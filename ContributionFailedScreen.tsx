import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
}

export function ContributionFailedScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contribution Failed</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Heading */}
        <Text style={styles.heading}>Insufficient Account Balance</Text>

        {/* Description */}
        <Text style={styles.description}>
          We were unable to complete your scheduled contribution to your bills due to insufficient funds in your linked bank account. Please add funds or adjust your contribution schedule.
        </Text>

        {/* Warning Box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningIcon}>⚠️</Text>
          <Text style={styles.warningText}>
            This bill may fall behind schedule if no action is taken
          </Text>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Retry Contribution</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineButton}>
            <Text style={styles.outlineButtonText}>Adjust Schedule</Text>
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
    paddingVertical: spacing.xl,
    minHeight: '100%',
  },
  heading: {
    color: colors.textPrimary,
    fontSize: fontSizes['2xl'],
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  description: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  warningBox: {
    backgroundColor: colors.error + '15',
    borderWidth: 1,
    borderColor: colors.error + '40',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  warningIcon: {
    fontSize: fontSizes.xl,
  },
  warningText: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
    flex: 1,
  },
  buttonContainer: {
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
