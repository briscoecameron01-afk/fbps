import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius, screenPadding } from '@/theme';
import { useStore } from '@/hooks/useStore';

interface VerificationScreenProps {
  navigation: any;
  route: any;
}

export function VerificationScreen({ navigation, route }: VerificationScreenProps) {
  const email = route?.params?.email || '';
  const [loading, setLoading] = useState(false);
  const { sendOTP } = useStore();

  const handleResend = async () => {
    if (!email) {
      Alert.alert('Email Missing', 'Please go back and enter your email address again.');
      return;
    }

    setLoading(true);
    const result = await sendOTP(email);
    setLoading(false);

    if (result?.error) {
      Alert.alert('Unable to Resend', result.error);
      return;
    }

    Alert.alert('Email Sent', 'We sent another confirmation link to your email.');
  };

  const handleContinue = () => {
    navigation.navigate('Login', { email });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>

        <View style={styles.titleSection}>
          <Text style={styles.title}>Confirm Your Email</Text>
          <Text style={styles.subtitle}>
            Supabase sent a confirmation link to {email || 'your email address'}.
          </Text>
          <Text style={styles.description}>
            Open that email and click the confirmation link. After your email is confirmed, come back here and log in with your email and password.
          </Text>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>@</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>No code needed</Text>
            <Text style={styles.infoDescription}>
              This app uses Supabase's email confirmation link instead of a six-digit verification code.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue to Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, loading && styles.secondaryButtonDisabled]}
          onPress={handleResend}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>
            {loading ? 'Sending...' : 'Resend Confirmation Email'}
          </Text>
        </TouchableOpacity>
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
    marginBottom: spacing['3xl'],
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
    marginBottom: spacing.md,
  },
  description: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundInput,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  iconText: {
    fontSize: fontSizes.xl,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  continueButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
  secondaryButton: {
    backgroundColor: colors.backgroundCard,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryButtonDisabled: {
    opacity: 0.6,
  },
  secondaryButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
});
