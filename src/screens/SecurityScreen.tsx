import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';

export function SecurityScreen({ navigation }: any) {
  const [rememberMe, setRememberMe] = useState(false);
  const [faceID, setFaceID] = useState(true);
  const [biometricID, setBiometricID] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Remember me</Text>
            <Text style={styles.settingDescription}>Stay logged in on this device</Text>
          </View>
          <Switch value={rememberMe} onValueChange={setRememberMe} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={rememberMe ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Face ID</Text>
            <Text style={styles.settingDescription}>Use face recognition to unlock</Text>
          </View>
          <Switch value={faceID} onValueChange={setFaceID} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={faceID ? colors.primary : colors.backgroundInput} />
        </View>
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Biometric ID</Text>
            <Text style={styles.settingDescription}>Use fingerprint to unlock</Text>
          </View>
          <Switch value={biometricID} onValueChange={setBiometricID} trackColor={{ false: colors.border, true: colors.primary }} thumbColor={biometricID ? colors.primary : colors.backgroundInput} />
        </View>
        <TouchableOpacity style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Google Authentication</Text>
            <Text style={styles.settingDescription}>Add 2FA via Google Authenticator</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
        <View style={styles.buttonSection}>
          <TouchableOpacity style={styles.updatePasswordButton}>
            <Text style={styles.updatePasswordButtonText}>Update Password</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  settingItem: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingLabel: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.xs },
  settingDescription: { fontSize: fontSizes.sm, color: colors.textSecondary },
  chevron: { fontSize: fontSizes.xl, color: colors.textSecondary },
  buttonSection: { marginTop: spacing.xl },
  updatePasswordButton: { backgroundColor: 'transparent', borderRadius: borderRadius.lg, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  updatePasswordButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
});
