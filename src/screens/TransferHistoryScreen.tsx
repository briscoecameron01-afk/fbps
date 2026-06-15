import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';
import { Transfer } from '../types/bill';
import { refreshUnitTransfers } from '../services/unit';

const FILTER_OPTIONS = ['All', 'Success', 'Pending', 'Failed'] as const;

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

function formatDate(value: string | undefined) {
  if (!value) return 'Not run yet';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not run yet';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TransferHistoryScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState<typeof FILTER_OPTIONS[number]>('All');
  const { transfers, syncFromSupabase } = useStore();

  useFocusEffect(
    useCallback(() => {
      const refresh = async () => {
        try {
          await refreshUnitTransfers();
        } catch {
          // Keep the latest synced history visible when Unit is not configured yet.
        }
        await syncFromSupabase();
      };

      refresh();
    }, [syncFromSupabase])
  );

  const rows = [...transfers].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const filteredTransfers = selectedFilter === 'All'
    ? rows
    : rows.filter((item) => item.status === selectedFilter.toLowerCase());

  const getStatusColor = (status: Transfer['status']) => {
    switch (status) {
      case 'success': return colors.success;
      case 'pending': return colors.warning;
      case 'failed': return colors.error;
      default: return colors.textSecondary;
    }
  };

  const renderTransferItem = ({ item }: { item: Transfer }) => (
    <View style={styles.transferCard}>
      <View style={styles.transferHeader}>
        <View style={styles.transferText}>
          <Text style={styles.billName}>{item.billName}</Text>
          <Text style={styles.transferInfo}>
            {formatCurrency(item.amount)} - {formatDate(item.date)}
          </Text>
          {!!item.fundingSource && (
            <Text style={styles.fundingSource}>{item.fundingSource}</Text>
          )}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer History</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTER_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.filterPill, selectedFilter === option && styles.filterPillActive]}
              onPress={() => setSelectedFilter(option)}
            >
              <Text style={[styles.filterPillText, selectedFilter === option && styles.filterPillTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      {filteredTransfers.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No transfers yet</Text>
          <Text style={styles.emptyText}>
            Unit ACH transfers will appear here once money movement is initiated.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredTransfers}
          keyExtractor={(item) => item.id}
          renderItem={renderTransferItem}
          contentContainerStyle={styles.listContent}
          scrollEnabled={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  filterContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  filterContent: { gap: spacing.md },
  filterPill: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
  filterPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterPillText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  filterPillTextActive: { color: colors.background },
  listContent: { padding: spacing.lg, gap: spacing.md },
  transferCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  transferHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md },
  transferText: { flex: 1 },
  billName: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  transferInfo: { fontSize: fontSizes.sm, color: colors.textSecondary },
  fundingSource: { fontSize: fontSizes.xs, color: colors.textMuted, marginTop: spacing.xs },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  statusText: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold, color: colors.background, textTransform: 'capitalize' },
  emptyCard: { margin: spacing.lg, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: fontWeights.bold, marginBottom: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
});
