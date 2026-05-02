import {plaidRequest} from "../_shared/plaid";
import {handleCors, jsonResponse} from "../_shared/cors";
import {requireUser} from "../_shared/supabase";


Deno.serve(async (req) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { user } = await requireUser(req);

    const data = await plaidRequest<{ link_token: string }>('/link/token/create', {
      user: {
        client_user_id: user.id,
      },
      client_name: 'Fractional Bill Pay',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
      webhook: Deno.env.get('PLAID_WEBHOOK_URL') || undefined,
      transactions: {
        days_requested: 180,
      },
    });

    return jsonResponse({ link_token: data.link_token });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
