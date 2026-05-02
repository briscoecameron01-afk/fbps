import React, { useState, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform,
} from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '@/theme';
import { Button } from '../components';
import { createLinkToken, exchangePublicToken, openPlaidLinkWeb } from '../services/plaid';

// ── Plaid Link SDK ──────────────────────────────────────
// Production: uses react-native-plaid-link-sdk (requires dev build)
// Development: falls back to simulated flow for Expo Go
let PlaidLink: any = null;
if (Platform.OS !== 'web') {
try {
  const plaidModule = require('react-native-plaid-link-sdk');
  PlaidLink = plaidModule;
} catch {
  // Plaid SDK not available (Expo Go) — will use simulated flow
}
}

interface Props {
  navigation: any;
  route?: any;
}

type LinkState = 'idle' | 'loading' | 'linking' | 'success' | 'error';

export function LinkBankScreen({ navigation, route }: Props) {
  const [state, setState] = useState<LinkState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const isOnboarding = route?.params?.onboarding ?? false;

  // Pre-fetch link token when screen mounts for faster UX
  useEffect(() => {
    prefetchLinkToken();
  }, []);

  const prefetchLinkToken = async () => {
    try {
      const token = await createLinkToken();
      setLinkToken(token);
    } catch (err) {
      // Don't show error yet — will retry when user taps button
      console.log('Pre-fetch link token failed (will retry on tap):', err);
    }
  };

  const handleSuccess = useCallback(async () => {
    if (isOnboarding) {
      setTimeout(() => navigation.replace('Main'), 1500);
    } else {
      setTimeout(() => navigation.goBack(), 1500);
    }
  }, [navigation, isOnboarding]);

  // ── Real Plaid Link SDK flow ──────────────────────────
  const handleLinkWithSDK = useCallback(async () => {
    try {
      setState('loading');
      setErrorMessage('');

      // Get or reuse link token
      let token = linkToken;
      if (!token) {
        token = await createLinkToken();
        setLinkToken(token);
      }

      // Create the Plaid Link instance
      PlaidLink.create({ token });

      setState('linking');

      // Open the Plaid Link UI
      PlaidLink.open({
        onSuccess: async (result: any) => {
          try {
            const { publicToken, metadata } = result;
            await exchangePublicToken(publicToken, {
              institution: metadata?.institution,
            });
            setState('success');
            handleSuccess();
          } catch (err: any) {
            setState('error');
            setErrorMessage(err.message || 'Failed to link account');
          }
        },
        onExit: (exit: any) => {
          if (exit?.error) {
            setState('error');
            setErrorMessage(exit.error.displayMessage || exit.error.message || 'Connection interrupted');
          } else {
            // User cancelled
            setState('idle');
          }
        },
      });
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || 'Failed to start bank linking');
    }
  }, [linkToken, handleSuccess]);

  const handleLinkWithWeb = useCallback(async () => {
    try {
      setState('loading');
      setErrorMessage('');

      let token = linkToken;
      if (!token) {
        token = await createLinkToken();
        setLinkToken(token);
      }

      setState('linking');
      const result = await openPlaidLinkWeb(token);
      await exchangePublicToken(result.publicToken, {
        institution: result.metadata?.institution,
      });
      setState('success');
      handleSuccess();
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message || 'Failed to connect bank');
    }
  }, [linkToken, handleSuccess]);

  // ── Simulated flow for Expo Go / development ──────────
  const handleLinkSimulated = useCallback(async () => {
    try {
      setState('loading');
      setErrorMessage('');

      // Still fetch a real link token to verify the backend works
      let token = linkToken;
      if (!token) {
        token = await createLinkToken();
        setLinkToken(token);
      }

      setState('linking');

      Alert.alert(
        'Plaid Link (Sandbox)',
        'The real Plaid UI opens in production builds. For sandbox testing, simulate a bank connection.',
        [
          {
            text: 'Connect Chase Bank',
            onPress: async () => {
              try {
                const result = await exchangePublicToken(
                  'public-sandbox-test-token',
                  {
                    institution: {
                      name: 'Chase Bank',
                      institution_id: 'ins_3',
                    },
                  }
                );
                setState('success');
                handleSuccess();
              } catch (err: any) {
                setState('error');
                setErrorMessage(err.message);
              }
            },
          },
          {
            text: 'Connect Bank of America',
            onPress: async () => {
              try {
                await exchangePublicToken(
                  'public-sandbox-test-token',
                  {
                    institution: {
                      name: 'Bank of America',
                      institution_id: 'ins_1',
                    },
                  }
                );
                setState('success');
                handleSuccess();
              } catch (err: any) {
                setState('error');
                setErrorMessage(err.message);
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setState('idle'),
          },
        ]
      );
    } catch (err: any) {
      setState('error');
      setErrorMessage(err.message);
    }
  }, [linkToken, handleSuccess]);

  // Choose the right handler based on SDK availability
  const handleLinkBank =
    Platform.OS === 'web'
      ? handleLinkWithWeb
      : PlaidLink
        ? handleLinkWithSDK
        : handleLinkSimulated;

  const handleSkip = () => {
    if (isOnboarding) {
      navigation.replace('Main');
    } else {
      navigation.goBack();
    }
  };

  const handleRetry = () => {
    setErrorMessage('');
    setState('idle');
    prefetchLinkToken();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      {!isOnboarding && (
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backBtn}>{'←'} Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Link Bank Account</Text>
          <View style={{ width: 50 }} />
        </View>
      )}

      <View style={styles.content}>
        {/* Icon */}
        <View style={[
          styles.iconContainer,
          state === 'success' && styles.iconContainerSuccess,
          state === 'error' && styles.iconContainerError,
        ]}>
          {state === 'success' ? (
            <Text style={styles.iconEmoji}>{'✅'}</Text>
          ) : state === 'error' ? (
            <Text style={styles.iconEmoji}>{'⚠️'}</Text>
          ) : (
            <Text style={styles.iconEmoji}>{'🏦'}</Text>
          )}
        </View>

        {/* Title & description based on state */}
        {state === 'success' ? (
          <>
            <Text style={styles.title}>Account Linked!</Text>
            <Text style={styles.subtitle}>
              Your bank account has been connected successfully. We'll start scanning for recurring bills automatically.
            </Text>
          </>
        ) : state === 'error' ? (
          <>
            <Text style={styles.title}>Connection Failed</Text>
            <Text style={styles.subtitle}>
              {errorMessage || 'Something went wrong while connecting to your bank. Please try again.'}
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>
              {isOnboarding ? 'Link your bank account' : 'Connect a bank account'}
            </Text>
            <Text style={styles.subtitle}>
              We use Plaid to securely connect to your bank. We can only view transactions — we can never move money without your permission.
            </Text>
          </>
        )}

        {/* SDK status indicator */}
        {state === 'idle' && !PlaidLink && (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerText}>
              Development Mode — Using simulated bank connection
            </Text>
          </View>
        )}

        {/* Security badges */}
        {(state === 'idle' || state === 'loading') && (
          <View style={styles.badges}>
            {[
              { icon: '🔒', text: '256-bit encryption' },
              { icon: '🛡️', text: 'SOC 2 compliant' },
              { icon: '👁️', text: 'Read-only access' },
            ].map((badge, i) => (
              <View key={i} style={styles.badge}>
                <Text style={{ fontSize: 16 }}>{badge.icon}</Text>
                <Text style={styles.badgeText}>{badge.text}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Supported banks */}
        {state === 'idle' && (
          <View style={styles.banksSection}>
            <Text style={styles.banksLabel}>Works with 12,000+ banks including:</Text>
            <View style={styles.banksRow}>
              {['Chase', 'BofA', 'Wells Fargo', 'Citi', 'Capital One'].map((bank, i) => (
                <View key={i} style={styles.bankChip}>
                  <Text style={styles.bankChipText}>{bank}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {state === 'loading' || state === 'linking' ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.teal} />
            <Text style={styles.loadingText}>
              {state === 'loading' ? 'Preparing secure connection...' : 'Connecting to your bank...'}
            </Text>
          </View>
        ) : state === 'success' ? (
          <Button
            title={isOnboarding ? 'Continue to Dashboard' : 'Done'}
            onPress={() => isOnboarding ? navigation.replace('Main') : navigation.goBack()}
            size="lg"
            style={{ width: '100%' }}
          />
        ) : state === 'error' ? (
          <>
            <Button
              title="Try Again"
              onPress={handleRetry}
              size="lg"
              style={{ width: '100%' }}
            />
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>
                {isOnboarding ? 'Skip for now' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Button
              title="Link Bank Account"
              onPress={handleLinkBank}
              size="lg"
              style={{ width: '100%' }}
            />
            <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
              <Text style={styles.skipText}>
                {isOnboarding ? 'Skip for now' : 'Cancel'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingTop: 60,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    color: colors.teal,
    fontSize: fontSizes.md,
  },
  headerTitle: {
    fontWeight: '700',
    color: colors.navy,
    fontSize: fontSizes.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['4xl'],
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  iconContainerSuccess: {
    backgroundColor: '#E8FFF5',
  },
  iconContainerError: {
    backgroundColor: colors.coralBg,
  },
  iconEmoji: {
    fontSize: 44,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 28,
    fontWeight: '700',
    color: colors.navy,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.mid,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing['2xl'],
    maxWidth: 320,
  },
  devBanner: {
    backgroundColor: '#FFF8E1',
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  devBannerText: {
    fontSize: fontSizes.xs,
    color: '#F57F17',
    fontWeight: '500',
    textAlign: 'center',
  },
  badges: {
    gap: spacing.md,
    marginBottom: spacing['2xl'],
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: fontSizes.sm,
    color: colors.mid,
  },
  banksSection: {
    alignItems: 'center',
  },
  banksLabel: {
    fontSize: fontSizes.xs,
    color: colors.light,
    marginBottom: spacing.md,
  },
  banksRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  bankChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    backgroundColor: colors.lightBg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bankChipText: {
    fontSize: fontSizes.xs,
    color: colors.navy,
    fontWeight: '500',
  },
  actions: {
    padding: spacing['2xl'],
    paddingBottom: spacing['4xl'],
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    gap: spacing.md,
  },
  loadingText: {
    color: colors.mid,
    fontSize: fontSizes.sm,
  },
  skipBtn: {
    marginTop: spacing.lg,
    padding: spacing.sm,
  },
  skipText: {
    color: colors.light,
    fontSize: fontSizes.md,
  },
});
