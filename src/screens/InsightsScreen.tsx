import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';
import { CATEGORY_LABELS } from '../types/bill';

const FILTER_DAYS = {
  Monthly: 30,
  Quarterly: 90,
} as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function withinDays(value: string | undefined, days: number) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const start = new Date();
  start.setDate(start.getDate() - days);
  return date >= start;
}

export function InsightsScreen({ navigation }: any) {
  const [timePeriod, setTimePeriod] = useState<'Monthly' | 'Quarterly'>('Monthly');
  const { bills, buckets, contributions } = useStore();
  const days = FILTER_DAYS[timePeriod];
  const activeBills = bills.filter((bill) => bill.isActive);
  const periodContributions = contributions.filter((item) =>
    withinDays(item.executedAt || item.createdAt, days)
  );

  const totalContributions = periodContributions
    .filter((item) => item.status === 'completed')
    .reduce((sum, item) => sum + item.amount, 0);
  const fundedBills = activeBills.filter((bill) => {
    const bucket = buckets.find((item) => item.billId === bill.id);
    return bucket?.status === 'paid' || (bucket?.currentAmount || 0) >= bill.amount;
  }).length;
  const upcomingPayments = activeBills.reduce((sum, bill) => {
    const bucket = buckets.find((item) => item.billId === bill.id);
    return sum + Math.max(0, bill.amount - (bucket?.currentAmount || 0));
  }, 0);
  const monthlyAverage = timePeriod === 'Monthly'
    ? totalContributions
    : totalContributions / 3;

  const stats = [
    { label: 'Total Contributions', value: formatCurrency(totalContributions) },
    { label: 'Bills Funded', value: `${fundedBills}/${activeBills.length}` },
    { label: 'Upcoming Payments', value: formatCurrency(upcomingPayments) },
    { label: 'Avg Monthly Saving', value: formatCurrency(monthlyAverage) },
  ];

  const recentDays = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (5 - index));
    const key = date.toISOString().slice(0, 10);
    const total = contributions
      .filter((item) => (item.executedAt || item.createdAt || '').slice(0, 10) === key)
      .filter((item) => item.status === 'completed')
      .reduce((sum, item) => sum + item.amount, 0);
    return { key, total, label: date.toLocaleDateString(undefined, { weekday: 'short' }) };
  });
  const maxDayTotal = Math.max(...recentDays.map((day) => day.total), 1);

  const categoryTotals = activeBills.reduce<Record<string, number>>((acc, bill) => {
    acc[bill.category] = (acc[bill.category] || 0) + bill.amount;
    return acc;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Insights & Reports</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.toggleContainer}>
          {(['Monthly', 'Quarterly'] as const).map((period) => (
            <TouchableOpacity
              key={period}
              style={[styles.togglePill, timePeriod === period && styles.togglePillActive]}
              onPress={() => setTimePeriod(period)}
            >
              <Text style={[styles.toggleText, timePeriod === period && styles.toggleTextActive]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Daily Contributions</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBars}>
              {recentDays.map((day) => (
                <View key={day.key} style={styles.barColumn}>
                  <View
                    style={[
                      styles.bar,
                      { height: `${Math.max(8, (day.total / maxDayTotal) * 100)}%` },
                    ]}
                  />
                  <Text style={styles.barLabel}>{day.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Bills Funding Progress</Text>
          {activeBills.length === 0 ? (
            <Text style={styles.emptyText}>Add a bill to see funding progress.</Text>
          ) : (
            activeBills.map((bill) => {
              const bucket = buckets.find((item) => item.billId === bill.id);
              const percentage = Math.min(
                100,
                Math.round(((bucket?.currentAmount || 0) / Math.max(bill.amount, 1)) * 100)
              );
              return (
                <View key={bill.id} style={styles.progressItem}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.billName}>{bill.name}</Text>
                    <Text style={styles.billPercentage}>{percentage}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                  </View>
                </View>
              );
            })
          )}
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Category Breakdown</Text>
          {Object.keys(categoryTotals).length === 0 ? (
            <Text style={styles.emptyText}>No active bills to categorize yet.</Text>
          ) : (
            Object.entries(categoryTotals).map(([category, total]) => (
              <View key={category} style={styles.categoryRow}>
                <Text style={styles.categoryLabel}>{CATEGORY_LABELS[category as keyof typeof CATEGORY_LABELS] || category}</Text>
                <Text style={styles.categoryAmount}>{formatCurrency(total)}</Text>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  toggleContainer: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl },
  togglePill: { flex: 1, paddingVertical: spacing.sm, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  togglePillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  toggleTextActive: { color: colors.background },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, marginBottom: spacing.xl },
  statCard: { width: '48%', backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  statLabel: { fontSize: fontSizes.xs, color: colors.textSecondary, marginBottom: spacing.sm },
  statValue: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.primary },
  chartSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  chartTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  chartPlaceholder: { height: 170, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.md, justifyContent: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
  barColumn: { alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: spacing.xs },
  bar: { width: 30, backgroundColor: colors.primary, borderRadius: borderRadius.sm, minHeight: 8 },
  barLabel: { color: colors.textMuted, fontSize: fontSizes.xs },
  progressSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  progressTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  progressItem: { marginBottom: spacing.lg },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  billName: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  billPercentage: { fontSize: fontSizes.sm, color: colors.textSecondary },
  progressBarContainer: { height: 8, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: borderRadius.full },
  categorySection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  categoryTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  categoryLabel: { color: colors.textPrimary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
  categoryAmount: { color: colors.textSecondary, fontSize: fontSizes.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
});
