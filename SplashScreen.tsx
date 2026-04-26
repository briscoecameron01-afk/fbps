import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { colors, typography } from '@/theme';

export default function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.bg,
      }}
    >
      <Text style={{ ...typography.h1, color: colors.primary, marginBottom: 24 }}>
        Fractional Bill Pay
      </Text>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
