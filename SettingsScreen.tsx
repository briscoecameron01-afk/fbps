import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function SettingsScreen({ navigation }: Props) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  const currencies = ['USD', 'EUR', 'GBP', 'CAD'];
  const languages = ['English', 'Spanish', 'French', 'German'];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Display Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>

          {/* Theme Setting */}
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Theme</Text>
              <Text style={styles.settingDescription}>
                Dark theme is currently the only available option
              </Text>
            </View>
            <View
              style={[
                styles.themeBadge,
                { backgroundColor: colors.backgroundInput },
              ]}
            >
              <Text style={styles.themeBadgeText}>Dark</Text>
            </View>
          </View>
        </View>

        {/* Language & Region Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language & Region</Text>

          {/* Currency */}
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Currency</Text>
              <Text style={styles.settingDescription}>Default currency for amounts</Text>
            </View>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowCurrencyMenu(!showCurrencyMenu)}
            >
              <Text style={styles.selectorText}>{currency}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {showCurrencyMenu && (
            <View style={styles.menu}>
              {currencies.map((curr) => (
                <TouchableOpacity
                  key={curr}
                  style={[
                    styles.menuItem,
                    curr === currency && styles.menuItemSelected,
                  ]}
                  onPress={() => {
                    setCurrency(curr);
                    setShowCurrencyMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      curr === currency && styles.menuItemTextSelected,
                    ]}
                  >
                    {curr}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Language */}
          <View style={styles.settingCard}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Language</Text>
              <Text style={styles.settingDescription}>App language</Text>
            </View>
            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowLanguageMenu(!showLanguageMenu)}
            >
              <Text style={styles.selectorText}>{language}</Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
          </View>

          {showLanguageMenu && (
            <View style={styles.menu}>
              {languages.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.menuItem,
                    lang === language && styles.menuItemSelected,
                  ]}
                  onPress={() => {
                    setLanguage(lang);
                    setShowLanguageMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.menuItemText,
                      lang === language && styles.menuItemTextSelected,
                    ]}
                  >
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Data & Privacy Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data & Privacy</Text>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Export My Data</Text>
              <Text style={styles.actionDescription}>
                Download a copy of your data
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Clear Cache</Text>
              <Text style={styles.actionDescription}>
                Free up space by clearing app cache
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Privacy Policy</Text>
              <Text style={styles.actionDescription}>
                Read our privacy policy
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Terms of Service</Text>
              <Text style={styles.actionDescription}>
                Review our terms and conditions
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.aboutCard}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>App Version</Text>
              <Text style={styles.aboutValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.aboutCard}>
            <View style={styles.aboutItem}>
              <Text style={styles.aboutLabel}>Build Number</Text>
              <Text style={styles.aboutValue}>2401</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.rateButton}>
            <Text style={styles.rateButtonIcon}>⭐</Text>
            <Text style={styles.rateButtonText}>Rate the App</Text>
          </TouchableOpacity>
        </View>

        {/* Debug Section */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Contact Support</Text>
              <Text style={styles.actionDescription}>
                Get help from our support team
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionCard}>
            <View style={styles.actionCardContent}>
              <Text style={styles.actionLabel}>Send Feedback</Text>
              <Text style={styles.actionDescription}>
                Share your thoughts with us
              </Text>
            </View>
            <Text style={styles.actionChevron}>›</Text>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
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
  themeBadge: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  themeBadgeText: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  selectorText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  menu: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  menuItem: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  menuItemText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
  menuItemTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  actionCard: {
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
  actionCardContent: {
    flex: 1,
  },
  actionLabel: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  actionDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  actionChevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.xl,
  },
  aboutCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aboutItem: {
    flex: 1,
  },
  aboutLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  aboutValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  rateButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary + '15',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    gap: spacing.md,
  },
  rateButtonIcon: {
    fontSize: fontSizes.lg,
  },
  rateButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
