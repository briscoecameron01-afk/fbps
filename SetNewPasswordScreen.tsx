import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function SetNewPasswordScreen({ navigation }: { navigation: any }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (password: string) => {
    if (!password) return 'none';
    if (password.length < 8) return 'weak';
    if (password.length < 12) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength(newPassword);
  const strengthColor = {
    weak: colors.error,
    medium: '#FFA500',
    strong: colors.primary,
    none: colors.textMuted,
  }[strength];

  const handleUpdatePassword = () => {
    if (newPassword === confirmPassword && newPassword.length >= 8) {
      // TODO: Implement update password logic
      navigation.navigate('Success');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Set New Password</Text>
          </View>

          {/* Info Text */}
          <Text style={styles.infoText}>
            Create a strong password to secure your account.
          </Text>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Enter new password"
                  placeholderTextColor={colors.textMuted}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword(!showNewPassword)}
                  style={styles.eyeIcon}
                >
                  <Text style={styles.eyeText}>
                    {showNewPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Confirm your password"
                  placeholderTextColor={colors.textMuted}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Text style={styles.eyeText}>
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Strength Indicator */}
            {newPassword && (
              <View style={styles.strengthContainer}>
                <View style={styles.strengthBars}>
                  <View
                    style={[
                      styles.strengthBar,
                      { backgroundColor: strengthColor },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          strength === 'weak'
                            ? colors.border
                            : strengthColor,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          strength !== 'strong'
                            ? colors.border
                            : strengthColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.strengthText, { color: strengthColor }]}>
                  {strength.charAt(0).toUpperCase() + strength.slice(1)} password
                </Text>
              </View>
            )}
          </View>

          {/* Update Button */}
          <TouchableOpacity
            style={[
              styles.updateButton,
              !(newPassword === confirmPassword && newPassword.length >= 8) &&
                styles.updateButtonDisabled,
            ]}
            onPress={handleUpdatePassword}
            disabled={!(newPassword === confirmPassword && newPassword.length >= 8)}
          >
            <Text style={styles.updateButtonText}>Update Password</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    paddingVertical: spacing.md,
    marginBottom: spacing.md,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  headerContainer: {
    marginBottom: spacing.lg,
  },
  header: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
  },
  formContainer: {
    marginBottom: spacing.lg,
  },
  inputGroup: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  eyeIcon: {
    paddingHorizontal: spacing.md,
  },
  eyeText: {
    fontSize: 18,
  },
  strengthContainer: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.textMuted,
  },
  updateButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
});
