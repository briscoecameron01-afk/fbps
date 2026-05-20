import React, { useEffect, useMemo, useState } from 'react';
import { Alert, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { formatCurrency } from '../utils/calculations';
import { useStore } from '../hooks/useStore';
import { getLinkedAccounts, LinkedAccount } from '../services/plaid';
import { createUnitTransfer } from '../services/unit';

export function ManualContributionScreen({ navigation }: any) {
  const { bills, buckets, syncFromSupabase } = useStore();
  const activeBills = bills.filter((bill) => bill.isActive);
  const [selectedBillId, setSelectedBillId] = useState(activeBills[0]?.id || '');
  const [amount, setAmount] = useState('');
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [showBillDropdown, setShowBillDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

    if (!authorized) {
      Alert.alert('Authorization required', 'Confirm the ACH authorization before starting the transfer.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await createUnitTransfer({
        linkedAccountId: selectedAccount.id,
        amount: parsedAmount,
        direction: 'to_unit',
        billId: selectedBill.id,
        description: 'Funding',
      });

      await syncFromSupabase();
      Alert.alert(
        'Contribution Started',
        `Unit created the ACH transfer. Status: ${result.status || 'Pending'}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Please try again.';
      if (
        message.includes('UNIT_API_TOKEN') ||
        message.includes('Unit customer id') ||
        message.includes('Unit deposit account id')
      ) {
        Alert.alert(
          'Open Unit Banking',
          'This app is configured for Unit Ready-to-Launch. Move money in the embedded Unit banking hub, then return to track your bill funding.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Banking Hub', onPress: () => navigation.navigate('ReadyToLaunchBanking') },
          ]
        );
      } else {
        Alert.alert('Contribution failed', message);
      }
    } finally {
      setSubmitting(false);
    }
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
                <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('LinkBank', { autoStart: true })}>
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

        <TouchableOpacity
          style={styles.authorizationRow}
          activeOpacity={0.8}
          onPress={() => setAuthorized((current) => !current)}
        >
          <View style={[styles.checkbox, authorized && styles.checkboxActive]}>
            <Text style={styles.checkboxText}>{authorized ? 'x' : ''}</Text>
          </View>
          <Text style={styles.authorizationText}>
            I authorize this ACH debit from the selected bank account into my Unit account for this bill contribution.
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]} onPress={handleConfirm} disabled={submitting}>
          <Text style={styles.confirmButtonText}>{submitting ? 'Starting...' : 'Start Contribution'}</Text>
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
  authorizationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginTop: spacing.lg },
  checkbox: { width: 22, height: 22, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxText: { color: colors.background, fontSize: fontSizes.sm, fontWeight: fontWeights.bold },
  authorizationText: { flex: 1, fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: 20 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  confirmButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
