import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

interface Props {
  navigation: any;
}

type SettingItem =
  | {
      icon: React.ComponentProps<typeof Feather>['name'];
      label: string;
      action: 'navigate';
      screen: string;
      accent?: boolean;
    }
  | {
      icon: React.ComponentProps<typeof Feather>['name'];
      label: string;
      action: 'toggle';
      setting: 'notifications' | 'darkMode' | 'weeklyReport';
    };

type SettingSection = {
  title: string;
  items: SettingItem[];
};

const STORAGE_KEY = 'fractional.settings';

const darkPalette = {
  background: colors.background,
  card: colors.backgroundCard,
  cardAlt: colors.backgroundCardLight,
  text: colors.textPrimary,
  secondary: colors.textSecondary,
  muted: colors.textMuted,
  border: colors.border,
  primary: colors.primary,
  danger: colors.error,
  switchThumb: colors.textPrimary,
};

const lightPalette = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  cardAlt: '#EEF3F8',
  text: '#0A1628',
  secondary: '#475569',
  muted: '#64748B',
  border: '#DDE6F0',
  primary: colors.primaryDark,
  danger: colors.error,
  switchThumb: '#FFFFFF',
};

const sections: SettingSection[] = [
  {
    title: 'Account',
    items: [
      { icon: 'user', label: 'Edit Profile', action: 'navigate', screen: 'EditProfile' },
      { icon: 'briefcase', label: 'Linked Accounts', action: 'navigate', screen: 'LinkedAccounts' },
      { icon: 'credit-card', label: 'Payment Methods', action: 'navigate', screen: 'PaymentMethods' },
      { icon: 'star', label: 'Upgrade to Premium', action: 'navigate', screen: 'PlansComparison', accent: true },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'bell', label: 'Notifications', action: 'toggle', setting: 'notifications' },
      { icon: 'moon', label: 'Dark Mode', action: 'toggle', setting: 'darkMode' },
      { icon: 'file-text', label: 'Weekly Report', action: 'toggle', setting: 'weeklyReport' },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle', label: 'Help Center', action: 'navigate', screen: 'EmployerProgram' },
      { icon: 'message-circle', label: 'Contact Support', action: 'navigate', screen: 'EmployerProgram' },
      { icon: 'file', label: 'Terms of Service', action: 'navigate', screen: 'EmployerProgram' },
      { icon: 'lock', label: 'Privacy Policy', action: 'navigate', screen: 'Security' },
    ],
  },
];

function readSavedSettings() {
  if (typeof window === 'undefined') {
    return { notifications: true, darkMode: true, weeklyReport: true };
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return { notifications: true, darkMode: true, weeklyReport: true };
    return {
      notifications: true,
      darkMode: true,
      weeklyReport: true,
      ...JSON.parse(saved),
    };
  } catch {
    return { notifications: true, darkMode: true, weeklyReport: true };
  }
}

export function SettingsScreen({ navigation }: Props) {
  const { userName, userProfile, signOut } = useStore();
  const [settings, setSettings] = React.useState(readSavedSettings);
  const palette = settings.darkMode ? darkPalette : lightPalette;
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username || 'User';
  const profileInitial = displayName.trim()[0]?.toUpperCase() || 'U';
  const planLabel = userProfile.plan === 'premium' ? 'Premium' : 'Free';

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const toggleSetting = (key: 'notifications' | 'darkMode' | 'weeklyReport') => {
    setSettings((current) => ({ ...current, [key]: !current[key] }));
  };

  const styles = React.useMemo(() => createStyles(palette), [palette]);

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
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{displayName}</Text>
            <Text style={styles.profileEmail}>{userProfile.email || 'No email saved'}</Text>
          </View>
          <View style={styles.freeBadge}>
            <Text style={styles.freeBadgeText}>{planLabel}</Text>
          </View>
        </View>

        {sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, index) => (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.settingRow,
                    index < section.items.length - 1 && styles.settingRowBorder,
                  ]}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (item.action === 'navigate') navigation.navigate(item.screen);
                  }}
                >
                  <View style={styles.settingLeft}>
                    <View style={[styles.iconBox, item.accent && styles.iconBoxAccent]}>
                      <Feather
                        name={item.icon}
                        size={18}
                        color={item.accent ? colors.background : palette.primary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.settingLabel,
                        item.accent && styles.settingLabelAccent,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {item.action === 'toggle' ? (
                    <Switch
                      value={settings[item.setting]}
                      onValueChange={() => toggleSetting(item.setting)}
                      trackColor={{ false: palette.border, true: palette.primary }}
                      thumbColor={palette.switchThumb}
                    />
                  ) : (
                    <Feather name="chevron-right" size={20} color={palette.muted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Feather name="log-out" size={18} color={palette.danger} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Fractional Bill Pay v1.0.0</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

function createStyles(palette: typeof darkPalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: palette.background,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingTop: 60,
      paddingBottom: spacing.lg,
    },
    headerTitle: {
      fontWeight: fontWeights.bold as any,
      color: palette.text,
      fontSize: fontSizes.xl,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: palette.card,
      marginHorizontal: spacing.xl,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: palette.border,
      marginBottom: spacing.xl,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: palette.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: colors.background,
      fontWeight: fontWeights.bold as any,
      fontSize: fontSizes.xl,
    },
    profileText: {
      flex: 1,
    },
    profileName: {
      fontWeight: fontWeights.bold as any,
      fontSize: fontSizes.lg,
      color: palette.text,
    },
    profileEmail: {
      fontSize: fontSizes.xs,
      color: palette.secondary,
      marginTop: 2,
    },
    freeBadge: {
      backgroundColor: palette.cardAlt,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.full,
    },
    freeBadgeText: {
      fontSize: fontSizes.xs,
      color: palette.secondary,
      fontWeight: fontWeights.semibold as any,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      fontSize: fontSizes.xs,
      color: palette.muted,
      fontWeight: fontWeights.semibold as any,
      textTransform: 'uppercase',
      letterSpacing: 1,
      paddingHorizontal: spacing.xl,
      marginBottom: spacing.sm,
    },
    sectionCard: {
      backgroundColor: palette.card,
      marginHorizontal: spacing.xl,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: palette.border,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.lg,
    },
    settingRowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: palette.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      flex: 1,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: borderRadius.md,
      backgroundColor: palette.cardAlt,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconBoxAccent: {
      backgroundColor: palette.primary,
    },
    settingLabel: {
      flex: 1,
      fontSize: fontSizes.md,
      color: palette.text,
    },
    settingLabelAccent: {
      color: palette.primary,
      fontWeight: fontWeights.semibold as any,
    },
    signOutBtn: {
      marginHorizontal: spacing.xl,
      padding: spacing.lg,
      backgroundColor: palette.card,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: palette.border,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    signOutText: {
      color: palette.danger,
      fontWeight: fontWeights.semibold as any,
      fontSize: fontSizes.md,
    },
    version: {
      textAlign: 'center',
      color: palette.muted,
      fontSize: fontSizes.xs,
      marginBottom: spacing.xl,
    },
  });
}
