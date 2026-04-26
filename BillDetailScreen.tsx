import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { ProgressBar, StatusBadge, Button } from '../components';

interface Props {
  navigation: any;
  route: any;
}

export function BillDetailScreen({ navigation, route }: Props) {
  const [showDelete, setShowDelete] = React.useState(false);

  // Mock data for Figma match
  const bill = {
    name: 'Electricity Bill',
    saved: 78,
    total: 120,
    progress: 65,
    dueDate: '28 Feb',
    remaining: 42,
    cadence: 'Daily',
    nextContribution: 4.00,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{bill.name}</Text>
          <StatusBadge status="on_track" />
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <View>
            <Text style={styles.summaryLabel}>Saved</Text>
            <Text style={styles.summaryValue}>${bill.saved}</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <ProgressBar progress={bill.progress} height={8} color={colors.onTrack} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>${bill.total}</Text>
          </View>
        </View>

        {/* Info Grid (2x2) */}
        <View style={styles.infoGrid}>
          <View style={[styles.infoCard, styles.infoCardTop]}>
            <Text style={styles.infoLabel}>Due Date</Text>
            <Text style={styles.infoValue}>{bill.dueDate}</Text>
          </View>
          <View style={[styles.infoCard, styles.infoCardTop]}>
            <Text style={styles.infoLabel}>Remaining</Text>
            <Text style={styles.infoValue}>${bill.remaining}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Cadence</Text>
            <Text style={styles.infoValue}>{bill.cadence}</Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Next Contribution</Text>
            <Text style={styles.infoValue}>${bill.nextContribution.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1, marginRight: spacing.sm }]}
            onPress={() => navigation.navigate('BillBreakdown')}
          >
            <Text style={styles.outlineButtonText}>Breakdown</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1, marginLeft: spacing.sm }]}
            onPress={() => navigation.navigate('DepositHistory')}
          >
            <Text style={styles.outlineButtonText}>Funding Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* History Button */}
        <TouchableOpacity
          style={[styles.outlineButton, styles.fullWidth]}
          onPress={() => navigation.navigate('DepositHistory')}
        >
          <Text style={styles.outlineButtonText}>History</Text>
        </TouchableOpacity>

        {/* Pay Bill Button */}
        <TouchableOpacity
          style={[styles.primaryButton, styles.fullWidth]}
          onPress={() => navigation.navigate('PayBill')}
        >
          <Text style={styles.primaryButtonText}>Pay Bill</Text>
        </TouchableOpacity>

        {/* Bottom Action Buttons */}
        <View style={styles.bottomButtonRow}>
          <TouchableOpacity
            style={[styles.outlineButton, { flex: 1, marginRight: spacing.sm }]}
            onPress={() => navigation.navigate('EditBill')}
          >
            <Text style={styles.outlineButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.deleteButton, { flex: 1, marginLeft: spacing.sm }]}
            onPress={() => setShowDelete(true)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
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
    flex: 1,
    marginLeft: spacing.lg,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['2xl'],
    gap: spacing.lg,
  },
  summaryLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  summaryValue: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  progressBarContainer: {
    flex: 1,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  infoCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoCardTop: {
    marginBottom: spacing.sm,
  },
  infoLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  infoValue: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  actionRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  fullWidth: {
    marginHorizontal: spacing.xl,
    marginVertical: spacing.sm,
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
  bottomButtonRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    gap: spacing.md,
  },
  deleteButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.error,
  },
});
