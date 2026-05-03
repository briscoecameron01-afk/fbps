import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { formatCurrency } from '../utils/calculations';
import {
  getLinkedAccounts,
  refreshLinkedAccountBalances,
  LinkedAccount,
} from '../services/plaid';

interface Props {
  navigation: any;
}

export function FundingHubScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(true);
  const [balanceRefreshing, setBalanceRefreshing] = useState(false);

  useEffect(() => {
    loadConnectedAccounts();
  }, []);

  const loadConnectedAccounts = async () => {
    setAccountsLoading(true);
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
    } catch {
      setAccounts([]);
    }
    setAccountsLoading(false);
  };

  const formatBalance = (amount: number | null) => {
    if (typeof amount !== 'number') return 'Unavailable';
    return formatCurrency(amount);
  };

  const getAccountLabel = (account: LinkedAccount) => {
    const type = account.account_subtype || account.account_type || 'account';
    const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
    return `${type.replace(/_/g, ' ')}${mask}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>Funding Hub</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>Auto-transfer</Text>
              <Text style={styles.cardValue}>Enabled</Text>
            </View>
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Active</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Next Scheduled Transfer</Text>
          <Text style={styles.cardValue}>Mar 05 - $4.00</Text>
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
                Link a bank to see each connected account and balance here.
              </Text>
              <TouchableOpacity
                style={styles.linkInlineButton}
                onPress={() => navigation.navigate('LinkBank')}
              >
                <Text style={styles.linkInlineButtonText}>Link Bank</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.accountsList}>
              {accounts.map((account) => (
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
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.buttonsSection}>
          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('ManualContribution')}
          >
            <Text style={styles.outlineButtonText}>Manual Contribution</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={() => navigation.navigate('LinkBank')}
          >
            <Text style={styles.outlineButtonText}>Link Bank</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => navigation.navigate('AutoTransferSchedule')}
          >
            <Text style={styles.primaryButtonText}>Schedules</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.screenPadding,
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
