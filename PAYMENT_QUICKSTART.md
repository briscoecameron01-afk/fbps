# Payment Integration - Quick Start Guide

Get the payment system running in 5 minutes.

## 1. Setup Database (2 min)

Open Supabase Dashboard > SQL Editor and paste:

```sql
-- Copy contents of: supabase/migrations/002_payment_system.sql
```

Or run via CLI:
```bash
supabase db push
```

## 2. Configure Secrets (2 min)

Get your API keys and run:

```bash
# Stripe
supabase secrets set STRIPE_SECRET_KEY "sk_test_..."
supabase secrets set STRIPE_WEBHOOK_SECRET "whsec_..."

# PayPal
supabase secrets set PAYPAL_CLIENT_ID "..."
supabase secrets set PAYPAL_SECRET "..."
supabase secrets set PAYPAL_ENV "sandbox"
```

## 3. Deploy Functions (1 min)

```bash
supabase functions deploy create-payment
supabase functions deploy confirm-payment
supabase functions deploy payment-methods
supabase functions deploy payment-status
supabase functions deploy manage-subscription
supabase functions deploy payment-webhook
supabase functions deploy create-apple-pay-payment
supabase functions deploy apple-pay-available
```

## 4. Use in Your App

```typescript
import { PaymentService } from './services';

// Add a payment method
const { data } = await PaymentService.addPaymentMethod(
  'stripe',
  stripePaymentMethodId
);

// Make a payment
const intent = await PaymentService.createPayment({
  amount: 50.00,
  provider: 'stripe',
  paymentMethodId: data.providerMethodId,
});

const result = await PaymentService.confirmPayment(
  intent.id,
  'stripe'
);

console.log(result.success ? 'Payment succeeded!' : 'Payment failed');
```

## Quick API Reference

### Payment Methods
```typescript
// List
const methods = await PaymentService.getPaymentMethods();

// Add
const { data } = await PaymentService.addPaymentMethod('stripe', token);

// Set default
await PaymentService.setDefaultPaymentMethod(methodId);

// Remove
await PaymentService.removePaymentMethod(methodId);
```

### One-Time Payments
```typescript
// Create
const intent = await PaymentService.createPayment({
  amount: 99.99,
  provider: 'stripe',
  paymentMethodId: 'pm_...',
});

// Confirm
const result = await PaymentService.confirmPayment(
  intent.id,
  'stripe'
);

// Check status
const status = await PaymentService.getPaymentStatus(
  intentId,
  'stripe'
);
```

### Subscriptions
```typescript
// Create
const { subscriptionId } = await PaymentService.createSubscription({
  provider: 'stripe',
  priceId: 'price_...',
});

// Cancel
await PaymentService.cancelSubscription(subscriptionId, 'stripe');

// Check status
const status = await PaymentService.getSubscriptionStatus();
```

### Apple Pay
```typescript
// Check availability
const available = await PaymentService.isApplePayAvailable();

// Make payment
const result = await PaymentService.createApplePayPayment(50, 'Bill Payment');
```

## Get Test Credentials

### Stripe
1. Go to https://stripe.com
2. Sign up for free
3. Dashboard > Developers > API Keys
4. Copy Secret Key (starts with `sk_test_`)

### PayPal
1. Go to https://developer.paypal.com
2. Sign up or log in
3. Create an app
4. Copy Client ID and Secret

## Test Payment Methods

### Stripe Test Card
- Number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits

### PayPal Test Account
- Use sandbox.paypal.com
- Create test merchant and buyer accounts
- Use test account credentials

## Troubleshooting

### "Function not found"
- Ensure functions are deployed: `supabase functions list`
- Check function names match exactly

### "Invalid API key"
- Verify secret key format (should start with `sk_test_` or `pk_live_`)
- Check secrets are set: `supabase secrets list`

### "Webhook not received"
- Use provider's webhook testing tool
- Verify endpoint URL is correct
- Check firewall/CORS settings

### Payment fails with "Card declined"
- Using test card? Use `4242 4242 4242 4242`
- Check card hasn't expired
- Verify amount is correct

## Next Steps

1. Read full documentation in `/PAYMENT_SETUP.md`
2. Review API reference in `/src/services/PAYMENTS_API.md`
3. Implement payment UI in your screens
4. Test with sandbox credentials
5. Configure webhooks
6. Deploy to production

## Support

- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Supabase: https://supabase.com/docs
- This repo: See `/PAYMENT_SETUP.md`
