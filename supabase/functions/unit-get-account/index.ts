import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { requireUser } from '../_shared/supabase.ts';
import { unitRequest } from '../_shared/unit.ts';
import { centsToDollars, getUnitContext } from '../_shared/unitMoneyMovement.ts';

type UnitAccountResponse = {
  data: {
    id: string;
    type: string;
    attributes?: {
      name?: string;
      status?: string;
      currency?: string;
      balance?: number;
      available?: number;
      hold?: number;
    };
  };
};

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);
    const { depositAccountId } = await getUnitContext(adminClient, user.id);
    const account = await unitRequest<UnitAccountResponse>(`/accounts/${depositAccountId}`);
    const attributes = account.data.attributes || {};

    return jsonResponse({
      account: {
        id: account.data.id,
        name: attributes.name || 'Unit Account',
        status: attributes.status || '',
        currency: attributes.currency || 'USD',
        balance: centsToDollars(attributes.balance),
        available: centsToDollars(attributes.available),
        hold: centsToDollars(attributes.hold),
      },
    });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
