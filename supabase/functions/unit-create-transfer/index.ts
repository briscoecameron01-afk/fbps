import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { requireUser } from '../_shared/supabase.ts';
import { unitRequest } from '../_shared/unit.ts';
import {
  appStatusForUnitStatus,
  dollarsToCents,
  ensureUnitCounterparty,
  getLinkedAccount,
  getUnitContext,
  makeFundingSourceLabel,
  sanitizeAchDescription,
  unitDirectionFor,
  updateContributionForPaymentStatus,
} from '../_shared/unitMoneyMovement.ts';

type CreateTransferBody = {
  linked_account_id?: string;
  amount?: number | string;
  direction?: 'to_unit' | 'from_unit';
  bill_id?: string | null;
  description?: string;
};

type UnitPaymentResponse = {
  data: {
    id: string;
    type: string;
    attributes?: {
      status?: string;
      amount?: number;
      direction?: string;
      description?: string;
      reason?: string;
    };
  };
};

async function getCurrentBucket(adminClient: any, userId: string, billId: string) {
  const { data, error } = await adminClient
    .from('bill_buckets')
    .select('id,target_amount,current_amount,status')
    .eq('user_id', userId)
    .eq('bill_id', billId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('No funding bucket found for this bill');
  return data;
}

async function failTransfer(adminClient: any, transferId: string | null, reason: string) {
  if (!transferId) return;
  await adminClient
    .from('unit_transfers')
    .update({
      status: 'failed',
      reason,
    })
    .eq('id', transferId);
}

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  let transferId: string | null = null;
  let adminClient: any = null;

  try {
    const auth = await requireUser(req);
    adminClient = auth.adminClient;
    const user = auth.user;
    const body = (await req.json()) as CreateTransferBody;

    const linkedAccountId = body.linked_account_id;
    const amount = Number(body.amount);
    const direction = body.direction || 'to_unit';

    if (!linkedAccountId) {
      return jsonResponse({ error: 'Missing linked_account_id' }, 400);
    }

    if (direction !== 'to_unit' && direction !== 'from_unit') {
      return jsonResponse({ error: 'Invalid transfer direction' }, 400);
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ error: 'Transfer amount must be greater than 0' }, 400);
    }

    const amountCents = dollarsToCents(amount);
    if (amountCents < 1) {
      return jsonResponse({ error: 'Transfer amount must be at least $0.01' }, 400);
    }

    const account = await getLinkedAccount(adminClient, user.id, linkedAccountId);
    const { customerId, depositAccountId, counterpartyName } = await getUnitContext(adminClient, user.id);
    const counterpartyId = await ensureUnitCounterparty(adminClient, account, customerId, counterpartyName);
    const unitDirection = unitDirectionFor(direction);
    const description = sanitizeAchDescription(
      body.description,
      direction === 'to_unit' ? 'Funding' : 'Withdraw',
    );
    const idempotencyKey = crypto.randomUUID();

    let bucket: any = null;
    if (body.bill_id && direction === 'to_unit') {
      bucket = await getCurrentBucket(adminClient, user.id, body.bill_id);
    }

    const { data: transfer, error: insertTransferError } = await adminClient
      .from('unit_transfers')
      .insert({
        user_id: user.id,
        linked_account_id: linkedAccountId,
        bill_id: body.bill_id || null,
        unit_counterparty_id: counterpartyId,
        direction,
        unit_direction: unitDirection,
        amount,
        currency: 'USD',
        status: 'creating',
        description,
        idempotency_key: idempotencyKey,
      })
      .select()
      .single();

    if (insertTransferError) throw insertTransferError;
    transferId = transfer.id;

    const payment = await unitRequest<UnitPaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        data: {
          type: 'achPayment',
          attributes: {
            amount: amountCents,
            direction: unitDirection,
            description,
            idempotencyKey,
            verifyCounterpartyBalance: direction === 'to_unit',
          },
          relationships: {
            account: {
              data: {
                type: 'account',
                id: depositAccountId,
              },
            },
            counterparty: {
              data: {
                type: 'counterparty',
                id: counterpartyId,
              },
            },
          },
        },
      }),
    });

    const unitStatus = payment.data.attributes?.status || 'pending';
    const appStatus = appStatusForUnitStatus(unitStatus);
    const reason = payment.data.attributes?.reason || null;

    const { data: updatedTransfer, error: updateTransferError } = await adminClient
      .from('unit_transfers')
      .update({
        unit_payment_id: payment.data.id,
        status: unitStatus,
        reason,
        raw_response: payment,
      })
      .eq('id', transfer.id)
      .select()
      .single();

    if (updateTransferError) throw updateTransferError;

    let contribution = null;
    if (bucket && body.bill_id && direction === 'to_unit') {
      const { data, error } = await adminClient
        .from('contributions')
        .insert({
          bill_id: body.bill_id,
          bucket_id: bucket.id,
          user_id: user.id,
          amount,
          funding_source: makeFundingSourceLabel(account),
          status: appStatus,
          executed_at: appStatus === 'completed' ? new Date().toISOString() : null,
          unit_transfer_id: transfer.id,
          linked_account_id: linkedAccountId,
        })
        .select()
        .single();

      if (error) throw error;
      contribution = data;

      await adminClient
        .from('unit_transfers')
        .update({ contribution_id: contribution.id })
        .eq('id', transfer.id);

      if (appStatus === 'completed') {
        await updateContributionForPaymentStatus(
          adminClient,
          { ...updatedTransfer, contribution_id: contribution.id, user_id: user.id },
          unitStatus,
        );
      }
    }

    return jsonResponse({
      success: true,
      transfer: updatedTransfer,
      contribution,
      unit_payment_id: payment.data.id,
      status: unitStatus,
    });
  } catch (error) {
    await failTransfer(adminClient, transferId, error.message || 'Transfer failed');
    return jsonResponse({ error: error.message }, 400);
  }
});
