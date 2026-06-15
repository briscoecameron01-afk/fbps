import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { requireUser } from '../_shared/supabase.ts';
import { unitRequest } from '../_shared/unit.ts';
import {
  appStatusForUnitStatus,
  updateContributionForPaymentStatus,
} from '../_shared/unitMoneyMovement.ts';

type UnitPaymentResponse = {
  data: {
    id: string;
    attributes?: {
      status?: string;
      reason?: string | null;
    };
  };
};

const FINAL_STATUSES = ['sent', 'completed', 'rejected', 'returned', 'canceled', 'cancelled', 'failed'];

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);
    const { data: transfers, error } = await adminClient
      .from('unit_transfers')
      .select('id,user_id,unit_payment_id,contribution_id,status')
      .eq('user_id', user.id)
      .not('unit_payment_id', 'is', null)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const refreshed = [];

    for (const transfer of transfers || []) {
      if (FINAL_STATUSES.includes(String(transfer.status || '').toLowerCase())) {
        refreshed.push(transfer);
        continue;
      }

      const payment = await unitRequest<UnitPaymentResponse>(`/payments/${transfer.unit_payment_id}`);
      const unitStatus = payment.data.attributes?.status || transfer.status || 'Pending';
      const appStatus = appStatusForUnitStatus(unitStatus);
      const reason = payment.data.attributes?.reason || null;

      const { data: updatedTransfer, error: updateError } = await adminClient
        .from('unit_transfers')
        .update({
          status: unitStatus,
          reason,
          raw_response: payment,
        })
        .eq('id', transfer.id)
        .eq('user_id', user.id)
        .select()
        .maybeSingle();

      if (updateError) throw updateError;

      if (appStatus !== 'pending') {
        await updateContributionForPaymentStatus(adminClient, transfer, unitStatus);
      }

      refreshed.push(updatedTransfer || transfer);
    }

    return jsonResponse({ success: true, transfers: refreshed });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
