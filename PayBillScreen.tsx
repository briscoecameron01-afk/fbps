import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  brand: string;
  last4: string;
  icon: string;
}

export function PayBillScreen({ navigation }: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('1');
  const [amountToPay, setAmountToPay] = useState('120.00');

  const billName = 'Electricity Bill';
  const billAmount = 120.00;
  const remaining = 120.00;

  const paymentMethods: PaymentMethod[] = [
    { id: '1', type: 'card', brand: 'Visa', last4: '4242', icon: '💳' },
    { id: '2', type: 'card', brand: 'Mastercard', last4: '5555', icon: '💳' },
    { id: '3', type: 'bank', brand: 'Chase Bank', last4: '9876', icon: '🏦' },
  ];

  const handlePayNow = () => {
    navigation.navigate('PaymentReview', {
      billName,
      amount: amountToPay,
      paymentMethodId: selectedPaymentMethod,
    });
  };

  const selectedMethod = paymentMethods.find((m) => m.id === selectedPaymentMethod);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pay Bill</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Bill Info Card */}
        <View style={styles.billInfoCard}>
          <Text style={styles.billLabel}>Bill Name</Text>
          <Text style={styles.billName}>{billName}</Text>
          <View style={styles.divider} />
          <Text style={styles.billLabel}>Total Amount</Text>
          <Text style={styles.billAmount}>${billAmount.toFixed(2)}</Text>
        </View>

        {/* Amount to Pay Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Amount to Pay</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              value={amountToPay}
              onChangeText={setAmountToPay}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
            />
          </View>
          <Text style={styles.amountHint}>Remaining to pay: ${remaining.toFixed(2)}</Text>
        </View>

        {/* Quick Amount Buttons */}
        <View style={styles.quickButtons}>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setAmountToPay((remaining / 2).toFixed(2))}
          >
            <Text style={styles.quickButtonText}>Half</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickButton}
            onPress={() => setAmountToPay(remaining.toFixed(2))}
          >
            <Text style={styles.quickButtonText}>Full</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.sectionDescription}>Select how you want to pay</Text>

          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethodCard,
                selectedPaymentMethod === method.id && styles.paymentMethodCardSelected,
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.paymentMethodLeft}>
                <Text style={styles.paymentMethodIcon}>{method.icon}</Text>
                <View>
                  <Text style={styles.paymentMethodBrand}>{method.brand}</Text>
                  <Text style={styles.paymentMethodLast4}>•••• {method.last4}</Text>
                </View>
              </View>
              {selectedPaymentMethod === method.id && (
                <View style={styles.selectedRadio}>
                  <View style={styles.selectedRadioInner} />
                </View>
              )}
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.addPaymentButton}>
            <Text style={styles.addPaymentButtonText}>+ Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Amount</Text>
            <Text style={styles.summaryValue}>${amountToPay}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Processing Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabelBold}>Total</Text>
            <Text style={styles.summaryValueBold}>${amountToPay}</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
          <Text style={styles.payButtonText}>Pay Now</Text>
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
  billInfoCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  billLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  billName: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  billAmount: {
    color: colors.primary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  currencySymbol: {
    color: colors.textSecondary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  amountHint: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  quickButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  quickButton: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  paymentMethodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentMethodIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.lg,
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
  selectedRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  addPaymentButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  addPaymentButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  summaryLabelBold: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  summaryValueBold: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  payButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
