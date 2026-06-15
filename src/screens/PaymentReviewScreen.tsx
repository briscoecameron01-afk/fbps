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

export function PaymentReviewScreen({ navigation, route }: Props) {
  const { bills, markBillPaidAsync, isLoading } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const amount = Number(route?.params?.amount || bill?.amount || 0);
  const paymentMethod = route?.params?.paymentMethod || 'Connected bank account';
  const [error, setError] = React.useState('');

  const handleConfirm = async () => {
    if (!bill) return;
    setError('');
    const result = await markBillPaidAsync(bill.id);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigation.navigate('PaymentReceipt', {
      billId: bill.id,
      paymentMethod,
      amount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Review</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.subtitleSection}>
          <Text style={styles.subtitle}>Please review the details before confirming</Text>
        </View>

        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bill</Text>
            <Text style={styles.detailValue}>{bill?.name || 'Bill not found'}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{paymentMethod}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Payment Date</Text>
            <Text style={styles.detailValue}>Today</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValueAccent}>{formatCurrency(amount)}</Text>
          </View>
        </View>

        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        <TouchableOpacity
          style={[styles.primaryButton, styles.bottomButton, (!bill || isLoading) && styles.primaryButtonDisabled]}
          disabled={!bill || isLoading}
          onPress={handleConfirm}
        >
          <Text style={styles.primaryButtonText}>{isLoading ? 'Confirming...' : 'Confirm Payment'}</Text>
        </TouchableOpacity>

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
  subtitleSection: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  subtitle: { fontSize: fontSizes.md, color: colors.textSecondary },
  detailsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing.md, gap: spacing.lg },
  detailRowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  detailLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  detailValue: { flex: 1, fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.textPrimary, textAlign: 'right' },
  detailValueAccent: { fontSize: fontSizes.md, fontWeight: fontWeights.bold, color: colors.primary, textAlign: 'right' },
  errorText: { color: colors.error, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, marginHorizontal: spacing.xl, marginTop: spacing.lg },
  bottomButton: { marginHorizontal: spacing.xl, marginBottom: spacing.xl },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.background },
});
