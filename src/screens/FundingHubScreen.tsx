import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { colors, spacing, screenPadding, borderRadius, fontSizes, fontWeights } from '../theme';
import { formatCurrency } from '../utils/calculations';
import {
  getLinkedAccounts,
  refreshLinkedAccountBalances,
  unlinkAccount,
  LinkedAccount,
} from '../services/plaid';
import { confirmDestructiveAction } from '../utils/confirmAction';
import { ConfirmBankRemovalModal } from '../components/ConfirmBankRemovalModal';

interface Props {
  navigation: any;
}

export function FundingHubScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);
  const [accountsError, setAccountsError] = useState('');
  const [removingAccountId, setRemovingAccountId] = useState<string | null>(null);
  const [accountPendingRemoval, setAccountPendingRemoval] = useState<LinkedAccount | null>(null);

  const loadConnectedAccounts = useCallback(async () => {
    setAccountsLoading(true);
    setAccountsError('');
    try {
      const linkedAccounts = await getLinkedAccounts();
      setAccounts(linkedAccounts);

      if (linkedAccounts.length > 0) {
        setBalanceRefreshing(true);
        try {
          await refreshLinkedAccountBalances();
          setAccounts(await getLinkedAccounts());
        } catch {
          // Keep linked accounts visible if balance refresh fails.
        }
        setBalanceRefreshing(false);
      }
    } catch (error) {
      setAccounts([]);
      setAccountsError(error instanceof Error ? error.message : 'Unable to load connected accounts.');
    }
    setAccountsLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadConnectedAccounts();
    }, [loadConnectedAccounts])
  );

  const formatBalance = (amount: number | null) => {
    if (typeof amount !== 'number') return 'Unavailable';
    return formatCurrency(amount);
  };

  const getAccountLabel = (account: LinkedAccount) => {
    const type = account.account_subtype || account.account_type || 'account';
    const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
    return `${type.replace(/_/g, ' ')}${mask}`;
  };

  const openBankingHub = () => {
    navigation.navigate('ReadyToLaunchBanking');
  };

  const confirmRemoveAccount = async () => {
    if (!accountPendingRemoval) return;

    setRemovingAccountId(accountPendingRemoval.id);
    try {
      await unlinkAccount(accountPendingRemoval.id);
      setAccounts((current) => current.filter((item) => item.id !== accountPendingRemoval.id));
      setAccountPendingRemoval(null);
    } catch (error) {
      Alert.alert(
        'Unable to remove account',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setRemovingAccountId(null);
    }
  };

  const handleRemoveAccount = async (account: LinkedAccount) => {
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
      setAccounts((current) => current.filter((item) => item.id !== account.id));
    } catch (error) {
      Alert.alert(
        'Unable to remove account',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setRemovingAccountId(null);
    }

    return;
    Alert.alert(
      'Remove Bank Account',
      `Remove ${account.account_name || 'this account'}${account.account_mask ? ` (••${account.account_mask})` : ''}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await unlinkAccount(account.id);
              setAccounts((current) => current.filter((item) => item.id !== account.id));
            } catch (error) {
              Alert.alert(
                'Unable to remove account',
                error instanceof Error ? error.message : 'Please try again.'
              );
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Funding Hub</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleBlock}>
              <Text style={styles.cardLabel}>Unit Banking</Text>
              <Text style={styles.cardValue}>Ready-to-Launch</Text>
              <Text style={styles.cardSubtext}>
                Open Unit's embedded banking experience to onboard, hold funds, connect banks, and move money.
              </Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Embedded</Text>
            </View>
          </View>
          <View style={styles.unitActions}>
            <TouchableOpacity
              style={styles.unitActionButton}
              onPress={openBankingHub}
            >
              <Text style={styles.unitActionButtonText}>Open Banking Hub</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.connectedSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleBlock}>
              <Text style={styles.sectionTitle}>Connected Bank</Text>
              <Text style={styles.sectionSubtitle}>
                {balanceRefreshing ? 'Refreshing balances...' : 'Current balances from linked accounts'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={loadConnectedAccounts}
              disabled={accountsLoading || balanceRefreshing}
            >
              <Text style={styles.refreshButtonText}>
                {accountsLoading || balanceRefreshing ? 'Syncing' : 'Refresh'}
              </Text>
            </TouchableOpacity>
          </View>

          {accountsLoading ? (
            <View style={styles.connectedEmptyCard}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.connectedEmptyText}>Loading connected accounts...</Text>
            </View>
          ) : accounts.length === 0 ? (
            <View style={styles.connectedEmptyCard}>
              <Text style={styles.connectedEmptyTitle}>No connected bank yet</Text>
              <Text style={styles.connectedEmptyText}>
                {accountsError || 'Link a bank to see each connected account and balance here.'}
              </Text>
              <TouchableOpacity
                style={styles.linkInlineButton}
                onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
              >
                <Text style={styles.linkInlineButtonText}>Link Bank</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.accountsList}>
              {accounts.map((account) => {
                const isRemoving = removingAccountId === account.id;

                return (
                <View key={account.id} style={styles.accountCard}>
                  <View style={styles.accountTopRow}>
                    <View style={styles.accountIcon}>
                      <Text style={styles.accountIconText}>
                        {account.institution_name?.[0]?.toUpperCase() || 'B'}
                      </Text>
                    </View>
                    <View style={styles.accountInfo}>
                      <View style={styles.accountNameRow}>
                        <Text style={styles.accountName}>{account.account_name || 'Bank Account'}</Text>
                        {account.is_primary && (
                          <View style={styles.primaryBadge}>
                            <Text style={styles.primaryBadgeText}>Primary</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.bankName}>{account.institution_name}</Text>
                      <Text style={styles.accountMeta}>{getAccountLabel(account)}</Text>
                    </View>
                  </View>

                  <View style={styles.balanceRow}>
                    <View>
                      <Text style={styles.balanceLabel}>Current</Text>
                      <Text style={styles.balanceValue}>{formatBalance(account.balance_current)}</Text>
                    </View>
                    <View style={styles.balanceRight}>
                      <Text style={styles.balanceLabel}>Available</Text>
                      <Text style={styles.balanceValueSecondary}>{formatBalance(account.balance_available)}</Text>
                    </View>
                  </View>

                  <View style={styles.accountActions}>
                    <TouchableOpacity
                      style={styles.accountActionButton}
                      onPress={openBankingHub}
                    >
                      <Text style={styles.accountActionButtonText}>Manage in Unit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.removeAccountButton, isRemoving && styles.disabledAction]}
                      onPress={() => setAccountPendingRemoval(account)}
                      disabled={!!removingAccountId}
                    >
                      <Text style={styles.removeAccountButtonText}>
                        {isRemoving ? 'Removing...' : 'Remove'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                );
              })}

              <TouchableOpacity
                style={styles.connectAnotherButton}
                onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
              >
                <Text style={styles.connectAnotherButtonText}>Connect Another Bank</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={openBankingHub}
          >
            <Text style={styles.outlineButtonText}>Unit Banking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
          >
            <Text style={styles.outlineButtonText}>Connect Another Bank</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('AutoTransferSchedule')}
          >
            <Text style={styles.primaryButtonText}>Schedules</Text>
          </TouchableOpacity>
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
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: screenPadding.vertical,
  },
  headerSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  cardTitleBlock: {
    flex: 1,
  },
  cardLabel: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  cardValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  cardSubtext: {
    marginTop: spacing.xs,
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  cardError: {
    fontSize: fontSizes.sm,
    color: colors.error,
    lineHeight: 20,
  },
  unitActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  unitActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  unitActionButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  activeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  activeBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
  connectedSection: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  sectionTitleBlock: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  refreshButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  refreshButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  connectedEmptyCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    gap: spacing.sm,
  },
  connectedEmptyTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  connectedEmptyText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  linkInlineButton: {
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  linkInlineButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
  accountsList: {
    gap: spacing.md,
  },
  accountCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountTopRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  accountIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundCardLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountIconText: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  accountInfo: {
    flex: 1,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  accountName: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  bankName: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  accountMeta: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'capitalize',
  },
  primaryBadge: {
    backgroundColor: 'rgba(0, 217, 152, 0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  primaryBadgeText: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  balanceRight: {
    alignItems: 'flex-end',
  },
  balanceLabel: {
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  balanceValue: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  balanceValueSecondary: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
  },
  accountActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  accountActionButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  accountActionButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  removeAccountButton: {
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  removeAccountButtonText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    color: colors.error,
  },
  disabledAction: {
    opacity: 0.5,
  },
  connectAnotherButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectAnotherButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.primary,
  },
  buttonsSection: {
    marginTop: spacing.xl,
    gap: spacing.md,
  },
  button: {
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
});
