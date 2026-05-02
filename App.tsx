import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useStore } from './src/hooks/useStore';

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>F</Text>
      </View>
      <Text style={styles.appName}>Fractional Bill</Text>
      <ActivityIndicator size="small" color="#00D998" style={styles.spinner} />
    </View>
  );
}

export default function App() {
  const { initialize, isInitialized, isLoading } = useStore();

  useEffect(() => {
    initialize();
  }, []);

  if (!isInitialized && isLoading) {
    return (
      <>
        <StatusBar style="light" />
        <LoadingScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0A1628',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#00D998',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#0A1628',
  },
  appName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  spinner: {
    marginTop: 8,
  },
});