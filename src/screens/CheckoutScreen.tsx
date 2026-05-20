import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, screenPadding } from '../theme';
import { useStore } from '../hooks/useStore';
import { getLinkedAccounts, LinkedAccount } from '../services/plaid';
import { formatCurrency } from '../utils/calculations';

interface CheckoutScreenProps {
  navigation: any;
  route: any;
}

function accountLabel(account: LinkedAccount) {
  const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
  return `${account.institution_name} - ${account.account_name}${mask}`;
}

export function CheckoutScreen({ navigation, route }: CheckoutScreenProps) {
  const { type, billId, amount, planName } = route.params || {};
  const { bills, buckets } = useStore();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const isSubscription = type === 'subscription';
  const bill = bills.find((item) => item.id === billId);
  const bucket = buckets.find((item) => item.billId === billId);
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId);
  const displayAmount = Number(amount || (bucket
    ? Math.max(bucket.targetAmount - bucket.currentAmount, 0) || bucket.targetAmount
    : bill?.amount || 0));

  useEffect(() => {
    const loadAccounts = async () => {
      setLoadingAccounts(true);
      setErrorMessage('');
      try {
        const linkedAccounts = await getLinkedAccounts();
        setAccounts(linkedAccounts);
        setSelectedAccountId(linkedAccounts.find((account) => account.is_primary)?.id || linkedAccounts[0]?.id || '');
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : 'Unable to load connected bank accounts.');
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (!isSubscription) loadAccounts();
    else setLoadingAccounts(false);
  }, [isSubscription]);

  const handleContinue = () => {
    if (isSubscription) return;
    if (!bill || !selectedAccount) return;
    navigation.navigate('PaymentReview', {
      billId: bill.id,
      paymentMethod: accountLabel(selectedAccount),
      amount: displayAmount,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {isSubscription ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>{planName || 'Subscription'} checkout is not configured</Text>
            <Text style={styles.messageText}>
              This build does not have a live subscription billing provider connected yet, so it will not simulate a card, PayPal, or Apple Pay payment.
            </Text>
          </View>
        ) : !bill ? (
          <View style={styles.messageCard}>
            <Text style={styles.messageTitle}>Bill not found</Text>
            <Text style={styles.messageText}>Choose a saved bill before starting checkout.</Text>
          </View>
        ) : (
          <>
            <View style={styles.summaryCard}>
              <Text style={styles.billVendor}>{bill.name}</Text>
              {!!bill.description && <Text style={styles.billDescription}>{bill.description}</Text>}
              <Text style={styles.billAmount}>{formatCurrency(displayAmount)}</Text>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Funding Source</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PaymentMethods')}>
                  <Text style={styles.changeLink}>Manage</Text>
                </TouchableOpacity>
              </View>

              {loadingAccounts ? (
                <View style={styles.selectedMethodCard}>
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : accounts.length === 0 ? (
                <View style={styles.messageCard}>
                  <Text style={styles.messageTitle}>No bank account connected</Text>
                  <Text style={styles.messageText}>
                    {errorMessage || 'Link a bank account before paying this bill.'}
                  </Text>
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={() => navigation.navigate('LinkBank', { autoStart: true })}
                  >
                    <Text style={styles.secondaryButtonText}>Link Bank</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.accountList}>
                  {accounts.map((account) => (
                    <TouchableOpacity
                      key={account.id}
                      style={[
                        styles.selectedMethodCard,
                        selectedAccountId === account.id && styles.selectedMethodCardActive,
                      ]}
                      onPress={() => setSelectedAccountId(account.id)}
                    >
                      <Text style={styles.methodIconSmallText}>🏦</Text>
                      <View style={styles.methodLabelSmall}>
                        <Text style={styles.methodLabelText}>{accountLabel(account)}</Text>
                        <Text style={styles.methodSubtext}>
                          {account.account_subtype || account.account_type || 'Connected account'}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {!!errorMessage && accounts.length > 0 && (
              <Text style={styles.errorText}>{errorMessage}</Text>
            )}

            <View style={styles.amountSection}>
              <Text style={styles.amountLabel}>Amount to Pay</Text>
              <Text style={styles.amountDisplay}>{formatCurrency(displayAmount)}</Text>
            </View>

            <TouchableOpacity
              style={[
                styles.actionButton,
                (!selectedAccount || loadingAccounts) && styles.actionButtonDisabled,
              ]}
              onPress={handleContinue}
              disabled={!selectedAccount || loadingAccounts}
            >
              <Text style={styles.actionButtonText}>Review Payment</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing['2xl'],
    alignItems: 'center',
  },
  billVendor: { fontSize: fontSizes.base, color: colors.textSecondary, marginBottom: spacing.sm },
  billDescription: { fontSize: fontSizes.sm, color: colors.textMuted, marginBottom: spacing.md, textAlign: 'center' },
  billAmount: { fontSize: fontSizes['3xl'], fontWeight: fontWeights.bold as any, color: colors.primary },
  section: { marginBottom: spacing['2xl'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  sectionTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold as any, color: colors.textPrimary },
  changeLink: { fontSize: fontSizes.sm, color: colors.primary, fontWeight: fontWeights.semibold as any },
  accountList: { gap: spacing.md },
  selectedMethodCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  selectedMethodCardActive: { borderColor: colors.primary },
  methodIconSmallText: { fontSize: fontSizes.xl },
  methodLabelSmall: { flex: 1 },
  methodLabelText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold as any, color: colors.textPrimary },
  methodSubtext: { fontSize: fontSizes.sm, color: colors.textMuted, textTransform: 'capitalize', marginTop: 2 },
  amountSection: { marginBottom: spacing['2xl'] },
  amountLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.sm },
  amountDisplay: { fontSize: fontSizes['3xl'], fontWeight: fontWeights.bold as any, color: colors.primary },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  actionButtonDisabled: { opacity: 0.5 },
  actionButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold as any, color: colors.background },
  messageCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  messageTitle: { color: colors.textPrimary, fontSize: fontSizes.base, fontWeight: fontWeights.bold as any },
  messageText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.bold as any },
  errorText: { color: colors.error, fontSize: fontSizes.sm, marginBottom: spacing.lg },
});
