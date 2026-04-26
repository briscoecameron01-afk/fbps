import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

export function WelcomeScreen({ navigation }: { navigation: any }) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoSquare}>
            <Text style={styles.logoText}>F</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          <Text style={styles.tagline}>Turns chaos into clarity</Text>
          <Text style={styles.subtitle}>
            Pay bills in daily or weekly chunks instead of large lump sums
          </Text>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.outlineButtonText}>Create Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  logoSquare: {
    width: 80,
    height: 80,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.text,
  },
  contentSection: {
    marginTop: spacing.xl,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.bg,
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
