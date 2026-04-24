# Auth Screens - Fractional Bill Pay App

Complete, production-quality authentication and onboarding screens for the Fractional Bill Pay React Native Expo app.

## Screens Created

### 1. **SplashScreen.tsx**
- Dark navy background with centered teal rounded-square icon containing "F"
- "Fractional Bill" text below the icon
- Auto-navigates to Welcome screen after 2 seconds
- Uses `navigation.replace('Welcome')`

### 2. **WelcomeScreen.tsx**
- Top: Teal "F" icon + "Fractional" header text
- Middle: "Turns chaos into clarity" bold heading with "Pay bills in daily or weekly chunks" subtitle
- Invoice illustration placeholder (styled View)
- Bottom: Two full-width buttons
  - "Log In" (teal solid)
  - "Create Account" (teal outline)

### 3. **SignUpScreen.tsx**
- Back button (teal-bordered rounded square with "<" chevron)
- "Create Account" title in teal
- Form fields: Username, Email/Phone, Password (with eye toggle), Confirm Password (with eye toggle)
- All inputs: dark bg (#0F1D32), border #1C2E4A, rounded 12px, label above in white
- "Sign Up" teal button
- "Already Have An Account?" link
- Divider with "Or continue with" text
- Social auth buttons: Google, Facebook, Apple (circular, dark background)

### 4. **LoginScreen.tsx**
- Back button
- "Log In Here" teal title with "Welcome Back" subtitle
- Username and Password fields (with eye toggle)
- "Forgot Your Password?" link aligned right
- "Log In" teal button
- "Create New Account" link
- Social auth buttons

### 5. **VerificationScreen.tsx**
- Back button
- "Verification" teal title
- "Choose how you'd like to verify your profile" subtitle
- Two selectable option cards (Email and Phone)
  - Each with icon, title, description
  - Teal border when selected, checkmark indicator
- "Continue" button

### 6. **OTPScreen.tsx**
- Back button
- "Enter The Code" teal title with "Check Your Phone" subtitle
- 6 individual digit input boxes (dark bg, rounded, teal border when focused)
- Countdown timer: "You can resend the code in 24 seconds"
- Auto-focus on next input, paste support
- "Verify" button
- Resend link appears when countdown reaches 0

### 7. **ForgotPasswordScreen.tsx**
- Back button
- "Forgot Password" teal title with descriptive subtitle
- Email Address input field
- "Reset Your Password" teal button
- "Remember your password?" link back to Login

### 8. **SetNewPasswordScreen.tsx**
- Back button
- "Set New Password" teal title
- Password field (with eye toggle)
- Confirm Password field (with eye toggle)
- Password requirements display (8+ characters)
- "Update Password" button

### 9. **SuccessModal.tsx**
- Reusable modal component
- Overlay with dark semi-transparent background
- Centered card with:
  - Green checkmark circle
  - Title text
  - Description text
  - Action button
- Used after registration and other successful flows

### 10. **PayScheduleSetupScreen.tsx**
- "Pay Schedule Setup" title
- "Select how often you receive income..." subtitle
- Four selectable option cards:
  - Daily, Weekly, Biweekly, Monthly
  - Dark cards, teal border when selected, teal text when selected
  - Icons for each option
- "Continue" button

### 11. **InitialBillSetupScreen.tsx**
- "Initial Bill Setup" teal title
- "Add your first bill..." subtitle
- Form fields:
  - Bill Name (TextInput)
  - Amount (with AED currency symbol)
  - Due Date (with calendar icon)
  - Category (dropdown with chevron)
  - Bill Type (toggle: Recurring / One Time as two pill buttons)
- "Continue" button
- All inputs styled consistently with dark theme

## Design System Integration

All screens use the theme from `src/theme/index.ts`:
- **Colors**: Dark navy backgrounds, bright teal accents, proper text hierarchy
- **Spacing**: Consistent gaps and padding using theme spacing scale
- **Typography**: Platform-specific fonts (System on iOS, Roboto on Android)
- **Border Radius**: Rounded corners at 12px for inputs, 20px for larger elements

### Key Color Values
- Background: #0A1628
- Input Background: #0F1D32
- Border: #1C2E4A
- Primary/Accent: #00D998 (bright teal)
- Text Primary: #FFFFFF
- Text Secondary: #94A3B8
- Text Muted: #64748B

## Features

- **Type-Safe**: Full TypeScript support with interface definitions
- **Responsive**: ScrollView for content that may overflow
- **State Management**: React hooks for form state and validation
- **Loading States**: Button opacity changes and text updates during operations
- **Accessibility**: Proper touch targets (40x40 for back buttons, etc.)
- **Eye Toggle**: Password visibility toggle on all password inputs
- **Navigation Integration**: Using React Navigation navigation prop
- **Form Validation**: Basic validation with Alert feedback
- **OTP Input**: Smart auto-focus, paste support, backspace handling

## Usage in Navigation

```typescript
// Stack Navigator Example
import {
  SplashScreen,
  WelcomeScreen,
  SignUpScreen,
  LoginScreen,
  VerificationScreen,
  OTPScreen,
  ForgotPasswordScreen,
  SetNewPasswordScreen,
  PayScheduleSetupScreen,
  InitialBillSetupScreen,
} from './screens/auth';

// In your navigator:
<Stack.Screen name="Splash" component={SplashScreen} />
<Stack.Screen name="Welcome" component={WelcomeScreen} />
<Stack.Screen name="SignUp" component={SignUpScreen} />
<Stack.Screen name="Login" component={LoginScreen} />
<Stack.Screen name="Verification" component={VerificationScreen} />
<Stack.Screen name="OTP" component={OTPScreen} />
<Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
<Stack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
<Stack.Screen name="PayScheduleSetup" component={PayScheduleSetupScreen} />
<Stack.Screen name="InitialBillSetup" component={InitialBillSetupScreen} />
```

## TODO: Backend Integration

- Replace `setTimeout` mock logic with actual API calls
- Implement sign-up validation and API calls
- Implement login authentication
- Implement OTP verification logic
- Implement password reset flow
- Implement bill creation API
- Add error handling and retry logic
- Connect to payment/banking APIs
- Add analytics tracking

## File Locations

All files are located at:
```
/sessions/blissful-serene-edison/mnt/fractional\ bill\ pay\ solutions\ /fractional-app/src/screens/auth/
```

- SplashScreen.tsx
- WelcomeScreen.tsx
- SignUpScreen.tsx
- LoginScreen.tsx
- VerificationScreen.tsx
- OTPScreen.tsx
- ForgotPasswordScreen.tsx
- SetNewPasswordScreen.tsx
- SuccessModal.tsx
- PayScheduleSetupScreen.tsx
- InitialBillSetupScreen.tsx
- index.ts (barrel export)
