import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { formatCurrency } from '../utils/calculations';
import { useStore } from '../hooks/useStore';

interface Props {
  navigation: any;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function DashboardScreen({ navigation }: Props) {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const { userProfile, userName } = useStore();

  const currentMonth = MONTHS[selectedMonth];
  const currentYear = new Date().getFullYear();
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username || 'User';

  const mockBills = [
    { id: '1', name: 'Electricity', amount: 120, dueDate: 'Jul 10', status: 'On Track' as const },
    { id: '2', name: 'Internet', amount: 79, dueDate: 'Jul 15', status: 'On Track' as const },
    { id: '3', name: 'Insurance', amount: 150, dueDate: 'Jul 20', status: 'Behind' as const },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.name}>{displayName}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>🔔</Text>
            </View>
          </View>

          {/* Month Selector */}
          <TouchableOpacity
            style={styles.monthSelector}
            onPress={() => setShowMonthDropdown(!showMonthDropdown)}
          >
            <Text style={styles.monthText}>{currentMonth} {currentYear}</Text>
            <Text style={styles.chevron}>▼</Text>
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

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Bills</Text>
              <Text style={styles.statValue}>6</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Funded</Text>
              <Text style={styles.statValue}>$420</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Remaining</Text>
              <Text style={styles.statValue}>$180</Text>
            </View>
          </View>

          {/* Alert Banner */}
          <View style={styles.alertBanner}>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Next bill due in 3 days</Text>
              <Text style={styles.alertDescription}>Electricity · $120 remaining</Text>
            </View>
          </View>
        </View>

        {/* Your Bills Section */}
        <View style={styles.billsSection}>
          <Text style={styles.billsTitle}>Your Bills</Text>

          {mockBills.map((bill) => (
            <TouchableOpacity key={bill.id} style={styles.billCard} activeOpacity={0.7}>
              <View style={styles.billCardContent}>
                <View>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billDueDate}>Due {bill.dueDate}</Text>
                </View>
                <View style={styles.billCardRight}>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          bill.status === 'On Track'
                            ? colors.onTrack + '20'
                            : colors.behind + '20',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        {
                          color:
                            bill.status === 'On Track'
                              ? colors.onTrack
                              : colors.behind,
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
                      width:
                        bill.status === 'On Track' ? '75%' : '40%',
                      backgroundColor: colors.primary,
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('AddBill')}
          >
            <Text style={styles.outlineButtonText}>Add Bill</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.navigate('Contribution')}
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
    fontSize: 20,
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
  billCardRight: {
    alignItems: 'flex-end',
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
