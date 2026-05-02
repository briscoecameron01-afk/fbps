import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

export function MyProfileScreen({ navigation }: any) {
  const { userProfile, userName } = useStore();
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <Text style={styles.editIcon}>Edit</Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{displayName[0]?.toUpperCase() || 'U'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.fieldValue}>{userProfile.username}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Name</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.fieldValue}>{displayName}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.fieldValue}>{userProfile.phoneNumber || 'Not added'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.fieldValue}>{userProfile.email}</Text>
          </View>
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
  editIcon: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.primary },
  content: { padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  avatarText: { fontSize: fontSizes.xl },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  readOnlyField: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  fieldValue: { fontSize: fontSizes.base, color: colors.textPrimary },
});
