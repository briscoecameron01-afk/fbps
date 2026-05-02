import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, fontSizes, spacing } from '../theme';

export function EmployerProgramScreen({ navigation }: { navigation: any }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.back}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Employer Program</Text>
      <Text style={styles.body}>Employer benefits setup is not configured in this build yet.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing['2xl'],
    backgroundColor: colors.bg,
  },
  back: {
    color: colors.primary,
    fontSize: fontSizes.md,
    marginBottom: spacing.xl,
  },
  title: {
    color: colors.text,
    fontSize: fontSizes['3xl'],
    fontWeight: '800',
    marginBottom: spacing.md,
  },
  body: {
    color: colors.textSecondary,
    fontSize: fontSizes.md,
  },
});
