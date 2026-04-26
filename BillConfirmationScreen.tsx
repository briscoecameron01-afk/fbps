import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route?: any;
}

export function BillConfirmationScreen({ navigation, route }: Props) {
  const billName = route?.params?.billName || 'Electricity';
  const billAmount = route?.params?.billAmount || 120;
  const dueDate = route?.params?.dueDate || 'Mar 25';
  const category = route?.params?.category || 'Utilities';
  const dailyContribution = (billAmount / 30).toFixed(2);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bill Confirmation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Subtitle */}
        <Text style={styles.subtitle}>Review details before saving</Text>

        {/* Bill Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bill Name</Text>
            <Text style={styles.detailValue}>{billName}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Monthly Amount</Text>
            <Text style={styles.detailValue}>${billAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Due Date</Text>
            <Text style={styles.detailValue}>{dueDate}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category</Text>
            <TouchableOpacity>
              <Text style={styles.detailLink}>{category}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Bill Type</Text>
            <Text style={styles.detailValue}>Monthly (Recurring)</Text>
          </View>
        </View>

        {/* Contribution Schedule Card */}
        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTitle}>Contribution Schedule</Text>

          <View style={styles.scheduleDetail}>
            <View>
              <Text style={styles.scheduleLabel}>Daily Contribution</Text>
              <Text style={styles.scheduleAmount}>${dailyContribution}</Text>
            </View>
            <Text style={styles.scheduleDescription}>per day</Text>
          </View>

          <View style={styles.scheduleSeparator} />

          <View style={styles.scheduleStats}>
            <View style={styles.scheduleStat}>
              <Text style={styles.scheduleStatLabel}>30 contributions</Text>
              <Text style={styles.scheduleStatValue}>remaining</Text>
            </View>
            <View style={styles.scheduleStat}>
              <Text style={styles.scheduleStatLabel}>Fully funded by</Text>
              <Text style={styles.scheduleStatValue}>28 Feb</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.outlineButtonText}>Back</Text>
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
  subtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  detailsCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  detailLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '500',
  },
  detailValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  detailLink: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  scheduleCard: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  scheduleTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  scheduleDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  scheduleLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  scheduleAmount: {
    color: colors.primary,
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
  },
  scheduleDescription: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
  },
  scheduleSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  scheduleStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scheduleStat: {
    flex: 1,
  },
  scheduleStatLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xs,
  },
  scheduleStatValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
