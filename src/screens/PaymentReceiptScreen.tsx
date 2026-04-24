import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function PaymentReceiptScreen({ navigation, route }: Props) {
  // Mock data
  const receipt = {
    receiptId: 'FRAC-2026-001284',
    timestamp: 'Jan 14, 2026 · 09:42 AM',
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment Receipt</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Success Message */}
        <View style={styles.successSection}>
          <Text style={styles.successMessage}>
            Your payment was completed successfully
          </Text>
        </View>

        {/* Checkmark and Success Text */}
        <View style={styles.checkmarkContainer}>
          <View style={styles.checkmarkCircle}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Payment Successful</Text>
        </View>

        {/* Receipt Details Card */}
        <View style={styles.receiptCard}>
          <View style={[styles.receiptRow, styles.receiptRowBorder]}>
            <Text style={styles.receiptLabel}>Receipt ID</Text>
            <Text style={styles.receiptValue}>{receipt.receiptId}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Timestamp</Text>
            <Text style={styles.receiptValue}>{receipt.timestamp}</Text>
          </View>
        </View>

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.primaryButton, styles.buttonMargin]}>
            <Text style={styles.primaryButtonText}>Download</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.outlineButton, styles.buttonMargin]}>
            <Text style={styles.outlineButtonText}>Share</Text>
          </TouchableOpacity>
        </View>

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
  successSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
  },
  successMessage: {
    fontSize: fontSizes.md,
    color: colors.success,
    textAlign: 'center',
    fontWeight: fontWeights.semibold,
  },
  checkmarkContainer: {
    alignItems: 'center',
    paddingVertical: spacing['2xl'],
  },
  checkmarkCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  checkmark: {
    fontSize: fontSizes['4xl'],
    color: colors.success,
    fontWeight: fontWeights.bold,
  },
  successTitle: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  receiptCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  receiptRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  receiptLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  receiptValue: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
  },
  buttonMargin: {
    marginBottom: spacing.md,
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
  outlineButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
});
