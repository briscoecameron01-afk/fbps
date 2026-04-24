# Fractional Bill Pay - Auth Screens Implementation Guide

## Overview
11 complete, production-quality authentication and onboarding screens with full TypeScript support, dark fintech theme, and comprehensive form handling.

## Quick Start

### Import All Screens
```typescript
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
  SuccessModal,
} from './src/screens/auth';
```

### Basic Navigation Setup (React Navigation)
```typescript
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const AuthStack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={SplashScreen} />
      <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <AuthStack.Screen name="SetNewPassword" component={SetNewPasswordScreen} />
      <AuthStack.Screen name="Verification" component={VerificationScreen} />
      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="PayScheduleSetup" component={PayScheduleSetupScreen} />
      <AuthStack.Screen name="InitialBillSetup" component={InitialBillSetupScreen} />
    </AuthStack.Navigator>
  );
}
```

## Screen Details

### 1. SplashScreen
**Purpose**: App initialization and branding
**Flow**: Shows for 2 seconds → Auto-navigates to Welcome
**Props**: `navigation`
```typescript
<Stack.Screen name="Splash" component={SplashScreen} />
```

### 2. WelcomeScreen
**Purpose**: App introduction and first-time user routing
**Key Elements**:
- Fractional branding header
- Value proposition heading
- Dual action buttons (Log In / Create Account)
**Navigation**:
- → Login
- → SignUp

### 3. SignUpScreen
**Purpose**: User registration
**Form Fields**:
- Username
- Email/Phone
- Password (with visibility toggle)
- Confirm Password (with visibility toggle)
**Features**:
- Form validation
- Social auth buttons (Google, Facebook, Apple)
- Link to existing account login
**Navigation**:
- ← Back to Welcome
- → Verification (after sign-up)

### 4. LoginScreen
**Purpose**: User authentication
**Form Fields**:
- Username
- Password (with visibility toggle)
**Features**:
- "Forgot Password" link
- Social auth options
- Link to sign-up
**Navigation**:
- ← Back to Welcome
- → Main App (post-login)
- → ForgotPassword

### 5. VerificationScreen
**Purpose**: Choose verification method (email or SMS)
**Options**:
- Email verification
- Phone verification
**Features**:
- Selectable option cards with teal border highlights
- Checkmark indicator on selection
**Navigation**:
- ← Back to SignUp
- → OTP

### 6. OTPScreen
**Purpose**: Verify OTP code
**Features**:
- 6 individual digit inputs
- Auto-focus to next input
- Paste support for full code
- 24-second countdown timer
- "Resend Code" link (appears at 0 seconds)
- Backspace to move to previous input
**Navigation**:
- ← Back to Verification
- → PayScheduleSetup (after verification)

### 7. ForgotPasswordScreen
**Purpose**: Initiate password reset
**Form Fields**:
- Email Address
**Features**:
- Email validation
- "Remember password?" link back to login
**Navigation**:
- ← Back to Login
- → SetNewPassword

### 8. SetNewPasswordScreen
**Purpose**: Create new password
**Form Fields**:
- Password (with visibility toggle)
- Confirm Password (with visibility toggle)
**Features**:
- Password requirements display
- 8+ character minimum validation
- Password match validation
**Navigation**:
- ← Back to ForgotPassword
- → Login (on success)

### 9. SuccessModal
**Purpose**: Reusable success feedback component
**Props**:
```typescript
interface SuccessModalProps {
  visible: boolean;
  title: string;
  description: string;
  actionButtonText?: string; // defaults to "Continue"
  onActionPress: () => void;
  overlayStyle?: ViewStyle;
}
```
**Usage**:
```typescript
<SuccessModal
  visible={showSuccess}
  title="Account Created!"
  description="Your account has been successfully created."
  onActionPress={() => navigation.navigate('PayScheduleSetup')}
/>
```

### 10. PayScheduleSetupScreen
**Purpose**: Select income frequency
**Options**:
- Daily
- Weekly
- Biweekly
- Monthly
**Features**:
- Icon-based selection cards
- Teal highlighting on select
**Navigation**:
- → InitialBillSetup

### 11. InitialBillSetupScreen
**Purpose**: Add first bill to account
**Form Fields**:
- Bill Name
- Amount (with AED currency symbol)
- Due Date (with calendar icon)
- Category (dropdown)
- Bill Type (Recurring / One Time toggle pills)
**Categories Included**:
- Electricity
- Water
- Internet
- Phone
- Insurance
- Rent
- Other
**Navigation**:
- → Main App (on completion)

## Design System

### Colors Used
All colors imported from `src/theme/colors.ts`:
- **background**: #0A1628 (dark navy)
- **backgroundInput**: #0F1D32 (lighter navy for inputs)
- **primary/accent**: #00D998 (bright teal)
- **textPrimary**: #FFFFFF
- **textSecondary**: #94A3B8
- **textMuted**: #64748B
- **border**: #1C2E4A

### Spacing Scale
All spacing from `src/theme/spacing.ts`:
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 20px
- 2xl: 24px
- 3xl: 32px
- 4xl: 40px
- 5xl: 48px
- 6xl: 64px

### Typography
From `src/theme/typography.ts`:
- **Headings**: System/Roboto, Bold (700)
- **Body**: System/Roboto, Regular (400)
- **Emphasis**: Semibold (600)
- **Font Sizes**: xs(11) → sm(13) → md(15) → lg(17) → xl(20) → 2xl(24) → 3xl(28) → 4xl(34) → 5xl(42)

## Common Patterns

### Back Button (All Auth Screens)
```typescript
<TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()}
  activeOpacity={0.8}
>
  <Text style={styles.backButtonText}>{'<'}</Text>
</TouchableOpacity>
```

### Text Input Field
```typescript
<View style={styles.fieldContainer}>
  <Text style={styles.label}>Field Label</Text>
  <TextInput
    style={styles.input}
    placeholder="Placeholder text"
    placeholderTextColor={colors.textMuted}
    value={state}
    onChangeText={setState}
    editable={!loading}
  />
</View>
```

### Password Input with Eye Toggle
```typescript
<View style={styles.passwordInputContainer}>
  <TextInput
    style={styles.passwordInput}
    placeholder="Password"
    secureTextEntry={!showPassword}
    value={password}
    onChangeText={setPassword}
  />
  <TouchableOpacity
    style={styles.eyeButton}
    onPress={() => setShowPassword(!showPassword)}
  >
    <Text style={styles.eyeButtonText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
  </TouchableOpacity>
</View>
```

### Teal Button (Primary)
```typescript
<TouchableOpacity
  style={[styles.button, disabled && styles.buttonDisabled]}
  onPress={handlePress}
  disabled={disabled}
  activeOpacity={0.8}
>
  <Text style={styles.buttonText}>Button Text</Text>
</TouchableOpacity>
```

### Selectable Card
```typescript
<TouchableOpacity
  style={[
    styles.card,
    isSelected && styles.cardSelected,
  ]}
  onPress={() => setSelected(true)}
  activeOpacity={0.8}
>
  {isSelected && <View style={styles.checkmark}>✓</View>}
</TouchableOpacity>
```

## Implementation Checklist

- [ ] Copy all screen files to `src/screens/auth/`
- [ ] Import theme from `src/theme`
- [ ] Set up navigation stack with screen names
- [ ] Implement backend API calls (replace setTimeout mocks)
- [ ] Add proper error handling and retry logic
- [ ] Connect authentication service
- [ ] Implement OTP service integration
- [ ] Add analytics/tracking
- [ ] Test responsive design across devices
- [ ] Test form validation edge cases
- [ ] Connect to payment/banking services

## API Integration TODOs

Each screen has TODO comments for backend integration:

### SignUpScreen
```typescript
// TODO: Implement sign up logic
// POST /api/auth/signup
// { username, email, password }
```

### LoginScreen
```typescript
// TODO: Implement login logic
// POST /api/auth/login
// { username, password }
```

### OTPScreen
```typescript
// TODO: Implement OTP verification logic
// POST /api/auth/verify-otp
// { otpCode, method }

// TODO: Implement resend OTP logic
// POST /api/auth/resend-otp
```

### SetNewPasswordScreen
```typescript
// TODO: Implement password update logic
// POST /api/auth/reset-password
// { token, newPassword }
```

### InitialBillSetupScreen
```typescript
// TODO: Implement bill creation logic
// POST /api/bills
// { billName, amount, dueDate, category, billType }
```

## File Location
```
/sessions/blissful-serene-edison/mnt/fractional\ bill\ pay\ solutions\ /fractional-app/src/screens/auth/
```

## Support Components

All screens use only React Native built-in components:
- SafeAreaView
- ScrollView
- View
- Text
- TouchableOpacity
- TextInput
- Modal
- StyleSheet
- Alert

No external UI libraries required - pure React Native Expo implementation.

## Performance Considerations

- All screens use `activeOpacity={0.8}` for touch feedback
- ScrollView properly configured with `showsVerticalScrollIndicator={false}`
- Loading states prevent double-submission
- Proper cleanup of timers and intervals (OTPScreen countdown)
- Refs used for TextInput focus management (OTPScreen)

## Testing Recommendations

1. **Navigation**: Verify forward/backward navigation works
2. **Forms**: Test required field validation
3. **OTP**: Test digit input, auto-focus, paste, backspace
4. **Social Auth**: Verify button layout and spacing
5. **Responsiveness**: Test on various screen sizes
6. **Accessibility**: Check touch target sizes (min 40x40)
7. **States**: Test loading, disabled, selected states
