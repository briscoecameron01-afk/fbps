import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

interface Feature {
  name: string;
  included: boolean;
}

export function SubscriptionScreen({ navigation }: Props) {
  const features: Feature[] = [
    { name: 'Unlimited bills', included: true },
    { name: 'Auto-detect bills', included: true },
    { name: 'Export reports', included: true },
    { name: 'Advanced insights', included: true },
    { name: 'Recurring contributions', included: true },
    { name: 'Priority support', included: true },
    { name: 'Payment history', included: true },
    { name: 'Multi-user access', included: true },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pricing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Simple, transparent pricing</Text>
          <Text style={styles.heroDescription}>No monthly fees. No plan limits. Just a small 1.5% fee on what you use.</Text>
        </View>

        {/* Big Price Display */}
        <View style={styles.priceDisplayCard}>
          <Text style={styles.pricePercentage}>1.5%</Text>
          <Text style={styles.priceSubtitle}>per transaction</Text>
        </View>

        {/* Explanation */}
        <View style={styles.explanationCard}>
          <Text style={styles.explanationText}>
            We charge a small 1.5% fee on every contribution and bill payment. No monthly fees, no hidden charges, no plan limits.
          </Text>
        </View>

        {/* Example Breakdown */}
        <View style={styles.breakdownSection}>
          <Text style={styles.breakdownTitle}>How it works</Text>
          <View style={styles.exampleCard}>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Contribution Amount</Text>
              <Text style={styles.exampleValue}>$100.00</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Transaction Fee (1.5%)</Text>
              <Text style={styles.exampleValueFee}>$1.50</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabelTotal}>Amount to Bucket</Text>
              <Text style={styles.exampleValueTotal}>$98.50</Text>
            </View>
          </View>

          <View style={styles.exampleCard}>
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Rent Payment</Text>
              <Text style={styles.exampleValue}>$1,200.00</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabel}>Transaction Fee (1.5%)</Text>
              <Text style={styles.exampleValueFee}>$18.00</Text>
            </View>
            <View style={styles.exampleDivider} />
            <View style={styles.exampleRow}>
              <Text style={styles.exampleLabelTotal}>Amount Applied</Text>
              <Text style={styles.exampleValueTotal}>$1,182.00</Text>
            </View>
          </View>
        </View>

        {/* What's Included */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>What's included</Text>
          <View style={styles.featuresList}>
            {features.map((feature) => (
              <View key={feature.name} style={styles.featureItem}>
                <Text style={styles.featureCheckmark}>✓</Text>
                <Text style={styles.featureName}>{feature.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqCard}>
          <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Why a transaction fee?</Text>
            <Text style={styles.faqAnswer}>We only make money when you use the app, aligning our incentives with yours. The more you save, the more you're willing to pay.</Text>
          </View>
          <View style={styles.faqDivider} />
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Is there a maximum fee?</Text>
            <Text style={styles.faqAnswer}>The fee is always 1.5%, regardless of transaction size. No caps, no surprises.</Text>
          </View>
          <View style={styles.faqDivider} />
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>What about my current plan?</Text>
            <Text style={styles.faqAnswer}>All users now enjoy the same 1.5% fee model. There are no plan tiers anymore—everyone gets all features.</Text>
          </View>
        </View>

        <View style={{ height: 20 }} />
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
  heroSection: {
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  heroDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
  },
  priceDisplayCard: {
    backgroundColor: colors.primary + '10',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
  },
  pricePercentage: {
    color: colors.primary,
    fontSize: fontSizes.xl * 2,
    fontWeight: '700',
    marginBottom: spacing.sm,
  },
  priceSubtitle: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  explanationCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  explanationText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  breakdownSection: {
    marginBottom: spacing.xl,
  },
  breakdownTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  exampleCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  exampleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  exampleLabel: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  exampleValue: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  exampleValueFee: {
    color: colors.error,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  exampleLabelTotal: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  exampleValueTotal: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  exampleDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  featuresSection: {
    marginBottom: spacing.xl,
  },
  featuresTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  featuresList: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  featureCheckmark: {
    color: colors.primary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginRight: spacing.md,
    width: 24,
  },
  featureName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '500',
  },
  faqCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  faqTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  faqItem: {
    marginBottom: spacing.lg,
  },
  faqDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  faqQuestion: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  faqAnswer: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    lineHeight: 20,
  },
});
