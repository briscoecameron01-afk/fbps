import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const FREQUENCIES = ['Daily', 'Weekly', 'Bi-weekly', 'Monthly'];

export function AutoTransferScheduleScreen({ navigation }: any) {
  const [selectedFrequency, setSelectedFrequency] = useState('Weekly');
  const [transferTime] = useState('09:00 AM');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Auto Transfer Schedule</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.subtitle}>Configure how and when your contributions are automatically transferred</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequency</Text>
          <View style={styles.pillsContainer}>
            {FREQUENCIES.map(freq => (
              <TouchableOpacity key={freq} style={[styles.pill, selectedFrequency === freq && styles.pillActive]} onPress={() => setSelectedFrequency(freq)}>
                <Text style={[styles.pillText, selectedFrequency === freq && styles.pillTextActive]}>{freq}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transfer Time</Text>
          <View style={styles.timeCard}>
            <Text style={styles.timeValue}>{transferTime}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quiet Hours</Text>
          <Text style={styles.quietHoursDesc}>Transfers will not be made between 10:00 PM and 6:00 AM to avoid late-night notifications</Text>
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
  subtitle: { fontSize: fontSizes.base, color: colors.textSecondary, marginBottom: spacing.xl, lineHeight: fontSizes.base * 1.5 },
  section: { marginBottom: spacing.xl },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.md },
  pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  pill: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent' },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  pillTextActive: { color: colors.background },
  timeCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  timeValue: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  quietHoursDesc: { fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: fontSizes.sm * 1.5 },
});
