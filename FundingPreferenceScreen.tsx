import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

type Cadence = 'daily' | 'weekly' | 'biweekly';

export function FundingPreferenceScreen({ navigation }: Props) {
  const [selectedCadence, setSelectedCadence] = useState<Cadence>('weekly');
  const [startDate, setStartDate] = useState('2024-01-15');

  const billName = 'Netflix';
  const billAmount = 15.99;

  const cadences = [
    {
      id: 'daily',
      label: 'Daily',
      amount: (billAmount / 30).toFixed(2),
      description: 'Every day',
    },
    {
      id: 'weekly',
      label: 'Weekly',
      amount: (billAmount / 4.29).toFixed(2),
      description: 'Every week',
    },
    {
      id: 'biweekly',
      label: 'Biweekly',
      amount: (billAmount / 2).toFixed(2),
      description: 'Every 2 weeks',
    },
  ];

  const handleConfirm = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Set Contribution</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Bill Summary */}
        <View style={styles.billSummary}>
          <View style={styles.billSummaryContent}>
            <Text style={styles.billSummaryLabel}>Bill</Text>
            <Text style={styles.billSummaryName}>{billName}</Text>
          </View>
          <View style={styles.billSummaryDivider} />
          <View style={styles.billSummaryContent}>
            <Text style={styles.billSummaryLabel}>Amount Due</Text>
            <Text style={styles.billSummaryAmount}>${billAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Cadence Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Funding Cadence</Text>
          <Text style={styles.sectionDescription}>Choose how often you want to contribute to this bill</Text>

          <View style={styles.cadenceGrid}>
            {cadences.map((cadence) => (
              <TouchableOpacity
                key={cadence.id}
                style={[
                  styles.cadenceCard,
                  selectedCadence === cadence.id && styles.cadenceCardSelected,
                ]}
                onPress={() => setSelectedCadence(cadence.id as Cadence)}
              >
                <View style={styles.cadenceCardContent}>
                  <Text style={styles.cadenceLabel}>{cadence.label}</Text>
                  <Text style={styles.cadenceAmount}>${cadence.amount}</Text>
                  <Text style={styles.cadenceDescription}>{cadence.description}</Text>
                </View>
                {selectedCadence === cadence.id && (
                  <View style={styles.cadenceCheckmark}>
                    <Text style={styles.checkmark}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Start Date Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Start Date</Text>
          <TouchableOpacity style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{startDate}</Text>
          </TouchableOpacity>
        </View>

        {/* Summary Box */}
        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Payment Frequency</Text>
            <Text style={styles.summaryValue}>
              {cadences.find((c) => c.id === selectedCadence)?.label}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Amount Per {cadences.find((c) => c.id === selectedCadence)?.label}</Text>
            <Text style={styles.summaryValue}>
              ${cadences.find((c) => c.id === selectedCadence)?.amount}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Start Date</Text>
            <Text style={styles.summaryValue}>{startDate}</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
    paddingVertical: spacing.lg,
  },
  billSummary: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },
  billSummaryContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  billSummaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  billSummaryName: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  billSummaryAmount: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  billSummaryDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  cadenceGrid: {
    gap: spacing.md,
  },
  cadenceCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cadenceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  cadenceCardContent: {
    flex: 1,
  },
  cadenceLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cadenceAmount: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  cadenceDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  cadenceCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  dateButton: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  summaryBox: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
