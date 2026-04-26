import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function SecurityScreen({ navigation }: Props) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const activeSessions = [
    {
      id: '1',
      device: 'iPhone 14 Pro',
      browser: 'Safari',
      location: 'New York, NY',
      lastActive: 'Today',
      isCurrent: true,
    },
    {
      id: '2',
      device: 'MacBook Pro',
      browser: 'Chrome',
      location: 'New York, NY',
      lastActive: '2 days ago',
      isCurrent: false,
    },
  ];

  const toggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
  };

  const toggleBiometric = () => {
    setBiometricEnabled(!biometricEnabled);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Password Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Change Password</Text>

          {!showChangePassword ? (
            <TouchableOpacity
              style={styles.changePasswordButton}
              onPress={() => setShowChangePassword(true)}
            >
              <Text style={styles.changePasswordButtonText}>
                Update Password
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.passwordForm}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Current Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter current password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirm new password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save Password</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Two-Factor Authentication */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
              <Text style={styles.sectionDescription}>
                Add an extra layer of security
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                twoFactorEnabled && styles.toggleEnabled,
              ]}
              onPress={toggleTwoFactor}
            >
              <View
                style={[
                  styles.toggleCircle,
                  twoFactorEnabled && styles.toggleCircleEnabled,
                ]}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.toggleDescription}>
            {twoFactorEnabled
              ? 'Your account is protected with 2FA'
              : 'Enable 2FA to protect your account'}
          </Text>
        </View>

        {/* Biometric Login */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Biometric Login</Text>
              <Text style={styles.sectionDescription}>
                Face ID / Fingerprint
              </Text>
            </View>
            <TouchableOpacity
              style={[
                styles.toggle,
                biometricEnabled && styles.toggleEnabled,
              ]}
              onPress={toggleBiometric}
            >
              <View
                style={[
                  styles.toggleCircle,
                  biometricEnabled && styles.toggleCircleEnabled,
                ]}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.toggleDescription}>
            {biometricEnabled
              ? 'Biometric login is enabled'
              : 'Enable biometric login for quick access'}
          </Text>
        </View>

        {/* Active Sessions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          <Text style={styles.sectionDescription}>
            Manage your logged-in devices
          </Text>

          {activeSessions.map((session) => (
            <View key={session.id} style={styles.sessionCard}>
              <View style={styles.sessionInfo}>
                <Text style={styles.sessionDevice}>{session.device}</Text>
                <Text style={styles.sessionBrowser}>{session.browser}</Text>
                <Text style={styles.sessionLocation}>{session.location}</Text>
                <Text style={styles.sessionLastActive}>
                  Last active: {session.lastActive}
                </Text>
              </View>
              {session.isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              )}
              {!session.isCurrent && (
                <TouchableOpacity style={styles.logoutButton}>
                  <Text style={styles.logoutButtonText}>Logout</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
          <Text style={styles.deleteDescription}>
            Permanently delete your account and all associated data. This action cannot be undone.
          </Text>
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
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dangerSection: {
    marginBottom: spacing.xl,
    backgroundColor: colors.error + '10',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.error + '30',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
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
  toggleDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  changePasswordButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  changePasswordButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  passwordForm: {
    gap: spacing.lg,
  },
  formGroup: {
    gap: spacing.sm,
  },
  label: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  sessionCard: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sessionInfo: {
    flex: 1,
  },
  sessionDevice: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  sessionBrowser: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  sessionLocation: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  sessionLastActive: {
    color: colors.textMuted,
    fontSize: fontSizes.xs,
  },
  currentBadge: {
    backgroundColor: colors.primary + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  currentBadgeText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  logoutButtonText: {
    color: colors.error,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  deleteButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  deleteDescription: {
    color: colors.error,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
});
