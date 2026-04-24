import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function PayBillScreen({ navigation, route }: Props) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('Bank Of Habib');

  // Mock data
  const bill = {
    vendor: 'Electricity Company',
    amount: 120.00,
    paymentMethods: ['Bank Of Habib', 'Bank Of Punjab', 'HBL'],
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bill</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Vendor Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Vendor</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{bill.vendor}</Text>
          </View>
        </View>

        {/* Amount to Pay Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Amount to Pay</Text>
          <View style={styles.card}>
            <Text style={styles.amountText}>${bill.amount.toFixed(2)}</Text>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          <TouchableOpacity
            style={styles.dropdownCard}
            onPress={() => {
              // Could open a modal for selection
            }}
          >
            <Text style={styles.dropdownText}>{selectedPaymentMethod}</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        {/* Pay Now Button */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.bottomButton]}
          onPress={() => navigation.navigate('PaymentReview')}
        >
          <Text style={styles.primaryButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
  },
  headerTitle: {
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
  },
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: fontWeights.semibold,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  amountText: {
    fontSize: fontSizes['2xl'],
    color: colors.primary,
    fontWeight: fontWeights.bold,
  },
  dropdownCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    fontWeight: fontWeights.semibold,
  },
  chevron: {
    fontSize: fontSizes.xl,
    color: colors.primary,
  },
  bottomButton: {
    marginHorizontal: spacing.xl,
    marginBottom: spacing.xl,
  },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
});
