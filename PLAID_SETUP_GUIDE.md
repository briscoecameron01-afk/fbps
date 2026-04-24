# Plaid Integration Setup Guide

## Overview

Fractional Bill Pay uses **Plaid** to securely connect to users' bank accounts and auto-detect recurring bills from transaction history. This guide walks you through setting up Plaid from scratch.

---

## Step 1: Create a Plaid Developer Account

1. Go to [https://dashboard.plaid.com/signup](https://dashboard.plaid.com/signup)
2. Sign up with your email and create a password
3. Verify your email address
4. Complete the onboarding questionnaire (select "Personal Finance" as your use case)

## Step 2: Get Your API Keys

Once logged in to the Plaid Dashboard:

1. Navigate to **Team Settings → Keys**
2. You'll see three sets of keys for different environments:
   - **Sandbox** — Free, uses test data (start here)
   - **Development** — Free, connects to real banks (100 live Items)
   - **Production** — Paid, unlimited connections

3. Copy your **Sandbox** credentials:
   - `PLAID_CLIENT_ID` — Your unique client identifier
   - `PLAID_SECRET` — Your sandbox secret key

## Step 3: Configure Supabase Secrets

Your Edge Functions need these credentials. Set them using the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to your Supabase project
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Set Plaid secrets
supabase secrets set PLAID_CLIENT_ID=your_client_id_here
supabase secrets set PLAID_SECRET=your_sandbox_secret_here
supabase secrets set PLAID_ENV=sandbox
```

## Step 4: Deploy Edge Functions

Deploy the three Plaid Edge Functions to your Supabase project:

```bash
# From the fractional-app directory
cd supabase

# Deploy all functions
supabase functions deploy plaid-link-token
supabase functions deploy plaid-exchange-token
supabase functions deploy plaid-transactions
```

## Step 5: Run Database Migrations

Apply the migration that creates the `linked_accounts` and `detected_bills` tables:

```bash
supabase db push
```

This runs both migration files:
- `001_initial.sql` — Core tables (profiles, bills, bill_buckets, contributions)
- `002_linked_accounts.sql` — Plaid-related tables (linked_accounts, detected_bills)

## Step 6: Test in Sandbox Mode

Plaid's Sandbox environment provides test credentials so you can verify everything works without connecting real bank accounts.

**Sandbox test credentials:**
- Username: `user_good`
- Password: `pass_good`

The app's current `LinkBankScreen` simulates the Plaid Link flow using an Alert dialog. When you tap "Simulate Success," it calls the `exchangePublicToken` Edge Function with a test token.

## Step 7: Add the Plaid Link SDK (Production)

For production use, install the official React Native Plaid SDK:

```bash
npx expo install react-native-plaid-link-sdk
```

Then update `LinkBankScreen.tsx` to use the real SDK:

```tsx
import { create, open, dismissLink } from 'react-native-plaid-link-sdk';

// In your handleLinkBank function:
const linkToken = await createLinkToken();

create({ token: linkToken });

open({
  onSuccess: async (result) => {
    const { publicToken, metadata } = result;
    await exchangePublicToken(publicToken, metadata);
    setState('success');
  },
  onExit: (exit) => {
    if (exit.error) {
      setState('error');
      setErrorMessage(exit.error.message);
    } else {
      setState('idle');
    }
  },
});
```

> **Note:** `react-native-plaid-link-sdk` requires a development build (not Expo Go). Run `npx expo prebuild` and then build with `npx expo run:ios` or `npx expo run:android`.

## Step 8: Moving to Production

When you're ready to go live:

1. **Apply for Production access** in the Plaid Dashboard under **Team Settings → API**
2. **Complete Plaid's application review** — they'll ask about your use case, compliance, and data handling
3. **Update your secrets** with Production keys:
   ```bash
   supabase secrets set PLAID_SECRET=your_production_secret
   supabase secrets set PLAID_ENV=production
   ```
4. **Configure allowed redirect URIs** in the Plaid Dashboard for your app's deep link scheme

## Environment Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `PLAID_CLIENT_ID` | Your Plaid client ID | `5f...a3` |
| `PLAID_SECRET` | Environment-specific secret | `abc...xyz` |
| `PLAID_ENV` | `sandbox`, `development`, or `production` | `sandbox` |

## How It All Fits Together

```
Mobile App                    Supabase Edge Functions           Plaid API
─────────                    ──────────────────────           ─────────
1. User taps "Link Bank"
2. App calls createLinkToken() →  plaid-link-token →          /link/token/create
3. App receives link_token    ←  returns link_token  ←        returns token
4. App opens Plaid Link UI
5. User selects bank & logs in                                (handled by Plaid)
6. Plaid returns public_token
7. App calls exchangePublicToken() → plaid-exchange-token →   /item/public_token/exchange
8. Edge Function saves accounts  ←  returns access_token  ←   returns access_token
9. App shows success state
10. Later: fetchDetectedBills() →  plaid-transactions →       /transactions/get
11. Edge Function analyzes       ←  returns transactions  ←   returns 90 days
    transactions for patterns
12. Returns detected bills to app
```

## Troubleshooting

**"Not authenticated" error**: Make sure the user is signed in via Supabase Auth before calling any Plaid functions.

**Edge Function 500 errors**: Check your secrets are set correctly with `supabase secrets list`. Verify the function logs with `supabase functions logs plaid-link-token`.

**Sandbox token exchange fails**: Plaid's sandbox uses specific test tokens. The simulated flow in the app sends `public-sandbox-test-token` — this works with Plaid's sandbox environment automatically.

**"react-native-plaid-link-sdk" build errors**: This package requires native modules. You must use a development build (`npx expo prebuild`) instead of Expo Go.
