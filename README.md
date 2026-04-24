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
