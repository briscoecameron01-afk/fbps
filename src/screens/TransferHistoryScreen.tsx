import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

interface Transfer {
  id: string;
  billName: string;
  amount: number;
  date: string;
  status: 'Success' | 'Pending' | 'Failed';
}

const TRANSFERS: Transfer[] = [
  { id: '1', billName: 'Electricity', amount: 12.0, date: 'Jan 12, 2026', status: 'Success' },
  { id: '2', billName: 'Internet', amount: 8.5, date: 'Jan 10, 2026', status: 'Pending' },
  { id: '3', billName: 'Rent', amount: 25.0, date: 'Jan 08, 2026', status: 'Success' },
  { id: '4', billName: 'Insurance', amount: 15.0, date: 'Jan 05, 2026', status: 'Failed' },
];

const FILTER_OPTIONS = ['All', 'Success', 'Pending', 'Failed'];

export function TransferHistoryScreen({ navigation }: any) {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredTransfers = selectedFilter === 'All' ? TRANSFERS : TRANSFERS.filter(t => t.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return colors.onTrack;
      case 'Pending': return colors.warning;
      case 'Failed': return colors.behind;
      default: return colors.textSecondary;
    }
  };

  const renderTransferItem = ({ item }: { item: Transfer }) => (
    <View style={styles.transferCard}>
      <View style={styles.transferHeader}>
        <View>
          <Text style={styles.billName}>{item.billName}</Text>
          <Text style={styles.transferInfo}>Amount: ${item.amount.toFixed(2)} | Date: {item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      {item.status === 'Failed' && (
        <TouchableOpacity style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer History</Text>
        <View style={{ width: 50 }} />
      </View>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterContent}>
          {FILTER_OPTIONS.map(option => (
            <TouchableOpacity key={option} style={[styles.filterPill, selectedFilter === option && styles.filterPillActive]} onPress={() => setSelectedFilter(option)}>
              <Text style={[styles.filterPillText, selectedFilter === option && styles.filterPillTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList data={filteredTransfers} keyExtractor={item => item.id} renderItem={renderTransferItem} contentContainerStyle={styles.listContent} scrollEnabled={false} />
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
  transferHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md },
  billName: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  transferInfo: { fontSize: fontSizes.sm, color: colors.textSecondary },
  statusBadge: { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: borderRadius.full },
  statusText: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold, color: colors.background },
  retryButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.sm, alignItems: 'center' },
  retryButtonText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.background },
});
