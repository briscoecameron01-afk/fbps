import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Transfer {
  id: string;
  billName: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  fundingSource: string;
  icon: string;
}

type FilterTab = 'all' | 'completed' | 'pending' | 'failed';

export function TransferHistoryScreen({ navigation }: Props) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  const allTransfers: Transfer[] = [
    {
      id: '1',
      billName: 'Netflix',
      amount: 15.99,
      date: '2024-01-15',
      status: 'completed',
      fundingSource: 'Chase',
      icon: '🎬',
    },
    {
      id: '2',
      billName: 'Spotify',
      amount: 10.99,
      date: '2024-01-14',
      status: 'completed',
      fundingSource: 'Chase',
      icon: '🎵',
    },
    {
      id: '3',
      billName: 'Gym Membership',
      amount: 49.99,
      date: '2024-01-13',
      status: 'pending',
      fundingSource: 'Bank of America',
      icon: '💪',
    },
    {
      id: '4',
      billName: 'Internet',
      amount: 79.99,
      date: '2024-01-12',
      status: 'completed',
      fundingSource: 'Chase',
      icon: '📡',
    },
    {
      id: '5',
      billName: 'Electricity',
      amount: 120.00,
      date: '2024-01-11',
      status: 'failed',
      fundingSource: 'Chase',
      icon: '⚡',
    },
    {
      id: '6',
      billName: 'Phone',
      amount: 50.00,
      date: '2024-01-10',
      status: 'completed',
      fundingSource: 'Bank of America',
      icon: '📱',
    },
  ];

  const filters: FilterTab[] = ['all', 'completed', 'pending', 'failed'];

  const getFilteredTransfers = () => {
    if (activeTab === 'all') return allTransfers;
    return allTransfers.filter((t) => t.status === activeTab);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.primary;
      case 'pending':
        return colors.warning;
      case 'failed':
        return colors.error;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case 'completed':
        return colors.primary + '20';
      case 'pending':
        return colors.warning + '20';
      case 'failed':
        return colors.error + '20';
      default:
        return colors.backgroundCard;
    }
  };

  const filteredTransfers = getFilteredTransfers();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transfer History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.tab,
                activeTab === filter && styles.tabActive,
              ]}
              onPress={() => setActiveTab(filter)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === filter && styles.tabTextActive,
                ]}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Transfers List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {filteredTransfers.length > 0 ? (
          <>
            {filteredTransfers.map((transfer) => (
              <TouchableOpacity
                key={transfer.id}
                style={styles.transferCard}
                activeOpacity={0.7}
              >
                <View style={styles.transferLeft}>
                  <Text style={styles.transferIcon}>{transfer.icon}</Text>
                  <View style={styles.transferInfo}>
                    <Text style={styles.transferBill}>{transfer.billName}</Text>
                    <Text style={styles.transferSource}>From {transfer.fundingSource}</Text>
                    <Text style={styles.transferDate}>{transfer.date}</Text>
                  </View>
                </View>

                <View style={styles.transferRight}>
                  <Text style={styles.transferAmount}>
                    ${transfer.amount.toFixed(2)}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusBgColor(transfer.status) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(transfer.status) },
                      ]}
                    >
                      {transfer.status.charAt(0).toUpperCase() + transfer.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={{ height: 20 }} />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyTitle}>No Transfers</Text>
            <Text style={styles.emptyDescription}>
              No {activeTab !== 'all' ? activeTab : ''} transfers yet
            </Text>
          </View>
        )}
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
  backButton: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabs: {
    paddingHorizontal: spacing.xl,
  },
  tab: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  tabTextActive: {
    color: colors.primary,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  transferCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  transferLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transferIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.lg,
  },
  transferInfo: {
    flex: 1,
  },
  transferBill: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  transferSource: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  transferDate: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  transferRight: {
    alignItems: 'flex-end',
  },
  transferAmount: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
});
