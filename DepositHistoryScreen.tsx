import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Deposit {
  id: string;
  date: string;
  status: 'Completed' | 'Failed';
  amount: number;
}

export function DepositHistoryScreen({ navigation, route }: Props) {
  // Mock data
  const deposits: Deposit[] = [
    { id: '1', date: 'Feb 18, 2026', status: 'Completed', amount: 4.00 },
    { id: '2', date: 'Feb 17, 2026', status: 'Completed', amount: 4.00 },
    { id: '3', date: 'Feb 16, 2026', status: 'Failed', amount: 4.00 },
    { id: '4', date: 'Feb 15, 2026', status: 'Completed', amount: 4.00 },
    { id: '5', date: 'Feb 14, 2026', status: 'Completed', amount: 4.00 },
    { id: '6', date: 'Feb 13, 2026', status: 'Completed', amount: 4.00 },
    { id: '7', date: 'Feb 12, 2026', status: 'Completed', amount: 4.00 },
    { id: '8', date: 'Feb 11, 2026', status: 'Failed', amount: 4.00 },
  ];

  const getStatusColor = (status: string) => {
    return status === 'Completed' ? colors.success : colors.error;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Deposit History</Text>
        <TouchableOpacity>
          <Text style={styles.exportIcon}>⤓</Text>
        </TouchableOpacity>
      </View>

      {/* Deposit List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.listContainer}>
          {deposits.map((deposit, index) => (
            <View key={deposit.id}>
              <View style={styles.depositRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.depositDate}>{deposit.date}</Text>
                </View>
                <Text
                  style={[
                    styles.depositStatus,
                    { color: getStatusColor(deposit.status) },
                  ]}
                >
                  {deposit.status}
                </Text>
                <Text style={styles.depositAmount}>${deposit.amount.toFixed(2)}</Text>
              </View>
              {index !== deposits.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
        <View style={{ height: spacing.xl }} />
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
  backBtn: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  headerTitle: {
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
  },
  exportIcon: {
    fontSize: fontSizes.xl,
    color: colors.primary,
  },
  listContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  depositRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.lg,
  },
  depositDate: {
    fontSize: fontSizes.sm,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  depositStatus: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    minWidth: 80,
    textAlign: 'center',
  },
  depositAmount: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    minWidth: 60,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
});
