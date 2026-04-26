import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  screen: string;
}

export function ProfileHubScreen({ navigation }: Props) {
  const menuItems: MenuItem[] = [
    { id: '1', icon: '👤', label: 'My Profile', screen: 'MyProfile' },
    { id: '2', icon: '💳', label: 'Payment Methods', screen: 'PaymentMethods' },
    { id: '3', icon: '🏦', label: 'Linked Accounts', screen: 'LinkedAccounts' },
    { id: '4', icon: '💡', label: 'Pricing', screen: 'Subscription' },
    { id: '5', icon: '🎁', label: 'Rewards', screen: 'Rewards' },
    { id: '6', icon: '🔐', label: 'Security', screen: 'Security' },
    { id: '7', icon: '🔔', label: 'Notification Settings', screen: 'NotificationSettings' },
    { id: '8', icon: '🏢', label: 'Employer Program', screen: 'EmployerProgram' },
    { id: '9', icon: '⚙️', label: 'Settings', screen: 'Settings' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* User Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SL</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Loren</Text>
            <Text style={styles.profileEmail}>sarah.loren@example.com</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>7</Text>
            <Text style={styles.statLabel}>Streak Days</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📋</Text>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Bills Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>💰</Text>
            <Text style={styles.statValue}>$420</Text>
            <Text style={styles.statLabel}>Total Saved</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate(item.screen)}
            >
              <View style={styles.menuItemLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

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
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  avatarText: {
    color: colors.background,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  profileEmail: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    fontSize: fontSizes.lg,
    marginBottom: spacing.sm,
  },
  statValue: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    textAlign: 'center',
  },
  menuSection: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    fontSize: fontSizes.lg,
    marginRight: spacing.lg,
  },
  menuLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.xl,
  },
  logoutButton: {
    backgroundColor: colors.error + '15',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
