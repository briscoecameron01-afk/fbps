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

interface ForgotPasswordScreenProps {
  navigation: any;
}

export function ForgotPasswordScreen({ navigation }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const { resetPassword } = useStore();

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(normalizedEmail);
      setLoading(false);
      if (result?.error) {
        Alert.alert('Error', result.error);
      } else {
        setSentEmail(normalizedEmail);
        setResetEmailSent(true);
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Unable to send a reset link right now. Please try again.');
    }
  };

  if (resetEmailSent) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerPrompt}>
          <View style={styles.promptCard}>
            <View style={styles.promptIcon}>
              <Text style={styles.promptIconText}>✓</Text>
            </View>
            <Text style={styles.promptTitle}>Check Your Email</Text>
            <Text style={styles.promptText}>
              We sent a password reset link to {sentEmail}. Open the link in that email to set a new password.
            </Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => navigation.navigate('Login')}
              activeOpacity={0.8}
            >
              <Text style={styles.resetButtonText}>Back to Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                setResetEmailSent(false);
                setLoading(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>Use a Different Email</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              editable={!loading}
            />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity
          style={[styles.resetButton, loading && styles.resetButtonDisabled]}
          onPress={handleResetPassword}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.resetButtonText}>
            {loading ? 'Sending...' : 'Reset Your Password'}
          </Text>
        </TouchableOpacity>

        {/* Back to Login Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Remember your password? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.linkHighlight}>Log In</Text>
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
    lineHeight: 24,
  },
  formContainer: {
    marginBottom: spacing['3xl'],
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
  resetButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  resetButtonDisabled: {
    opacity: 0.6,
  },
  resetButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
  centerPrompt: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: screenPadding.vertical,
  },
  promptCard: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    gap: spacing.lg,
  },
  promptIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  promptIconText: {
    color: colors.background,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
  },
  promptTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
  },
  promptText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 22,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
});
