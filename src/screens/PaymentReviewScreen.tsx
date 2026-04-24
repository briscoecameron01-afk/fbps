import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentReviewScreen({ navigation, route }: Props) {
  // Mock data
  const paymentDetails = {
    vendor: 'Electricity Company',
    paymentMethod: 'Bank of Fractional',
    paymentDate: 'Today',
    totalAmount: 120.00,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Review</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Subtitle */}
        <View style={styles.subtitleSection}>
          <Text style={styles.subtitle}>
            Please review the details before confirming
          </Text>
        </View>

        {/* Payment Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Vendor</Text>
            <Text style={styles.detailValue}>{paymentDetails.vendor}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <Text style={styles.detailValue}>{paymentDetails.paymentMethod}</Text>
          </View>
          <View style={[styles.detailRow, styles.detailRowBorder]}>
            <Text style={styles.detailLabel}>Payment Date</Text>
            <Text style={styles.detailValue}>{paymentDetails.paymentDate}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Amount</Text>
            <Text style={styles.detailValueAccent}>
              ${paymentDetails.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        {/* Confirm Payment Button */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.bottomButton]}
          onPress={() => navigation.navigate('PaymentReceipt')}
        >
          <Text style={styles.primaryButtonText}>Confirm Payment</Text>
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
  subtitleSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  detailsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detailLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    textAlign: 'right',
  },
  detailValueAccent: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
    textAlign: 'right',
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
