import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
}

interface Notification {
  id: string;
  message: string;
  timestamp: string;
  isUnread: boolean;
}

const notificationGroups = [
  {
    title: 'Contribution Reminders',
    notifications: [
      { id: '1', message: 'Daily contribution of $4.00 has been scheduled', timestamp: 'Today · 9:00 AM', isUnread: true },
      { id: '2', message: 'Upcoming contribution due tomorrow', timestamp: 'Yesterday · 2:30 PM', isUnread: false },
    ],
  },
  {
    title: 'Due Date Alerts',
    notifications: [
      { id: '3', message: 'Electricity bill due in 3 days', timestamp: 'Today · 8:15 AM', isUnread: true },
      { id: '4', message: 'Internet bill funding is complete', timestamp: 'Mar 25 · 5:45 PM', isUnread: false },
    ],
  },
  {
    title: 'Missed Contributions',
    notifications: [
      { id: '5', message: 'Unable to process contribution - insufficient balance', timestamp: 'Mar 24 · 9:00 AM', isUnread: true },
    ],
  },
  {
    title: 'System Alerts',
    notifications: [
      { id: '6', message: 'Your bank account has been linked successfully', timestamp: 'Mar 20 · 10:30 AM', isUnread: false },
    ],
  },
];

export function NotificationsScreen({ navigation }: Props) {
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {notificationGroups.map((group, groupIdx) => (
          <View key={groupIdx} style={styles.section}>
            <Text style={styles.sectionTitle}>{group.title}</Text>
            {group.notifications.map((notification) => (
              <View key={notification.id} style={styles.notificationRow}>
                {notification.isUnread && <View style={styles.unreadDot} />}
                <View style={styles.notificationContent}>
                  <Text
                    style={[
                      styles.notificationText,
                      !notification.isUnread && styles.notificationTextRead,
                    ]}
                  >
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>{notification.timestamp}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={{ height: 40 }} />
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
  section: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  notificationContent: {
    flex: 1,
    gap: spacing.xs,
  },
  notificationText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '500',
  },
  notificationTextRead: {
    color: colors.textSecondary,
  },
  notificationTime: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
});
