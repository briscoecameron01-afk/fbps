import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

export function InsightsScreen({ navigation }: any) {
  const [timePeriod, setTimePeriod] = useState<'Monthly' | 'Quarterly'>('Monthly');

  const stats = [
    { label: 'Total Contributions', value: '$4,850' },
    { label: 'Bills Funded', value: '6/8' },
    { label: 'Upcoming Payments', value: '$1,120' },
    { label: 'Avg Monthly Saving', value: '$810' },
  ];

  const billsProgress = [
    { name: 'Rent', percentage: 65 },
    { name: 'Utilities', percentage: 45 },
    { name: 'Subscriptions', percentage: 80 },
  ];

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
          {(['Monthly', 'Quarterly'] as const).map(period => (
            <TouchableOpacity key={period} style={[styles.togglePill, timePeriod === period && styles.togglePillActive]} onPress={() => setTimePeriod(period)}>
              <Text style={[styles.toggleText, timePeriod === period && styles.toggleTextActive]}>{period}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>
        <View style={styles.chartSection}>
          <Text style={styles.chartTitle}>Daily Contribution</Text>
          <View style={styles.chartPlaceholder}>
            <View style={styles.chartBars}>
              <View style={[styles.bar, { height: '40%' }]} />
              <View style={[styles.bar, { height: '60%' }]} />
              <View style={[styles.bar, { height: '35%' }]} />
              <View style={[styles.bar, { height: '75%' }]} />
              <View style={[styles.bar, { height: '50%' }]} />
              <View style={[styles.bar, { height: '45%' }]} />
            </View>
          </View>
        </View>
        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Bills Funding Progress</Text>
          {billsProgress.map((bill, index) => (
            <View key={index} style={styles.progressItem}>
              <View style={styles.progressHeader}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billPercentage}>{bill.percentage}%</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${bill.percentage}%` }]} />
              </View>
            </View>
          ))}
        </View>
        <View style={styles.categorySection}>
          <Text style={styles.categoryTitle}>Category Breakdown</Text>
          <View style={styles.donutChartPlaceholder}>
            <View style={styles.donutCircle} />
            <Text style={styles.donutLabel}>Breakdown</Text>
          </View>
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
  chartPlaceholder: { height: 150, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.md, justifyContent: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  chartBars: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: '100%' },
  bar: { width: 30, backgroundColor: colors.primary, borderRadius: borderRadius.sm, minHeight: 10 },
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
  donutChartPlaceholder: { height: 200, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.md, justifyContent: 'center', alignItems: 'center' },
  donutCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 20, borderColor: colors.primary, backgroundColor: colors.backgroundCardLight },
  donutLabel: { position: 'absolute', fontSize: fontSizes.xs, color: colors.textSecondary },
});
