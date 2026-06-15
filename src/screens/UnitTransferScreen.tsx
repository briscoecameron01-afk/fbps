import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { formatCurrency } from '../utils/calculations';
import { getLinkedAccounts, LinkedAccount } from '../services/plaid';
import { createUnitTransfer, getUnitAccount, UnitAccount, UnitTransferDirection } from '../services/unit';

type Props = {
  navigation: any;
  route?: {
    params?: {
      linkedAccountId?: string;
      direction?: UnitTransferDirection;
    };
  };
};

function accountLabel(account: LinkedAccount) {
  const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
  return `${account.institution_name} - ${account.account_name}${mask}`;
}

export function UnitTransferScreen({ navigation, route }: Props) {
  const [direction, setDirection] = useState<UnitTransferDirection>(route?.params?.direction || 'to_unit');
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState(route?.params?.linkedAccountId || '');
  const [unitAccount, setUnitAccount] = useState<UnitAccount | null>(null);
  const [unitError, setUnitError] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setUnitError('');
      try {
        const linkedAccounts = await getLinkedAccounts();
        setAccounts(linkedAccounts);
        setSelectedAccountId((current) => current || linkedAccounts[0]?.id || '');
      } catch (error) {
        Alert.alert('Unable to load banks', error instanceof Error ? error.message : 'Please try again.');
      }

      try {
        setUnitAccount(await getUnitAccount());
      } catch (error) {
        setUnitError(error instanceof Error ? error.message : 'Unit is not configured yet.');
      }

      setLoading(false);
    };

    load();
  }, []);

  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const parsedAmount = Number(amount || 0);

  const directionCopy = useMemo(() => {
    if (direction === 'to_unit') {
      return {
        title: 'Add Money',
        subtitle: 'Pull money from your connected bank into your Unit account.',
        button: 'Start Transfer to Unit',
      };
    }

    return {
      title: 'Withdraw',
      subtitle: 'Push money from your Unit account back to your connected bank.',
      button: 'Start Withdrawal',
    };
  }, [direction]);

  const handleSubmit = async () => {
    if (!selectedAccount) {
      Alert.alert('Select a bank account', 'Connect or choose a bank account first.');
      return;
    }

    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Invalid amount', 'Enter an amount greater than $0.');
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
        direction,
        description,
      });

      Alert.alert(
        'Transfer Started',
        `Unit created the ACH transfer. Status: ${result.status || 'Pending'}.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      Alert.alert('Transfer failed', error instanceof Error ? error.message : 'Please try again.');
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
        <Text style={styles.headerTitle}>Unit Transfer</Text>
        <View style={{ width: 50 }} />
      </View>

      {loading ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.mutedText}>Loading transfer details...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segment, direction === 'to_unit' && styles.segmentActive]}
              onPress={() => setDirection('to_unit')}
            >
              <Text style={[styles.segmentText, direction === 'to_unit' && styles.segmentTextActive]}>
                Add Money
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.segment, direction === 'from_unit' && styles.segmentActive]}
              onPress={() => setDirection('from_unit')}
            >
              <Text style={[styles.segmentText, direction === 'from_unit' && styles.segmentTextActive]}>
                Withdraw
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>{directionCopy.title}</Text>
            <Text style={styles.mutedText}>{directionCopy.subtitle}</Text>
          </View>

          <View style={styles.unitCard}>
            <Text style={styles.label}>Unit Account</Text>
            {unitAccount ? (
              <>
                <Text style={styles.unitBalance}>{formatCurrency(unitAccount.available ?? unitAccount.balance ?? 0)}</Text>
                <Text style={styles.mutedText}>
                  {unitAccount.name} - {unitAccount.status || 'Configured'}
                </Text>
              </>
            ) : (
              <Text style={styles.errorText}>{unitError || 'Unit account is not configured.'}</Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Bank Account</Text>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setShowSourceDropdown((current) => !current)}
            >
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

          <View style={styles.section}>
            <Text style={styles.label}>Amount</Text>
            <TextInput
              style={styles.input}
              placeholder="$0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder={direction === 'to_unit' ? 'Funding' : 'Withdraw'}
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              maxLength={10}
            />
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
              I authorize this ACH transfer between the selected bank account and my Unit account.
            </Text>
          </TouchableOpacity>

          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Review</Text>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Direction</Text>
              <Text style={styles.reviewValue}>{direction === 'to_unit' ? 'Bank to Unit' : 'Unit to Bank'}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Amount</Text>
              <Text style={styles.reviewValue}>{formatCurrency(parsedAmount || 0)}</Text>
            </View>
            <View style={styles.reviewItem}>
              <Text style={styles.reviewLabel}>Bank</Text>
              <Text style={styles.reviewValue}>{selectedAccount ? accountLabel(selectedAccount) : 'None selected'}</Text>
            </View>
          </View>
        </ScrollView>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.confirmButton, (submitting || !unitAccount) && styles.confirmButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !unitAccount}
        >
          <Text style={styles.confirmButtonText}>{submitting ? 'Starting...' : directionCopy.button}</Text>
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
  loadingState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  segmentedControl: { flexDirection: 'row', backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.xs, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  segment: { flex: 1, alignItems: 'center', paddingVertical: spacing.md, borderRadius: borderRadius.md },
  segmentActive: { backgroundColor: colors.primary },
  segmentText: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
  segmentTextActive: { color: colors.background },
  section: { marginBottom: spacing.lg },
  title: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  mutedText: { fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: 20 },
  errorText: { fontSize: fontSizes.sm, color: colors.error, lineHeight: 20 },
  unitCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg },
  unitBalance: { fontSize: fontSizes['2xl'], fontWeight: fontWeights.bold, color: colors.textPrimary, marginBottom: spacing.xs },
  dropdown: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  dropdownText: { fontSize: fontSizes.base, color: colors.textPrimary, flex: 1 },
  chevron: { color: colors.textSecondary, fontSize: fontSizes.sm },
  dropdownMenu: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuItemText: { fontSize: fontSizes.base, color: colors.textSecondary },
  menuItemTextActive: { color: colors.primary, fontWeight: fontWeights.semibold },
  input: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary },
  authorizationRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, borderWidth: 1, borderColor: colors.border, padding: spacing.lg, marginBottom: spacing.lg },
  checkbox: { width: 22, height: 22, borderRadius: borderRadius.sm, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  checkboxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkboxText: { color: colors.background, fontSize: fontSizes.sm, fontWeight: fontWeights.bold },
  authorizationText: { flex: 1, fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: 20 },
  reviewSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  reviewTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.md },
  reviewItem: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md, gap: spacing.md },
  reviewLabel: { fontSize: fontSizes.sm, color: colors.textSecondary },
  reviewValue: { flex: 1, textAlign: 'right', fontSize: fontSizes.sm, color: colors.textPrimary, fontWeight: fontWeights.semibold },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  confirmButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  confirmButtonDisabled: { opacity: 0.6 },
  confirmButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
