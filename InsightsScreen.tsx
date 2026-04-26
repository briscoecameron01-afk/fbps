import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function InsightsScreen({ navigation }: Props) {
  const categories = [
    { name: 'Housing', amount: 1500, percentage: 35, color: '#00D998' },
    { name: 'Utilities', amount: 250, percentage: 20, color: '#FFB800' },
    { name: 'Entertainment', amount: 150, percentage: 15, color: '#FF6B6B' },
    { name: 'Transportation', amount: 200, percentage: 18, color: '#4ECDC4' },
    { name: 'Other', amount: 100, percentage: 12, color: '#95E1D3' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Insights</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Monthly Overview Card */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Total Bills</Text>
            <Text style={styles.overviewValue}>$2,200</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Total Funded</Text>
            <Text style={styles.overviewValue}>$1,850</Text>
          </View>
          <View style={styles.overviewDivider} />
          <View style={styles.overviewItem}>
            <Text style={styles.overviewLabel}>Savings Rate</Text>
            <Text style={styles.overviewValue}>84%</Text>
          </View>
        </View>

        {/* Streak Card */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakContent}>
            <Text style={styles.streakDays}>7 Days</Text>
            <Text style={styles.streakLabel}>Contribution Streak</Text>
          </View>
        </View>

        {/* Spending Breakdown Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Spending Breakdown by Category</Text>

          {categories.map((category, idx) => (
            <View key={idx} style={styles.categoryItem}>
              <View style={styles.categoryInfo}>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
              </View>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      width: `${category.percentage}%`,
                      backgroundColor: category.color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.categoryPercent}>{category.percentage}%</Text>
            </View>
          ))}
        </View>

        {/* Monthly Trend Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Trend</Text>
          <View style={styles.trendContainer}>
            {/* Simple bar chart using Views */}
            {[
              { month: 'Jan', value: 60, label: '$1,320' },
              { month: 'Feb', value: 75, label: '$1,650' },
              { month: 'Mar', value: 85, label: '$1,870' },
              { month: 'Apr', value: 84, label: '$1,848' },
              { month: 'May', value: 90, label: '$1,980' },
              { month: 'Jun', value: 88, label: '$1,936' },
            ].map((item, idx) => (
              <View key={idx} style={styles.trendBar}>
                <View
                  style={[
                    styles.trendBarFill,
                    {
                      height: `${item.value}%`,
                    },
                  ]}
                />
                <Text style={styles.trendMonth}>{item.month}</Text>
                <Text style={styles.trendValue}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={styles.achievementName}>On Track</Text>
              <Text style={styles.achievementDate}>Unlocked today</Text>
            </View>
            <View style={styles.achievementCard}>
              <Text style={styles.achievementIcon}>💪</Text>
              <Text style={styles.achievementName}>Consistency</Text>
              <Text style={styles.achievementDate}>Unlocked 3 days ago</Text>
            </View>
            <View style={[styles.achievementCard, styles.achievementCardLocked]}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={styles.achievementName}>Perfectionist</Text>
              <Text style={styles.achievementDate}>Locked</Text>
            </View>
            <View style={[styles.achievementCard, styles.achievementCardLocked]}>
              <Text style={styles.achievementIcon}>🌟</Text>
              <Text style={styles.achievementName}>Champion</Text>
              <Text style={styles.achievementDate}>Locked</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  overviewCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    flexDirection: 'row',
  },
  overviewItem: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  overviewLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  overviewValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  overviewDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  streakCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  streakIcon: {
    fontSize: 32,
    marginRight: spacing.lg,
  },
  streakContent: {
    flex: 1,
  },
  streakDays: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  streakLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
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
  categoryItem: {
    marginBottom: spacing.lg,
  },
  categoryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  categoryName: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  categoryAmount: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  barContainer: {
    height: 6,
    backgroundColor: colors.backgroundInput,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  bar: {
    height: '100%',
    borderRadius: 3,
  },
  categoryPercent: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trendBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  trendBarFill: {
    width: '80%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.sm,
  },
  trendMonth: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  trendValue: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  achievementCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '40',
    borderTopWidth: 2,
    borderTopColor: colors.primary,
  },
  achievementCardLocked: {
    opacity: 0.5,
    borderTopColor: colors.border,
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  achievementName: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  achievementDate: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
});
