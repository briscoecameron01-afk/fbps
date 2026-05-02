import {plaidRequest} from "../_shared/plaid";
import {handleCors, jsonResponse} from "../_shared/cors";
import {requireUser} from "../_shared/supabase";

Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user, adminClient } = await requireUser(req);

    const { data: accounts, error } = await adminClient
      .from('linked_accounts')
      .select('plaid_item_id, plaid_access_token')
      .eq('user_id', user.id)
      .eq('is_active', true);

    if (error) throw error;

    const byItem = new Map<string, string>();
    for (const account of accounts || []) {
      byItem.set(account.plaid_item_id, account.plaid_access_token);
    }

    const streams = [];
    for (const [itemId, accessToken] of byItem) {
      const recurring = await plaidRequest<any>('/transactions/recurring/get', {
        access_token: accessToken,
      });

      streams.push({
        item_id: itemId,
        inflow_streams: recurring.inflow_streams || [],
        outflow_streams: recurring.outflow_streams || [],
      });
    }

    return jsonResponse({ user_id: user.id, streams });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
