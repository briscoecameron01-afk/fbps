import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const BILLS = ['Electricity', 'Internet', 'Rent', 'Insurance'];
const FUNDING_SOURCES = ['Bank Account', 'Credit Card', 'Debit Card'];

export function ManualContributionScreen({ navigation }: any) {
  const [selectedBill, setSelectedBill] = useState('Electricity');
  const [amount, setAmount] = useState('');
  const [fundingSource, setFundingSource] = useState('Bank Account');
  const [showBillDropdown, setShowBillDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const handleIncrement = () => {
    const newAmount = (parseFloat(amount) || 0) + 1;
    setAmount(newAmount.toString());
  };

  const handleDecrement = () => {
    const newAmount = Math.max(0, (parseFloat(amount) || 0) - 1);
    setAmount(newAmount.toString());
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Contribution</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Select Bill</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowBillDropdown(!showBillDropdown)}>
            <Text style={styles.dropdownText}>{selectedBill}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {showBillDropdown && (
            <View style={styles.dropdownMenu}>
              {BILLS.map(bill => (
                <TouchableOpacity key={bill} style={styles.menuItem} onPress={() => { setSelectedBill(bill); setShowBillDropdown(false); }}>
                  <Text style={[styles.menuItemText, bill === selectedBill && styles.menuItemTextActive]}>{bill}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Contribution Amount</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperButton} onPress={handleDecrement}>
              <Text style={styles.stepperButtonText}>−</Text>
            </TouchableOpacity>
            <TextInput style={styles.amountInput} placeholder="$0.00" placeholderTextColor={colors.textMuted} value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />
            <TouchableOpacity style={styles.stepperButton} onPress={handleIncrement}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Funding Source</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowSourceDropdown(!showSourceDropdown)}>
            <Text style={styles.dropdownText}>{fundingSource}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {showSourceDropdown && (
            <View style={styles.dropdownMenu}>
              {FUNDING_SOURCES.map(source => (
                <TouchableOpacity key={source} style={styles.menuItem} onPress={() => { setFundingSource(source); setShowSourceDropdown(false); }}>
                  <Text style={[styles.menuItemText, source === fundingSource && styles.menuItemTextActive]}>{source}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Review</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Bill:</Text>
            <Text style={styles.reviewValue}>{selectedBill}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Amount:</Text>
            <Text style={styles.reviewValue}>${parseFloat(amount || '0').toFixed(2)}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Funding Source:</Text>
            <Text style={styles.reviewValue}>{fundingSource}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={() => navigation.goBack()}>
          <Text style={styles.confirmButtonText}>Confirm Contribution</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  dropdown: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  dropdownText: { fontSize: fontSizes.base, color: colors.textPrimary },
  chevron: { color: colors.textSecondary, fontSize: fontSizes.sm },
  dropdownMenu: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuItemText: { fontSize: fontSizes.base, color: colors.textSecondary },
  menuItemTextActive: { color: colors.primary, fontWeight: fontWeights.semibold },
  stepperContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm },
  stepperButton: { paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  stepperButtonText: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.primary },
  amountInput: { flex: 1, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary, textAlign: 'center' },
  reviewSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xl },
  reviewTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.md },
  reviewItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  reviewLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  reviewValue: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  confirmButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  confirmButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
