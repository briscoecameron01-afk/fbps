import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius, screenPadding } from '../../theme';
import {
  clearPasswordRecoverySession,
  getSession,
  updatePassword,
} from '../../services/auth';

interface SetNewPasswordScreenProps {
  navigation: any;
}

export function SetNewPasswordScreen({ navigation }: SetNewPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [sessionError, setSessionError] = useState('');

  useEffect(() => {
    const checkRecoverySession = async () => {
      const result = await getSession();
      if (result.error || !result.session?.user) {
        setSessionError('This password reset link is invalid or has expired. Please request a new reset link.');
      }
      setCheckingSession(false);
    };

    checkRecoverySession();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      const result = await updatePassword({ password });
      if (result.error) {
        setLoading(false);
        Alert.alert('Error', result.error);
        return;
      }

      await clearPasswordRecoverySession();
      if (typeof window !== 'undefined' && window.history?.replaceState) {
        window.history.replaceState({}, '', '/');
      }

      setLoading(false);
      Alert.alert('Success', 'Password updated successfully. Please log in with your new password.', [
        {
          text: 'OK',
          onPress: () => navigation.reset?.({
            index: 0,
            routes: [{ name: 'Login' }],
          }) || navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  if (checkingSession) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerState}>
          <Text style={styles.subtitle}>Checking reset link...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (sessionError) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centerState}>
          <Text style={styles.title}>Reset Link Expired</Text>
          <Text style={styles.subtitle}>{sessionError}</Text>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => {
              if (typeof window !== 'undefined' && window.history?.replaceState) {
                window.history.replaceState({}, '', '/');
              }
              navigation.navigate('ForgotPassword');
            }}
          >
            <Text style={styles.updateButtonText}>Request New Link</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => {
              if (typeof window !== 'undefined' && window.history?.replaceState) {
                window.history.replaceState({}, '', '/');
              }
              navigation.navigate('Login');
            }}
          >
            <Text style={styles.secondaryButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backButtonText}>{'<'}</Text>
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Set New Password</Text>
          <Text style={styles.subtitle}>Enter your new password below</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Enter your new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Text style={styles.eyeButtonText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Confirm your new password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text style={styles.eyeButtonText}>
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <Text style={styles.requirement}>
              {password.length >= 8 ? '✓' : '○'} At least 8 characters
            </Text>
          </View>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={[styles.updateButton, loading && styles.updateButtonDisabled]}
          onPress={handleUpdatePassword}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.updateButtonText}>
            {loading ? 'Updating...' : 'Update Password'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: screenPadding.vertical,
  },
  centerState: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: screenPadding.horizontal,
    gap: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  backButtonText: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  titleSection: {
    marginBottom: spacing['2xl'],
  },
  title: {
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
  },
  formContainer: {
    marginBottom: spacing['2xl'],
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: spacing.lg,
  },
  eyeButtonText: {
    fontSize: fontSizes.lg,
  },
  requirementsContainer: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginTop: spacing.lg,
  },
  requirementsTitle: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  requirement: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  updateButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonDisabled: {
    opacity: 0.6,
  },
  updateButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
});
