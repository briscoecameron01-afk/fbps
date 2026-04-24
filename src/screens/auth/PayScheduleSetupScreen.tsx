import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors, spacing, fontSizes, fontWeights, borderRadius, screenPadding } from '../../theme';

interface PayScheduleSetupScreenProps {
  navigation: any;
}

type PaySchedule = 'daily' | 'weekly' | 'biweekly' | 'monthly' | null;

const scheduleOptions = [
  { id: 'daily', label: 'Daily', icon: '📅' },
  { id: 'weekly', label: 'Weekly', icon: '📆' },
  { id: 'biweekly', label: 'Biweekly', icon: '📊' },
  { id: 'monthly', label: 'Monthly', icon: '📈' },
];

export function PayScheduleSetupScreen({ navigation }: PayScheduleSetupScreenProps) {
  const [selectedSchedule, setSelectedSchedule] = useState<PaySchedule>(null);
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!selectedSchedule) {
      Alert.alert('Error', 'Please select a pay schedule');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('InitialBillSetup', { paySchedule: selectedSchedule });
    }, 1000);
  };

  const isSelected = (schedule: string) => selectedSchedule === schedule;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Pay Schedule Setup</Text>
          <Text style={styles.subtitle}>Select how often you receive income...</Text>
        </View>

        {/* Schedule Options */}
        <View style={styles.optionsContainer}>
          {scheduleOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.optionCard,
                isSelected(option.id) && styles.optionCardSelected,
              ]}
              onPress={() => setSelectedSchedule(option.id as PaySchedule)}
              activeOpacity={0.8}
            >
              <Text style={styles.optionIcon}>{option.icon}</Text>
              <Text style={[
                styles.optionLabel,
                isSelected(option.id) && styles.optionLabelSelected,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading || !selectedSchedule}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Processing...' : 'Continue'}
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
  titleSection: {
    marginBottom: spacing['3xl'],
    marginTop: spacing.xl,
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
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.lg,
    marginBottom: spacing['3xl'],
  },
  optionCard: {
    width: '48%',
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing['2xl'],
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(0, 217, 152, 0.05)',
  },
  optionIcon: {
    fontSize: fontSizes['3xl'],
    marginBottom: spacing.md,
  },
  optionLabel: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textSecondary,
  },
  optionLabelSelected: {
    color: colors.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
});
