import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { ProgressBar, StatusBadge } from '../components';
import { useStore } from '../hooks/useStore';
import {
  calculateContribution,
  formatCurrency,
  formatDate,
  getFundedPercent,
  getNextDueDate,
} from '../utils/calculations';

interface Props {
  navigation: any;
  route: any;
}

export function BillDetailScreen({ navigation, route }: Props) {
  const [showDelete, setShowDelete] = React.useState(false);
  const { bills, buckets, deleteBillAsync, getBillStatus, syncFromSupabase } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const bucket = buckets.find((item) => item.billId === billId);

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bill not found</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>This bill could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const targetAmount = bucket?.targetAmount ?? bill.amount;
  const currentAmount = bucket?.currentAmount ?? 0;
  const remainingAmount = Math.max(targetAmount - currentAmount, 0);
  const progress = getFundedPercent(currentAmount, targetAmount);
  const dueDate = bill.dueDate ? formatDate(bill.dueDate) : formatDate(getNextDueDate(bill.dueDay));
  const contribution = calculateContribution(remainingAmount || targetAmount, bill.dueDay, bill.cadence);
  const status = bucket?.status === 'paid' ? 'completed' : getBillStatus(bill.id);

  const handleDelete = async () => {
    const result = await deleteBillAsync(bill.id);
    if (result.error) return;
    await syncFromSupabase();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{bill.name}</Text>
          <StatusBadge status={status} />
        </View>

        <View style={styles.progressSummary}>
          <View>
            <Text style={styles.summaryLabel}>Saved</Text>
            <Text style={styles.summaryValue}>{formatCurrency(currentAmount)}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={progress} height={8} color={colors.primary} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>{formatCurrency(targetAmount)}</Text>
          </View>
        </View>

        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, styles.infoCardTop]}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{dueDate}</Text>
          </View>
          <View style={[styles.infoCard, styles.infoCardTop]}>
            <Text style={styles.infoLabel}>Remaining</Text>
            <Text style={styles.infoValue}>{formatCurrency(remainingAmount)}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Cadence</Text>
            <Text style={styles.infoValue}>{bill.cadence}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Next Contribution</Text>
            <Text style={styles.infoValue}>{formatCurrency(contribution.perPeriod)}{contribution.label}</Text>
          </View>
        </View>

        {!!bill.description && (
          <View style={styles.descriptionCard}>
            <Text style={styles.infoLabel}>Description</Text>
            <Text style={styles.descriptionText}>{bill.description}</Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1 }]}
            onPress={() => navigation.navigate('BillBreakdown', { billId: bill.id })}
          >
            <Text style={styles.outlineButtonText}>Breakdown</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1 }]}
            onPress={() => navigation.navigate('FundingPreference', { billId: bill.id, billAmount: bill.amount })}
          >
            <Text style={styles.outlineButtonText}>Funding Schedule</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.outlineButton, styles.fullWidth]}
          onPress={() => navigation.navigate('DepositHistory', { billId: bill.id })}
        >
          <Text style={styles.outlineButtonText}>History</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.primaryButton, styles.fullWidth]}
          onPress={() => navigation.navigate('PayBill', { billId: bill.id })}
        >
          <Text style={styles.primaryButtonText}>Pay Bill</Text>
        </TouchableOpacity>

        <View style={styles.bottomButtonRow}>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1 }]}
            onPress={() => navigation.navigate('EditBill', { billId: bill.id })}
          >
            <Text style={styles.outlineButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, { flex: 1 }]}
            onPress={() => setShowDelete(true)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        {showDelete && (
          <View style={styles.deleteConfirm}>
            <Text style={styles.deleteConfirmText}>Delete {bill.name}? This removes the bill and its funding history.</Text>
            <View style={styles.deleteConfirmRow}>
              <TouchableOpacity style={[styles.outlineButton, { flex: 1 }]} onPress={() => setShowDelete(false)}>
                <Text style={styles.outlineButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteButton, { flex: 1 }]} onPress={handleDelete}>
                <Text style={styles.deleteButtonText}>Confirm Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

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
  headerTitle: {
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    flex: 1,
    marginLeft: spacing.lg,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    gap: spacing.lg,
  },
  summaryLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  summaryValue: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  progressBarContainer: { flex: 1 },
  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.xl, gap: spacing.md },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCardTop: { marginBottom: spacing.sm },
  infoLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  infoValue: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.textPrimary },
  descriptionCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  descriptionText: { fontSize: fontSizes.md, color: colors.textPrimary, lineHeight: 22 },
  actionRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, gap: spacing.md },
  fullWidth: { marginHorizontal: spacing.xl, marginVertical: spacing.sm },
  outlineButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.background },
  bottomButtonRow: { flexDirection: 'row', paddingHorizontal: spacing.xl, paddingVertical: spacing.xl, gap: spacing.md },
  deleteButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.error },
  deleteConfirm: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.error,
    padding: spacing.lg,
    gap: spacing.md,
  },
  deleteConfirmText: { color: colors.textPrimary, fontSize: fontSizes.md, lineHeight: 22 },
  deleteConfirmRow: { flexDirection: 'row', gap: spacing.md },
  emptyState: { padding: spacing.xl },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.md },
});
