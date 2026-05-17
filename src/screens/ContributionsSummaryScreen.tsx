import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function isSameDay(value: string | undefined, target: Date) {
  if (!value) return false;
  const date = new Date(value);
  return !Number.isNaN(date.getTime()) && date.toDateString() === target.toDateString();
}

function isWithinLastWeek(value: string | undefined) {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  return date >= weekAgo;
}

export function ContributionsSummaryScreen({ navigation }: any) {
  const { contributions, bills, buckets } = useStore();
  const today = new Date();
  const completed = contributions.filter((item) => item.status === 'completed');
  const thisWeek = completed
    .filter((item) => isWithinLastWeek(item.executedAt || item.createdAt))
    .reduce((sum, item) => sum + item.amount, 0);
  const todayTotal = completed
    .filter((item) => isSameDay(item.executedAt || item.createdAt, today))
    .reduce((sum, item) => sum + item.amount, 0);
  const billBreakdown = bills
    .filter((bill) => bill.isActive)
    .map((bill) => {
      const bucket = buckets.find((item) => item.billId === bill.id);
      return {
        id: bill.id,
        name: bill.name,
        funded: bucket?.currentAmount || 0,
        total: bill.amount,
      };
    });

  const getProgressPercentage = (funded: number, total: number) =>
    Math.min(100, Math.round((funded / Math.max(total, 1)) * 100));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contributions Summary</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>This Week</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(thisWeek)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryAmount}>{formatCurrency(todayTotal)}</Text>
          </View>
        </View>
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Bills Breakdown</Text>
          {billBreakdown.length === 0 ? (
            <Text style={styles.emptyText}>Add a bill to see contribution progress.</Text>
          ) : (
            billBreakdown.map((bill) => (
              <View key={bill.id} style={styles.billItem}>
                <View style={styles.billHeader}>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billAmount}>
                    {formatCurrency(bill.funded)} / {formatCurrency(bill.total)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${getProgressPercentage(bill.funded, bill.total)}%` },
                    ]}
                  />
                </View>
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
  content: { padding: spacing.lg },
  summaryRow: { flexDirection: 'row', gap: spacing.lg, marginBottom: spacing.xl },
  summaryCard: { flex: 1, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  summaryLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  summaryAmount: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.primary },
  breakdownSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  breakdownTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  billItem: { marginBottom: spacing.lg },
  billHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.md },
  billName: { flex: 1, fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  billAmount: { fontSize: fontSizes.sm, color: colors.textSecondary },
  progressBarContainer: { height: 6, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: borderRadius.full },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
});
