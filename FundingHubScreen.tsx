import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

interface Props {
  navigation: any;
}

export function FundingHubScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.title}>Funding Hub</Text>
        </View>

        {/* Auto-transfer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Auto-transfer</Text>
              <Text style={styles.cardValue}>Enabled</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
        </View>

        {/* Next Scheduled Transfer Card */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Next Scheduled Transfer</Text>
          <Text style={styles.cardValue}>Mar 05 · $4.00</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('ManualContribution')}
          >
            <Text style={styles.outlineButtonText}>Manual Contribution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('LinkBank')}
          >
            <Text style={styles.outlineButtonText}>Link Bank</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('AutoTransferSchedule')}
          >
            <Text style={styles.primaryButtonText}>Schedules</Text>
          </TouchableOpacity>
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
  scrollContent: {
    padding: spacing.screenPadding,
  },
  headerSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  activeBadge: {
    backgroundColor: colors.onTrack,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  activeBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
  buttonsSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
});
