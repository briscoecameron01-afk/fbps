import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';
import { formatCurrency, formatDate, getFundedPercent, getNextDueDate } from '../utils/calculations';

interface Props {
  navigation: any;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return colors.success;
    case 'Current':
      return colors.primary;
    case 'Upcoming':
      return colors.warning;
    default:
      return colors.textMuted;
  }
};

export function AllBillsScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const { bills, buckets } = useStore();

  const billRows = bills
    .filter((bill) => bill.isActive)
    .map((bill) => {
      const bucket = buckets.find((item) => item.billId === bill.id);
      const targetAmount = bucket?.targetAmount ?? bill.amount;
      const currentAmount = bucket?.currentAmount ?? 0;
      const fundedPercent = getFundedPercent(currentAmount, targetAmount);
      const status = bucket?.status === 'paid' || fundedPercent >= 100
        ? 'Completed'
        : currentAmount > 0
          ? 'Current'
          : 'Upcoming';
      const dueDate = bill.dueDate ? formatDate(bill.dueDate) : formatDate(getNextDueDate(bill.dueDay));

      return {
        id: bill.id,
        name: bill.name,
        amount: formatCurrency(targetAmount),
        dueDate: `Due ${dueDate}`,
        status,
        fundedPercent,
      };
    });

  const filteredBills = billRows.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>All Bills</Text>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bills..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.billsContainer}>
          {filteredBills.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No bills found</Text>
              <Text style={styles.emptyText}>Add a bill to track its funding progress here.</Text>
            </View>
          ) : filteredBills.map((bill) => (
            <TouchableOpacity
              key={bill.id}
              style={styles.billRow}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('BillDetail', { billId: bill.id })}
            >
              <View style={styles.billInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDueDate}>{bill.dueDate}</Text>
              </View>
              <View style={styles.billAmount}>
                <Text style={styles.billAmountText}>{bill.amount}</Text>
              </View>
              <View style={styles.billStatus}>
                <Text style={[styles.statusText, { color: getStatusColor(bill.status) }]}>
                  {bill.status}
                </Text>
                <View style={styles.progressBarSmall}>
                  <View
                    style={[
                      styles.progressBarSmallFill,
                      {
                        width: `${bill.fundedPercent}%`,
                        backgroundColor: getStatusColor(bill.status),
                      },
                    ]}
                  />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.addBillButton}
          onPress={() => navigation.navigate('AddBill')}
        >
          <Text style={styles.addBillButtonText}>+ Add Bill</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: {
    color: colors.textPrimary,
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    gap: spacing.md,
  },
  searchIcon: { fontSize: fontSizes.xs, color: colors.textMuted, fontWeight: '700' },
  searchInput: { flex: 1, color: colors.textPrimary, fontSize: fontSizes.md, padding: 0 },
  billsContainer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  billRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billInfo: { flex: 1, gap: spacing.xs },
  billName: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '600' },
  billDueDate: { color: colors.textSecondary, fontSize: fontSizes.sm },
  billAmount: { marginHorizontal: spacing.md },
  billAmountText: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700' },
  billStatus: { alignItems: 'flex-end', gap: spacing.xs, minWidth: 80 },
  statusText: { fontSize: fontSizes.xs, fontWeight: '600' },
  progressBarSmall: { width: 70, height: 3, backgroundColor: colors.border, borderRadius: borderRadius.full, overflow: 'hidden' },
  progressBarSmallFill: { height: '100%', borderRadius: borderRadius.full },
  emptyCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700', marginBottom: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, textAlign: 'center' },
  addBillButton: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addBillButtonText: { color: colors.background, fontSize: fontSizes.md, fontWeight: '700' },
});
