import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights, screenPadding } from '../theme';

interface PlansComparisonScreenProps {
  navigation: any;
}

export function PlansComparisonScreen({ navigation }: PlansComparisonScreenProps) {
  const handleSelectPremium = () => {
    navigation.navigate('Subscription');
  };

  const comparisonData = [
    {
      feature: 'Bill Tracking',
      freemium: '3 bills',
      premium: 'Unlimited',
      premiumHighlight: true,
    },
    {
      feature: 'Dashboard Analytics',
      freemium: 'Basic',
      premium: 'Advanced',
      premiumHighlight: true,
    },
    {
      feature: 'Bank Automation',
      freemium: false,
      premium: 'Auto-transfer',
      premiumHighlight: true,
    },
    {
      feature: 'Priority Support',
      freemium: false,
      premium: true,
      premiumHighlight: true,
    },
  ];

  const renderCheckmark = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Text style={styles.checkmark}>✓</Text>
      ) : (
        <Text style={styles.cross}>✕</Text>
      );
    }
    return <Text style={styles.text}>{value}</Text>;
  };

  const getValueColor = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? colors.success : colors.error;
    }
    return colors.textSecondary;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Plans Comparison</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        horizontal={false}
      >
        {/* Comparison Table */}
        <View style={styles.comparisonCard}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.featureColumn}>
              <Text style={styles.headerText}>Features</Text>
            </View>
            <View style={styles.planColumn}>
              <Text style={styles.headerText}>Freemium</Text>
            </View>
            <View style={styles.planColumn}>
              <Text style={styles.headerText}>1.5% Fee</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Table Rows */}
          {comparisonData.map((row, index) => (
            <View key={index}>
              <View style={styles.tableRow}>
                <View style={styles.featureColumn}>
                  <Text style={styles.featureText}>{row.feature}</Text>
                </View>
                <View style={styles.planColumn}>
                  <View
                    style={[
                      styles.cellContent,
                      {
                        backgroundColor:
                          typeof row.freemium === 'boolean' && !row.freemium
                            ? colors.errorBg
                            : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        {
                          color: getValueColor(row.freemium),
                          fontWeight: fontWeights.semibold,
                        },
                      ]}
                    >
                      {renderCheckmark(row.freemium)}
                    </Text>
                  </View>
                </View>
                <View style={styles.planColumn}>
                  <View
                    style={[
                      styles.cellContent,
                      {
                        backgroundColor: row.premiumHighlight
                          ? colors.successBg
                          : 'transparent',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        {
                          color: getValueColor(row.premium),
                          fontWeight: fontWeights.semibold,
                        },
                      ]}
                    >
                      {renderCheckmark(row.premium)}
                    </Text>
                  </View>
                </View>
              </View>
              {index < comparisonData.length - 1 && <View style={styles.rowDivider} />}
            </View>
          ))}
        </View>

        {/* Plan Details Cards */}
        <View style={styles.plansRow}>
          {/* Freemium Plan */}
          <View style={[styles.planCard, styles.freemiumCard]}>
            <Text style={styles.planCardTitle}>Freemium</Text>
            <Text style={styles.planCardPrice}>Free</Text>
            <Text style={styles.planCardDesc}>Perfect to get started</Text>
          </View>

          {/* Transaction Fee Plan */}
          <View style={[styles.planCard, styles.premiumCard]}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>👑</Text>
            </View>
            <Text style={styles.planCardTitle}>Transaction Fee</Text>
            <Text style={styles.planCardPrice}>1.5%</Text>
            <Text style={styles.planCardPricePeriod}>per transaction</Text>
            <Text style={styles.planCardDesc}>No monthly subscription</Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Simple Usage-Based Pricing</Text>
          <Text style={styles.ctaDesc}>
            No monthly price. Fractional charges a 1.5% fee only when a transaction is processed.
          </Text>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={handleSelectPremium}
          >
            <Text style={styles.selectButtonText}>View Fee Details</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    fontSize: fontSizes.lg,
    color: colors.primary,
    fontWeight: fontWeights.bold as any,
  },
  headerTitle: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: screenPadding.horizontal,
    paddingVertical: spacing.lg,
  },
  comparisonCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing['2xl'],
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.backgroundCardLight,
  },
  featureColumn: {
    flex: 1.2,
  },
  planColumn: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  featureText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: fontWeights.semibold as any,
  },
  cellContent: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold as any,
  },
  checkmark: {
    fontSize: fontSizes.base,
    color: colors.success,
    fontWeight: fontWeights.bold as any,
  },
  cross: {
    fontSize: fontSizes.base,
    color: colors.error,
    fontWeight: fontWeights.bold as any,
  },
  text: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
  },
  plansRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  planCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  freemiumCard: {
    backgroundColor: colors.backgroundCard,
    borderColor: colors.border,
  },
  premiumCard: {
    backgroundColor: colors.backgroundCardLight,
    borderColor: colors.primary,
  },
  premiumBadge: {
    marginBottom: spacing.md,
  },
  premiumBadgeText: {
    fontSize: fontSizes.xl,
  },
  planCardTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  planCardPrice: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold as any,
    color: colors.primary,
  },
  planCardPricePeriod: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  planCardDesc: {
    fontSize: fontSizes.xs,
    color: colors.textMuted,
    textAlign: 'center',
  },
  ctaSection: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  ctaTitle: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.bold as any,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  ctaDesc: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: fontSizes.sm * 1.5,
  },
  selectButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: '100%',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: fontSizes.base,
    fontWeight: fontWeights.semibold as any,
    color: colors.background,
  },
});
