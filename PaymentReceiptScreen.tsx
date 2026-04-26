import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentReceiptScreen({ navigation }: Props) {
  const transactionId = 'TXN-2024-001234';
  const billName = 'Electricity Bill';
  const amount = 120.00;
  const feeRate = 0.015; // 1.5%
  const fee = amount * feeRate;
  const netAmount = amount - fee;
  const paymentMethod = 'Visa •••• 4242';
  const date = new Date().toLocaleDateString();
  const time = new Date().toLocaleTimeString();

  const handleDone = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Success Checkmark */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmark}>
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </View>

        {/* Success Message */}
        <Text style={styles.successTitle}>Payment Successful!</Text>
        <Text style={styles.successDescription}>Your payment has been processed successfully</Text>

        {/* Receipt Details Card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Bill Name</Text>
            <Text style={styles.receiptValue}>{billName}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Amount Paid</Text>
            <Text style={styles.receiptValueAmount}>${amount.toFixed(2)}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Fee</Text>
            <Text style={styles.receiptValueFee}>${fee.toFixed(2)}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Net Amount to Bill</Text>
            <Text style={styles.receiptValueAmount}>${netAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Payment Method</Text>
            <Text style={styles.receiptValue}>{paymentMethod}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Transaction ID</Text>
            <Text style={styles.receiptValue}>{transactionId}</Text>
          </View>

          <View style={styles.receiptDivider} />

          <View style={styles.receiptSection}>
            <Text style={styles.receiptLabel}>Date & Time</Text>
            <Text style={styles.receiptValue}>
              {date} at {time}
            </Text>
          </View>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>📧</Text>
          <Text style={styles.infoText}>
            A receipt has been sent to your registered email address. You can access all receipts in your transaction history.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleDone}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>View in History</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Info */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            Your payment has been successfully applied to your {billName}. This may take 1-2 business days to reflect in your bank account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    flexGrow: 1,
  },
  checkmarkContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkmark: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkIcon: {
    fontSize: 40,
    color: colors.background,
    fontWeight: '700',
  },
  successTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  successDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  receiptCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  receiptSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  receiptLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  receiptValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  receiptValueAmount: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  receiptValueFee: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  receiptDivider: {
    height: 1,
    backgroundColor: colors.border,
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
    marginBottom: spacing.lg,
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
  actionButtons: {
    marginBottom: spacing.lg,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  footerInfo: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    textAlign: 'center',
  },
});
