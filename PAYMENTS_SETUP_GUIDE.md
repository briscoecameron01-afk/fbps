# Payment Processing Setup Guide

This guide covers the complete setup for Stripe, PayPal, Apple Pay, Google OAuth, and Apple OAuth integration in the Fractional Bill Pay mobile app.

## Stripe Setup

Stripe handles card payments, subscriptions, and integrates Apple Pay on iOS.

### 1. Create a Stripe Account

- Go to [stripe.com](https://stripe.com) and sign up
- Verify your email and create your account

### 2. Get Test API Keys

- Log in to your Stripe Dashboard
- Navigate to **Developers** → **API Keys**
- You'll see two sets of keys:
  - **Publishable Key** (starts with `pk_test_`)
  - **Secret Key** (starts with `sk_test_`)
- Copy both keys; you'll need them in the next steps

### 3. Create a Product and Price

For the premium subscription ($7.99/month):

- Go to **Products** in the Dashboard
- Click **+ Add product**
- Fill in:
  - **Name:** `Premium Subscription`
  - **Type:** `Service`
  - **Price:** `7.99`
  - **Billing period:** `Monthly`
  - **Recurring:** Check this box
- Click **Save product**
- Copy the **Price ID** (starts with `price_`)

### 4. Set Up Webhook Endpoint

- In the Dashboard, navigate to **Developers** → **Webhooks**
- Click **+ Add endpoint**
- **Endpoint URL:** Point to your Supabase Edge Function webhook:
  ```
  https://YOUR_PROJECT_REF.supabase.co/functions/v1/payment-webhook
  ```
  (Replace `YOUR_PROJECT_REF` with your actual Supabase project reference)
- **Events to send:** Select:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `charge.refunded`
- Click **Add endpoint**
- Copy the **Signing Secret** (starts with `whsec_`)

### 5. Configure Supabase Secrets

Run these commands in your terminal:

```bash
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
supabase secrets set STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
supabase secrets set STRIPE_PREMIUM_PRICE_ID=price_YOUR_PRICE_ID_HERE
```

Replace the placeholders with your actual Stripe keys.

### 6. Install Stripe React Native Package

```bash
npm install @stripe/stripe-react-native
npx expo prebuild
```

### 7. Configure app.json for Stripe

Add to your `app.json` under `expo.plugins`:

```json
{
  "expo": {
    "plugins": [
      [
        "@stripe/stripe-react-native",
        {
          "merchantIdentifier": "merchant.com.fractionalbillpay",
          "enableGooglePay": true
        }
      ]
    ]
  }
}
```

### 8. Apple Pay Certificate (iOS Only)

To enable Apple Pay via Stripe:

1. Enroll in the Apple Developer Program ($99/year) if you haven't already
2. In the Apple Developer portal:
   - Go to **Identifiers** and find your app identifier
   - Scroll down to **Apple Pay Payment Processing**
   - Click **Configure**
   - Create a new Merchant ID (e.g., `merchant.com.fractionalbillpay`)
   - Download the Apple Pay certificate
3. In Stripe Dashboard:
   - Go to **Settings** → **Apple Pay**
   - Upload your Apple Pay certificate
   - Add your merchant ID

---

## PayPal Setup

PayPal handles direct payments and subscriptions.

### 1. Create PayPal Developer Account

- Go to [developer.paypal.com](https://developer.paypal.com)
- Click **Sign up** or **Log in**
- Verify your email

### 2. Create a REST API Application

- In the Developer Dashboard, click **Apps & Credentials**
- Make sure you're on the **Sandbox** tab (for testing)
- Under **REST API apps**, click **Create app**
- **App Name:** `Fractional Bill Pay`
- Click **Create app**
- You'll see:
  - **Client ID**
  - **Secret**
- Copy both (we'll use these for Supabase secrets)

### 3. Configure Supabase Secrets

```bash
supabase secrets set PAYPAL_CLIENT_ID=YOUR_CLIENT_ID_HERE
supabase secrets set PAYPAL_SECRET=YOUR_SECRET_HERE
supabase secrets set PAYPAL_ENV=sandbox
```

### 4. Test PayPal Integration

Use the sandbox accounts created in your PayPal Developer Dashboard:

- Go to **Accounts** in the developer dashboard
- Create or view sandbox buyer/seller accounts
- Use these credentials to test payments

### 5. Switch to Production (When Ready)

When you're ready to go live:

1. Switch to **Live** tab in your PayPal Developer Dashboard
2. Copy your live **Client ID** and **Secret**
3. Update Supabase secrets:
   ```bash
   supabase secrets set PAYPAL_CLIENT_ID=YOUR_LIVE_CLIENT_ID
   supabase secrets set PAYPAL_SECRET=YOUR_LIVE_SECRET
   supabase secrets set PAYPAL_ENV=production
   ```

---

## Apple Pay Setup (via Stripe)

Apple Pay is configured through Stripe's integration. Follow the steps in the **Stripe Setup** section, particularly step 8.

For additional Apple Pay documentation, see [Stripe's Apple Pay Guide](https://stripe.com/docs/payments/accept-a-payment/apple-pay).

---

## Google OAuth Setup

Google OAuth allows users to sign in with their Google account.

### 1. Create a Google Cloud Project

- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Click the project dropdown at the top
- Click **New Project**
- **Project name:** `Fractional Bill Pay`
- Click **Create**
- Wait for the project to be created

### 2. Enable Google+ API

- In the Console, go to **APIs & Services** → **Library**
- Search for `Google+ API`
- Click on it and click **Enable**

### 3. Create OAuth 2.0 Credentials

- Go to **APIs & Services** → **Credentials**
- Click **+ Create Credentials** → **OAuth client ID**
- If prompted, configure the OAuth consent screen:
  - **User Type:** `External`
  - Click **Create**
  - Fill in the form:
    - **App name:** `Fractional Bill Pay`
    - **User support email:** Your email
    - **Developer contact:** Your email
  - Click **Save and continue**
  - Click **Save and continue** on Scopes
  - Click **Save and continue** on Test users
  - Click **Back to Dashboard**
- Now create OAuth credentials:
  - Click **+ Create Credentials** → **OAuth client ID**
  - **Application type:** `Web application`
  - **Name:** `Fractional Bill Pay Web`
  - Under **Authorized redirect URIs**, click **Add URI**
  - Add: `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`
  - Click **Create**
  - Copy your **Client ID** and **Client Secret**

### 4. Enable Google in Supabase

- Go to your Supabase Dashboard
- Navigate to **Authentication** → **Providers** → **Google**
- Paste your **Client ID** and **Client Secret**
- Click **Save**

### 5. Configure Mobile Deep Linking

In your `app.json`, set your scheme:

```json
{
  "expo": {
    "scheme": "fractionalbillpay"
  }
}
```

This allows the OAuth callback to return to your app via: `fractionalbillpay://auth/callback`

---

## Apple OAuth Setup

Apple Sign In allows users to sign in with their Apple ID.

### 1. Enroll in Apple Developer Program

- Go to [Apple Developer Program](https://developer.apple.com/programs/)
- Sign up or log in with your Apple ID
- Enroll ($99/year)

### 2. Create a Services ID

- In Apple Developer portal, go to **Identifiers**
- Click **+** to create a new identifier
- Select **Services IDs**
- Fill in:
  - **Description:** `Fractional Bill Pay Sign In with Apple`
  - **Identifier:** `com.fractionalbillpay.signin` (must be unique)
- Click **Continue** → **Register**

### 3. Configure Sign In with Apple

- In the Identifiers list, find your Services ID
- Click on it to edit
- Check **Sign In with Apple**
- Click **Configure**
- Select your App ID (create one if you don't have it: `com.fractionalbillpay`)
- Click **Save**
- In the configuration, under **Domains and Subdomains**, add your Supabase domain:
  ```
  YOUR_PROJECT_REF.supabase.co
  ```
- Under **Return URLs**, add:
  ```
  https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback
  ```
- Click **Save** → **Continue** → **Register**

### 4. Generate a Private Key

- In Apple Developer portal, go to **Keys**
- Click **+** to create a new key
- **Key Name:** `Sign In with Apple Key`
- Check **Sign In with Apple**
- Click **Configure**
- Select your Services ID (created above)
- Click **Save**
- Click **Continue** → **Register**
- Click **Download** to download your private key file (.p8)
- Store this file securely

### 5. Get Your Team ID

- In Apple Developer portal, go to **Membership** (top menu)
- Copy your **Team ID** (format: `XXXXXXXXXX`)

### 6. Get Key Information

From your downloaded .p8 file:

- **Key ID:** Shown on the Keys page (next to your key name)
- **Private Key:** The contents of the .p8 file (copy the full content)

### 7. Enable Apple in Supabase

- Go to your Supabase Dashboard
- Navigate to **Authentication** → **Providers** → **Apple**
- Fill in:
  - **Service ID:** `com.fractionalbillpay.signin`
  - **Team ID:** Your 10-character Team ID
  - **Key ID:** From your private key
  - **Private Key:** Full contents of your .p8 file
- Click **Save**

### 8. Configure Mobile Deep Linking

Make sure your `app.json` has the correct scheme (same as Google OAuth):

```json
{
  "expo": {
    "scheme": "fractionalbillpay"
  }
}
```

---

## Environment Variables Summary

| Variable | Where | Description |
|---|---|---|
| `STRIPE_SECRET_KEY` | Supabase secrets | Stripe API secret key (sk_test_...) |
| `STRIPE_PUBLISHABLE_KEY` | Supabase secrets | Stripe publishable key (pk_test_...) |
| `STRIPE_WEBHOOK_SECRET` | Supabase secrets | Stripe webhook signing secret (whsec_...) |
| `STRIPE_PREMIUM_PRICE_ID` | Supabase secrets | Stripe price ID for premium subscription (price_...) |
| `PAYPAL_CLIENT_ID` | Supabase secrets | PayPal REST API client ID |
| `PAYPAL_SECRET` | Supabase secrets | PayPal REST API secret |
| `PAYPAL_ENV` | Supabase secrets | `sandbox` or `production` |
| `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `.env.local` | Stripe key for client-side SDK |

### Setting Environment Variables in Supabase

```bash
supabase secrets set VAR_NAME=value
supabase secrets set VAR_NAME2=value2
```

View all secrets:
```bash
supabase secrets list
```

---

## Deploy Payment Edge Functions

Deploy all payment-related Edge Functions:

```bash
supabase functions deploy create-payment
supabase functions deploy confirm-payment
supabase functions deploy payment-methods
supabase functions deploy manage-subscription
supabase functions deploy payment-webhook
```

Each function should handle:

- **create-payment:** Initiate a payment with Stripe/PayPal
- **confirm-payment:** Confirm payment status after user returns from provider
- **payment-methods:** Manage saved payment methods
- **manage-subscription:** Handle subscription creation, cancellation, updates
- **payment-webhook:** Receive and process webhooks from Stripe/PayPal

---

## Test the Integration

### Stripe Test Cards

Use these card numbers in test mode:

| Card Type | Number | Expiry | CVC |
|---|---|---|---|
| Visa | `4242 4242 4242 4242` | Any future date | Any 3 digits |
| Visa (debit) | `4000 0566 5566 5556` | Any future date | Any 3 digits |
| Mastercard | `5555 5555 5555 4444` | Any future date | Any 3 digits |
| American Express | `3782 822463 10005` | Any future date | Any 4 digits |
| Decline | `4000 0000 0000 0002` | Any future date | Any 3 digits |

### PayPal Sandbox

- Use the buyer/seller accounts created in your PayPal Developer Dashboard
- Log in with sandbox credentials when prompted during payment flow

### Apple Pay (iOS Simulator)

- Build and run on Xcode iOS Simulator
- Xcode automatically enables Apple Pay test mode
- Use Stripe test cards when prompted

### Testing Subscriptions

1. Complete a payment with subscription plan
2. Check your Stripe/PayPal dashboard for subscription records
3. Test subscription renewal, cancellation, and failed payment scenarios

---

## Production Deployment Checklist

Before going live:

- [ ] Switch Stripe from test to live keys
- [ ] Switch PayPal from sandbox to production
- [ ] Update all `PAYPAL_ENV` references from `sandbox` to `production`
- [ ] Update Google OAuth Client ID and Secret to production values
- [ ] Update Apple OAuth credentials (same credentials work for both sandbox and production)
- [ ] Test a real payment on each platform
- [ ] Set up monitoring and alerting for payment failures
- [ ] Configure Stripe webhook endpoint to your production domain
- [ ] Ensure HTTPS is enabled on all payment endpoints
- [ ] Review Stripe and PayPal documentation for compliance requirements
- [ ] Set up proper error handling and user messaging for payment failures
- [ ] Back up all API keys and secrets securely

---

## Troubleshooting

### Stripe Issues

**Problem:** "Invalid API Key"
- Verify you copied the full key (starts with `sk_test_` or `sk_live_`)
- Check that you're using the Secret Key, not the Publishable Key

**Problem:** Webhook not receiving events
- Verify endpoint URL is accessible and returns 200 OK
- Check Supabase function logs for errors
- Test webhook manually in Stripe Dashboard

### PayPal Issues

**Problem:** "Authentication failed"
- Verify Client ID and Secret are correct
- Check that you're using the right environment (sandbox vs production)
- Ensure PAYPAL_ENV matches your credentials

### OAuth Issues

**Problem:** "Redirect URI mismatch"
- Verify the callback URL in Supabase matches exactly what's configured in Google/Apple
- Check that your project reference is correct

**Problem:** App doesn't return from OAuth
- Verify your scheme in `app.json` is correct
- Test deep linking: `expo send YOUR_SCHEME://auth/callback`

---

## Support and Resources

- [Stripe Documentation](https://stripe.com/docs)
- [PayPal Documentation](https://developer.paypal.com/docs)
- [Supabase Authentication](https://supabase.com/docs/guides/auth)
- [Expo Deep Linking](https://docs.expo.dev/guides/deep-linking/)
- [React Native Stripe SDK](https://github.com/stripe/stripe-react-native)
