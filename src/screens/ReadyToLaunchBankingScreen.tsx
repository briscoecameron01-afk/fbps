import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { createReadyToLaunchToken } from '../services/unitReadyToLaunch';

type Props = {
  navigation: any;
};

declare global {
  interface Document {
    createElement(tagName: 'unit-elements-white-label-app'): HTMLElement;
  }
}

function getScriptUrl(environment: string) {
  const normalized = environment.toLowerCase();
  if (normalized === 'production' || normalized === 'live') {
    return 'https://ui.unit.co/release/latest/components-extended.es.js';
  }

  return 'https://ui.s.unit.sh/release/latest/components-extended.es.js';
}

function getContainerNode(refValue: any) {
  return refValue?.getNode?.() || refValue;
}

function loadUnitScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('Unit Ready-to-Launch is available in the web app.'));
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existingScript.addEventListener('load', () => resolve(), { once: true });
      existingScript.addEventListener('error', () => reject(new Error('Unable to load Unit banking.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.type = 'module';
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error('Unable to load Unit banking.'));
    document.head.appendChild(script);
  });
}

export function ReadyToLaunchBankingScreen({ navigation }: Props) {
  const containerRef = useRef<any>(null);
  const unitElementRef = useRef<HTMLElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('Preparing Unit banking...');
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    const mountUnit = async () => {
      setLoading(true);
      setError('');

      if (Platform.OS !== 'web') {
        setError('Ready-to-Launch banking is available in the web app. Open this app in Safari or your installed web app on iPhone.');
        setLoading(false);
        return;
      }

      try {
        setStatus('Creating secure Unit session...');
        const { token, environment } = await createReadyToLaunchToken();
        await loadUnitScript(getScriptUrl(environment));
        if (cancelled) return;

        const container = getContainerNode(containerRef.current) as HTMLElement | null;
        if (!container) throw new Error('Unable to open the Unit banking container.');

        container.innerHTML = '';
        const unitElement = document.createElement('unit-elements-white-label-app');
        unitElement.setAttribute('jwt-token', token);
        unitElement.style.display = 'block';
        unitElement.style.width = '100%';
        unitElement.style.minHeight = '720px';

        const onLoad = () => setStatus('Unit banking is ready.');
        const onCompleted = () => setStatus('Application submitted. Unit is processing the status.');
        unitElement.addEventListener('unitOnLoad', onLoad);
        unitElement.addEventListener('unitApplicationFormCompleted', onCompleted);

        container.appendChild(unitElement);
        unitElementRef.current = unitElement;
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to open Unit banking.');
        setLoading(false);
      }
    };

    mountUnit();

    return () => {
      cancelled = true;
      if (unitElementRef.current) {
        unitElementRef.current.remove();
        unitElementRef.current = null;
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Unit Banking</Text>
        <View style={{ width: 50 }} />
      </View>

      {!!error ? (
        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Unit Banking Is Not Ready</Text>
          <Text style={styles.messageText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.replace('ReadyToLaunchBanking')}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {loading && (
            <View style={styles.loadingBar}>
              <ActivityIndicator color={colors.primary} />
              <Text style={styles.statusText}>{status}</Text>
            </View>
          )}
          <View ref={containerRef} style={styles.unitContainer} />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  loadingBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  statusText: { color: colors.textSecondary, fontSize: fontSizes.sm },
  unitContainer: { flex: 1, minHeight: 720, backgroundColor: colors.background },
  messageCard: { margin: spacing.lg, backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  messageTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: fontWeights.bold, marginBottom: spacing.sm },
  messageText: { color: colors.textSecondary, fontSize: fontSizes.sm, lineHeight: 20 },
  retryButton: { marginTop: spacing.lg, backgroundColor: colors.primary, borderRadius: borderRadius.md, paddingVertical: spacing.md, alignItems: 'center' },
  retryButtonText: { color: colors.background, fontSize: fontSizes.base, fontWeight: fontWeights.semibold },
});
