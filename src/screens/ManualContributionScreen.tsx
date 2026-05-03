import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { formatCurrency } from '../utils/calculations';
import { useStore } from '../hooks/useStore';
import { getLinkedAccounts, LinkedAccount } from '../services/plaid';

export function ManualContributionScreen({ navigation }: any) {
  const { bills, buckets, makeManualContributionAsync, syncFromSupabase, isLoading } = useStore();
  const activeBills = bills.filter((bill) => bill.isActive);
  const [selectedBillId, setSelectedBillId] = useState(activeBills[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [showBillDropdown, setShowBillDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  useEffect(() => {
    if (!selectedBillId && activeBills[0]?.id) {
      setSelectedBillId(activeBills[0].id);
    }
  }, [activeBills, selectedBillId]);

  useEffect(() => {
    const loadAccounts = async () => {
      const linkedAccounts = await getLinkedAccounts();
      setAccounts(linkedAccounts);
      setSelectedAccountId((current) => current || linkedAccounts[0]?.id || '');
    };

    loadAccounts();
  }, []);

  const selectedBill = activeBills.find((bill) => bill.id === selectedBillId);
  const selectedBucket = buckets.find((bucket) => bucket.billId === selectedBillId);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const remainingAmount = selectedBucket
    ? Math.max(selectedBucket.targetAmount - selectedBucket.currentAmount, 0)
    : selectedBill?.amount || 0;
  const parsedAmount = parseFloat(amount || '0');

  const accountLabel = (account: LinkedAccount) => {
    const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
    return `${account.institution_name} - ${account.account_name}${mask}`;
  };

  const billLabel = useMemo(() => {
    if (!selectedBill) return 'Select a bill';
    return `${selectedBill.name} (${formatCurrency(remainingAmount)} remaining)`;
  }, [selectedBill, remainingAmount]);

  const handleIncrement = () => {
    const newAmount = (parseFloat(amount) || 0) + 1;
    setAmount(newAmount.toString());
  };

  const handleDecrement = () => {
    const newAmount = Math.max(0, (parseFloat(amount) || 0) - 1);
    setAmount(newAmount.toString());
  };

  const handleConfirm = async () => {
    if (!selectedBill) {
      Alert.alert('Select a bill', 'Add a bill before making a contribution.');
      return;
    }

    if (!selectedAccount) {
      Alert.alert('Select a bank account', 'Connect a bank account before making a contribution.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter a contribution amount greater than $0.');
      return;
    }

    const result = await makeManualContributionAsync(selectedBill.id, parsedAmount, accountLabel(selectedAccount));
    if (result.error) {
      Alert.alert('Contribution failed', result.error);
      return;
    }

    await syncFromSupabase();
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Contribution</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Select Bill</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowBillDropdown(!showBillDropdown)}>
            <Text style={styles.dropdownText}>{billLabel}</Text>
            <Text style={styles.chevron}>v</Text>
          </TouchableOpacity>
          {showBillDropdown && (
            <View style={styles.dropdownMenu}>
              {activeBills.length === 0 ? (
                <View style={styles.menuItem}>
                  <Text style={styles.menuItemText}>No bills added yet</Text>
                </View>
              ) : activeBills.map((bill) => {
                const bucket = buckets.find((item) => item.billId === bill.id);
                const remaining = bucket ? Math.max(bucket.targetAmount - bucket.currentAmount, 0) : bill.amount;
                return (
                  <TouchableOpacity
                    key={bill.id}
                    style={styles.menuItem}
                    onPress={() => {
                      setSelectedBillId(bill.id);
                      setShowBillDropdown(false);
                    }}
                  >
                    <Text style={[styles.menuItemText, bill.id === selectedBillId && styles.menuItemTextActive]}>
                      {bill.name} - {formatCurrency(remaining)} remaining
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Contribution Amount</Text>
          <View style={styles.stepperContainer}>
            <TouchableOpacity style={styles.stepperButton} onPress={handleDecrement}>
              <Text style={styles.stepperButtonText}>-</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.amountInput}
              placeholder="$0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
            <TouchableOpacity style={styles.stepperButton} onPress={handleIncrement}>
              <Text style={styles.stepperButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Funding Source</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowSourceDropdown(!showSourceDropdown)}>
            <Text style={styles.dropdownText}>
              {selectedAccount ? accountLabel(selectedAccount) : 'Select connected bank account'}
            </Text>
            <Text style={styles.chevron}>v</Text>
          </TouchableOpacity>
          {showSourceDropdown && (
            <View style={styles.dropdownMenu}>
              {accounts.length === 0 ? (
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LinkBank')}>
                  <Text style={styles.menuItemTextActive}>Link a bank account</Text>
                </TouchableOpacity>
              ) : accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.menuItem}
                  onPress={() => {
                    setSelectedAccountId(account.id);
                    setShowSourceDropdown(false);
                  }}
                >
                  <Text style={[styles.menuItemText, account.id === selectedAccountId && styles.menuItemTextActive]}>
                    {accountLabel(account)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.reviewSection}>
          <Text style={styles.reviewTitle}>Review</Text>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Bill:</Text>
            <Text style={styles.reviewValue}>{selectedBill?.name || 'None selected'}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Amount:</Text>
            <Text style={styles.reviewValue}>{formatCurrency(parsedAmount || 0)}</Text>
          </View>
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Funding Source:</Text>
            <Text style={styles.reviewValue}>{selectedAccount ? accountLabel(selectedAccount) : 'None selected'}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]} onPress={handleConfirm} disabled={isLoading}>
          <Text style={styles.confirmButtonText}>{isLoading ? 'Saving...' : 'Confirm Contribution'}</Text>
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
  dropdown: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  dropdownText: { fontSize: fontSizes.base, color: colors.textPrimary, flex: 1 },
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
  reviewItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, gap: spacing.md },
  reviewLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  reviewValue: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, flex: 1, textAlign: 'right' },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  confirmButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
