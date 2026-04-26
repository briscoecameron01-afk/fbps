import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function SuccessModal({ navigation }: { navigation: any }) {
  const handleGetStarted = () => {
    // TODO: Navigate to main app
    navigation.navigate('Main');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <View style={styles.content}>
        {/* Success Checkmark */}
        <View style={styles.checkmarkCircle}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>All Set!</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Your account has been successfully created. You're ready to start managing your bills!
        </Text>

        {/* Get Started Button */}
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={handleGetStarted}
        >
          <Text style={styles.getStartedButtonText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    backgroundColor: colors.primary,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkmark: {
    fontSize: 64,
    color: colors.bg,
    fontWeight: '700',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    minWidth: 200,
    alignItems: 'center',
  },
  getStartedButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
});
