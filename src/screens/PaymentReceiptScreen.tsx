import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../utils/calculations';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentReceiptScreen({ navigation, route }: Props) {
  const { bills } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const amount = Number(route?.params?.amount || bill?.amount || 0);
  const paymentMethod = route?.params?.paymentMethod || 'Connected bank account';
  const receiptId = `FRAC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
  const timestamp = new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('BillDetail', { billId })}>
            <Text style={styles.backBtn}>Done</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Receipt</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.successSection}>
          <Text style={styles.successMessage}>Your payment was completed successfully</Text>
        </View>

        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Payment Successful</Text>
        </View>

        <View style={styles.receiptCard}>
          <View style={[styles.receiptRow, styles.receiptRowBorder]}>
            <Text style={styles.receiptLabel}>Bill</Text>
            <Text style={styles.receiptValue}>{bill?.name || 'Bill'}</Text>
          </View>
          <View style={[styles.receiptRow, styles.receiptRowBorder]}>
            <Text style={styles.receiptLabel}>Amount</Text>
            <Text style={styles.receiptValue}>{formatCurrency(amount)}</Text>
          </View>
          <View style={[styles.receiptRow, styles.receiptRowBorder]}>
            <Text style={styles.receiptLabel}>Payment Method</Text>
            <Text style={styles.receiptValue}>{paymentMethod}</Text>
          </View>
          <View style={[styles.receiptRow, styles.receiptRowBorder]}>
            <Text style={styles.receiptLabel}>Receipt ID</Text>
            <Text style={styles.receiptValue}>{receiptId}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Timestamp</Text>
            <Text style={styles.receiptValue}>{timestamp}</Text>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.primaryButton, styles.buttonMargin]}
            onPress={() => navigation.navigate('BillDetail', { billId })}
          >
            <Text style={styles.primaryButtonText}>Back to Bill</Text>
          </TouchableOpacity>
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
  successSection: { paddingHorizontal: spacing.xl, paddingVertical: spacing.xl },
  successMessage: { fontSize: fontSizes.md, color: colors.success, textAlign: 'center', fontWeight: fontWeights.semibold },
  checkmarkContainer: { alignItems: 'center', paddingVertical: spacing['2xl'] },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.success,
  },
  checkmark: { fontSize: fontSizes['4xl'], color: colors.success, fontWeight: fontWeights.bold },
  successTitle: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  receiptCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.lg },
  receiptRowBorder: { borderBottomWidth: 1, borderBottomColor: colors.border },
  receiptLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  receiptValue: { flex: 1, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, textAlign: 'right' },
  buttonContainer: { paddingHorizontal: spacing.xl },
  buttonMargin: { marginBottom: spacing.md },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.background },
});
