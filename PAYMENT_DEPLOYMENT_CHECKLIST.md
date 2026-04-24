# Payment Integration Deployment Checklist

Complete this checklist to properly deploy the payment integration system.

## Pre-Deployment Setup

### 1. Stripe Account Setup
- [ ] Create/access Stripe account at https://stripe.com
- [ ] Navigate to Developers > API Keys
- [ ] Copy Secret Key (starts with `sk_test_` or `sk_live_`)
- [ ] Copy Publishable Key (starts with `pk_test_` or `pk_live_`)
- [ ] Note the Webhook Secret (we'll create this)
- [ ] Create at least one Product with a Price for testing

### 2. PayPal Account Setup
- [ ] Create/access PayPal Developer account at https://developer.paypal.com
- [ ] Navigate to Apps & Credentials
- [ ] Create an app or use existing
- [ ] Copy Client ID and Secret
- [ ] Note API endpoint (sandbox vs production)

### 3. Apple Pay Setup (Optional)
- [ ] Access Apple Developer Account
- [ ] Create Merchant ID for Apple Pay
- [ ] Create Apple Pay Certificate
- [ ] Note: Certificate must be configured in Stripe Dashboard

## Database Deployment

### 4. Run Migration
- [ ] Open Supabase Dashboard
- [ ] Navigate to SQL Editor
- [ ] Copy contents of: `supabase/migrations/002_payment_system.sql`
- [ ] Paste and execute
- [ ] Verify tables created:
  - [ ] `payment_methods` table exists
  - [ ] `transactions` table exists
  - [ ] `subscriptions` table exists
- [ ] Verify indexes created (check Schema > Indexes)
- [ ] Verify RLS policies applied

## Environment Configuration

### 5. Set Supabase Secrets

Run these commands in your terminal:

```bash
# Stripe
supabase secrets set STRIPE_SECRET_KEY "sk_test_..."
supabase secrets set STRIPE_WEBHOOK_SECRET "whsec_..."

# PayPal
supabase secrets set PAYPAL_CLIENT_ID "..."
supabase secrets set PAYPAL_SECRET "..."
supabase secrets set PAYPAL_ENV "sandbox"
```

- [ ] `STRIPE_SECRET_KEY` set correctly
- [ ] `STRIPE_WEBHOOK_SECRET` set (leave blank for now, fill after creating webhook)
- [ ] `PAYPAL_CLIENT_ID` set correctly
- [ ] `PAYPAL_SECRET` set correctly
- [ ] `PAYPAL_ENV` set to "sandbox" (development) or "production"
- [ ] Verify secrets with: `supabase secrets list`

## Edge Function Deployment

### 6. Deploy Edge Functions

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

- [ ] `create-payment` deployed
- [ ] `confirm-payment` deployed
- [ ] `payment-methods` deployed
- [ ] `payment-status` deployed
- [ ] `manage-subscription` deployed
- [ ] `payment-webhook` deployed
- [ ] `create-apple-pay-payment` deployed
- [ ] `apple-pay-available` deployed
- [ ] All functions show as "Active" in Supabase Dashboard
- [ ] No deployment errors in console

### 7. Verify Function Accessibility

- [ ] Access Supabase Dashboard > Functions
- [ ] For each function:
  - [ ] Function shows as "Active"
  - [ ] Copy the function URL (you'll need for webhooks)

## Webhook Configuration

### 8. Setup Stripe Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Click "Add an endpoint"
3. Enter endpoint: `https://[project-id].supabase.co/functions/v1/payment-webhook`
   - [ ] Correct Supabase project URL
   - [ ] Correct function name: `payment-webhook`
4. Select events to listen for:
   - [ ] `payment_intent.succeeded`
   - [ ] `payment_intent.payment_failed`
   - [ ] `invoice.paid`
   - [ ] `customer.subscription.deleted`
5. Copy Signing Secret
6. Update environment:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET "whsec_..."
   ```
   - [ ] Secret copied correctly

### 9. Setup PayPal Webhook

1. Go to PayPal Developer Dashboard
2. Navigate to your app > Webhooks
3. Click "Add Webhook"
4. Enter endpoint: `https://[project-id].supabase.co/functions/v1/payment-webhook`
   - [ ] Correct Supabase project URL
   - [ ] Correct function name: `payment-webhook`
5. Select events:
   - [ ] `PAYMENT.CAPTURE.COMPLETED`
   - [ ] `BILLING.SUBSCRIPTION.CANCELLED`
6. Save webhook
   - [ ] Webhook ID noted for testing

## Testing (Sandbox/Development)

### 10. Test Stripe Payment Flow

```typescript
// In your app
const intent = await PaymentService.createPayment({
  amount: 10.00,
  provider: 'stripe',
  currency: 'usd',
});

const result = await PaymentService.confirmPayment(
  intent.id,
  'stripe'
);
```

- [ ] Payment intent created successfully
- [ ] Payment confirmed successfully
- [ ] Transaction appears in Stripe Dashboard
- [ ] Transaction saved in Supabase `transactions` table

### 11. Test PayPal Payment Flow

```typescript
const intent = await PaymentService.createPayment({
  amount: 10.00,
  provider: 'paypal',
  currency: 'usd',
});

// Redirect user to intent.approvalUrl
// After user approves, confirm:
const result = await PaymentService.confirmPayment(
  intent.id,
  'paypal'
);
```

- [ ] Order created in PayPal
- [ ] Approval URL generated
- [ ] User can approve payment
- [ ] Payment captured successfully
- [ ] Transaction appears in PayPal Dashboard

### 12. Test Payment Methods

```typescript
const methods = await PaymentService.getPaymentMethods();
console.log('Methods:', methods);
```

- [ ] Can list payment methods
- [ ] Can add payment method
- [ ] Can set as default
- [ ] Can remove payment method
- [ ] Methods stored in `payment_methods` table

### 13. Test Subscriptions

```typescript
const { subscriptionId } = await PaymentService.createSubscription({
  provider: 'stripe',
  priceId: 'price_1234567890',
});

const status = await PaymentService.getSubscriptionStatus();
console.log('Status:', status);
```

- [ ] Subscription created successfully
- [ ] Subscription status retrieved
- [ ] Subscription stored in `subscriptions` table
- [ ] Can cancel subscription
- [ ] Cancellation updates database

### 14. Test Webhooks

**Stripe:**
```bash
# Use Stripe CLI (install from https://stripe.com/docs/stripe-cli)
stripe listen --forward-to localhost:3000/functions/v1/payment-webhook
stripe trigger payment_intent.succeeded
```

- [ ] Webhook received in function logs
- [ ] Transaction status updated in database

**PayPal:**
- [ ] Use PayPal Webhook Simulator in Developer Dashboard
- [ ] Trigger test event
- [ ] Verify webhook received
- [ ] Verify database updated

### 15. Test Apple Pay (iOS only)

- [ ] Add Apple Pay capability to Xcode project
- [ ] Create Merchant ID
- [ ] Upload Apple Pay Certificate to Stripe
- [ ] Test `isApplePayAvailable()` returns true on iOS
- [ ] Test payment with `createApplePayPayment()`

## Error Handling & Edge Cases

### 16. Test Error Scenarios

- [ ] Insufficient funds payment rejected
- [ ] Invalid card rejected
- [ ] Expired card rejected
- [ ] Wrong CVC rejected
- [ ] Network timeout handled gracefully
- [ ] Invalid payment method ID rejected
- [ ] Unauthorized access (RLS) prevented
- [ ] Missing required fields returns error

## Security Review

### 17. Security Checks

- [ ] API keys never exposed in client code
- [ ] All API calls go through Edge Functions
- [ ] Webhook signatures verified (Stripe & PayPal)
- [ ] RLS policies prevent unauthorized access
- [ ] Environment secrets properly set
- [ ] CORS headers appropriate for production
- [ ] No test keys in production
- [ ] Database backups configured

## Documentation Review

### 18. Documentation Setup

- [ ] `/PAYMENT_QUICKSTART.md` reviewed
- [ ] `/PAYMENT_SETUP.md` reviewed
- [ ] `/src/services/PAYMENTS_API.md` reviewed
- [ ] `/PAYMENT_IMPLEMENTATION_SUMMARY.md` reviewed
- [ ] Team trained on payment system
- [ ] Support documentation created

## Production Deployment

### 19. Prepare for Production

- [ ] Switch to Stripe Live keys:
  ```bash
  supabase secrets set STRIPE_SECRET_KEY "sk_live_..."
  supabase secrets set STRIPE_WEBHOOK_SECRET "whsec_live_..."
  ```
  - [ ] Live Secret Key set
  - [ ] Live Webhook Secret set

- [ ] Switch to PayPal Production:
  ```bash
  supabase secrets set PAYPAL_ENV "production"
  ```
  - [ ] Environment changed to production
  - [ ] Client ID and Secret verified for production

- [ ] Update webhook endpoints to production domain
  - [ ] Stripe webhook URL updated
  - [ ] PayPal webhook URL updated

### 20. Final Production Checks

- [ ] All functions deployed to production
- [ ] Database migration applied
- [ ] Environment secrets set with live keys
- [ ] Webhooks configured for production endpoints
- [ ] Test payment with real test card (production)
- [ ] Monitoring and alerts configured
- [ ] Error logging setup
- [ ] Backup and recovery plan documented

## Post-Deployment

### 21. Monitoring & Maintenance

- [ ] Setup error logging (Sentry, LogRocket, etc.)
- [ ] Setup performance monitoring
- [ ] Create customer support documentation
- [ ] Document refund/chargeback process
- [ ] Setup payment reconciliation process
- [ ] Schedule regular security audits
- [ ] Monitor for failed transactions

### 22. Operations Procedures

- [ ] Document how to handle refunds
- [ ] Document how to handle disputes
- [ ] Create emergency contact procedures
- [ ] Document payment support escalation
- [ ] Setup customer notification emails
- [ ] Create dashboard for payment monitoring

## Rollback Plan

### 23. If Issues Occur

- [ ] Switch back to sandbox keys
- [ ] Disable webhook endpoints
- [ ] Revert to previous function versions
- [ ] Restore database from backup
- [ ] Document incident for post-mortem

## Sign-Off

- [ ] Project Lead: __________ Date: __________
- [ ] Technical Lead: __________ Date: __________
- [ ] QA Lead: __________ Date: __________
- [ ] Security Review: __________ Date: __________

## Notes

```
Use this space to document any deviations or special configurations:




```

---

## Quick Reference

### File Locations
- Client Service: `src/services/payments.ts`
- Edge Functions: `supabase/functions/*/index.ts`
- Database: `supabase/migrations/002_payment_system.sql`
- Documentation: Root directory (*.md files)

### Test Credentials
- Stripe Test: https://stripe.com/docs/testing
- PayPal Test: https://developer.paypal.com/docs

### Support Resources
- Stripe: https://stripe.com/docs
- PayPal: https://developer.paypal.com/docs
- Supabase: https://supabase.com/docs
