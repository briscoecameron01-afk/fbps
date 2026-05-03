import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';
import { formatCurrency } from '../utils/calculations';
import { getLinkedAccounts, LinkedAccount } from '../services/plaid';

interface Props {
  navigation: any;
  route: any;
}

export function PayBillScreen({ navigation, route }: Props) {
  const { bills, buckets } = useStore();
  const billId = route?.params?.billId;
  const bill = bills.find((item) => item.id === billId);
  const bucket = buckets.find((item) => item.billId === billId);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showMethods, setShowMethods] = useState(false);

  useEffect(() => {
    const loadAccounts = async () => {
      const linkedAccounts = await getLinkedAccounts();
      setAccounts(linkedAccounts);
      setSelectedPaymentMethod((current) => current || linkedAccounts[0]?.id || '');
    };

    loadAccounts();
  }, []);

  if (!bill) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bill</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.section}>
          <Text style={styles.emptyText}>This bill could not be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const amountToPay = bucket ? Math.max(bucket.targetAmount - bucket.currentAmount, 0) || bucket.targetAmount : bill.amount;
  const selectedAccount = accounts.find((account) => account.id === selectedPaymentMethod);
  const accountLabel = (account: LinkedAccount) => {
    const mask = account.account_mask ? ` **** ${account.account_mask}` : '';
    return `${account.institution_name} - ${account.account_name}${mask}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Pay Bill</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Bill</Text>
          <View style={styles.card}>
            <Text style={styles.cardText}>{bill.name}</Text>
            {!!bill.description && <Text style={styles.cardSubtext}>{bill.description}</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Amount to Pay</Text>
          <View style={styles.card}>
            <Text style={styles.amountText}>{formatCurrency(amountToPay)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Payment Method</Text>
          <TouchableOpacity
            style={styles.dropdownCard}
            onPress={() => setShowMethods(!showMethods)}
          >
            <Text style={styles.dropdownText}>
              {selectedAccount ? accountLabel(selectedAccount) : 'Select connected bank account'}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
          {showMethods && (
            <View style={styles.methodList}>
              {accounts.length === 0 ? (
                <TouchableOpacity style={styles.methodItem} onPress={() => navigation.navigate('LinkBank')}>
                  <Text style={styles.methodItemActive}>Link a bank account</Text>
                </TouchableOpacity>
              ) : accounts.map((account) => (
                <TouchableOpacity
                  key={account.id}
                  style={styles.methodItem}
                  onPress={() => {
                    setSelectedPaymentMethod(account.id);
                    setShowMethods(false);
                  }}
                >
                  <Text style={[styles.methodItemText, selectedPaymentMethod === account.id && styles.methodItemActive]}>
                    {accountLabel(account)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, minHeight: spacing['4xl'] }} />

        <TouchableOpacity
          style={[
            styles.primaryButton,
            styles.bottomButton,
            !selectedAccount && styles.primaryButtonDisabled,
          ]}
          disabled={!selectedAccount}
          onPress={() => navigation.navigate('PaymentReview', {
            billId: bill.id,
            paymentMethod: selectedAccount ? accountLabel(selectedAccount) : '',
            amount: amountToPay,
          })}
        >
          <Text style={styles.primaryButtonText}>Pay Now</Text>
        </TouchableOpacity>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { color: colors.primary, fontSize: fontSizes.md, fontWeight: fontWeights.semibold },
  headerTitle: { fontWeight: fontWeights.bold, color: colors.textPrimary, fontSize: fontSizes.lg },
  section: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  label: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.md, fontWeight: fontWeights.semibold },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardText: { fontSize: fontSizes.md, color: colors.textPrimary, fontWeight: fontWeights.semibold },
  cardSubtext: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.sm },
  amountText: { fontSize: fontSizes['2xl'], color: colors.primary, fontWeight: fontWeights.bold },
  dropdownCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  dropdownText: { flex: 1, fontSize: fontSizes.md, color: colors.textPrimary, fontWeight: fontWeights.semibold },
  chevron: { fontSize: fontSizes.xl, color: colors.primary },
  methodList: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  methodItem: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  methodItemText: { color: colors.textPrimary, fontSize: fontSizes.sm },
  methodItemActive: { color: colors.primary, fontSize: fontSizes.sm, fontWeight: fontWeights.semibold },
  bottomButton: { marginHorizontal: spacing.xl, marginBottom: spacing.xl },
  primaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonDisabled: { opacity: 0.5 },
  primaryButtonText: { fontSize: fontSizes.md, fontWeight: fontWeights.semibold, color: colors.background },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.md },
});
