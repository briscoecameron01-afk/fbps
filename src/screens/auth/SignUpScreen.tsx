import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius, screenPadding } from '../../theme';
import { useStore } from '../../hooks/useStore';

interface SignUpScreenProps {
  navigation: any;
}

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { signUp } = useStore();

  const handleSignUp = async () => {
    setFormError('');
    setEmailError('');
    setPasswordError('');
    setShowLoginPrompt(false);

    if (!username.trim() || !firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setFormError('Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const result = await signUp(email, password, username, firstName, lastName);
      if (result?.error) {
        const message = result.error.toLowerCase();
        const isExistingAccount =
          result.errorCode === 'user_already_exists' ||
          message.includes('already') ||
          message.includes('registered');
        const isRateLimited =
          result.errorStatus === 429 ||
          result.errorCode === 'over_email_send_rate_limit' ||
          message.includes('rate limit') ||
          message.includes('too many');

        if (isExistingAccount) {
          setEmailError('An account with this email already exists.');
          setFormError('You can log in with this email instead.');
          setShowLoginPrompt(true);
        } else if (isRateLimited) {
          setFormError('Too many signup attempts. Please wait a few minutes before trying again.');
        } else {
          setFormError(result.error);
        }
        setLoading(false);
      } else {
        setLoading(false);
        navigation.navigate(result.needsEmailConfirmation ? 'Verification' : 'PayScheduleSetup', { email });
      }
    } catch (error) {
      setLoading(false);
      setFormError('Unable to create your account. Please try again.');
    }
  };

  const handleGoogleSignUp = () => {};
  const handleAppleSignUp = () => {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Fractional and manage your bills smarter</Text>
        </View>

        {!!formError && (
          <View style={styles.formErrorContainer}>
            <Text style={styles.formErrorText}>{formError}</Text>
            {showLoginPrompt && (
              <TouchableOpacity
                style={styles.inlineLoginButton}
                onPress={() => navigation.navigate('Login', { email })}
              >
                <Text style={styles.inlineLoginButtonText}>Go to Log In</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Username */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Choose a username"
              placeholderTextColor={colors.textMuted}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
          </View>

          {/* First Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your first name"
              placeholderTextColor={colors.textMuted}
              value={firstName}
              onChangeText={setFirstName}
              editable={!loading}
            />
          </View>

          {/* Last Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your last name"
              placeholderTextColor={colors.textMuted}
              value={lastName}
              onChangeText={setLastName}
              editable={!loading}
            />
          </View>

          {/* Email */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
            />
            {!!emailError && <Text style={styles.fieldError}>{emailError}</Text>}
          </View>

          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeButtonText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
            {!!passwordError && <Text style={styles.fieldError}>{passwordError}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeButtonText}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
          onPress={handleSignUp}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpButtonText}>{loading ? 'Creating Account...' : 'Sign Up'}</Text>
        </TouchableOpacity>

        {/* Already Have Account Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Already Have An Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkHighlight}>Log In</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Auth Buttons */}
        <View style={styles.socialButtonsContainer}>
          {/* Google Sign-Up */}
          <TouchableOpacity
            style={[styles.socialAuthButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleGoogleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.googleIconContainer}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.socialAuthButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Apple Sign-Up */}
          <TouchableOpacity
            style={[styles.socialAuthButton, { opacity: loading ? 0.6 : 1 }]}
            onPress={handleAppleSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            <View style={styles.appleIconContainer}>
              <Text style={styles.appleIcon}>🍎</Text>
            </View>
            <Text style={styles.socialAuthButtonText}>Continue with Apple</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: screenPadding.vertical,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButtonText: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  titleSection: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  formContainer: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: spacing.lg,
  },
  eyeButtonText: {
    fontSize: fontSizes.lg,
  },
  signUpButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  linkText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  linkHighlight: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.semibold as any,
  },
  fieldError: {
    color: colors.error || '#ef4444',
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  formErrorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.35)',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  formErrorText: {
    color: colors.error || '#ef4444',
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  inlineLoginButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  inlineLoginButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
  },
  dividerContainer: {
    display: 'none',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: spacing.md,
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  socialButtonsContainer: {
    display: 'none',
    flexDirection: 'column',
    gap: spacing.md,
  },
  socialAuthButton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconContainer: {
    marginRight: spacing.md,
  },
  googleIcon: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
  },
  appleIconContainer: {
    marginRight: spacing.md,
  },
  appleIcon: {
    fontSize: fontSizes.lg,
  },
  socialAuthButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
});
