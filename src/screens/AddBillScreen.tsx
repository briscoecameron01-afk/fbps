import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '@/theme';
import { useStore } from '@/hooks/useStore';
import { BillCategory, CATEGORY_ICONS, CATEGORY_LABELS } from '@/types/bill';

interface Props {
  navigation: any;
  route?: any;
}

const CATEGORIES: BillCategory[] = [
  'housing', 'car', 'transport', 'utilities', 'insurance', 'subscriptions', 'loans', 'other',
];
const DUE_DAYS = Array.from({ length: 31 }, (_, index) => String(index + 1));

export function AddBillScreen({ navigation, route }: Props) {
  const { bills, addBillAsync, updateBillAsync, syncFromSupabase } = useStore();
  const editBillId = route?.params?.billId as string | undefined;
  const editingBill = bills.find((bill) => bill.id === editBillId);
  const isEditing = !!editBillId;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDay, setDueDay] = useState('');
  const [billType, setBillType] = useState<'recurring' | 'one_time'>('recurring');
  const [category, setCategory] = useState<BillCategory>('utilities');
  const [showCategories, setShowCategories] = useState(false);
  const [showDueDays, setShowDueDays] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!editingBill) return;

    setName(editingBill.name);
    setDescription(editingBill.description || '');
    setAmount(String(editingBill.amount));
    setDueDay(String(editingBill.dueDay));
    setBillType(editingBill.billType || 'recurring');
    setCategory(editingBill.category);
  }, [editingBill]);

  const handleSubmit = async () => {
    if (isSaving) return;

    setSubmitError('');

    if (!name.trim() || !amount || !dueDay) {
      setSubmitError('Add a bill name, amount, and due day before saving.');
      return;
    }
    const parsedAmount = parseFloat(amount);
    const parsedDay = parseInt(dueDay, 10);

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setSubmitError('Enter a valid dollar amount greater than $0.');
      return;
    }
    if (isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) {
      setSubmitError('Select a due day between 1 and 31.');
      return;
    }

    setIsSaving(true);
    const payload = {
      name: name.trim(),
      description: description.trim() || undefined,
      amount: parsedAmount,
      dueDay: parsedDay,
      billType,
      category,
      icon: CATEGORY_ICONS[category],
      isActive: editingBill?.isActive ?? true,
      autoPay: editingBill?.autoPay ?? true,
      cadence: editingBill?.cadence || 'daily',
    };

    const result = isEditing && editBillId
      ? await updateBillAsync(editBillId, payload)
      : await addBillAsync(payload);

    if (result.error) {
      setSubmitError(result.error);
      setIsSaving(false);
      return;
    }

    await syncFromSupabase();
    setIsSaving(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Bill' : 'Add Bill'}</Text>
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

        {/* Description */}
        <View style={styles.field}>
          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Add a note about this bill"
            placeholderTextColor={colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
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
          <TouchableOpacity
            style={styles.dueDateContainer}
            onPress={() => setShowDueDays(!showDueDays)}
            activeOpacity={0.8}
          >
            <Text style={[styles.dueDateText, !dueDay && styles.dueDatePlaceholder]}>
              {dueDay ? `Day ${dueDay}` : 'Select day'}
            </Text>
            <Text style={styles.calendarIcon}>📅</Text>
          </TouchableOpacity>
          {showDueDays && (
            <View style={styles.dueDayGrid}>
              {DUE_DAYS.map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dueDayOption,
                    dueDay === day && styles.dueDayOptionActive,
                  ]}
                  onPress={() => {
                    setDueDay(day);
                    setShowDueDays(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dueDayOptionText,
                      dueDay === day && styles.dueDayOptionTextActive,
                    ]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
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
                billType === 'one_time' && styles.togglePillActive,
              ]}
              onPress={() => setBillType('one_time')}
            >
              <Text
                style={[
                  styles.toggleText,
                  billType === 'one_time' && styles.toggleTextActive,
                ]}
              >
                One Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!!submitError && (
            <Text style={styles.errorText}>{submitError}</Text>
          )}
          <TouchableOpacity
            style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
            onPress={handleSubmit}
            disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
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
  descriptionInput: {
    minHeight: 88,
    paddingTop: spacing.md,
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
  dueDateText: {
    flex: 1,
    paddingVertical: spacing.md,
    fontSize: fontSizes.md,
    color: colors.textPrimary,
  },
  dueDatePlaceholder: {
    color: colors.textMuted,
  },
  calendarIcon: {
    fontSize: fontSizes.lg,
    marginLeft: spacing.md,
  },
  dueDayGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundCard,
  },
  dueDayOption: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundInput,
  },
  dueDayOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dueDayOptionText: {
    color: colors.textPrimary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  dueDayOptionTextActive: {
    color: colors.background,
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
  errorText: {
    color: colors.error,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: {
    opacity: 0.65,
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
