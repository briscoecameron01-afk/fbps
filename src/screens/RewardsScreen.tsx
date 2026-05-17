import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

export function RewardsScreen({ navigation }: any) {
  const { achievements, userProfile } = useStore();
  const completedDays = Math.min(userProfile.streakDays || 0, DAYS.length);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Current Streak</Text>
          <View style={styles.streakCard}>
            <View style={styles.daysGrid}>
              {DAYS.map((day, index) => {
                const completed = index < completedDays;
                return (
                  <View key={day} style={styles.dayContainer}>
                    <View style={[styles.dayCircle, completed && styles.dayCircleCompleted]}>
                      <Text style={styles.dayIcon}>{completed ? '✓' : ''}</Text>
                    </View>
                    <Text style={styles.dayLabel}>{day}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {achievements.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No achievements yet</Text>
              <Text style={styles.emptyText}>
                Achievements will appear here after they are saved for your account.
              </Text>
            </View>
          ) : (
            <View style={styles.achievementsGrid}>
              {achievements.map((achievement) => (
                <View
                  key={achievement.id}
                  style={[
                    styles.achievementCard,
                    !achievement.unlocked && styles.achievementCardLocked,
                  ]}
                >
                  {achievement.unlocked ? (
                    <>
                      <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                      <Text style={styles.achievementName}>{achievement.name}</Text>
                      {!!achievement.unlockedAt && (
                        <Text style={styles.achievementDate}>
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </Text>
                      )}
                    </>
                  ) : (
                    <>
                      <Text style={styles.achievementIconLocked}>?</Text>
                      <Text style={styles.achievementNameLocked}>{achievement.name}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  streakCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  daysGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  dayContainer: { alignItems: 'center' },
  dayCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.backgroundCardLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.sm, borderWidth: 2, borderColor: colors.border },
  dayCircleCompleted: { backgroundColor: colors.gold, borderColor: colors.gold },
  dayIcon: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.background },
  dayLabel: { fontSize: fontSizes.xs, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between' },
  achievementCard: { width: '48%', backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center', minHeight: 140 },
  achievementCardLocked: { borderColor: colors.border, borderStyle: 'dashed' },
  achievementIcon: { fontSize: fontSizes.xl, marginBottom: spacing.sm },
  achievementIconLocked: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textMuted, marginBottom: spacing.sm },
  achievementName: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, textAlign: 'center' },
  achievementNameLocked: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textMuted, textAlign: 'center' },
  achievementDate: { color: colors.textMuted, fontSize: fontSizes.xs, marginTop: spacing.xs },
  emptyCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: fontWeights.bold, marginBottom: spacing.sm },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
});
