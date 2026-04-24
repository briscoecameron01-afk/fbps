import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { Button } from '../components';
import { Cadence } from '../types/bill';
import { calculateContribution, formatCurrency } from '../utils/calculations';

interface Props {
  navigation: any;
  route: any;
}

export function SetCadenceScreen({ navigation, route }: Props) {
  const { billName = 'Bill', billAmount = 0, billDueDay = 1 } = route.params || {};
  const [selectedCadence, setSelectedCadence] = useState<Cadence>('daily');

  const cadenceOptions: { id: Cadence; label: string }[] = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'biweekly', label: 'Biweekly' },
  ];

  const calc = calculateContribution(billAmount, billDueDay, selectedCadence);

  const handleConfirm = () => {
    // In a real app, we'd save the cadence to the store/backend
    navigation.navigate('Main');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contribution Setup</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Bill summary */}
      <View style={styles.billSummary}>
        <Text style={styles.billEmoji}>📋</Text>
        <Text style={styles.billName}>{billName}</Text>
        <Text style={styles.billAmount}>{formatCurrency(billAmount)}</Text>
        <Text style={styles.billDue}>Due on the {billDueDay}{getOrdinal(billDueDay)} of each month</Text>
      </View>

      {/* Cadence selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Choose your rhythm</Text>

        {cadenceOptions.map((opt) => {
          const optCalc = calculateContribution(billAmount, billDueDay, opt.id);
          const isSelected = selectedCadence === opt.id;

          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.cadenceCard, isSelected && styles.cadenceCardActive]}
              onPress={() => setSelectedCadence(opt.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cadenceLeft}>
                <View style={[styles.radio, isSelected && styles.radioActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View>
                  <Text style={styles.cadenceLabel}>{opt.label}</Text>
                  <Text style={styles.cadenceDesc}>{optCalc.periods} contributions</Text>
                </View>
              </View>
              <Text style={[styles.cadenceAmount, isSelected && styles.cadenceAmountActive]}>
                {formatCurrency(optCalc.perPeriod)}{optCalc.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recommendation */}
      <View style={styles.recommendation}>
        <Text style={styles.recTitle}>Aligned with your pay schedule</Text>
        <Text style={styles.recDesc}>
          Based on your income pattern, we recommend {selectedCadence} contributions of{' '}
          {formatCurrency(calc.perPeriod)} to spread the cost evenly.
        </Text>
      </View>

      {/* CTA */}
      <View style={styles.cta}>
        <Button title="Start Contributing" onPress={handleConfirm} size="lg" />
      </View>
    </View>
  );
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    color: colors.teal,
    fontSize: fontSizes.md,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: fontSizes.lg,
  },
  billSummary: {
    backgroundColor: colors.navy,
    margin: spacing.xl,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
  },
  billEmoji: {
    fontSize: 28,
    marginBottom: spacing.sm,
  },
  billName: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.lg,
    marginBottom: spacing.xs,
  },
  billAmount: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Georgia',
  },
  billDue: {
    color: colors.light,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  section: {
    paddingHorizontal: spacing.xl,
  },
  sectionTitle: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: fontSizes.md,
    marginBottom: spacing.md,
  },
  cadenceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cadenceCardActive: {
    borderColor: colors.teal,
    backgroundColor: colors.teal + '08',
  },
  cadenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: colors.teal,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.teal,
  },
  cadenceLabel: {
    fontWeight: '600',
    fontSize: fontSizes.md,
    color: colors.dark,
  },
  cadenceDesc: {
    fontSize: fontSizes.xs,
    color: colors.mid,
    marginTop: 2,
  },
  cadenceAmount: {
    fontWeight: '700',
    fontSize: fontSizes.md,
    color: colors.navy,
  },
  cadenceAmountActive: {
    color: colors.teal,
  },
  recommendation: {
    backgroundColor: colors.lightBg,
    borderRadius: borderRadius.md,
    margin: spacing.xl,
    padding: spacing.lg,
  },
  recTitle: {
    fontWeight: '600',
    fontSize: fontSizes.sm,
    color: colors.navy,
    marginBottom: spacing.xs,
  },
  recDesc: {
    fontSize: fontSizes.xs,
    color: colors.mid,
    lineHeight: 18,
  },
  cta: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing['3xl'],
  },
});
