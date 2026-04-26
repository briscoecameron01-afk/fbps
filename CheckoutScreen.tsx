import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, screenPadding } from '../theme';

interface CheckoutScreenProps {
  navigation: any;
  route: any;
}

export function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { type, billId, amount } = route.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay'>('card');
  const [processingState, setProcessingState] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');

  const feeRate = 0.015; // 1.5%
  const baseAmount = amount || 120;
  const fee = baseAmount * feeRate;
  const totalAmount = baseAmount + fee;

  const displayAmount = `$${baseAmount.toFixed(2)}`;

  const handlePaymentMethodChange = (method: 'card' | 'paypal' | 'apple_pay') => {
    setSelectedPaymentMethod(method);
  };

  const handlePayNow = async () => {
    setProcessingState('processing');
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setProcessingState('success');
    } catch (error) {
      setErrorMessage('Payment failed. Please try again.');
      setProcessingState('error');
    }
  };

  const handleRetry = () => {
    setProcessingState('ready');
    setErrorMessage('');
  };

  const handleDone = () => {
    navigation.goBack();
  };

  const getPaymentMethodLabel = () => {
    switch (selectedPaymentMethod) {
      case 'card':
        return 'Visa ••••4242';
      case 'paypal':
        return 'PayPal (cam@fractionalbillpay.com)';
      case 'apple_pay':
        return 'Apple Pay';
      default:
        return 'Card';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'paypal':
        return 'P';
      case 'apple_pay':
        return '🍎';
      default:
        return '●';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 30 }} />
      </View>

      {processingState === 'ready' && (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <Text style={styles.billVendor}>Payment Summary</Text>
            <Text style={styles.billAmount}>${baseAmount.toFixed(2)}</Text>
            <Text style={styles.billDueDate}>Due: 2026-04-15</Text>
          </View>

          {/* Payment Method Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')}>
                <Text style={styles.changeLink}>Change</Text>
              </TouchableOpacity>
            </View>

            {/* Current Selected Method */}
            <View style={styles.selectedMethodCard}>
              <View style={styles.methodIconSmall}>
                <Text style={styles.methodIconSmallText}>
                  {getPaymentMethodIcon(selectedPaymentMethod)}
                </Text>
              </View>
              <View style={styles.methodLabelSmall}>
                <Text style={styles.methodLabelText}>{getPaymentMethodLabel()}</Text>
              </View>
            </View>

            {/* Quick Select Row */}
            <Text style={styles.quickSelectLabel}>Quick Select:</Text>
            <View style={styles.quickSelectRow}>
              <TouchableOpacity
                style={[
                  styles.quickSelectButton,
                  selectedPaymentMethod === 'card' && styles.quickSelectButtonActive,
                ]}
                onPress={() => handlePaymentMethodChange('card')}
              >
                <Text style={styles.quickSelectIcon}>💳</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickSelectButton,
                  selectedPaymentMethod === 'paypal' && styles.quickSelectButtonActive,
                ]}
                onPress={() => handlePaymentMethodChange('paypal')}
              >
                <Text style={styles.quickSelectIcon}>P</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.quickSelectButton,
                  selectedPaymentMethod === 'apple_pay' && styles.quickSelectButtonActive,
                ]}
                onPress={() => handlePaymentMethodChange('apple_pay')}
              >
                <Text style={styles.quickSelectIcon}>🍎</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Fee Breakdown */}
          <View style={styles.amountSection}>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount</Text>
              <Text style={styles.amountValue}>{displayAmount}</Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Transaction Fee (1.5%)</Text>
              <Text style={styles.amountValueFee}>${fee.toFixed(2)}</Text>
            </View>
            <View style={styles.amountDivider} />
            <View style={styles.amountRow}>
              <Text style={styles.amountLabelTotal}>Total Amount</Text>
              <Text style={styles.amountDisplayTotal}>${totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handlePayNow}
          >
            <Text style={styles.actionButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {processingState === 'processing' && (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.stateText}>Processing payment...</Text>
        </View>
      )}

      {processingState === 'success' && (
        <View style={styles.stateContainer}>
          <Text style={styles.successIcon}>✓</Text>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.receiptInfo}>Your payment has been processed</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDone}
          >
            <Text style={styles.actionButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {processingState === 'error' && (
        <View style={styles.stateContainer}>
          <Text style={styles.errorIcon}>✕</Text>
          <Text style={styles.errorTitle}>Payment Failed</Text>
          <Text style={styles.errorMsg}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleRetry}
          >
            <Text style={styles.actionButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  billVendor: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  billAmount: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  billDueDate: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  changeLink: {
    fontSize: fontSizes.sm,
    color: colors.primary,
    fontWeight: fontWeights.semibold as any,
  },
  selectedMethodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  methodIconSmall: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodIconSmallText: {
    fontSize: fontSizes.lg,
  },
  methodLabelSmall: {
    flex: 1,
  },
  methodLabelText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  quickSelectLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  quickSelectRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickSelectButton: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickSelectButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.backgroundCardLight,
  },
  quickSelectIcon: {
    fontSize: fontSizes.xl,
  },
  amountSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.border,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  amountLabel: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  amountLabelTotal: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
  },
  amountValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  amountValueFee: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.error,
  },
  amountDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  amountDisplayTotal: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
  stateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: screenPadding.horizontal,
  },
  stateText: {
    fontSize: fontSizes.lg,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  successIcon: {
    fontSize: fontSizes['4xl'],
    color: colors.success,
    marginBottom: spacing.lg,
  },
  successTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  receiptInfo: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
  errorIcon: {
    fontSize: fontSizes['4xl'],
    color: colors.error,
    marginBottom: spacing.lg,
  },
  errorTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold as any,
    color: colors.error,
    marginBottom: spacing.md,
  },
  errorMsg: {
    fontSize: fontSizes.base,
    color: colors.textSecondary,
    marginBottom: spacing['2xl'],
    textAlign: 'center',
  },
});
