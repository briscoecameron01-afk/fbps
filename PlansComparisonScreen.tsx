import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
}

export function PlansComparisonScreen({ navigation }: Props) {
  const [inputAmount, setInputAmount] = useState('');

  const recentTransactions: Transaction[] = [
    { id: '1', description: 'Rent Payment', amount: 1200.00 },
    { id: '2', description: 'Electricity Bill', amount: 150.00 },
    { id: '3', description: 'Gym Membership', amount: 49.99 },
    { id: '4', description: 'Internet Bill', amount: 79.99 },
  ];

  const feeRate = 0.015; // 1.5%

  const calculateFee = (amount: number) => {
    return amount * feeRate;
  };

  const calculateNet = (amount: number) => {
    return amount - calculateFee(amount);
  };

  const displayAmount = inputAmount ? parseFloat(inputAmount) : 0;
  const fee = calculateFee(displayAmount);
  const net = calculateNet(displayAmount);

  const features = [
    'Unlimited bills',
    'Auto-detect bills',
    'Export reports',
    'Advanced insights',
    'Recurring contributions',
    'Priority support',
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fee Calculator</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Input Section */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Calculate Your Fee</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={inputAmount}
              onChangeText={setInputAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Breakdown Result */}
        {inputAmount && (
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Amount</Text>
              <Text style={styles.breakdownValue}>${displayAmount.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Fee (1.5%)</Text>
              <Text style={styles.breakdownValueFee}>${fee.toFixed(2)}</Text>
            </View>
            <View style={styles.breakdownDivider} />
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabelTotal}>Net Amount</Text>
              <Text style={styles.breakdownValueTotal}>${net.toFixed(2)}</Text>
            </View>
          </View>
        )}

        {/* Recent Transactions */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Recent Transactions</Text>
          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View>
                <Text style={styles.transactionName}>{transaction.description}</Text>
                <Text style={styles.transactionAmount}>${transaction.amount.toFixed(2)}</Text>
              </View>
              <Text style={styles.transactionFee}>
                Fee: ${calculateFee(transaction.amount).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* All Features Included */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>All Features Included</Text>
          <View style={styles.featuresCard}>
            {features.map((feature, idx) => (
              <View key={feature}>
                <View style={styles.featureRow}>
                  <Text style={styles.featureCheckmark}>✓</Text>
                  <Text style={styles.featureName}>{feature}</Text>
                </View>
                {idx < features.length - 1 && <View style={styles.featureDivider} />}
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    paddingVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.lg,
    height: 56,
  },
  currencySymbol: {
    color: colors.textSecondary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  breakdownCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  breakdownLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  breakdownValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  breakdownValueFee: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  breakdownLabelTotal: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  breakdownValueTotal: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  transactionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  transactionName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  transactionAmount: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  transactionFee: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  featuresCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  featureCheckmark: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginRight: spacing.md,
    width: 24,
  },
  featureName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '500',
  },
  featureDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
});
