import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function ForgotPasswordScreen({ navigation }: { navigation: any }) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendReset = () => {
    if (email) {
      // TODO: Implement send reset link logic
      setSubmitted(true);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Forgot Password?</Text>
          </View>

          {!submitted ? (
            <>
              {/* Info Text */}
              <Text style={styles.infoText}>
                Enter your email address and we'll send you a link to reset your password.
              </Text>

              {/* Email Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* Send Reset Button */}
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSendReset}
              >
                <Text style={styles.sendButtonText}>Send Reset Link</Text>
              </TouchableOpacity>

              {/* Back to Login Link */}
              <View style={styles.linkContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.backLoginLink}>Back to Log In</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <View style={styles.iconContainer}>
                <View style={styles.successIcon}>
                  <Text style={styles.iconText}>✓</Text>
                </View>
              </View>

              {/* Success Message */}
              <Text style={styles.successTitle}>Check Your Email</Text>
              <Text style={styles.successText}>
                We've sent a password reset link to {email}. Click the link in your email to create a new password.
              </Text>

              {/* Back to Login Button */}
              <TouchableOpacity
                style={styles.backButton2}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.backButtonText2}>Back to Log In</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
  linkContainer: {
    alignItems: 'center',
  },
  backLoginLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  successIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 40,
    color: colors.bg,
    fontWeight: '700',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  successText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
    lineHeight: 24,
  },
  backButton2: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  backButtonText2: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
});
