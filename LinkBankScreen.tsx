import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
  route: any;
}

export function LinkBankScreen({ navigation }: Props) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const handleConnectBank = () => {
    navigation.navigate('LinkedAccounts');
  };

  const securityBadges = [
    { icon: '🔒', text: 'Encrypted' },
    { icon: '👁️', text: 'Read-only' },
    { icon: '⚙️', text: 'No password stored' },
    { icon: '✅', text: 'Verified' },
  ];

  const howItWorks = [
    { step: '1', title: 'Connect', description: 'Securely link your bank account' },
    { step: '2', title: 'Verify', description: 'Verify your account with micro-deposits' },
    { step: '3', title: 'Auto-fund', description: 'Set up automatic contributions' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Link Your Bank</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
        {/* Illustration Area */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustration}>🏦</Text>
        </View>

        {/* Main Description */}
        <Text style={styles.mainTitle}>Connect Your Bank Account</Text>
        <Text style={styles.mainDescription}>
          Securely link your bank account to automatically fund your bills. We use Plaid, the industry's most trusted platform.
        </Text>

        {/* Security Badges */}
        <View style={styles.badgesContainer}>
          {securityBadges.map((badge, idx) => (
            <View key={idx} style={styles.badge}>
              <Text style={styles.badgeIcon}>{badge.icon}</Text>
              <Text style={styles.badgeText}>{badge.text}</Text>
            </View>
          ))}
        </View>

        {/* How It Works Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(expandedSection === 'howItWorks' ? null : 'howItWorks')
            }
          >
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.chevron}>
              {expandedSection === 'howItWorks' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'howItWorks' && (
            <View style={styles.sectionContent}>
              {howItWorks.map((item, idx) => (
                <View key={idx} style={styles.stepCard}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{item.step}</Text>
                  </View>
                  <View style={styles.stepContent}>
                    <Text style={styles.stepTitle}>{item.title}</Text>
                    <Text style={styles.stepDescription}>{item.description}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Supported Banks */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(expandedSection === 'banks' ? null : 'banks')
            }
          >
            <Text style={styles.sectionTitle}>Supported Banks</Text>
            <Text style={styles.chevron}>
              {expandedSection === 'banks' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'banks' && (
            <View style={styles.sectionContent}>
              <Text style={styles.supportedBanksText}>
                We support 12,000+ institutions including Chase, Bank of America, Wells Fargo, Citibank, and more.
              </Text>
            </View>
          )}
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() =>
              setExpandedSection(expandedSection === 'faq' ? null : 'faq')
            }
          >
            <Text style={styles.sectionTitle}>Is my data safe?</Text>
            <Text style={styles.chevron}>
              {expandedSection === 'faq' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expandedSection === 'faq' && (
            <View style={styles.sectionContent}>
              <Text style={styles.faqText}>
                Yes! Plaid uses bank-level encryption and never stores your login credentials. We have read-only access to your account information.
              </Text>
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.connectButton} onPress={handleConnectBank}>
          <Text style={styles.connectButtonText}>Connect Bank Account</Text>
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
  illustrationContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  illustration: {
    fontSize: 64,
  },
  mainTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  mainDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: spacing.xl,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  badge: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeIcon: {
    fontSize: fontSizes.md,
  },
  badgeText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  chevron: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  sectionContent: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  stepCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },
  stepNumberText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  stepDescription: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  supportedBanksText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  faqText: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  connectButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
