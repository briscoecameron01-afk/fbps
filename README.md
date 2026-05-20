# Fractional Bill Pay — Mobile App

Break your bills into bite-sized payments. Never miss a due date again.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your phone (iOS/Android)

### Install & Run

```bash
# Install dependencies
cd fractional-app
npm install

# Start the dev server
npx expo start
```

Scan the QR code with Expo Go (Android) or Camera app (iOS).

### Project Structure

```
fractional-app/
├── App.tsx                         # Entry point
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── BillCard.tsx            # Bill card with progress bar
│   │   ├── Button.tsx              # Styled button variants
│   │   └── ProgressBar.tsx         # Animated progress bar
│   ├── hooks/
│   │   └── useStore.ts             # Zustand state management + mock data
│   ├── navigation/
│   │   └── AppNavigator.tsx        # React Navigation setup (tabs + stack)
│   ├── screens/
│   │   ├── OnboardingScreen.tsx    # Welcome flow (3 slides)
│   │   ├── DashboardScreen.tsx     # Main home with bill overview
│   │   ├── AddBillScreen.tsx       # Add bill (auto-detect + manual)
│   │   ├── SetCadenceScreen.tsx    # Choose contribution frequency
│   │   ├── BillDetailScreen.tsx    # Individual bill progress + history
│   │   └── SettingsScreen.tsx      # Profile, preferences, support
│   ├── services/
│   │   └── supabase.ts             # Supabase client configuration
│   ├── theme/                      # Design system (colors, typography, spacing)
│   ├── types/                      # TypeScript interfaces
│   └── utils/                      # Calculation helpers (contributions, formatting)
├── supabase/
│   └── migrations/
│       └── 001_initial.sql         # Database schema (run in Supabase SQL Editor)
└── package.json
```

## Setting Up Supabase Backend

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/migrations/001_initial.sql`
3. Go to **Settings > API** and copy your Project URL and anon key
4. Update `src/services/supabase.ts` with your credentials
5. Enable **Email Auth** in Authentication > Providers

## Key Features (MVP)

- **Onboarding** — 3-step welcome flow explaining the value prop
- **Dashboard** — Total saved, funding progress, upcoming bills
- **Add Bill** — Auto-detection from linked accounts + manual entry
- **Set Cadence** — Daily/weekly/biweekly with live calculation
- **Bill Detail** — Circular progress, contribution history, remaining amount
- **Settings** — Profile, linked accounts, notifications, premium upgrade

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Mobile | React Native + Expo (TypeScript) |
| State | Zustand |
| Navigation | React Navigation v7 |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Charts | react-native-svg |

## Next Steps

- [ ] Connect screens to Supabase (replace mock data)
- [ ] Add Plaid integration for bank linking
- [ ] Implement real contribution scheduling (Supabase Edge Functions)
- [ ] Add Stripe for payment processing
- [ ] Push notifications (Expo Notifications)
- [ ] Premium subscription (Stripe + RevenueCat)

## Unit Money Movement

Unit Ready-to-Launch banking is embedded in the app through Unit's white-label component. The app asks Supabase for a short-lived RS256 JWT, then passes that JWT to Unit's web component.

Generate a signing key pair:

```bash
node scripts/generate-unit-jwt-keypair.js
```

In Unit Sandbox, open **Ready To Launch > Settings > Authentication**:

- Set **Identity Provider** to `Custom`
- Paste the generated public key body into **Public Key**
- Set **JWT Issuer** to the same value you use for `UNIT_JWT_ISSUER`

Required Supabase secrets for Ready-to-Launch:

```bash
npx supabase secrets set UNIT_JWT_PRIVATE_KEY_BASE64=generated_private_key_base64
npx supabase secrets set UNIT_JWT_ISSUER=https://your-app-domain-or-stable-issuer
npx supabase secrets set UNIT_ENV=sandbox
```

If Unit gives you a specific key id, also set `UNIT_JWT_KEY_ID`.

Deploy/update after changing this integration:

```bash
npx supabase db push
npx supabase functions deploy unit-create-ready-to-launch-token
```

The older Custom Build money movement functions are still in the repo for later API-based integration. They require Unit API access that Ready-to-Launch accounts may not expose directly:

```bash
npx supabase secrets set UNIT_API_TOKEN=your_unit_token
npx supabase secrets set UNIT_CUSTOMER_ID=your_unit_customer_id
npx supabase secrets set UNIT_DEPOSIT_ACCOUNT_ID=your_unit_deposit_account_id
npx supabase functions deploy plaid-create-link-token
npx supabase functions deploy unit-get-account
npx supabase functions deploy unit-create-transfer
npx supabase functions deploy unit-refresh-transfers
```
