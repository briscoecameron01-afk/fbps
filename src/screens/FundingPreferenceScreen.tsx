import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';
import { Cadence } from '../types/bill';
import { calculateContribution, formatCurrency } from '../utils/calculations';

interface Props {
  navigation: any;
  route?: any;
}

const CADENCES: Cadence[] = ['daily', 'weekly', 'biweekly', 'monthly'];

export function FundingPreferenceScreen({ navigation, route }: Props) {
  const { bills, updateBillAsync, syncFromSupabase, isLoading } = useStore();
  const billId = route?.params?.billId as string | undefined;
  const bill = bills.find((item) => item.id === billId);
  const [cadence, setCadence] = useState<Cadence>(bill?.cadence || 'daily');
  const [error, setError] = useState('');

  useEffect(() => {
    if (bill?.cadence) setCadence(bill.cadence);
  }, [bill?.cadence]);

  const billAmount = bill?.amount || route?.params?.billAmount || 0;
  const dueDay = bill?.dueDay || 1;
  const estimatedContribution = calculateContribution(billAmount, dueDay, cadence);

  const handleSave = async () => {
    if (!bill) {
      navigation.goBack();
      return;
    }

    setError('');
    const result = await updateBillAsync(bill.id, { cadence });
    if (result.error) {
      setError(result.error);
      return;
    }

    await syncFromSupabase();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Funding Schedule</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>
          {bill ? `Choose how often you want to contribute toward ${bill.name}.` : 'Choose how often you want to contribute toward this bill.'}
        </Text>

        <View style={styles.cadenceContainer}>
          {CADENCES.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.cadencePill,
                cadence === option && styles.cadencePillActive,
              ]}
              onPress={() => setCadence(option)}
            >
              <Text
                style={[
                  styles.cadenceText,
                  cadence === option && styles.cadenceTextActive,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.estimatedCard}>
          <Text style={styles.estimatedLabel}>Estimated Contribution</Text>
          <Text style={styles.estimatedAmount}>{formatCurrency(estimatedContribution.perPeriod)}</Text>
          <Text style={styles.estimatedPeriod}>{estimatedContribution.label}</Text>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={{ flex: 1 }} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.primaryButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
          >
            <Text style={styles.primaryButtonText}>{isLoading ? 'Saving...' : 'Save Schedule'}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
  headerTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700' },
  content: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, minHeight: '100%' },
  subtitle: { color: colors.textSecondary, fontSize: fontSizes.md, marginBottom: spacing.xl, lineHeight: 24 },
  cadenceContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  cadencePill: {
    width: '47%',
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundCard,
  },
  cadencePillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  cadenceText: { color: colors.textSecondary, fontSize: fontSizes.md, fontWeight: '600', textTransform: 'capitalize' },
  cadenceTextActive: { color: colors.background },
  estimatedCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  estimatedLabel: { color: colors.textSecondary, fontSize: fontSizes.sm, marginBottom: spacing.xs },
  estimatedAmount: { color: colors.primary, fontSize: fontSizes['3xl'], fontWeight: '700', marginBottom: spacing.xs },
  estimatedPeriod: { color: colors.textMuted, fontSize: fontSizes.sm },
  errorText: { color: colors.error, fontSize: fontSizes.sm, fontWeight: '600', marginBottom: spacing.lg },
  buttonContainer: { gap: spacing.md },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: colors.background, fontSize: fontSizes.md, fontWeight: '700' },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '600' },
});
