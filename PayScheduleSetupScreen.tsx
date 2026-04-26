import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

type PayCadence = 'daily' | 'weekly' | 'biweekly' | 'monthly';

interface CadenceOption {
  id: PayCadence;
  label: string;
  description: string;
}

const cadenceOptions: CadenceOption[] = [
  { id: 'daily', label: 'Daily', description: 'Get paid every day' },
  { id: 'weekly', label: 'Weekly', description: 'Get paid every week' },
  { id: 'biweekly', label: 'Biweekly', description: 'Get paid every 2 weeks' },
  { id: 'monthly', label: 'Monthly', description: 'Get paid every month' },
];

export function PayScheduleSetupScreen({ navigation }: { navigation: any }) {
  const [selectedCadence, setSelectedCadence] = useState<PayCadence | null>(null);

  const handleContinue = () => {
    if (selectedCadence) {
      // TODO: Save selected cadence
      navigation.navigate('InitialBillSetup');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.header}>Let's set up your pay schedule</Text>
          <Text style={styles.subtitle}>
            How often do you receive income?
          </Text>
        </View>

        {/* Cadence Cards */}
        <View style={styles.cardsContainer}>
          {cadenceOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.cadenceCard,
                selectedCadence === option.id && styles.cadenceCardSelected,
              ]}
              onPress={() => setSelectedCadence(option.id)}
            >
              <Text style={styles.cadenceLabel}>{option.label}</Text>
              <Text style={styles.cadenceDescription}>{option.description}</Text>
              {selectedCadence === option.id && (
                <View style={styles.checkIcon}>
                  <Text style={styles.checkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedCadence && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedCadence}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>

        {/* Skip Link */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Main')}
          style={styles.skipContainer}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  headerContainer: {
    marginBottom: spacing.xl,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardsContainer: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  cadenceCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cadenceCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.bgCard,
  },
  cadenceLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    flex: 1,
  },
  cadenceDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  checkIcon: {
    width: 28,
    height: 28,
    backgroundColor: colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.md,
  },
  checkText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  continueButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.textMuted,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.bg,
  },
  skipContainer: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  skipText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
});
