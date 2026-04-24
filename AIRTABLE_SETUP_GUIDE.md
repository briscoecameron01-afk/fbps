# Airtable Admin Dashboard Setup Guide

## Overview

Fractional Bill Pay uses **Airtable as an admin CMS** so your team can manage users, bills, app config, and announcements without touching code. Data syncs bidirectionally between Supabase (primary database) and Airtable (admin panel).

```
Mobile App ←→ Supabase (primary DB) ←→ Airtable (admin CMS)
                    ↕
            Edge Functions
         (airtable-sync, airtable-cms)
```

---

## Step 1: Create an Airtable Account & Base

1. Go to [https://airtable.com/signup](https://airtable.com/signup) and create a free account
2. Create a new **Base** called "Fractional Bill Pay Admin"
3. Follow the table schemas in `scripts/setup-airtable-base.md` to create all 7 tables:
   - Users, Bills, Contributions, Transfers, Linked Accounts, App Config, Announcements

## Step 2: Get Your API Credentials

1. Go to [https://airtable.com/create/tokens](https://airtable.com/create/tokens)
2. Click **"Create new token"**
3. Name it "Fractional Bill Pay"
4. Add these **scopes**:
   - `data.records:read`
   - `data.records:write`
5. Add your Base under **Access** → select "Fractional Bill Pay Admin"
6. Click **Create token** and copy it

To find your **Base ID**:
1. Open your base in Airtable
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. The `appXXXXXXXXXXXXXX` part is your Base ID

## Step 3: Configure Environment Variables

### For the Mobile App (.env)

Create/update `.env` in `fractional-app/`:

```
EXPO_PUBLIC_AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
EXPO_PUBLIC_AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

### For Supabase Edge Functions

```bash
supabase secrets set AIRTABLE_API_KEY=patXXXXXXXXXXXXXX
supabase secrets set AIRTABLE_BASE_ID=appXXXXXXXXXXXXXX
```

## Step 4: Deploy the Edge Functions

```bash
cd fractional-app/supabase

# Deploy the sync function (Supabase → Airtable)
supabase functions deploy airtable-sync

# Deploy the CMS function (Airtable → App)
supabase functions deploy airtable-cms
```

## Step 5: Set Up Database Webhooks (Optional)

To auto-sync changes from Supabase to Airtable in real-time, set up database webhooks in the Supabase Dashboard:

1. Go to **Database → Webhooks** in your Supabase project
2. Create webhooks for these tables: `profiles`, `bills`, `contributions`, `transfers`
3. Set the webhook URL to your Edge Function:
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/airtable-sync
   ```
4. Select trigger events: **INSERT**, **UPDATE**
5. Add the Authorization header: `Bearer YOUR_SUPABASE_ANON_KEY`

Each webhook sends the new/updated record to the airtable-sync function, which pushes it to the corresponding Airtable table.

## Step 6: Run Initial Sync

To populate Airtable with existing data, call the full sync endpoint:

```bash
curl -X POST \
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/airtable-sync \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"type": "full_sync"}'
```

This pulls all users, bills, contributions, and transfers from Supabase and pushes them to Airtable.

## How It Works

### Admin → App (CMS Flow)

Your team edits **App Config** or **Announcements** in Airtable. The app reads them via the `airtable-cms` Edge Function:

```
GET /functions/v1/airtable-cms?table=config
GET /functions/v1/airtable-cms?table=announcements
GET /functions/v1/airtable-cms?table=categories
```

Use these in the app to show dynamic announcements, configure pricing, toggle features, etc.

### App → Admin (Data Sync)

When users create bills, make contributions, or update profiles, the data flows:

```
User action → Supabase insert/update → DB Webhook → airtable-sync → Airtable
```

Your admin team sees real-time data in Airtable and can:
- View all users and their plans
- Monitor bill funding progress
- Track contributions and transfers
- Identify failed payments
- Override bill amounts or categories

### Admin Overrides

If an admin edits a bill in Airtable (e.g., corrects an amount), you can set up an Airtable Automation to call the Supabase API and push the change back. This is optional and would use Airtable's built-in Automations feature with a "Run a script" action.

## Airtable Views (Recommended)

Set up these views in your Airtable base for quick admin access:

### Users Table
- **All Users** — Default grid view
- **Premium Users** — Filter: Plan = "premium"
- **New This Week** — Filter: Created At is within past 7 days

### Bills Table
- **All Bills** — Default grid sorted by Amount desc
- **Behind Schedule** — Filter: Status = "behind"
- **By Category** — Group by Category field

### Contributions Table
- **Recent** — Sort by Date desc, limit 100
- **Failed** — Filter: Status = "failed"

### Transfers Table
- **Pending** — Filter: Status = "pending"
- **Failed** — Filter: Status = "failed" (for retry queue)

## Troubleshooting

**"AUTHENTICATION_REQUIRED" error**: Your API token is missing or expired. Generate a new one at airtable.com/create/tokens.

**Records not syncing**: Check that your database webhooks are enabled in Supabase Dashboard → Database → Webhooks. Verify the function URL and auth header.

**Rate limit (429)**: Airtable allows 5 requests/second on free plans. The sync client auto-retries after 30 seconds. For bulk operations, the client batches records in groups of 10.

**"TABLE_NOT_FOUND"**: Make sure the table names in Airtable exactly match the constants in `airtable.ts` (case-sensitive): Users, Bills, Contributions, Transfers, Linked Accounts, App Config, Announcements.
