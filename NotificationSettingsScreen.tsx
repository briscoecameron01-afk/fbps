import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationSettingsScreen({ navigation }: Props) {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'push',
      label: 'Push Notifications',
      description: 'Receive push notifications on your device',
      enabled: true,
    },
    {
      id: 'email',
      label: 'Email Notifications',
      description: 'Receive email updates about your account',
      enabled: true,
    },
    {
      id: 'billReminders',
      label: 'Bill Reminders',
      description: 'Get reminded when bills are due',
      enabled: true,
    },
    {
      id: 'contributionReminders',
      label: 'Contribution Reminders',
      description: 'Get reminded to make contributions',
      enabled: false,
    },
    {
      id: 'dueDateAlerts',
      label: 'Due Date Alerts',
      description: 'Alerts 3 days before bills are due',
      enabled: true,
    },
    {
      id: 'weeklySummary',
      label: 'Weekly Summary',
      description: 'Get a weekly summary of your bills',
      enabled: true,
    },
    {
      id: 'marketing',
      label: 'Marketing Updates',
      description: 'Hear about new features and promotions',
      enabled: false,
    },
  ]);

  const toggleSetting = (id: string) => {
    setSettings(
      settings.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Notification Settings List */}
        {settings.map((setting) => (
          <View key={setting.id} style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>{setting.label}</Text>
              <Text style={styles.settingDescription}>
                {setting.description}
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                setting.enabled && styles.toggleEnabled,
              ]}
              onPress={() => toggleSetting(setting.id)}
            >
              <View
                style={[
                  styles.toggleCircle,
                  setting.enabled && styles.toggleCircleEnabled,
                ]}
              />
            </TouchableOpacity>
          </View>
        ))}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            You can change your notification preferences at any time. Some notifications are essential for your account security and cannot be disabled.
          </Text>
        </View>

        {/* Notification Schedule */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Schedule</Text>
          <Text style={styles.sectionDescription}>
            We respect your time. Choose when you'd like to receive notifications.
          </Text>

          <View style={styles.scheduleCard}>
            <View style={styles.scheduleItem}>
              <Text style={styles.scheduleLabel}>Quiet Hours</Text>
              <Text style={styles.scheduleTime}>9:00 PM - 8:00 AM</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editScheduleButton}>
            <Text style={styles.editScheduleButtonText}>Edit Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Preferences</Text>

          <View style={styles.preferenceCard}>
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Email Address</Text>
              <Text style={styles.preferenceValue}>sarah.loren@example.com</Text>
            </View>
            <View style={styles.preferenceDivider} />
            <View style={styles.preferenceItem}>
              <Text style={styles.preferenceLabel}>Phone Number</Text>
              <Text style={styles.preferenceValue}>+1 (555) 123-4567</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.updateContactButton}>
            <Text style={styles.updateContactButtonText}>Update Contact Info</Text>
          </TouchableOpacity>
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
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.lg,
  },
  settingLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  settingDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 2,
    justifyContent: 'center',
  },
  toggleEnabled: {
    backgroundColor: colors.primary,
  },
  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
  },
  toggleCircleEnabled: {
    alignSelf: 'flex-end',
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
    marginVertical: spacing.xl,
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  scheduleCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  scheduleTime: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  editScheduleButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  editScheduleButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  preferenceCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  preferenceItem: {
    padding: spacing.lg,
  },
  preferenceLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.sm,
  },
  preferenceValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  preferenceDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  updateContactButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  updateContactButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
