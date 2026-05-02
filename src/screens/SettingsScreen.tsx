import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';

interface Props {
  navigation: any;
}

export function SettingsScreen({ navigation }: Props) {
  const { userName, userProfile, signOut } = useStore();
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username;
  const profileInitial = displayName.trim()[0]?.toUpperCase() || 'U';

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'User', label: 'Edit Profile', action: 'navigate', screen: 'EditProfile' },
        { icon: 'Bank', label: 'Linked Accounts', action: 'navigate' },
        { icon: 'Card', label: 'Payment Methods', action: 'navigate' },
        { icon: 'Star', label: 'Upgrade to Premium', action: 'navigate', accent: true },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'Bell', label: 'Notifications', action: 'toggle', value: true },
        { icon: 'Moon', label: 'Dark Mode', action: 'toggle', value: false },
        { icon: 'Report', label: 'Weekly Report', action: 'toggle', value: true },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'Help', label: 'Help Center', action: 'navigate' },
        { icon: 'Chat', label: 'Contact Support', action: 'navigate' },
        { icon: 'Terms', label: 'Terms of Service', action: 'navigate' },
        { icon: 'Lock', label: 'Privacy Policy', action: 'navigate' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profileInitial}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{userProfile.email}</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>Free</Text>
          </View>
        </View>

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
                  onPress={() => 'screen' in item && item.screen && navigation.navigate(item.screen)}
                >
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingIcon}>{item.icon}</Text>
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
                    <Text style={styles.chevron}>{'>'}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
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
  settingIcon: {
    width: 44,
    color: colors.mid,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  settingLabel: {
    fontSize: fontSizes.md,
    color: colors.dark,
  },
  chevron: {
    fontSize: 18,
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
