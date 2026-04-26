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
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius } from '../../theme';

type BillCategory = 
  | 'housing'
  | 'utilities'
  | 'transport'
  | 'insurance'
  | 'subscriptions'
  | 'loans'
  | 'phone'
  | 'internet'
  | 'other';

interface BillCategoryOption {
  id: BillCategory;
  label: string;
  icon: string;
}

const billCategories: BillCategoryOption[] = [
  { id: 'housing', label: 'Housing', icon: '🏠' },
  { id: 'utilities', label: 'Utilities', icon: '💡' },
  { id: 'transport', label: 'Transport', icon: '🚗' },
  { id: 'insurance', label: 'Insurance', icon: '🛡️' },
  { id: 'subscriptions', label: 'Subscriptions', icon: '📺' },
  { id: 'loans', label: 'Loans', icon: '💰' },
  { id: 'phone', label: 'Phone', icon: '📱' },
  { id: 'internet', label: 'Internet', icon: '🌐' },
  { id: 'other', label: 'Other', icon: '📌' },
];

export function InitialBillSetupScreen({ navigation }: { navigation: any }) {
  const [billName, setBillName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BillCategory | null>(null);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const handleAddBill = () => {
    if (billName && amount && dueDate && selectedCategory) {
      // TODO: Implement add bill logic
      navigation.navigate('Success');
    }
  };

  const handleSkip = () => {
    // TODO: Navigate to main app
    navigation.navigate('Main');
  };

  const categoryOption = billCategories.find((c) => c.id === selectedCategory);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.headerContainer}>
            <Text style={styles.header}>Add your first bill</Text>
            <Text style={styles.subtitle}>
              Let's get you started with your first bill
            </Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Bill Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Bill Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Rent, Electric Bill"
                placeholderTextColor={colors.textMuted}
                value={billName}
                onChangeText={setBillName}
              />
            </View>

            {/* Amount */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Amount ($)</Text>
              <View style={styles.currencyContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={styles.currencyInput}
                  placeholder="0.00"
                  placeholderTextColor={colors.textMuted}
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Due Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Due Date (Day of Month)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 15"
                placeholderTextColor={colors.textMuted}
                value={dueDate}
                onChangeText={setDueDate}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>

            {/* Category Picker */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <TouchableOpacity
                style={styles.categoryButton}
                onPress={() => setShowCategoryPicker(!showCategoryPicker)}
              >
                {categoryOption ? (
                  <View style={styles.selectedCategory}>
                    <Text style={styles.categoryIcon}>{categoryOption.icon}</Text>
                    <Text style={styles.categoryButtonText}>
                      {categoryOption.label}
                    </Text>
                  </View>
                ) : (
                  <Text style={styles.categoryPlaceholder}>Select a category</Text>
                )}
                <Text style={styles.categoryChevron}>
                  {showCategoryPicker ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>

              {/* Category Picker Dropdown */}
              {showCategoryPicker && (
                <View style={styles.categoryDropdown}>
                  <FlatList
                    data={billCategories}
                    keyExtractor={(item) => item.id}
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.categoryOption,
                          selectedCategory === item.id &&
                            styles.categoryOptionSelected,
                        ]}
                        onPress={() => {
                          setSelectedCategory(item.id);
                          setShowCategoryPicker(false);
                        }}
                      >
                        <Text style={styles.categoryOptionIcon}>{item.icon}</Text>
                        <Text style={styles.categoryOptionText}>{item.label}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Add Bill Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              !(billName && amount && dueDate && selectedCategory) &&
                styles.addButtonDisabled,
            ]}
            onPress={handleAddBill}
            disabled={!(billName && amount && dueDate && selectedCategory)}
          >
            <Text style={styles.addButtonText}>Add Bill</Text>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipContainer}
          >
            <Text style={styles.skipText}>Skip for now</Text>
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
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  currencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  currencySymbol: {
    paddingLeft: spacing.md,
    fontSize: 18,
    fontWeight: '600',
    color: colors.primary,
  },
  currencyInput: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.text,
    fontSize: 16,
  },
  categoryButton: {
    backgroundColor: colors.bgInput,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCategory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryButtonText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  categoryPlaceholder: {
    fontSize: 16,
    color: colors.textMuted,
  },
  categoryChevron: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  categoryDropdown: {
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.primary,
    borderTopWidth: 0,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  categoryOptionSelected: {
    backgroundColor: colors.bgLight,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md - 4,
  },
  categoryOptionIcon: {
    fontSize: 20,
  },
  categoryOptionText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButtonDisabled: {
    opacity: 0.5,
    backgroundColor: colors.textMuted,
  },
  addButtonText: {
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
