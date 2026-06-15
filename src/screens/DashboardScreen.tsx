import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { formatCurrency, formatDate, getFundedPercent } from '../utils/calculations';
import { useStore } from '../hooks/useStore';

interface Props {
  navigation: any;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DashboardScreen({ navigation }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const { userProfile, userName, bills, buckets } = useStore();

  const currentMonth = MONTHS[selectedMonth];
  const currentYear = new Date().getFullYear();
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username || 'User';
  const activeBills = bills.filter((bill) => bill.isActive);
  const billRows = activeBills.map((bill) => {
    const bucket = buckets.find((item) => item.billId === bill.id);
    const targetAmount = bucket?.targetAmount ?? bill.amount;
    const currentAmount = bucket?.currentAmount ?? 0;
    const remainingAmount = Math.max(targetAmount - currentAmount, 0);
    const fundedPercent = getFundedPercent(currentAmount, targetAmount);
    const formattedDueDate = bill.dueDate ? formatDate(bill.dueDate) : `Day ${bill.dueDay}`;
    const status =
      fundedPercent >= 100
        ? 'Funded'
        : fundedPercent >= 75
          ? 'On Track'
          : currentAmount > 0
            ? 'Funding'
            : 'Not Started';

    return {
      ...bill,
      targetAmount,
      currentAmount,
      remainingAmount,
      fundedPercent,
      formattedDueDate,
      status,
    };
  });

  const totalTarget = billRows.reduce((sum, bill) => sum + bill.targetAmount, 0);
  const totalFunded = billRows.reduce((sum, bill) => sum + bill.currentAmount, 0);
  const totalRemaining = Math.max(totalTarget - totalFunded, 0);
  const nextBill = [...billRows]
    .filter((bill) => bill.remainingAmount > 0)
    .sort((a, b) => {
      if (a.dueDate && b.dueDate && a.dueDate !== b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.dueDay - b.dueDay;
    })[0];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.name}>{displayName}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>!</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.monthSelector}
            onPress={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            <Text style={styles.monthText}>{currentMonth} {currentYear}</Text>
            <Text style={styles.chevron}>v</Text>
          </TouchableOpacity>

          {showMonthDropdown && (
            <View style={styles.monthDropdown}>
              {MONTHS.map((month, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.monthOption,
                    idx === selectedMonth && styles.monthOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedMonth(idx);
                    setShowMonthDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.monthOptionText,
                      idx === selectedMonth && styles.monthOptionTextSelected,
                    ]}
                  >
                    {month}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Bills</Text>
              <Text style={styles.statValue}>{activeBills.length}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Funded</Text>
              <Text style={styles.statValue}>{formatCurrency(totalFunded, false)}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={styles.statValue}>{formatCurrency(totalRemaining, false)}</Text>
            </View>
          </View>

          {!!nextBill && (
            <View style={styles.alertBanner}>
              <View style={styles.alertContent}>
                <Text style={styles.alertTitle}>Next bill to fund</Text>
                <Text style={styles.alertDescription}>
                  {nextBill.name} - {formatCurrency(nextBill.remainingAmount)} remaining
                </Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.billsSection}>
          <Text style={styles.billsTitle}>Your Bills</Text>

          {billRows.length === 0 ? (
            <View style={styles.emptyBillsCard}>
              <Text style={styles.emptyBillsTitle}>No bills yet</Text>
              <Text style={styles.emptyBillsText}>Add your first bill to track funding progress here.</Text>
            </View>
          ) : (
            billRows.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={styles.billCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('BillDetail', { billId: bill.id })}
              >
                <View style={styles.billCardContent}>
                  <View style={styles.billCardLeft}>
                    <Text style={styles.billName}>{bill.name}</Text>
                    <Text style={styles.billDueDate}>Due {bill.formattedDueDate}</Text>
                    <Text style={styles.billFundingText}>
                      {formatCurrency(bill.currentAmount)} of {formatCurrency(bill.targetAmount)} funded
                    </Text>
                  </View>
                  <View style={styles.billCardRight}>
                    <Text style={styles.billAmount}>{formatCurrency(bill.remainingAmount)}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            bill.status === 'Funded' || bill.status === 'On Track'
                              ? colors.primary + '20'
                              : colors.warning + '20',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          {
                            color:
                              bill.status === 'Funded' || bill.status === 'On Track'
                                ? colors.primary
                                : colors.warning,
                          },
                        ]}
                      >
                        {bill.status}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${bill.fundedPercent}%`,
                        backgroundColor: colors.primary,
                      },
                    ]}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('AddBill')}
          >
            <Text style={styles.outlineButtonText}>Add Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('ManualContribution')}
          >
            <Text style={styles.outlineButtonText}>Contribution</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: 4,
  },
  name: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: '700',
  },
  monthSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  monthDropdown: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  monthOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  monthOptionSelected: {
    backgroundColor: colors.backgroundCardLight,
  },
  monthOptionText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  monthOptionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  alertBanner: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '40',
  },
  alertContent: {
    gap: spacing.xs,
  },
  alertTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  alertDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  billsSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  billsTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  emptyBillsCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyBillsTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  emptyBillsText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
  billCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  billCardLeft: {
    flex: 1,
  },
  billName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  billDueDate: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  billFundingText: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  billCardRight: {
    alignItems: 'flex-end',
  },
  billAmount: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  outlineButton: {
    flex: 1,
    paddingVertical: spacing.lg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
