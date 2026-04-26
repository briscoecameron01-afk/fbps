import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentReviewScreen({ navigation }: Props) {
  const { billName = 'Electricity Bill', amount = '120.00', paymentMethodId = '1' } = navigation.route?.params || {};

  const paymentMethod = {
    brand: 'Visa',
    last4: '4242',
    icon: '💳',
  };

  const feeRate = 0.015; // 1.5%
  const baseAmount = parseFloat(amount);
  const fee = baseAmount * feeRate;
  const totalAmount = baseAmount + fee;

  const handleConfirmPayment = () => {
    navigation.navigate('PaymentReceipt');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryHeaderText}>Payment Summary</Text>
          </View>

          {/* Bill Details */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Bill</Text>
            <Text style={styles.summaryValue}>{billName}</Text>
          </View>

          <View style={styles.divider} />

          {/* Amount */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Amount to Pay</Text>
            <Text style={styles.summaryValueLarge}>${baseAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Fee */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Transaction Fee (1.5%)</Text>
            <Text style={styles.summaryValueFee}>${fee.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* Payment Method */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Payment Method</Text>
            <View style={styles.paymentMethodDisplay}>
              <Text style={styles.paymentMethodIcon}>{paymentMethod.icon}</Text>
              <View>
                <Text style={styles.paymentMethodBrand}>{paymentMethod.brand}</Text>
                <Text style={styles.paymentMethodLast4}>•••• {paymentMethod.last4}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Date */}
          <View style={styles.summarySection}>
            <Text style={styles.summaryLabel}>Payment Date</Text>
            <Text style={styles.summaryValue}>{new Date().toLocaleDateString()}</Text>
          </View>
        </View>

        {/* Fee Breakdown */}
        <View style={styles.feeCard}>
          <Text style={styles.feeTitle}>Total Amount Due</Text>

          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Subtotal</Text>
            <Text style={styles.feeValue}>${baseAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.feeItem}>
            <Text style={styles.feeLabel}>Transaction Fee (1.5%)</Text>
            <Text style={styles.feeValueFee}>${fee.toFixed(2)}</Text>
          </View>

          <View style={styles.feeDivider} />

          <View style={styles.feeItem}>
            <Text style={styles.feeTotalLabel}>Total Amount</Text>
            <Text style={styles.feeTotalValue}>${totalAmount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Information Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            This payment will be processed immediately. You'll receive a confirmation email shortly.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmPayment}>
          <Text style={styles.confirmButtonText}>Confirm Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
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
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  summaryHeader: {
    backgroundColor: colors.primary + '10',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summaryHeaderText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  summarySection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  summaryValueLarge: {
    color: colors.primary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  summaryValueFee: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  paymentMethodDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.md,
  },
  paymentMethodBrand: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  paymentMethodLast4: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  feeCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  feeTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  feeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  feeLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  feeValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  feeValueFee: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  feeDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  feeTotalLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  feeTotalValue: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  infoIcon: {
    fontSize: fontSizes.lg,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  confirmButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: spacing.md,
  },
});
