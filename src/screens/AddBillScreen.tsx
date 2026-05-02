import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '@/theme';
import { useStore } from '@/hooks/useStore';
import { BillCategory, CATEGORY_ICONS, CATEGORY_LABELS } from '@/types/bill';

interface Props {
  navigation: any;
}

const CATEGORIES: BillCategory[] = [
  'housing', 'transport', 'utilities', 'insurance', 'subscriptions', 'loans', 'other',
];

export function AddBillScreen({ navigation }: Props) {
  const { addBill } = useStore();
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [billType, setBillType] = useState<'recurring' | 'one-time'>('recurring');
  const [category, setCategory] = useState<BillCategory>('utilities');
  const [showCategories, setShowCategories] = useState(false);

  const handleSubmit = () => {
    if (!name || !amount || !dueDay) {
      Alert.alert('Missing info', 'Please fill in all fields.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(dueDay, 10);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Please enter a valid dollar amount.');
      return;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      Alert.alert('Invalid day', 'Please enter a day between 1 and 31.');
      return;
    }

    addBill({
      name,
      amount: parsedAmount,
      dueDay: parsedDay,
      category,
      icon: CATEGORY_ICONS[category],
      isActive: true,
      autoPay: true,
      cadence: 'daily',
    });

    navigation.navigate('FundingPreference', {
      billName: name,
      billAmount: parsedAmount,
      billDueDay: parsedDay,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Bill</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Bill Name */}
        <View style={styles.field}>
          <Text style={styles.label}>Bill Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Electric Bill"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            editable
          />
        </View>

        {/* Amount */}
        <View style={styles.field}>
          <Text style={styles.label}>Monthly Amount</Text>
          <View style={styles.currencyInput}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Due Date */}
        <View style={styles.field}>
          <Text style={styles.label}>Due Day of Month</Text>
          <View style={styles.dueDateContainer}>
            <TextInput
              style={styles.dueDateInput}
              placeholder="1-31"
              placeholderTextColor={colors.textMuted}
              value={dueDay}
              onChangeText={setDueDay}
              keyboardType="number-pad"
            />
            <Text style={styles.calendarIcon}>📅</Text>
          </View>
        </View>

        {/* Category Dropdown */}
        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowCategories(!showCategories)}
          >
            <Text style={styles.dropdownText}>
              {CATEGORY_ICONS[category]} {CATEGORY_LABELS[category]}
            </Text>
            <Text style={styles.dropdownChevron}>▼</Text>
          </TouchableOpacity>

          {showCategories && (
            <View style={styles.categoryList}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.categoryOption,
                    category === cat && styles.categoryOptionActive,
                  ]}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategories(false);
                  }}
                >
                  <Text style={styles.categoryOptionText}>
                    {CATEGORY_ICONS[cat]} {CATEGORY_LABELS[cat]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Bill Type Toggle */}
        <View style={styles.field}>
          <Text style={styles.label}>Bill Type</Text>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[
                styles.togglePill,
                billType === 'recurring' && styles.togglePillActive,
              ]}
              onPress={() => setBillType('recurring')}
            >
              <Text
                style={[
                  styles.toggleText,
                  billType === 'recurring' && styles.toggleTextActive,
                ]}
              >
                Recurring
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.togglePill,
                billType === 'one-time' && styles.togglePillActive,
              ]}
              onPress={() => setBillType('one-time')}
            >
              <Text
                style={[
                  styles.toggleText,
                  billType === 'one-time' && styles.toggleTextActive,
                ]}
              >
                One Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
            <Text style={styles.primaryButtonText}>Next</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.outlineButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
  backBtn: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  field: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundInput,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundInput,
  },
  currencySymbol: {
    paddingLeft: spacing.lg,
    color: colors.textSecondary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundInput,
    paddingHorizontal: spacing.lg,
  },
  dueDateInput: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  calendarIcon: {
    fontSize: fontSizes.lg,
    marginLeft: spacing.md,
  },
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundInput,
  },
  dropdownText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  dropdownChevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  categoryList: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    backgroundColor: colors.backgroundCard,
    overflow: 'hidden',
  },
  categoryOption: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  categoryOptionActive: {
    backgroundColor: colors.backgroundCardLight,
  },
  categoryOptionText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  togglePill: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  togglePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.background,
  },
  buttonContainer: {
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
