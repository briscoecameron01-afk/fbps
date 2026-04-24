import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const COMPLETED_DAYS = ['MON', 'TUE', 'WED', 'THU'];

const ACHIEVEMENTS = [
  { id: '1', name: 'Daily Fund', icon: '🪙', unlocked: true },
  { id: '2', name: 'Weekly Warrior', icon: '🏅', unlocked: true },
  { id: '3', name: 'Month Master', icon: '⭐', unlocked: false },
  { id: '4', name: 'Saving Streak', icon: '🔥', unlocked: false },
  { id: '5', name: 'Premium Plus', icon: '💎', unlocked: false },
  { id: '6', name: 'Goal Getter', icon: '🎯', unlocked: false },
];

export function RewardsScreen({ navigation }: any) {
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
              {DAYS.map((day, index) => (
                <View key={index} style={styles.dayContainer}>
                  <View style={[styles.dayCircle, COMPLETED_DAYS.includes(day) && styles.dayCircleCompleted]}>
                    <Text style={styles.dayIcon}>{COMPLETED_DAYS.includes(day) ? '✓' : ''}</Text>
                  </View>
                  <Text style={styles.dayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map(achievement => (
              <View key={achievement.id} style={[styles.achievementCard, !achievement.unlocked && styles.achievementCardLocked]}>
                {achievement.unlocked ? (
                  <>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={styles.achievementName}>{achievement.name}</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.achievementIconLocked}>?</Text>
                    <Text style={styles.achievementNameLocked}>Locked</Text>
                  </>
                )}
              </View>
            ))}
          </View>
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
  achievementNameLocked: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textMuted },
});
