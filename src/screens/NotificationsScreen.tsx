import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';
import { Notification } from '../types/bill';

interface Props {
  navigation: any;
}

const GROUP_LABELS: Record<Notification['type'], string> = {
  contribution_reminder: 'Contribution Reminders',
  due_date: 'Due Date Alerts',
  missed_contribution: 'Missed Contributions',
  system: 'System Alerts',
};

function formatTimestamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function NotificationsScreen({ navigation }: Props) {
  const { notifications, markNotificationReadAsync } = useStore();
  const grouped = notifications.reduce<Record<string, Notification[]>>((acc, notification) => {
    const label = GROUP_LABELS[notification.type] || 'Notifications';
    acc[label] = [...(acc[label] || []), notification];
    return acc;
  }, {});

  const groups = Object.entries(grouped);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Alerts about due dates, bank links, and contributions will appear here.
            </Text>
          </View>
        ) : (
          groups.map(([title, groupNotifications]) => (
            <View key={title} style={styles.section}>
              <Text style={styles.sectionTitle}>{title}</Text>
              {groupNotifications.map((notification) => (
                <TouchableOpacity
                  key={notification.id}
                  style={styles.notificationRow}
                  activeOpacity={0.75}
                  onPress={() => {
                    if (!notification.read) markNotificationReadAsync(notification.id);
                  }}
                >
                  {!notification.read && <View style={styles.unreadDot} />}
                  <View style={styles.notificationContent}>
                    <Text
                      style={[
                        styles.notificationTitle,
                        notification.read && styles.notificationTextRead,
                      ]}
                    >
                      {notification.title}
                    </Text>
                    <Text
                      style={[
                        styles.notificationText,
                        notification.read && styles.notificationTextRead,
                      ]}
                    >
                      {notification.message}
                    </Text>
                    <Text style={styles.notificationTime}>
                      {formatTimestamp(notification.createdAt)}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '600' },
  headerTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700' },
  emptyState: {
    margin: spacing.xl,
    padding: spacing.xl,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.md, lineHeight: 22 },
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
  notificationContent: { flex: 1, gap: spacing.xs },
  notificationTitle: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700' },
  notificationText: { color: colors.textPrimary, fontSize: fontSizes.sm, lineHeight: 20 },
  notificationTextRead: { color: colors.textSecondary },
  notificationTime: { color: colors.textMuted, fontSize: fontSizes.xs },
});
