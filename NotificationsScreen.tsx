import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Notification {
  id: string;
  icon: string;
  title: string;
  message: string;
  timestamp: string;
  unread: boolean;
}

export function NotificationsScreen({ navigation }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      icon: '💡',
      title: 'Bill Due Soon',
      message: 'Electricity bill is due in 3 days',
      timestamp: '2 hours ago',
      unread: true,
    },
    {
      id: '2',
      icon: '✅',
      title: 'Contribution Successful',
      message: 'Your contribution of $50 to Netflix was successful',
      timestamp: '5 hours ago',
      unread: true,
    },
    {
      id: '3',
      icon: '🏦',
      title: 'Bank Account Linked',
      message: 'Your Chase account has been successfully linked',
      timestamp: '1 day ago',
      unread: false,
    },
    {
      id: '4',
      icon: '🎉',
      title: 'Streak Milestone',
      message: 'You\'ve reached a 7-day contribution streak!',
      timestamp: '2 days ago',
      unread: false,
    },
    {
      id: '5',
      icon: '⚠️',
      title: 'Payment Failed',
      message: 'Your payment to Internet failed due to insufficient funds',
      timestamp: '3 days ago',
      unread: false,
    },
  ]);

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, unread: false })));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleMarkAllAsRead}>
          <Text style={styles.markAllButton}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      {/* Notifications List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {notifications.map((notification) => (
          <TouchableOpacity key={notification.id} style={styles.notificationCard}>
            {notification.unread && <View style={styles.unreadDot} />}
            <View style={styles.notificationContent}>
              <Text style={styles.notificationIcon}>{notification.icon}</Text>
              <View style={styles.notificationTextContainer}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTimestamp}>{notification.timestamp}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
  markAllButton: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: spacing.md,
    marginTop: 6,
  },
  notificationContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  notificationIcon: {
    fontSize: fontSizes['2xl'],
    marginRight: spacing.md,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notificationTimestamp: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
});
