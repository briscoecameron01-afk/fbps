import { handleCors, jsonResponse } from '../_shared/cors.ts';
import { plaidRequest } from '../_shared/plaid.ts';
import { requireUser } from '../_shared/supabase.ts';

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

    const results = [];
    for (const [itemId, accessToken] of byItem) {
      let cursor: string | null = null;
      let hasMore = true;
      const added = [];
      const modified = [];
      const removed = [];

      while (hasMore) {
        const sync = await plaidRequest<any>('/transactions/sync', {
          access_token: accessToken,
          cursor,
          count: 500,
        });

        added.push(...sync.added);
        modified.push(...sync.modified);
        removed.push(...sync.removed);
        cursor = sync.next_cursor;
        hasMore = sync.has_more;
      }

      results.push({ item_id: itemId, added, modified, removed, next_cursor: cursor });
    }

    return jsonResponse({ results });
  } catch (error) {
    return jsonResponse({ error: error.message }, 400);
  }
});
