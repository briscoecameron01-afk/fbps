import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface LinkedAccount {
  id: string;
  bankName: string;
  accountType: 'checking' | 'savings';
  accountMask: string;
  balance: number;
  isPrimary: boolean;
  icon: string;
}

export function LinkedAccountsScreen({ navigation }: Props) {
  const [accounts, setAccounts] = useState<LinkedAccount[]>([
    {
      id: '1',
      bankName: 'Chase Bank',
      accountType: 'checking',
      accountMask: '4242',
      balance: 3500.50,
      isPrimary: true,
      icon: '🏦',
    },
    {
      id: '2',
      bankName: 'Bank of America',
      accountType: 'savings',
      accountMask: '8765',
      balance: 10250.00,
      isPrimary: false,
      icon: '🏦',
    },
  ]);

  const handleRemoveAccount = (accountId: string) => {
    setAccounts(accounts.filter((acc) => acc.id !== accountId));
  };

  const handleLinkAnother = () => {
    navigation.navigate('LinkBank');
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts(
      accounts.map((acc) => ({
        ...acc,
        isPrimary: acc.id === accountId,
      }))
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Linked Accounts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Accounts List */}
        {accounts.length > 0 ? (
          <>
            <Text style={styles.accountsLabel}>Your Bank Accounts</Text>

            {accounts.map((account) => (
              <View key={account.id} style={styles.accountCard}>
                <View style={styles.accountLeft}>
                  <Text style={styles.accountIcon}>{account.icon}</Text>
                  <View style={styles.accountInfo}>
                    <View style={styles.accountNameRow}>
                      <Text style={styles.accountBankName}>{account.bankName}</Text>
                      {account.isPrimary && (
                        <View style={styles.primaryBadge}>
                          <Text style={styles.primaryBadgeText}>Primary</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.accountType}>
                      {account.accountType.charAt(0).toUpperCase() + account.accountType.slice(1)} • •••• {account.accountMask}
                    </Text>
                    <Text style={styles.accountBalance}>
                      Balance: ${account.balance.toFixed(2)}
                    </Text>
                  </View>
                </View>

                <View style={styles.accountActions}>
                  {!account.isPrimary && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleSetPrimary(account.id)}
                    >
                      <Text style={styles.actionButtonText}>Set as Primary</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.actionButton, styles.removeButton]}
                    onPress={() => handleRemoveAccount(account.id)}
                  >
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏦</Text>
            <Text style={styles.emptyTitle}>No Accounts Linked</Text>
            <Text style={styles.emptyDescription}>
              Link your bank account to start automatically funding your bills
            </Text>
          </View>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>ℹ️</Text>
          <Text style={styles.infoText}>
            Your linked accounts are encrypted and secure. We only have read-only access to your account information.
          </Text>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.linkButton} onPress={handleLinkAnother}>
          <Text style={styles.linkButtonText}>+ Link Another Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  accountsLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: spacing.lg,
  },
  accountCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  accountLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  accountIcon: {
    fontSize: fontSizes.xl,
    marginRight: spacing.lg,
  },
  accountInfo: {
    flex: 1,
  },
  accountNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  accountBankName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  primaryBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  primaryBadgeText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  accountType: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    marginBottom: spacing.xs,
  },
  accountBalance: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  accountActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  removeButton: {
    backgroundColor: colors.error + '10',
    borderColor: colors.error + '30',
  },
  removeButtonText: {
    color: colors.error,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.primary + '40',
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  infoIcon: {
    fontSize: fontSizes.lg,
  },
  infoText: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  linkButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkButtonText: {
    color: colors.primary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
