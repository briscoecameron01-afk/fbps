import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { ProgressBar } from '../components';

interface Props {
  navigation: any;
  route: any;
}

export function BillBreakdownScreen({ navigation, route }: Props) {
  // Mock data
  const bill = {
    name: 'Electricity Bill',
    dueDate: '28 Feb',
    daysRemaining: 10,
    totalBill: 120.00,
    amountSaved: 78.00,
    amountRemaining: 42.00,
    progress: 65,
    nextContribution: 4.00,
  };

  const deposits = [
    { date: 'Feb 18', amount: 4.00 },
    { date: 'Feb 17', amount: 4.00 },
    { date: 'Feb 16', amount: 4.00 },
    { date: 'Feb 15', amount: 4.00 },
    { date: 'Feb 14', amount: 4.00 },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill Breakdown</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Bill Title and Subtitle */}
        <View style={styles.billSection}>
          <Text style={styles.billTitle}>{bill.name}</Text>
          <Text style={styles.billSubtitle}>
            Due on {bill.dueDate} · {bill.daysRemaining} days remaining
          </Text>
        </View>

        {/* Main Info Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Total Bill</Text>
            <Text style={styles.cardValue}>${bill.totalBill.toFixed(2)}</Text>
          </View>
          <View style={[styles.cardRow, styles.cardRowBorder]}>
            <Text style={styles.cardLabel}>Amount Saved</Text>
            <Text style={styles.cardValue}>${bill.amountSaved.toFixed(2)}</Text>
          </View>
          <View style={styles.cardRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardLabel}>Amount Remaining</Text>
              <Text style={styles.cardValue}>${bill.amountRemaining.toFixed(2)}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: spacing.lg }}>
              <ProgressBar progress={bill.progress} height={6} color={colors.primary} />
            </View>
          </View>
        </View>

        {/* Two-Column Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Days Remaining</Text>
            <Text style={styles.statValue}>{bill.daysRemaining}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Next Contribution</Text>
            <Text style={styles.statValue}>${bill.nextContribution.toFixed(2)}</Text>
          </View>
        </View>

        {/* Recent Deposits Section */}
        <View style={styles.depositsSection}>
          <Text style={styles.sectionTitle}>Recent Deposits</Text>
          {deposits.map((deposit, index) => (
            <View
              key={index}
              style={[
                styles.depositRow,
                index !== deposits.length - 1 && styles.depositRowBorder,
              ]}
            >
              <Text style={styles.depositDate}>{deposit.date}</Text>
              <Text style={styles.depositAmount}>${deposit.amount.toFixed(2)}</Text>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={[styles.outlineButton, styles.buttonMargin]}>
            <Text style={styles.outlineButtonText}>Manual Contribution</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.outlineButton, styles.buttonMargin]}>
            <Text style={styles.outlineButtonText}>Adjust Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonMargin]}
            onPress={() => navigation.navigate('PayBill')}
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
  backBtn: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  headerTitle: {
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
  },
  billSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  billTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  billSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  mainCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  cardRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cardLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  cardValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  statValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  depositsSection: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
  },
  depositRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  depositRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  depositDate: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  depositAmount: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  buttonsContainer: {
    paddingHorizontal: spacing.xl,
  },
  buttonMargin: {
    marginBottom: spacing.md,
  },
  outlineButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
});
