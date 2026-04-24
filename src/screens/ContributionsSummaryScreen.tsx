import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

export function ContributionsSummaryScreen({ navigation }: any) {
  const billBreakdown = [
    { name: 'Electricity', funded: 12.0, total: 40 },
    { name: 'Internet', funded: 10.0, total: 50 },
    { name: 'Rent', funded: 6.0, total: 500 },
  ];

  const getProgressPercentage = (funded: number, total: number) => (funded / total) * 100;

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
            <Text style={styles.summaryAmount}>$28.00</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Today</Text>
            <Text style={styles.summaryAmount}>$4.00</Text>
          </View>
        </View>
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>Bills Breakdown</Text>
          {billBreakdown.map((bill, index) => (
            <View key={index} style={styles.billItem}>
              <View style={styles.billHeader}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billAmount}>${bill.funded.toFixed(2)} / ${bill.total}</Text>
              </View>
              <View style={styles.progressBarContainer}>
                <View style={[styles.progressBar, { width: `${getProgressPercentage(bill.funded, bill.total)}%` }]} />
              </View>
            </View>
          ))}
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
  billHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  billName: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  billAmount: { fontSize: fontSizes.sm, color: colors.textSecondary },
  progressBarContainer: { height: 6, backgroundColor: colors.backgroundCardLight, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: colors.primary, borderRadius: borderRadius.full },
});
