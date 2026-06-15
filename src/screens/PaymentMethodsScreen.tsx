import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, screenPadding } from '../theme';
import {
  getLinkedAccounts,
  LinkedAccount,
  setPrimaryAccount,
  unlinkAccount,
} from '../services/plaid';
import { confirmDestructiveAction } from '../utils/confirmAction';
import { ConfirmBankRemovalModal } from '../components/ConfirmBankRemovalModal';

interface PaymentMethodsScreenProps {
  navigation: any;
}

function formatAccountLabel(account: LinkedAccount) {
  const type = account.account_subtype || account.account_type || 'bank account';
  const mask = account.account_mask ? ` •••• ${account.account_mask}` : '';
  return `${type.replace(/_/g, ' ')}${mask}`;
}

export function PaymentMethodsScreen({ navigation }: PaymentMethodsScreenProps) {
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
      setError(err instanceof Error ? err.message : 'Unable to load payment methods.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadAccounts();
    }, [loadAccounts])
  );

  const handleSetDefault = async (accountId: string) => {
    try {
      await setPrimaryAccount(accountId);
      setAccounts((prev) => prev.map((account) => ({
        ...account,
        is_primary: account.id === accountId,
      })));
    } catch (err) {
      Alert.alert('Unable to update default account', err instanceof Error ? err.message : 'Please try again.');
    }
  };

  const handleRemove = async (account: LinkedAccount) => {
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
      setAccounts((prev) => prev.filter((item) => item.id !== account.id));
    } catch (err) {
      Alert.alert('Unable to remove account', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setRemovingAccountId(null);
    }
  };

  const confirmRemoveAccount = async () => {
    if (!accountPendingRemoval) return;

    setRemovingAccountId(accountPendingRemoval.id);
    try {
      await unlinkAccount(accountPendingRemoval.id);
      setAccounts((prev) => prev.filter((item) => item.id !== accountPendingRemoval.id));
      setAccountPendingRemoval(null);
    } catch (err) {
      Alert.alert('Unable to remove account', err instanceof Error ? err.message : 'Please try again.');
    } finally {
      setRemovingAccountId(null);
    }
  };

  const renderAccount = (account: LinkedAccount) => {
    const isRemoving = removingAccountId === account.id;

    return (
    <View key={account.id} style={styles.methodCard}>
      <View style={styles.methodContent}>
        <View style={styles.methodIcon}>
          <Text style={styles.methodIconText}>🏦</Text>
        </View>
        <View style={styles.methodInfo}>
          <Text style={styles.methodLabel}>{account.account_name}</Text>
          <Text style={styles.methodProvider}>{account.institution_name}</Text>
          <Text style={styles.methodMeta}>{formatAccountLabel(account)}</Text>
        </View>
        {account.is_primary && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultBadgeText}>Default</Text>
          </View>
        )}
      </View>
      <View style={styles.methodActions}>
        {!account.is_primary && (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleSetDefault(account.id)}
          >
            <Text style={styles.actionButtonText}>Set Default</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.actionButton, styles.removeButton, isRemoving && styles.disabledAction]}
          onPress={() => setAccountPendingRemoval(account)}
          disabled={!!removingAccountId}
        >
          <Text style={styles.removeButtonText}>{isRemoving ? 'Removing...' : 'Remove'}</Text>
        </TouchableOpacity>
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connected Bank Accounts</Text>
          {loading ? (
            <View style={styles.loadingCard}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : accounts.length > 0 ? (
            <View style={styles.methodsList}>
              {accounts.map(renderAccount)}
              <TouchableOpacity
                style={styles.addBankButton}
                onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
              >
                <Text style={styles.addBankButtonText}>Connect Another Bank</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No connected bank accounts</Text>
              <Text style={styles.emptyText}>
                {error || 'Link a bank account before using it for contributions.'}
              </Text>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={error ? loadAccounts : () => navigation.navigate('LinkBank', { autoStart: true })}
              >
                <Text style={styles.primaryButtonText}>{error ? 'Try Again' : 'Connect Bank'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.securityNote}>
          <Text style={styles.securityNoteText}>
            Card, PayPal, and Apple Pay billing are not configured in this build. Connected banks are the available funding source.
          </Text>
        </View>
      </ScrollView>
      <ConfirmBankRemovalModal
        visible={!!accountPendingRemoval}
        account={accountPendingRemoval}
        loading={!!removingAccountId}
        onCancel={() => setAccountPendingRemoval(null)}
        onConfirm={confirmRemoveAccount}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { fontSize: fontSizes.lg, color: colors.primary, fontWeight: fontWeights.bold as any },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold as any, color: colors.textPrimary },
  scrollContent: { paddingHorizontal: screenPadding.horizontal, paddingVertical: spacing.lg },
  section: { marginBottom: spacing['2xl'] },
  sectionTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  methodsList: { gap: spacing.md },
  methodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  methodContent: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  methodIconText: { fontSize: fontSizes.xl },
  methodInfo: { flex: 1 },
  methodLabel: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
    textTransform: 'capitalize',
  },
  methodProvider: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: 2 },
  methodMeta: { fontSize: fontSizes.sm, color: colors.textMuted, textTransform: 'capitalize' },
  defaultBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.16)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  defaultBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold as any,
    color: colors.success,
  },
  methodActions: { flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderAccent,
    alignItems: 'center',
  },
  actionButtonText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold as any, color: colors.primary },
  removeButton: { borderColor: colors.error },
  removeButtonText: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold as any, color: colors.error },
  disabledAction: { opacity: 0.5 },
  addBankButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBankButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold as any,
  },
  loadingCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  emptyTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: fontWeights.bold as any },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryButtonText: { color: colors.background, fontSize: fontSizes.sm, fontWeight: fontWeights.bold as any },
  securityNote: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  securityNoteText: { fontSize: fontSizes.sm, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
