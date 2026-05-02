import React, { useState } from 'react';
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
import { useStore } from '../../hooks/useStore';

interface InitialBillSetupScreenProps {
  navigation: any;
  route: any;
}

type BillType = 'recurring' | 'one-time' | null;

const billCategories = [
  'Electricity',
  'Water',
  'Internet',
  'Phone',
  'Insurance',
  'Rent',
  'Mortgage',
  'Gas',
  'Streaming',
  'Credit Card',
  'Loan',
  'Subscription',
  'Healthcare',
  'Childcare',
  'Education',
  'Other',
];

export function InitialBillSetupScreen({ navigation, route }: InitialBillSetupScreenProps) {
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [dueDate, setDueDate] = useState('');
  const [category, setCategory] = useState('');
  const [billType, setBillType] = useState<BillType>(null);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const { completeOnboarding } = useStore();

  const currencyOptions = ['AED', 'USD', 'EUR', 'GBP'];
  const dateOptions = Array.from({ length: 31 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index + 1);
    return {
      label: date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      value: date.toISOString().split('T')[0],
    };
  });

  const handleContinue = async () => {
    if (!billName || !amount || !dueDate || !category || !billType) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement bill setup logic
      setTimeout(() => {
        setLoading(false);
        completeOnboarding();
      }, 1500);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to setup bill. Please try again.');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled
      >
        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Initial Bill Setup</Text>
          <Text style={styles.subtitle}>Add your first bill...</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* Bill Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bill Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Electricity Bill"
              placeholderTextColor={colors.textMuted}
              value={billName}
              onChangeText={setBillName}
              editable={!loading}
            />
          </View>

          {/* Amount */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountInputContainer}>
              <TouchableOpacity
                style={styles.currencySelector}
                onPress={() => {
                  setShowCurrencyDropdown(!showCurrencyDropdown);
                  setShowDateDropdown(false);
                  setShowCategoryDropdown(false);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.currencySymbol}>{currency}</Text>
                <Text style={styles.currencyChevron}>▼</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.textMuted}
                keyboardType="decimal-pad"
                value={amount}
                onChangeText={setAmount}
                editable={!loading}
              />
            </View>
            {showCurrencyDropdown && (
              <View style={styles.dropdownMenu}>
                {currencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownMenuItem}
                    onPress={() => {
                      setCurrency(option);
                      setShowCurrencyDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownMenuItemText}>{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Due Date */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => {
                setShowDateDropdown(!showDateDropdown);
                setShowCurrencyDropdown(false);
                setShowCategoryDropdown(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.dateInput, !dueDate && styles.dateInputPlaceholder]}>
                {dateOptions.find((date) => date.value === dueDate)?.label || 'Select date'}
              </Text>
              <Text style={styles.calendarIcon}>📅</Text>
            </TouchableOpacity>
            {showDateDropdown && (
              <View style={styles.dropdownMenu}>
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {dateOptions.map((date) => (
                    <TouchableOpacity
                      key={date.value}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setDueDate(date.value);
                        setShowDateDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownMenuItemText}>{date.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Category */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Category</Text>
            <TouchableOpacity
              style={styles.dropdownContainer}
              onPress={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowCurrencyDropdown(false);
                setShowDateDropdown(false);
              }}
              activeOpacity={0.8}
            >
              <Text style={[
                styles.dropdownText,
                !category && styles.dropdownTextPlaceholder,
              ]}>
                {category || 'Select category'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </TouchableOpacity>
            {showCategoryDropdown && (
              <View style={styles.dropdownMenu}>
                <ScrollView
                  style={styles.dropdownScroll}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {billCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.dropdownMenuItem}
                      onPress={() => {
                        setCategory(cat);
                        setShowCategoryDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownMenuItemText}>{cat}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Bill Type */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Bill Type</Text>
            <View style={styles.billTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.billTypePill,
                  billType === 'recurring' && styles.billTypePillSelected,
                ]}
                onPress={() => setBillType('recurring')}
              >
                <Text style={[
                  styles.billTypeText,
                  billType === 'recurring' && styles.billTypeTextSelected,
                ]}>
                  Recurring
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.billTypePill,
                  billType === 'one-time' && styles.billTypePillSelected,
                ]}
                onPress={() => setBillType('one-time')}
              >
                <Text style={[
                  styles.billTypeText,
                  billType === 'one-time' && styles.billTypeTextSelected,
                ]}>
                  One Time
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[styles.continueButton, loading && styles.continueButtonDisabled]}
          onPress={handleContinue}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>
            {loading ? 'Setting Up...' : 'Continue'}
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
    marginBottom: spacing['2xl'],
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
  input: {
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  currencySelector: {
    minWidth: 88,
    minHeight: 48,
    paddingHorizontal: spacing.lg,
    borderRightWidth: 1,
    borderRightColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  currencySymbol: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
  },
  currencyChevron: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  },
  amountInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  dateInput: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dateInputPlaceholder: {
    color: colors.textMuted,
  },
  calendarIcon: {
    paddingHorizontal: spacing.lg,
    fontSize: fontSizes.lg,
  },
  dropdownContainer: {
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dropdownTextPlaceholder: {
    color: colors.textMuted,
  },
  chevron: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  dropdownMenu: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    maxHeight: 200,
    overflow: 'hidden',
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownMenuItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownMenuItemText: {
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  billTypeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  billTypePill: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundCard,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
  },
  billTypePillSelected: {
    backgroundColor: 'rgba(0, 217, 152, 0.15)',
    borderColor: colors.primary,
  },
  billTypeText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold as any,
    color: colors.textSecondary,
  },
  billTypeTextSelected: {
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
