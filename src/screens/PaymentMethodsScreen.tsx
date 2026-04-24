import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, screenPadding } from '../theme';

interface PaymentMethod {
  id: string;
  provider: 'stripe' | 'paypal' | 'apple_pay';
  type: string;
  label: string;
  brand?: string;
  isDefault: boolean;
}

const mockMethods: PaymentMethod[] = [
  { id: '1', provider: 'stripe', type: 'card', label: 'Visa ••••4242', brand: 'visa', isDefault: true },
  { id: '2', provider: 'paypal', type: 'paypal', label: 'PayPal (cam@fractionalbillpay.com)', isDefault: false },
  { id: '3', provider: 'apple_pay', type: 'apple_pay', label: 'Apple Pay', isDefault: false },
];

interface PaymentMethodsScreenProps {
  navigation: any;
}

export function PaymentMethodsScreen({ navigation }: PaymentMethodsScreenProps) {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockMethods);

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
  };

  const handleRemove = (methodId: string) => {
    Alert.alert('Remove Payment Method', 'Are you sure you want to remove this payment method?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Remove',
        onPress: () => {
          setPaymentMethods((prev) => prev.filter((m) => m.id !== methodId));
        },
      },
    ]);
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'stripe':
        return '💳';
      case 'paypal':
        return 'P';
      case 'apple_pay':
        return '';
      default:
        return '●';
    }
  };

  const renderPaymentMethod = (method: PaymentMethod) => (
    <View key={method.id} style={styles.methodCard}>
      <View style={styles.methodContent}>
        <View style={styles.methodIcon}>
          <Text style={styles.methodIconText}>{getProviderIcon(method.provider)}</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodLabel}>{method.label}</Text>
          <Text style={styles.methodProvider}>{method.provider.toUpperCase()}</Text>
        </View>
        {method.isDefault && <View style={styles.defaultBadge}>
          <Text style={styles.defaultBadgeText}>Default</Text>
        </View>}
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
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Saved Payment Methods */}
        {paymentMethods.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
            <View style={styles.methodsList}>
              {paymentMethods.map(renderPaymentMethod)}
            </View>
          </View>
        )}

        {/* Add Payment Methods Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Payment Method</Text>

          {/* Credit/Debit Card */}
          <TouchableOpacity style={styles.addMethodCard}>
            <View style={styles.addMethodIcon}>
              <Text style={styles.addMethodIconText}>💳</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>Add Credit/Debit Card</Text>
              <Text style={styles.addMethodDesc}>Stripe powered</Text>
            </View>
            <Text style={styles.addMethodArrow}>→</Text>
          </TouchableOpacity>

          {/* PayPal */}
          <TouchableOpacity style={styles.addMethodCard}>
            <View style={[styles.addMethodIcon, { backgroundColor: '#0070BA20' }]}>
              <Text style={styles.addMethodIconText} style={{ color: '#0070BA', fontWeight: fontWeights.bold }}>P</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>Link PayPal</Text>
              <Text style={styles.addMethodDesc}>Connect your PayPal account</Text>
            </View>
            <Text style={styles.addMethodArrow}>→</Text>
          </TouchableOpacity>

          {/* Apple Pay */}
          <TouchableOpacity style={styles.addMethodCard}>
            <View style={styles.addMethodIcon}>
              <Text style={styles.addMethodIconText}>🍎</Text>
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>Apple Pay</Text>
              <Text style={styles.addMethodDesc}>Fast and secure</Text>
            </View>
            <Text style={styles.addMethodArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>🔒 Your payment info is encrypted and secure</Text>
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
  section: {
    marginBottom: spacing['2xl'],
  },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  methodsList: {
    gap: spacing.md,
  },
  methodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodIconText: {
    fontSize: fontSizes.xl,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  methodProvider: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  defaultBadge: {
    backgroundColor: colors.successBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold as any,
    color: colors.success,
  },
  methodActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
    color: colors.primary,
  },
  removeButton: {
    borderColor: colors.error,
  },
  removeButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
    color: colors.error,
  },
  addMethodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  addMethodIconText: {
    fontSize: fontSizes.xl,
  },
  addMethodInfo: {
    flex: 1,
  },
  addMethodName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  addMethodDesc: {
    fontSize: fontSizes.sm,
    color: colors.textMuted,
  },
  addMethodArrow: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  securityNote: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  securityNoteText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
