import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { Button } from '../components';
import {
  getLinkedAccounts, unlinkAccount, setPrimaryAccount, LinkedAccount,
} from '../services/plaid';

interface Props {
  navigation: any;
}

// Bank logo emoji mapping
const BANK_ICONS: Record<string, string> = {
  'Chase': '🟦',
  'Bank of America': '🟥',
  'Wells Fargo': '🟨',
  'Citi': '🔵',
  'Capital One': '🟧',
  'default': '🏦',
};

function getBankIcon(name: string): string {
  for (const [key, icon] of Object.entries(BANK_ICONS)) {
    if (name.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return BANK_ICONS.default;
}

function getAccountTypeLabel(type: string | null, subtype: string | null): string {
  if (subtype) {
    return subtype.charAt(0).toUpperCase() + subtype.slice(1).replace(/_/g, ' ');
  }
  if (type) {
    return type.charAt(0).toUpperCase() + type.slice(1);
  }
  return 'Account';
}

export function LinkedAccountsScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // For MVP with mock data, use static accounts
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    setLoading(true);
    try {
      const data = await getLinkedAccounts();
      setAccounts(data);
    } catch (err) {
      // Fallback to mock data for development
      setAccounts([
        {
          id: 'mock-1',
          institution_name: 'Chase Bank',
          account_name: 'Total Checking',
          account_mask: '4832',
          account_type: 'depository',
          account_subtype: 'checking',
          is_primary: true,
          is_active: true,
        },
        {
          id: 'mock-2',
          institution_name: 'Chase Bank',
          account_name: 'Savings',
          account_mask: '9271',
          account_type: 'depository',
          account_subtype: 'savings',
          is_primary: false,
          is_active: true,
        },
      ]);
    }
    setLoading(false);
  };

  const handleUnlink = (account: LinkedAccount) => {
    Alert.alert(
      'Unlink Account',
      `Are you sure you want to unlink ${account.account_name} (••${account.account_mask})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unlink',
          style: 'destructive',
          onPress: async () => {
            try {
              await unlinkAccount(account.id);
              setAccounts((prev) => prev.filter((a) => a.id !== account.id));
            } catch (err) {
              // For mock data, just remove locally
              setAccounts((prev) => prev.filter((a) => a.id !== account.id));
            }
          },
        },
      ]
    );
  };

  const handleSetPrimary = async (account: LinkedAccount) => {
    try {
      await setPrimaryAccount(account.id);
    } catch {
      // Mock: update locally
    }
    setAccounts((prev) =>
      prev.map((a) => ({ ...a, is_primary: a.id === account.id }))
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Linked Accounts</Text>
          <View style={{ width: 50 }} />
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.teal} />
          </View>
        ) : accounts.length === 0 ? (
          /* Empty state */
          <View style={styles.emptyState}>
            <Text style={{ fontSize: 48, marginBottom: spacing.lg }}>🏦</Text>
            <Text style={styles.emptyTitle}>No accounts linked</Text>
            <Text style={styles.emptySubtitle}>
              Link your bank account to auto-detect bills and fund them automatically.
            </Text>
            <Button
              title="Link Your First Account"
              onPress={() => navigation.navigate('LinkBank')}
              size="lg"
            />
          </View>
        ) : (
          /* Accounts list */
          <View style={styles.list}>
            {accounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountTop}>
                  <View style={styles.accountLeft}>
                    <Text style={styles.bankIcon}>
                      {getBankIcon(account.institution_name)}
                    </Text>
                    <View>
                      <View style={styles.nameRow}>
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
                    </View>
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
                    style={[styles.actionBtn, styles.actionBtnDanger]}
                    onPress={() => handleUnlink(account)}
                  >
                    <Text style={styles.actionBtnTextDanger}>Unlink</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add another account */}
            <TouchableOpacity
              style={styles.addAccountBtn}
              onPress={() => navigation.navigate('LinkBank')}
            >
              <Text style={styles.addAccountPlus}>+</Text>
              <Text style={styles.addAccountText}>Link Another Account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Info card */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🔒 Your data is secure</Text>
          <Text style={styles.infoText}>
            We use Plaid, the same technology trusted by Venmo, Robinhood, and Coinbase, to securely connect to your bank. We never store your banking credentials and can only view transactions — we cannot move money without your explicit permission.
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightBg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    color: colors.teal,
    fontSize: fontSizes.md,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: fontSizes.lg,
  },
  loadingContainer: {
    paddingTop: 100,
    alignItems: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: spacing['3xl'],
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSizes.md,
    color: colors.mid,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['2xl'],
  },
  list: {
    padding: spacing.xl,
  },
  accountCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  accountLeft: {
    flexDirection: 'row',
    gap: spacing.md,
    flex: 1,
  },
  bankIcon: {
    fontSize: 28,
    marginTop: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  accountName: {
    fontSize: fontSizes.md,
    fontWeight: '700',
    color: colors.navy,
  },
  primaryBadge: {
    backgroundColor: colors.tealBg,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },
  primaryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.teal,
  },
  bankName: {
    fontSize: fontSizes.sm,
    color: colors.dark,
    marginTop: 2,
  },
  accountMeta: {
    fontSize: fontSizes.xs,
    color: colors.light,
    marginTop: 2,
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
    borderColor: colors.teal,
  },
  actionBtnText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.teal,
  },
  actionBtnDanger: {
    borderColor: colors.coral,
  },
  actionBtnTextDanger: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
    color: colors.coral,
  },
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
  addAccountPlus: {
    fontSize: 20,
    color: colors.teal,
    fontWeight: '300',
  },
  addAccountText: {
    fontSize: fontSizes.md,
    color: colors.teal,
    fontWeight: '600',
  },
  infoCard: {
    marginHorizontal: spacing.xl,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoTitle: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: fontSizes.xs,
    color: colors.mid,
    lineHeight: 18,
  },
});
