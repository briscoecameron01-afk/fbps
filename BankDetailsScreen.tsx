import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

interface Props { navigation: any; route?: any; }

export function BankDetailsScreen({ navigation, route }: Props) {
  const selectedBank = route?.params?.selectedBank || { id: '1', name: 'Chase Bank' };
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank Details</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.bankInfoCard}>
          <View style={styles.bankIcon}>
            <Text style={styles.bankIconText}>🏦</Text>
          </View>
          <Text style={styles.bankName}>{selectedBank.name}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Enter Account Number or IBAN</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter account number"
            placeholderTextColor={colors.textMuted}
            value={accountNumber}
            onChangeText={setAccountNumber}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Enter Phone Number (Optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="(123) 456-7890"
            placeholderTextColor={colors.textMuted}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('LinkedAccounts')}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  content: { padding: spacing.lg },
  bankInfoCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  bankIcon: { width: 60, height: 60, borderRadius: borderRadius.lg, backgroundColor: colors.backgroundCardLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  bankIconText: { fontSize: fontSizes.xl },
  bankName: { fontSize: fontSizes.lg, fontWeight: fontWeights.semibold, color: colors.textPrimary },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  input: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  nextButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  nextButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
