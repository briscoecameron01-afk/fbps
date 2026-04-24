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
import { colors, spacing, fontSizes, fontWeights, borderRadius, screenPadding } from '../../theme';

interface VerificationScreenProps {
  navigation: any;
}

type VerificationMethod = 'email' | 'phone' | null;

export function VerificationScreen({ navigation }: VerificationScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Please select a verification method');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('OTP', { method: selectedMethod });
    }, 1000);
  };

  const isSelected = (method: VerificationMethod) => selectedMethod === method;

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
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>Choose how you'd like to verify your profile</Text>
        </View>

        {/* Option Cards */}
        <View style={styles.optionsContainer}>
          {/* Email Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              isSelected('email') && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>✉️</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Email</Text>
                <Text style={styles.optionDescription}>Receive code via email</Text>
              </View>
            </View>
            {isSelected('email') && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Phone Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              isSelected('phone') && styles.optionCardSelected,
            ]}
            onPress={() => setSelectedMethod('phone')}
            activeOpacity={0.8}
          >
            <View style={styles.optionContent}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>📱</Text>
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Phone</Text>
                <Text style={styles.optionDescription}>Receive code via SMS</Text>
              </View>
            </View>
            {isSelected('phone') && (
              <View style={styles.checkmark}>
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading || !selectedMethod}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Processing...' : 'Continue'}
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
  },
  optionsContainer: {
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  optionCard: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 217, 152, 0.05)',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionDescription: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    fontSize: fontSizes.md,
    color: colors.background,
    fontWeight: fontWeights.bold as any,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
});
