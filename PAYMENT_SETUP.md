# Payment Integration Setup Guide

This guide covers the complete setup for the payment integration layer supporting Stripe, PayPal, and Apple Pay.

## Overview

The payment system consists of:

1. **Client-side Service** (`src/services/payments.ts`) - Unified payment API
2. **Edge Functions** - Secure server-side payment processing
3. **Database Schema** - Transaction and subscription tracking
4. **Webhook Handlers** - Real-time payment status updates

## Prerequisites

- Supabase project with the latest CLI
- Stripe account (https://stripe.com)
- PayPal Developer account (https://developer.paypal.com)
- Apple Developer account (for Apple Pay)

## Step 1: Database Setup

Run the migration to create the payment tables:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/002_payment_system.sql
```

This creates:
- `payment_methods` - Stores saved payment methods
- `transactions` - Payment transaction records
- `subscriptions` - Subscription information

## Step 2: Environment Variables

Add these to your `.env.local` or Supabase secret management:

```env
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...
PAYPAL_ENV=sandbox  # or production

# Apple Pay
APPLE_PAY_MERCHANT_ID=merchant.com.yourcompany.billpay
```

### Setting Secrets in Supabase

```bash
supabase secrets set STRIPE_SECRET_KEY "sk_test_..."
supabase secrets set STRIPE_WEBHOOK_SECRET "whsec_..."
supabase secrets set PAYPAL_CLIENT_ID "..."
supabase secrets set PAYPAL_SECRET "..."
supabase secrets set PAYPAL_ENV "sandbox"
```

## Step 3: Stripe Configuration

### Create API Keys

1. Go to Stripe Dashboard > Developers > API Keys
2. Copy your Secret Key (starts with `sk_test_` or `sk_live_`)
3. Add to environment variables as `STRIPE_SECRET_KEY`

### Setup Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://YOUR_SUPABASE_URL/functions/v1/payment-webhook`
3. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `customer.subscription.deleted`
4. Copy the signing secret as `STRIPE_WEBHOOK_SECRET`

### Create Price IDs (for subscriptions)

1. Go to Stripe Dashboard > Products
2. Create your subscription products and prices
3. Use the price IDs (e.g., `price_1234567890`) when creating subscriptions

## Step 4: PayPal Configuration

### Create App

1. Go to PayPal Developer Dashboard
2. Create or use an existing app
3. Copy:
   - Client ID as `PAYPAL_CLIENT_ID`
   - Secret as `PAYPAL_SECRET`

### Setup Webhook (IPN)

1. Go to PayPal Merchant Account Settings > Notifications
2. Add webhook endpoint: `https://YOUR_SUPABASE_URL/functions/v1/payment-webhook`
3. Subscribe to events:
   - PAYMENT.CAPTURE.COMPLETED
   - BILLING.SUBSCRIPTION.CANCELLED

## Step 5: Apple Pay Configuration

### For iOS App

1. Add capabilities in Xcode:
   - Go to Target > Signing & Capabilities
   - Add "Apple Pay" capability
   - Add your Merchant ID

2. In your app, use the PaymentService:

```typescript
import { PaymentService } from './services';

// Check availability
const available = await PaymentService.isApplePayAvailable();

// Make payment
const result = await PaymentService.createApplePayPayment(
  amount,
  'Bill Payment'
);
```

### Merchant ID Setup

1. Go to Apple Developer Account
2. Create a Merchant ID for Apple Pay
3. Create an Apple Pay Certificate
4. Configure in Stripe Dashboard:
   - Settings > Apple Pay
   - Add your Apple Pay Certificate

## Usage Examples

### Making a Payment

```typescript
import { PaymentService } from './services';

// Create a payment intent
const intent = await PaymentService.createPayment({
  amount: 100.00,
  currency: 'usd',
  provider: 'stripe',
  paymentMethodId: 'pm_1234567890',
  description: 'Monthly subscription',
  metadata: {
    billId: 'bill_123',
    billName: 'Internet Bill',
  },
});

// Confirm the payment
const result = await PaymentService.confirmPayment(
  intent.id,
  'stripe',
  paymentMethodId
);

if (result.success) {
  console.log('Payment succeeded:', result.transactionId);
}
```

### Adding a Payment Method

```typescript
// For Stripe
const { data, error } = await PaymentService.addPaymentMethod(
  'stripe',
  'pm_1234567890' // Token from Stripe SDK
);

// For PayPal
const { data, error } = await PaymentService.addPaymentMethod(
  'paypal',
  'VAULT_ID' // PayPal vault ID
);
```

### Creating a Subscription

```typescript
const { subscriptionId, clientSecret, error } = await PaymentService.createSubscription({
  provider: 'stripe',
  priceId: 'price_1234567890', // From Stripe Dashboard
  paymentMethodId: 'pm_...',
});

if (clientSecret) {
  // Confirm subscription with client secret
}
```

### Checking Subscription Status

```typescript
const status = await PaymentService.getSubscriptionStatus();

if (status.active) {
  console.log('Active subscription:', status.plan);
  console.log('Renews at:', status.renewsAt);
}
```

## Error Handling

All service methods return errors in a predictable format:

```typescript
const result = await PaymentService.confirmPayment(intentId, 'stripe');

if (!result.success) {
  console.error('Payment failed:', result.error);
  // Handle error gracefully
}
```

## Webhook Testing

### Test Stripe Webhooks Locally

```bash
# Use Stripe CLI to forward webhooks
stripe listen --forward-to localhost:3000/functions/v1/payment-webhook

# Trigger test events
stripe trigger payment_intent.succeeded
```

### Test PayPal Webhooks

Use PayPal's webhook simulator in the Developer Dashboard to test events.

## Security Considerations

1. **API Keys**: Never expose secret keys in client code. All sensitive operations happen in Edge Functions.

2. **Webhook Verification**: Both Stripe and PayPal webhook signatures are verified before processing.

3. **Database Access**: Row-level security (RLS) policies ensure users can only access their own data.

4. **CORS**: Edge functions have appropriate CORS headers but should be restricted in production.

## File Structure

```
src/services/
├── payments.ts                 # Main service
└── index.ts                   # Exports

supabase/functions/
├── _shared/
│   ├── supabase.ts            # Shared Supabase utilities
│   └── plaid.ts               # (existing)
├── create-payment/
│   └── index.ts               # Create payment intent
├── confirm-payment/
│   └── index.ts               # Confirm payment
├── payment-methods/
│   └── index.ts               # Manage saved methods
├── payment-status/
│   └── index.ts               # Get payment status
├── manage-subscription/
│   └── index.ts               # Subscription operations
├── payment-webhook/
│   └── index.ts               # Webhook handler
├── create-apple-pay-payment/
│   └── index.ts               # Apple Pay integration
└── apple-pay-available/
    └── index.ts               # Apple Pay availability

supabase/migrations/
└── 002_payment_system.sql      # Database schema
```

## Deployment

### Deploy Edge Functions

```bash
# Deploy all payment functions
supabase functions deploy create-payment
supabase functions deploy confirm-payment
supabase functions deploy payment-methods
supabase functions deploy payment-status
supabase functions deploy manage-subscription
supabase functions deploy payment-webhook
supabase functions deploy create-apple-pay-payment
supabase functions deploy apple-pay-available
```

### Production Checklist

- [ ] Switch to Stripe/PayPal production keys
- [ ] Update webhook URLs to production domain
- [ ] Test all payment flows end-to-end
- [ ] Configure proper error logging
- [ ] Setup monitoring and alerts
- [ ] Review security policies
- [ ] Test webhook signature verification
- [ ] Document customer support procedures

## Troubleshooting

### Edge Function Errors

Check the Supabase dashboard for function logs:
- Functions > Logs
- Look for specific error messages

### Webhook Not Received

1. Verify webhook URL in provider dashboard
2. Check function is deployed and accessible
3. Verify signature secret is correct
4. Use provider's webhook testing tool

### Payment Fails

1. Check error message from confirm-payment response
2. Verify payment method is still valid
3. Check sufficient account balance
4. Review provider's payment processing requirements

## Support

- Stripe Docs: https://stripe.com/docs
- PayPal Docs: https://developer.paypal.com/docs
- Apple Pay Docs: https://developer.apple.com/apple-pay
- Supabase Docs: https://supabase.com/docs
