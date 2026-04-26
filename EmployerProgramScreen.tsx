import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const WHY_JOIN_POINTS = [
  'Get exclusive employer discounts',
  'Access payroll integration features',
  'Receive company matching contributions',
  'Reduce transaction fees through employer program',
];

export function EmployerProgramScreen({ navigation }: any) {
  const [employerCode, setEmployerCode] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Employer Program Entry</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>Your employer offers Fractional as a benefit to help you manage your bills more effectively. Enter your employer code below to link your account.</Text>
        </View>
        <View style={styles.whyJoinSection}>
          <Text style={styles.whyJoinTitle}>Why join?</Text>
          <View style={styles.whyJoinCard}>
            {WHY_JOIN_POINTS.map((point, index) => (
              <View key={index} style={styles.whyJoinItem}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.whyJoinText}>{point}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Employer Code</Text>
          <TextInput style={styles.input} placeholder="Enter your employer code" placeholderTextColor={colors.textMuted} value={employerCode} onChangeText={setEmployerCode} />
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.linkButton, !employerCode && styles.linkButtonDisabled]} onPress={() => navigation.goBack()} disabled={!employerCode}>
          <Text style={styles.linkButtonText}>Link Employer</Text>
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
  descriptionCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  descriptionText: { fontSize: fontSizes.base, color: colors.textSecondary, lineHeight: fontSizes.base * 1.5 },
  whyJoinSection: { marginBottom: spacing.xl },
  whyJoinTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.md },
  whyJoinCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  whyJoinItem: { flexDirection: 'row', marginBottom: spacing.md },
  bulletPoint: { color: colors.primary, fontSize: fontSizes.base, marginRight: spacing.sm },
  whyJoinText: { fontSize: fontSizes.sm, color: colors.textSecondary, flex: 1, lineHeight: fontSizes.sm * 1.4 },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  input: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  linkButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  linkButtonDisabled: { backgroundColor: colors.textMuted, opacity: 0.5 },
  linkButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
