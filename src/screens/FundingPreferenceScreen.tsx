import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route?: any;
}

export function FundingPreferenceScreen({ navigation, route }: Props) {
  const [cadence, setCadence] = useState<'daily' | 'weekly'>('daily');

  const billAmount = route?.params?.billAmount || 120;
  const estimatedContribution = cadence === 'daily' ? (billAmount / 30).toFixed(2) : (billAmount / 4).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Funding Preference</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Choose how often you want to contribute toward your bills.
        </Text>

        {/* Cadence Toggle Pills */}
        <View style={styles.cadenceContainer}>
          <TouchableOpacity
            style={[
              styles.cadencePill,
              cadence === 'daily' && styles.cadencePillActive,
            ]}
            onPress={() => setCadence('daily')}
          >
            <Text
              style={[
                styles.cadenceText,
                cadence === 'daily' && styles.cadenceTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.cadencePill,
              cadence === 'weekly' && styles.cadencePillActive,
            ]}
            onPress={() => setCadence('weekly')}
          >
            <Text
              style={[
                styles.cadenceText,
                cadence === 'weekly' && styles.cadenceTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Estimated Contribution Card */}
        <View style={styles.estimatedCard}>
          <Text style={styles.estimatedLabel}>Estimated Contribution</Text>
          <Text style={styles.estimatedAmount}>${estimatedContribution}</Text>
          <Text style={styles.estimatedPeriod}>
            per {cadence === 'daily' ? 'day' : 'week'}
          </Text>
        </View>

        {/* Info Text */}
        <Text style={styles.infoText}>
          You can adjust your schedule later if needed.
        </Text>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlineButtonText}>Cancel</Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    minHeight: '100%',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  cadenceContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cadencePill: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
  },
  cadencePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cadenceText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  cadenceTextActive: {
    color: colors.background,
  },
  estimatedCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  estimatedLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  estimatedAmount: {
    color: colors.primary,
    fontSize: fontSizes['3xl'],
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  estimatedPeriod: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  infoText: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
