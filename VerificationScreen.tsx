import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function VerificationScreen({ navigation }: { navigation: any }) {
  const [resendTimer, setResendTimer] = useState(0);
  const [email] = useState('user@example.com');

  const handleSendCode = () => {
    // TODO: Implement send code logic
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleVerify = () => {
    // TODO: Implement verify email logic
    navigation.navigate('OTP');
  };

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1***$3');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
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
          <Text style={styles.header}>Verify Your Email</Text>
        </View>

        {/* Verification Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.mailIcon}>
            <Text style={styles.mailIconText}>✉️</Text>
          </View>
        </View>

        {/* Info Text */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            We've sent a 4-digit code to your email
          </Text>
          <Text style={styles.emailText}>{maskedEmail}</Text>
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSendCode}
        >
          <Text style={styles.sendButtonText}>Send Code</Text>
        </TouchableOpacity>

        {/* Resend Link */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive it? </Text>
          <TouchableOpacity
            disabled={resendTimer > 0}
            onPress={handleSendCode}
          >
            <Text
              style={[
                styles.resendLink,
                resendTimer > 0 && styles.resendLinkDisabled,
              ]}
            >
              Resend {resendTimer > 0 ? `(${resendTimer}s)` : ''}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleVerify}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
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
  iconContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  mailIcon: {
    width: 80,
    height: 80,
    backgroundColor: colors.bgCard,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  mailIconText: {
    fontSize: 40,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  emailText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
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
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  resendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  resendLink: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    opacity: 0.5,
    color: colors.textMuted,
  },
  nextButton: {
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
});
