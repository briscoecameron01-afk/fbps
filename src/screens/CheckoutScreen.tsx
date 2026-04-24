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

type CheckoutType = 'bill_payment' | 'subscription';

interface CheckoutScreenProps {
  navigation: any;
  route: any;
}

export function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { type, billId, amount, planName, priceId } = route.params || {};
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'paypal' | 'apple_pay'>('card');
  const [processingState, setProcessingState] = useState<'ready' | 'processing' | 'success' | 'error'>('ready');
  const [errorMessage, setErrorMessage] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const isSubscription = type === 'subscription';
  const displayAmount = isSubscription ? `$${(amount || 9.99).toFixed(2)}/mo` : `$${(amount || 120).toFixed(2)}`;

  const handlePaymentMethodChange = (method: 'card' | 'paypal' | 'apple_pay') => {
    setSelectedPaymentMethod(method);
  };

  const handlePayNow = async () => {
    if (isSubscription && !agreedToTerms) {
      Alert.alert('Required', 'Please agree to the Terms & Conditions');
      return;
    }

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
            {isSubscription ? (
              <>
                <View style={styles.crownSection}>
                  <Text style={styles.crownIcon}>👑</Text>
                </View>
                <Text style={styles.planName}>{planName || 'Premium Plan'}</Text>
                <Text style={styles.planPrice}>${(amount || 9.99).toFixed(2)}/mo</Text>
                <View style={styles.featuresList}>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>Unlimited bill tracking</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>Advanced analytics</Text>
                  </View>
                  <View style={styles.featureItem}>
                    <Text style={styles.featureCheckmark}>✓</Text>
                    <Text style={styles.featureText}>Auto-transfer feature</Text>
                  </View>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.billVendor}>Due Payment</Text>
                <Text style={styles.billAmount}>${(amount || 120).toFixed(2)}</Text>
                <Text style={styles.billDueDate}>Due: 2026-04-15</Text>
              </>
            )}
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

          {/* Terms & Conditions (for subscription) */}
          {isSubscription && (
            <View style={styles.termsSection}>
              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setAgreedToTerms(!agreedToTerms)}
              >
                <View
                  style={[
                    styles.checkbox,
                    agreedToTerms && styles.checkboxChecked,
                  ]}
                >
                  {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.termsText}>I agree to the Terms & Conditions</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Amount Display */}
          <View style={styles.amountSection}>
            <Text style={styles.amountLabel}>Amount to Pay</Text>
            <Text style={styles.amountDisplay}>{displayAmount}</Text>
          </View>

          {/* Action Button */}
          <TouchableOpacity
            style={[styles.actionButton, !agreedToTerms && isSubscription && styles.actionButtonDisabled]}
            onPress={handlePayNow}
            disabled={!agreedToTerms && isSubscription}
          >
            <Text style={styles.actionButtonText}>
              {isSubscription ? 'Confirm & Upgrade' : 'Pay Now'}
            </Text>
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
          <Text style={styles.receiptInfo}>
            {isSubscription ? `Your ${planName || 'Premium'} plan is now active` : 'Your payment has been processed'}
          </Text>
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
  crownSection: {
    marginBottom: spacing.md,
  },
  crownIcon: {
    fontSize: fontSizes['3xl'],
  },
  planName: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  planPrice: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  featuresList: {
    width: '100%',
    gap: spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureCheckmark: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    marginRight: spacing.md,
    fontWeight: fontWeights.bold as any,
  },
  featureText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
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
  termsSection: {
    marginBottom: spacing['2xl'],
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    fontSize: fontSizes.base,
    color: colors.background,
    fontWeight: fontWeights.bold as any,
  },
  termsText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  amountSection: {
    marginBottom: spacing['2xl'],
  },
  amountLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  amountDisplay: {
    fontSize: fontSizes['3xl'],
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
  actionButtonDisabled: {
    opacity: 0.5,
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
