import React, { useState } from 'react';
import { Alert, View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

export function EditProfileScreen({ navigation }: any) {
  const { userProfile, updateProfileAsync, isLoading } = useStore();
  const [username, setUsername] = useState(userProfile.username || '');
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [phoneNumber, setPhoneNumber] = useState(userProfile.phoneNumber || '');

  const handleSave = async () => {
    if (!username.trim() || !firstName.trim() || !lastName.trim()) {
      Alert.alert('Missing Profile Details', 'Username, first name, and last name are required.');
      return;
    }

    const result = await updateProfileAsync({
      username: username.trim(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),
    });

    if (result.error) {
      Alert.alert('Update Failed', result.error);
      return;
    }

    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 50 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstName.trim()[0]?.toUpperCase() || 'U'}</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter username"
            placeholderTextColor={colors.textMuted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter first name"
            placeholderTextColor={colors.textMuted}
            value={firstName}
            onChangeText={setFirstName}
            editable={!isLoading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter last name"
            placeholderTextColor={colors.textMuted}
            value={lastName}
            onChangeText={setLastName}
            editable={!isLoading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Add phone number"
            placeholderTextColor={colors.textMuted}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            editable={!isLoading}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.readOnlyField}>
            <Text style={styles.fieldValue}>{userProfile.email}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} onPress={handleSave} disabled={isLoading}>
          <Text style={styles.saveButtonText}>{isLoading ? 'Saving...' : 'Save Changes'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  backBtn: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textSecondary },
  headerTitle: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  content: { padding: spacing.lg },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.backgroundCard, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  avatarText: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  section: { marginBottom: spacing.lg },
  label: { fontSize: fontSizes.sm, fontWeight: fontWeights.semibold, color: colors.textPrimary, marginBottom: spacing.sm },
  input: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, fontSize: fontSizes.base, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  readOnlyField: { backgroundColor: colors.backgroundInput, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: spacing.md, borderWidth: 1, borderColor: colors.border },
  fieldValue: { fontSize: fontSizes.base, color: colors.textPrimary },
  footer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border },
  saveButton: { backgroundColor: colors.primary, borderRadius: borderRadius.lg, paddingVertical: spacing.md, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.background },
});
