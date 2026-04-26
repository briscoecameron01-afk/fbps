import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, TextInput } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function ManualContributionScreen({ navigation }: Props) {
  const [selectedBill, setSelectedBill] = useState('netflix');
  const [amount, setAmount] = useState('');
  const [selectedFundingSource, setSelectedFundingSource] = useState('chase');
  const [showBillDropdown, setShowBillDropdown] = useState(false);
  const [showSourceDropdown, setShowSourceDropdown] = useState(false);

  const bills = [
    { id: 'netflix', name: 'Netflix', dueAmount: 15.99, remaining: 5.99 },
    { id: 'spotify', name: 'Spotify', dueAmount: 10.99, remaining: 10.99 },
    { id: 'gym', name: 'Gym Membership', dueAmount: 49.99, remaining: 25.00 },
  ];

  const fundingSources = [
    { id: 'chase', name: 'Chase Bank', mask: '4242' },
    { id: 'boa', name: 'Bank of America', mask: '8765' },
  ];

  const quickAmounts = [5, 10, 25, 50];

  const handleContribute = () => {
    if (amount && selectedBill) {
      navigation.goBack();
    }
  };

  const currentBill = bills.find((b) => b.id === selectedBill);
  const currentSource = fundingSources.find((s) => s.id === selectedFundingSource);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manual Contribution</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Bill Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Bill</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowBillDropdown(!showBillDropdown)}
          >
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownValue}>
                {currentBill?.name || 'Select a bill'}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </View>
          </TouchableOpacity>

          {showBillDropdown && (
            <View style={styles.dropdownMenu}>
              {bills.map((bill) => (
                <TouchableOpacity
                  key={bill.id}
                  style={[
                    styles.dropdownMenuItem,
                    selectedBill === bill.id && styles.dropdownMenuItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedBill(bill.id);
                    setShowBillDropdown(false);
                  }}
                >
                  <View style={styles.billSelectInfo}>
                    <Text style={styles.billSelectName}>{bill.name}</Text>
                    <Text style={styles.billSelectAmount}>
                      ${bill.remaining.toFixed(2)} remaining
                    </Text>
                  </View>
                  {selectedBill === bill.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Amount Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contribution Amount</Text>
          <View style={styles.amountInputContainer}>
            <Text style={styles.currencySymbol}>$</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={colors.textMuted}
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
            />
          </View>

          {currentBill && (
            <Text style={styles.amountHint}>
              Remaining: ${currentBill.remaining.toFixed(2)}
            </Text>
          )}

          {/* Quick Amount Buttons */}
          <View style={styles.quickButtonsContainer}>
            {quickAmounts.map((quickAmount) => (
              <TouchableOpacity
                key={quickAmount}
                style={styles.quickButton}
                onPress={() => setAmount(quickAmount.toFixed(2))}
              >
                <Text style={styles.quickButtonText}>${quickAmount}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.customButton}>
              <Text style={styles.customButtonText}>Custom</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Funding Source Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Funding Source</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowSourceDropdown(!showSourceDropdown)}
          >
            <View style={styles.dropdownHeader}>
              <View>
                <Text style={styles.dropdownValue}>
                  {currentSource?.name || 'Select account'}
                </Text>
                {currentSource && (
                  <Text style={styles.sourceSubtext}>
                    •••• {currentSource.mask}
                  </Text>
                )}
              </View>
              <Text style={styles.chevron}>▼</Text>
            </View>
          </TouchableOpacity>

          {showSourceDropdown && (
            <View style={styles.dropdownMenu}>
              {fundingSources.map((source) => (
                <TouchableOpacity
                  key={source.id}
                  style={[
                    styles.dropdownMenuItem,
                    selectedFundingSource === source.id && styles.dropdownMenuItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedFundingSource(source.id);
                    setShowSourceDropdown(false);
                  }}
                >
                  <View>
                    <Text style={styles.sourceSelectName}>{source.name}</Text>
                    <Text style={styles.sourceSelectMask}>•••• {source.mask}</Text>
                  </View>
                  {selectedFundingSource === source.id && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {amount && currentBill && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Bill</Text>
              <Text style={styles.summaryValue}>{currentBill.name}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text style={styles.summaryValue}>${amount}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>From</Text>
              <Text style={styles.summaryValue}>{currentSource?.name}</Text>
            </View>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contributeButton} onPress={handleContribute}>
          <Text style={styles.contributeButtonText}>Contribute</Text>
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
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  dropdown: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  sourceSubtext: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    marginTop: spacing.xs,
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  dropdownMenu: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.sm,
    overflow: 'hidden',
  },
  dropdownMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownMenuItemSelected: {
    backgroundColor: colors.primary + '10',
  },
  billSelectInfo: {
    flex: 1,
  },
  billSelectName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  billSelectAmount: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  sourceSelectName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  sourceSelectMask: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  checkmark: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: spacing.lg,
    marginBottom: spacing.md,
  },
  currencySymbol: {
    color: colors.textSecondary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
  amountInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  amountHint: {
    color: colors.textMuted,
    fontSize: fontSizes.sm,
    marginBottom: spacing.lg,
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  quickButton: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  quickButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  customButton: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: 'center',
  },
  customButtonText: {
    color: colors.primary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  summaryCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  contributeButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contributeButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
