import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';

interface Props {
  navigation: any;
}

export function SettingsScreen({ navigation }: Props) {
  const { userName, logout } = useStore();

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: '👤', label: 'Edit Profile', action: 'navigate' },
        { icon: '🏦', label: 'Linked Accounts', action: 'navigate' },
        { icon: '💳', label: 'Payment Methods', action: 'navigate' },
        { icon: '⭐', label: 'Upgrade to Premium', action: 'navigate', accent: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: '🔔', label: 'Notifications', action: 'toggle', value: true },
        { icon: '🌙', label: 'Dark Mode', action: 'toggle', value: false },
        { icon: '📊', label: 'Weekly Report', action: 'toggle', value: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: '❓', label: 'Help Center', action: 'navigate' },
        { icon: '💬', label: 'Contact Support', action: 'navigate' },
        { icon: '📋', label: 'Terms of Service', action: 'navigate' },
        { icon: '🔒', label: 'Privacy Policy', action: 'navigate' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userName[0]}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{userName}</Text>
            <Text style={styles.profileEmail}>founder@fractionalbillpay.com</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        </View>

        {/* Sections */}
        {sections.map((section, si) => (
          <View key={si} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={[
                    styles.settingRow,
                    ii < section.items.length - 1 && styles.settingRowBorder,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingLeft}>
                    <Text style={{ fontSize: 18 }}>{item.icon}</Text>
                    <Text
                      style={[
                        styles.settingLabel,
                        item.accent && { color: colors.teal, fontWeight: '600' },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.action === 'toggle' ? (
                    <Switch
                      value={item.value}
                      trackColor={{ false: colors.border, true: colors.teal }}
                      thumbColor={colors.white}
                    />
                  ) : (
                    <Text style={styles.chevron}>›</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={logout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Fractional Bill Pay v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: fontSizes.xl,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: fontSizes.xl,
  },
  profileName: {
    fontWeight: '700',
    fontSize: fontSizes.lg,
    color: colors.navy,
  },
  profileEmail: {
    fontSize: fontSizes.xs,
    color: colors.mid,
    marginTop: 2,
  },
  freeBadge: {
    marginLeft: 'auto',
    backgroundColor: colors.lightBg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  freeBadgeText: {
    fontSize: fontSizes.xs,
    color: colors.mid,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: fontSizes.xs,
    color: colors.light,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.sm,
  },
  sectionCard: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
  },
  settingRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingLabel: {
    fontSize: fontSizes.md,
    color: colors.dark,
  },
  chevron: {
    fontSize: 22,
    color: colors.light,
    fontWeight: '300',
  },
  signOutBtn: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  signOutText: {
    color: colors.coral,
    fontWeight: '600',
    fontSize: fontSizes.md,
  },
  version: {
    textAlign: 'center',
    color: colors.light,
    fontSize: fontSizes.xs,
    marginBottom: spacing.xl,
  },
});
