import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

const FEATURES = ['3 bills tracked', 'Basic dashboard analytics', 'No bank automation'];

export function SubscriptionScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription Overview</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.currentPlanCard}>
          <View style={styles.crownIcon}>
            <Text style={styles.crownText}>👑</Text>
          </View>
          <Text style={styles.currentPlanLabel}>Current Plan</Text>
          <Text style={styles.currentPlanName}>Freemium</Text>
        </View>
        <View style={styles.priceCard}>
          <View>
            <Text style={styles.priceAmount}>$70.50</Text>
            <Text style={styles.pricePeriod}>Per Month</Text>
          </View>
          <Text style={styles.pricePlanType}>Monthly plan</Text>
        </View>
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Features Included</Text>
          {FEATURES.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureCheckmark}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        <View style={styles.comparisonCard}>
          <Text style={styles.comparisonTitle}>Upgrade to Premium</Text>
          <Text style={styles.comparisonDesc}>Get access to unlimited bills, advanced analytics, and automatic bank transfers.</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.upgradeButton}>
          <Text style={styles.upgradeButtonText}>Upgrade Plan</Text>
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
  currentPlanCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  crownIcon: { marginBottom: spacing.md },
  crownText: { fontSize: fontSizes.xl },
  currentPlanLabel: { fontSize: fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  currentPlanName: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  priceCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceAmount: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.primary },
  pricePeriod: { fontSize: fontSizes.sm, color: colors.textSecondary, marginTop: spacing.xs },
  pricePlanType: { fontSize: fontSizes.sm, color: colors.textMuted },
  featuresSection: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  featuresTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.lg },
  featureItem: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  featureCheckmark: { fontSize: fontSizes.lg, color: colors.primary, marginRight: spacing.md },
  featureText: { fontSize: fontSizes.base, color: colors.textSecondary, flex: 1 },
  comparisonCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  comparisonTitle: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  comparisonDesc: { fontSize: fontSizes.sm, color: colors.textSecondary, lineHeight: fontSizes.sm * 1.5 },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  upgradeButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  upgradeButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
