import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const FORMATS = ['CSV', 'PDF', 'Excel'];

export function ExportReportsScreen({ navigation }: any) {
  const [selectedFormat, setSelectedFormat] = useState('CSV');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Export Reports</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.label}>Format</Text>
          <TouchableOpacity style={styles.dropdown} onPress={() => setShowFormatDropdown(!showFormatDropdown)}>
            <Text style={styles.dropdownText}>{selectedFormat}</Text>
            <Text style={styles.chevron}>▼</Text>
          </TouchableOpacity>
          {showFormatDropdown && (
            <View style={styles.dropdownMenu}>
              {FORMATS.map(format => (
                <TouchableOpacity key={format} style={styles.menuItem} onPress={() => { setSelectedFormat(format); setShowFormatDropdown(false); }}>
                  <Text style={[styles.menuItemText, format === selectedFormat && styles.menuItemTextActive]}>{format}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Date Range</Text>
          <View style={styles.dateRangeContainer}>
            <TextInput style={[styles.dateInput, { marginRight: spacing.md }]} placeholder="Start Date" placeholderTextColor={colors.textMuted} value={startDate} onChangeText={setStartDate} />
            <TextInput style={styles.dateInput} placeholder="End Date" placeholderTextColor={colors.textMuted} value={endDate} onChangeText={setEndDate} />
          </View>
        </View>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Export Information</Text>
          <Text style={styles.infoText}>Your report will include all transactions, contributions, and billing data for the selected date range.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.generateButton} onPress={() => navigation.goBack()}>
          <Text style={styles.generateButtonText}>Generate Report</Text>
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
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  dropdown: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  dropdownText: { fontSize: fontSizes.base, color: colors.textPrimary },
  chevron: { color: colors.textSecondary, fontSize: fontSizes.sm },
  dropdownMenu: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, marginTop: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  menuItem: { paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  menuItemText: { fontSize: fontSizes.base, color: colors.textSecondary },
  menuItemTextActive: { color: colors.primary, fontWeight: fontWeights.semibold },
  dateRangeContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  dateInput: { flex: 1, backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  infoCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginTop: spacing.xl },
  infoTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  infoText: { fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: fontSizes.sm * 1.5 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  generateButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  generateButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
