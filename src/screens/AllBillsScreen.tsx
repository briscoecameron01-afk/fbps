import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
}

interface Bill {
  id: string;
  name: string;
  amount: string;
  dueDate: string;
  status: 'Completed' | 'Current' | 'Upcoming';
  fundedPercent: number;
}

const mockBills: Bill[] = [
  { id: '1', name: 'Electricity', amount: '$120', dueDate: 'Due Mar 25', status: 'Completed', fundedPercent: 100 },
  { id: '2', name: 'Internet', amount: '$79', dueDate: 'Due Apr 5', status: 'Current', fundedPercent: 65 },
  { id: '3', name: 'Water', amount: '$50', dueDate: 'Due Apr 10', status: 'Upcoming', fundedPercent: 30 },
  { id: '4', name: 'Insurance', amount: '$150', dueDate: 'Due Apr 15', status: 'Upcoming', fundedPercent: 0 },
  { id: '5', name: 'Phone', amount: '$65', dueDate: 'Due Apr 20', status: 'Upcoming', fundedPercent: 0 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return colors.completed;
    case 'Current':
      return colors.current;
    case 'Upcoming':
      return colors.upcoming;
    default:
      return colors.textMuted;
  }
};

export function AllBillsScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBills = mockBills.filter((bill) =>
    bill.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Text style={styles.title}>All Bills</Text>

      {/* Search and Filter */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bills..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bills List */}
        <View style={styles.billsContainer}>
          {filteredBills.map((bill) => (
            <TouchableOpacity key={bill.id} style={styles.billRow} activeOpacity={0.7}>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDueDate}>{bill.dueDate}</Text>
              </View>
              <View style={styles.billAmount}>
                <Text style={styles.billAmountText}>{bill.amount}</Text>
              </View>
              <View style={styles.billStatus}>
                <Text
                  style={[
                    styles.statusText,
                    {
                      color: getStatusColor(bill.status),
                    },
                  ]}
                >
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

        {/* Add Bill Button */}
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  searchIcon: {
    fontSize: fontSizes.lg,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    padding: 0,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonIcon: {
    fontSize: fontSizes.lg,
  },
  billsContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
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
  billInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  billName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  billDueDate: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  billAmount: {
    marginHorizontal: spacing.md,
  },
  billAmountText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  billStatus: {
    alignItems: 'flex-end',
    gap: spacing.xs,
    minWidth: 80,
  },
  statusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  progressBarSmall: {
    width: 70,
    height: 3,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressBarSmallFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
  addBillButton: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addBillButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
