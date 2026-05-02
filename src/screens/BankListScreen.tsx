import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

interface Props {
  navigation: any;
  route?: any;
}

const BANKS = [
  { id: '1', name: 'Chase Bank' },
  { id: '2', name: 'Bank of America' },
  { id: '3', name: 'Wells Fargo' },
  { id: '4', name: 'Citi' },
  { id: '5', name: 'Capital One' },
  { id: '6', name: 'Ally Bank' },
  { id: '7', name: 'TD Bank' },
  { id: '8', name: 'US Bank' },
];

export function BankListScreen({ navigation }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const filteredBanks = BANKS.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = () => {
    if (selectedBank) {
      const bank = BANKS.find(b => b.id === selectedBank);
      navigation.navigate('BankDetails', { selectedBank: bank });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bank List</Text>
        <View style={{ width: 50 }} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search banks..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Bank List */}
      <FlatList
        data={filteredBanks}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.bankItem,
              selectedBank === item.id && styles.bankItemSelected,
            ]}
            onPress={() => setSelectedBank(item.id)}
          >
            <View style={styles.bankIcon}>
              <Text style={styles.bankIconText}>🏦</Text>
            </View>
            <Text style={styles.bankName}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Select Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.selectButton,
            !selectedBank && styles.selectButtonDisabled,
          ]}
          onPress={handleSelect}
          disabled={!selectedBank}
        >
          <Text style={styles.selectButtonText}>Select</Text>
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textSecondary,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold,
    color: colors.textPrimary,
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInput: {
    backgroundColor: colors.backgroundInput,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: fontSizes.base,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankItemSelected: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  bankIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundCardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  bankIconText: {
    fontSize: fontSizes.xl,
  },
  bankName: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  selectButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  selectButtonDisabled: {
    backgroundColor: colors.textMuted,
    opacity: 0.5,
  },
  selectButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold,
    color: colors.background,
  },
});
