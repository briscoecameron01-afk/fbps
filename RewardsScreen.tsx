import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedDate?: string;
}

export function RewardsScreen({ navigation }: Props) {
  const achievements: Achievement[] = [
    {
      id: '1',
      icon: '🔥',
      name: 'On Fire',
      description: '7-day contribution streak',
      unlocked: true,
      unlockedDate: 'Jan 15, 2024',
    },
    {
      id: '2',
      icon: '💪',
      name: 'Consistency',
      description: '30+ contributions in a month',
      unlocked: true,
      unlockedDate: 'Jan 10, 2024',
    },
    {
      id: '3',
      icon: '💰',
      name: 'Big Saver',
      description: 'Save $1,000 across all bills',
      unlocked: true,
      unlockedDate: 'Jan 5, 2024',
    },
    {
      id: '4',
      icon: '🎯',
      name: 'Accuracy',
      description: '100% on-time payments',
      unlocked: true,
      unlockedDate: 'Dec 28, 2023',
    },
    {
      id: '5',
      icon: '🏆',
      name: 'Perfectionist',
      description: '90-day perfect streak',
      unlocked: false,
    },
    {
      id: '6',
      icon: '🌟',
      name: 'Champion',
      description: 'All achievements unlocked',
      unlocked: false,
    },
  ];

  const streakCount = 7;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards & Achievements</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Streak Display */}
        <View style={styles.streakCard}>
          <Text style={styles.streakIcon}>🔥</Text>
          <View style={styles.streakInfo}>
            <Text style={styles.streakDays}>{streakCount} Days</Text>
            <Text style={styles.streakLabel}>Contribution Streak</Text>
          </View>
          <View style={styles.streakProgress}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(streakCount / 90) * 100}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>7 of 90 days</Text>
          </View>
        </View>

        {/* Rewards Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>🎁</Text>
          <Text style={styles.infoText}>
            Unlock achievements by completing milestones. Share your progress and earn exclusive rewards!
          </Text>
        </View>

        {/* Achievements Grid */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View
                key={achievement.id}
                style={[
                  styles.achievementCard,
                  !achievement.unlocked && styles.achievementCardLocked,
                ]}
              >
                <Text
                  style={[
                    styles.achievementIcon,
                    !achievement.unlocked && styles.achievementIconLocked,
                  ]}
                >
                  {achievement.icon}
                </Text>
                <Text style={styles.achievementName}>{achievement.name}</Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
                {achievement.unlocked && (
                  <Text style={styles.unlockedDate}>
                    {achievement.unlockedDate}
                  </Text>
                )}
                {!achievement.unlocked && (
                  <Text style={styles.lockedText}>Locked</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Upcoming Rewards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Rewards</Text>

          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardIcon}>🏆</Text>
              <Text style={styles.rewardName}>Perfectionist</Text>
            </View>
            <Text style={styles.rewardDescription}>
              Reach a 90-day contribution streak
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(streakCount / 90) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {streakCount} of 90 days ({Math.round((streakCount / 90) * 100)}%)
              </Text>
            </View>
          </View>

          <View style={styles.rewardCard}>
            <View style={styles.rewardHeader}>
              <Text style={styles.rewardIcon}>💰</Text>
              <Text style={styles.rewardName}>Big Spender</Text>
            </View>
            <Text style={styles.rewardDescription}>
              Contribute $5,000 across all bills
            </Text>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${(1850 / 5000) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                $1,850 of $5,000 ({Math.round((1850 / 5000) * 100)}%)
              </Text>
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
  streakCard: {
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakIcon: {
    fontSize: 40,
    marginRight: spacing.lg,
  },
  streakInfo: {
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
  streakProgress: {
    minWidth: 100,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
    textAlign: 'right',
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
  achievementsSection: {
    marginBottom: spacing.xl,
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
    borderColor: colors.border,
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
  achievementIconLocked: {
    opacity: 0.5,
  },
  achievementName: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '700',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  achievementDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: spacing.sm,
  },
  unlockedDate: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  lockedText: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  rewardCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rewardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  rewardIcon: {
    fontSize: fontSizes.xl,
  },
  rewardName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  rewardDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  progressContainer: {
    gap: spacing.sm,
  },
});
