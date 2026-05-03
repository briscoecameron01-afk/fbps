import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';
import { formatCurrency, formatDate } from '../utils/calculations';

interface Props {
  navigation: any;
  route: any;
}

export function DepositHistoryScreen({ navigation, route }: Props) {
  const { bills, contributions } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const deposits = contributions.filter((item) => item.billId === billId);

  const getStatusColor = (status: string) => {
    return status === 'completed' ? colors.success : status === 'failed' ? colors.error : colors.warning;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Funding History</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.billHeader}>
          <Text style={styles.billName}>{bill?.name || 'Bill'}</Text>
        </View>
        <View style={styles.listContainer}>
          {deposits.length === 0 ? (
            <Text style={styles.emptyText}>No contributions have been recorded for this bill yet.</Text>
          ) : deposits.map((deposit, index) => (
            <View key={deposit.id}>
              <View style={styles.depositRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.depositDate}>{formatDate(deposit.executedAt || deposit.createdAt)}</Text>
                  {!!deposit.fundingSource && (
                    <Text style={styles.depositSource}>{deposit.fundingSource}</Text>
                  )}
                </View>
                <Text style={[styles.depositStatus, { color: getStatusColor(deposit.status) }]}>
                  {deposit.status}
                </Text>
                <Text style={styles.depositAmount}>{formatCurrency(deposit.amount)}</Text>
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
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { color: colors.primary, fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
  headerTitle: { fontWeight: fontWeights.bold, color: colors.textPrimary, fontSize: fontSizes.lg },
  billHeader: { paddingHorizontal: spacing.xl, paddingTop: spacing.lg },
  billName: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: fontWeights.bold },
  listContainer: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  depositRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.lg },
  depositDate: { fontSize: fontSizes.sm, color: colors.textPrimary, fontWeight: fontWeights.semibold },
  depositSource: { fontSize: fontSizes.xs, color: colors.textMuted, marginTop: spacing.xs },
  depositStatus: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, minWidth: 80, textAlign: 'center', textTransform: 'capitalize' },
  depositAmount: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, minWidth: 72, textAlign: 'right' },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.md, lineHeight: 22 },
});
