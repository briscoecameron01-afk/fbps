import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { ProgressBar } from '../components';
import { useStore } from '../hooks/useStore';
import {
  calculateContribution,
  formatCurrency,
  formatDate,
  getFundedPercent,
  getNextDueDate,
} from '../utils/calculations';

interface Props {
  navigation: any;
  route: any;
}

export function BillBreakdownScreen({ navigation, route }: Props) {
  const { bills, buckets, contributions } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const bucket = buckets.find((item) => item.billId === billId);
  const deposits = contributions.filter((item) => item.billId === billId).slice(0, 5);

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Breakdown</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>This bill could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const targetAmount = bucket?.targetAmount ?? bill.amount;
  const amountSaved = bucket?.currentAmount ?? 0;
  const amountRemaining = Math.max(targetAmount - amountSaved, 0);
  const progress = getFundedPercent(amountSaved, targetAmount);
  const nextDueDate = bill.dueDate ? new Date(bill.dueDate) : getNextDueDate(bill.dueDay);
  const daysRemaining = Math.max(0, Math.ceil((nextDueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const nextContribution = calculateContribution(amountRemaining || targetAmount, bill.dueDay, bill.cadence);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Breakdown</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.billSection}>
          <Text style={styles.billTitle}>{bill.name}</Text>
          <Text style={styles.billSubtitle}>
            Due on {formatDate(nextDueDate)} · {daysRemaining} days remaining
          </Text>
        </View>

        <View style={styles.mainCard}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Bill</Text>
            <Text style={styles.cardValue}>{formatCurrency(targetAmount)}</Text>
          </View>
          <View style={[styles.cardRow, styles.cardRowBorder]}>
            <Text style={styles.cardLabel}>Amount Saved</Text>
            <Text style={styles.cardValue}>{formatCurrency(amountSaved)}</Text>
          </View>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Amount Remaining</Text>
              <Text style={styles.cardValue}>{formatCurrency(amountRemaining)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <ProgressBar progress={progress} height={6} color={colors.primary} />
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Days Remaining</Text>
            <Text style={styles.statValue}>{daysRemaining}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Next Contribution</Text>
            <Text style={styles.statValue}>{formatCurrency(nextContribution.perPeriod)}{nextContribution.label}</Text>
          </View>
        </View>

        <View style={styles.depositsSection}>
          <Text style={styles.sectionTitle}>Recent Deposits</Text>
          {deposits.length === 0 ? (
            <Text style={styles.emptyText}>No contributions yet.</Text>
          ) : deposits.map((deposit, index) => (
            <View
              key={deposit.id}
              style={[
                styles.depositRow,
                index !== deposits.length - 1 && styles.depositRowBorder,
              ]}
            >
              <Text style={styles.depositDate}>{formatDate(deposit.executedAt || deposit.createdAt)}</Text>
              <Text style={styles.depositAmount}>{formatCurrency(deposit.amount)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.outlineButton, styles.buttonMargin]}
            onPress={() => navigation.navigate('ManualContribution')}
          >
            <Text style={styles.outlineButtonText}>Manual Contribution</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton, styles.buttonMargin]}
            onPress={() => navigation.navigate('FundingPreference', { billId: bill.id, billAmount: bill.amount })}
          >
            <Text style={styles.outlineButtonText}>Adjust Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonMargin]}
            onPress={() => navigation.navigate('PayBill', { billId: bill.id })}
          >
            <Text style={styles.primaryButtonText}>Pay Bill</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: spacing.xl }} />
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
  backBtn: { color: colors.primary, fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
  headerTitle: { fontWeight: fontWeights.bold, color: colors.textPrimary, fontSize: fontSizes.lg },
  billSection: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  billTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  billSubtitle: { fontSize: fontSizes.sm, color: colors.textSecondary },
  mainCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  cardRowBorder: { borderTopWidth: 1, borderTopColor: colors.border, borderBottomWidth: 1, borderBottomColor: colors.border },
  cardLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  cardValue: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.textPrimary },
  statsRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, gap: spacing.md, marginBottom: spacing.xl },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  statValue: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  depositsSection: { paddingHorizontal: spacing.xl, marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.textPrimary, marginBottom: spacing.lg },
  depositRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md },
  depositRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  depositDate: { fontSize: fontSizes.sm, color: colors.textSecondary },
  depositAmount: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  buttonsContainer: { paddingHorizontal: spacing.xl },
  buttonMargin: { marginBottom: spacing.md },
  outlineButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.background },
  emptyState: { padding: spacing.xl },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.md },
});
