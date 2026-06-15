import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Button } from '../components';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import {
  getLinkedAccounts,
  LinkedAccount,
  setPrimaryAccount,
  unlinkAccount,
} from '../services/plaid';
import { confirmDestructiveAction } from '../utils/confirmAction';
import { ConfirmBankRemovalModal } from '../components/ConfirmBankRemovalModal';

interface Props {
  navigation: any;
}

function formatBalance(account: LinkedAccount) {
  const amount = account.balance_current ?? account.balance_available;
  if (amount === null || amount === undefined) return 'Balance unavailable';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: account.balance_iso_currency_code || 'USD',
  }).format(amount);
}

function getAccountTypeLabel(type: string | null, subtype: string | null): string {
  if (subtype) return subtype.charAt(0).toUpperCase() + subtype.slice(1).replace(/_/g, ' ');
  if (type) return type.charAt(0).toUpperCase() + type.slice(1);
  return 'Account';
}

export function LinkedAccountsScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingAccountId, setRemovingAccountId] = useState<string | null>(null);
  const [accountPendingRemoval, setAccountPendingRemoval] = useState<LinkedAccount | null>(null);

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setAccounts(await getLinkedAccounts());
    } catch (err) {
      setAccounts([]);
      setError(err instanceof Error ? err.message : 'Unable to load linked accounts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const handleUnlink = async (account: LinkedAccount) => {
    const accountLabel = `${account.account_name || 'this account'}${account.account_mask ? ` (••${account.account_mask})` : ''}`;
    const confirmed = await confirmDestructiveAction({
      title: 'Remove Bank Account',
      message: `Remove ${accountLabel}?`,
      confirmText: 'Remove',
    });

    if (!confirmed) return;

    setRemovingAccountId(account.id);
    try {
      await unlinkAccount(account.id);
      setAccounts((prev) => prev.filter((a) => a.id !== account.id));
    } catch (err) {
      Alert.alert(
        'Unable to unlink account',
        err instanceof Error ? err.message : 'Please try again.'
      );
    } finally {
      setRemovingAccountId(null);
    }

    return;
    Alert.alert(
      'Remove Bank Account',
      `Remove ${account.account_name}${account.account_mask ? ` (••${account.account_mask})` : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await unlinkAccount(account.id);
              setAccounts((prev) => prev.filter((a) => a.id !== account.id));
            } catch (err) {
              Alert.alert(
                'Unable to unlink account',
                err instanceof Error ? err.message : 'Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = async (account: LinkedAccount) => {
    try {
      await setPrimaryAccount(account.id);
      setAccounts((prev) => prev.map((a) => ({ ...a, is_primary: a.id === account.id })));
    } catch (err) {
      Alert.alert(
        'Unable to update primary account',
        err instanceof Error ? err.message : 'Please try again.'
      );
    }
  };

  const confirmRemoveAccount = async () => {
    if (!accountPendingRemoval) return;

    setRemovingAccountId(accountPendingRemoval.id);
    try {
      await unlinkAccount(accountPendingRemoval.id);
      setAccounts((prev) => prev.filter((a) => a.id !== accountPendingRemoval.id));
      setAccountPendingRemoval(null);
    } catch (err) {
      Alert.alert(
        'Unable to unlink account',
        err instanceof Error ? err.message : 'Please try again.'
      );
    } finally {
      setRemovingAccountId(null);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Linked Accounts</Text>
          <View style={{ width: 52 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : accounts.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyTitle}>No accounts linked</Text>
            <Text style={styles.emptySubtitle}>
              {error || 'Link your bank account to view balances and fund bills.'}
            </Text>
            {error ? (
              <Button title="Try Again" onPress={loadAccounts} size="lg" />
            ) : (
              <Button
                title="Connect Your First Bank"
                onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
                size="lg"
              />
            )}
          </View>
        ) : (
          <View style={styles.list}>
            {accounts.map((account) => {
              const isRemoving = removingAccountId === account.id;

              return (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.nameRow}>
                  <View style={styles.accountIcon}>
                    <Text style={styles.accountIconText}>🏦</Text>
                  </View>
                  <View style={styles.accountText}>
                    <View style={styles.titleRow}>
                      <Text style={styles.accountName}>{account.account_name}</Text>
                      {account.is_primary && (
                        <View style={styles.primaryBadge}>
                          <Text style={styles.primaryBadgeText}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.bankName}>{account.institution_name}</Text>
                    <Text style={styles.accountMeta}>
                      {getAccountTypeLabel(account.account_type, account.account_subtype)}
                      {account.account_mask ? ` •••• ${account.account_mask}` : ''}
                    </Text>
                    <Text style={styles.balanceText}>{formatBalance(account)}</Text>
                  </View>
                </View>

                <View style={styles.accountActions}>
                  {!account.is_primary && (
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleSetPrimary(account)}
                    >
                      <Text style={styles.actionBtnText}>Set as Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.actionBtnDanger, isRemoving && styles.disabledAction]}
                    onPress={() => setAccountPendingRemoval(account)}
                    disabled={!!removingAccountId}
                  >
                    <Text style={styles.actionBtnTextDanger}>
                      {isRemoving ? 'Removing...' : 'Remove'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              );
            })}

            <TouchableOpacity
              style={styles.addAccountBtn}
              onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
            >
              <Text style={styles.addAccountPlus}>+</Text>
              <Text style={styles.addAccountText}>Connect Another Bank</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your data is secure</Text>
          <Text style={styles.infoText}>
            Bank connections are handled through Plaid. We never store your banking credentials.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
      <ConfirmBankRemovalModal
        visible={!!accountPendingRemoval}
        account={accountPendingRemoval}
        loading={!!removingAccountId}
        onCancel={() => setAccountPendingRemoval(null)}
        onConfirm={confirmRemoveAccount}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
  headerTitle: { fontWeight: '700', color: colors.textPrimary, fontSize: fontSizes.lg },
  loadingContainer: { paddingTop: 100, alignItems: 'center' },
  emptyState: { alignItems: 'center', paddingTop: 80, paddingHorizontal: spacing['3xl'] },
  emptyIcon: { fontSize: 48, marginBottom: spacing.lg },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['2xl'],
  },
  list: { padding: spacing.xl },
  accountCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  nameRow: { flexDirection: 'row', gap: spacing.md },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountIconText: { fontSize: 24 },
  accountText: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flexWrap: 'wrap' },
  accountName: { fontSize: fontSizes.md, fontWeight: '700', color: colors.textPrimary },
  primaryBadge: {
    backgroundColor: 'rgba(0, 217, 152, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  primaryBadgeText: { fontSize: 10, fontWeight: '600', color: colors.primary },
  bankName: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  accountMeta: { fontSize: fontSizes.xs, color: colors.textMuted, marginTop: 2 },
  balanceText: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginTop: spacing.sm,
  },
  accountActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  actionBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  actionBtnText: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.primary },
  actionBtnDanger: { borderColor: colors.error },
  actionBtnTextDanger: { fontSize: fontSizes.xs, fontWeight: '600', color: colors.error },
  disabledAction: { opacity: 0.5 },
  addAccountBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  addAccountPlus: { fontSize: 20, color: colors.primary, fontWeight: '300' },
  addAccountText: { fontSize: fontSizes.md, color: colors.primary, fontWeight: '600' },
  infoCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  infoText: { fontSize: fontSizes.xs, color: colors.textSecondary, lineHeight: 18 },
});
