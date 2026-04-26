import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
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
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  icon: string;
}

export function PaymentMethodsScreen({ navigation }: Props) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      brand: 'Visa',
      last4: '4242',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      icon: '💳',
    },
    {
      id: '2',
      type: 'card',
      brand: 'Mastercard',
      last4: '5555',
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false,
      icon: '💳',
    },
    {
      id: '3',
      type: 'bank',
      brand: 'Chase Bank',
      last4: '9876',
      expiryMonth: 0,
      expiryYear: 0,
      isDefault: false,
      icon: '🏦',
    },
  ]);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleRemove = (id: string) => {
    setPaymentMethods(paymentMethods.filter((method) => method.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Payment Methods List */}
        {paymentMethods.length > 0 ? (
          <>
            <Text style={styles.listLabel}>Saved Payment Methods</Text>

            {paymentMethods.map((method) => (
              <View key={method.id} style={styles.methodCard}>
                <View style={styles.methodInfo}>
                  <Text style={styles.methodIcon}>{method.icon}</Text>
                  <View style={styles.methodDetails}>
                    <View style={styles.methodHeader}>
                      <Text style={styles.methodBrand}>{method.brand}</Text>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.methodMask}>•••• •••• •••• {method.last4}</Text>
                    {method.type === 'card' && (
                      <Text style={styles.methodExpiry}>
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={styles.methodActions}>
                  {!method.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetDefault(method.id)}
                    >
                      <Text style={styles.actionButtonText}>Set Default</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemove(method.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>No Payment Methods</Text>
            <Text style={styles.emptyDescription}>
              Add a payment method to start making payments
            </Text>
          </View>
        )}

        {/* Swipe Hint */}
        {paymentMethods.length > 0 && (
          <View style={styles.hintBox}>
            <Text style={styles.hintIcon}>👆</Text>
            <Text style={styles.hintText}>
              Swipe left on a card to see more options
            </Text>
          </View>
        )}

        {/* Add Payment Method Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your payment information is encrypted and secured. We never store your full card details.
          </Text>
        </View>

        {/* Accepted Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accepted Payment Methods</Text>
          <View style={styles.acceptedGrid}>
            <View style={styles.acceptedItem}>
              <Text style={styles.acceptedIcon}>💳</Text>
              <Text style={styles.acceptedLabel}>Credit Card</Text>
            </View>
            <View style={styles.acceptedItem}>
              <Text style={styles.acceptedIcon}>🏧</Text>
              <Text style={styles.acceptedLabel}>Debit Card</Text>
            </View>
            <View style={styles.acceptedItem}>
              <Text style={styles.acceptedIcon}>🏦</Text>
              <Text style={styles.acceptedLabel}>Bank Account</Text>
            </View>
            <View style={styles.acceptedItem}>
              <Text style={styles.acceptedIcon}>📱</Text>
              <Text style={styles.acceptedLabel}>Digital Wallet</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>+ Add Payment Method</Text>
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
  listLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  methodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  methodInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  methodIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.lg,
  },
  methodDetails: {
    flex: 1,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  methodBrand: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  defaultBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  defaultBadgeText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  methodMask: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
    fontFamily: 'monospace',
  },
  methodExpiry: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  methodActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },
  removeButtonText: {
    color: colors.error,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  hintBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  hintIcon: {
    fontSize: fontSizes.lg,
  },
  hintText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    flex: 1,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  acceptedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  acceptedItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  acceptedIcon: {
    fontSize: fontSizes.xl,
    marginBottom: spacing.sm,
  },
  acceptedLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  addButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
