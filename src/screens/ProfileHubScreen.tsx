import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { colors, spacing, borderRadius, fontSizes, fontWeights } from '../theme';
import { useStore } from '../hooks/useStore';

const MENU_ITEMS = [
  { id: '1', label: 'My Profile', icon: '👤', screen: 'MyProfile' },
  { id: '2', label: 'Rewards', icon: '🏆', screen: 'Rewards' },
  { id: '3', label: 'Pricing', icon: '%', screen: 'Subscription' },
  { id: '4', label: 'Notification', icon: '🔔', screen: 'NotificationSettings' },
  { id: '5', label: 'Security', icon: '🔒', screen: 'Security' },
  { id: '6', label: 'Settings', icon: '⚙️', screen: 'Settings' },
  { id: '7', label: 'Employer Program', icon: '🏢', screen: 'EmployerProgram' },
  { id: '8', label: 'Log out', icon: '🚪', screen: null },
];

export function ProfileHubScreen({ navigation }: any) {
  const { userProfile, userName, signOut } = useStore();
  const displayName = `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userName || userProfile.username;

  const handleMenuPress = (item: typeof MENU_ITEMS[0]) => {
    if (item.screen === null) {
      signOut();
      return;
    }
    navigation.navigate(item.screen);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.headerSection}>
          <Text style={styles.title}>My Profile</Text>
        </View>
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>{displayName}</Text>
        </View>
        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity key={item.id} style={[styles.menuItem, index === MENU_ITEMS.length - 1 && styles.menuItemLast]} onPress={() => handleMenuPress(item)}>
              <View style={styles.menuIconContainer}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.lg },
  headerSection: { marginBottom: spacing.xl, alignItems: 'center' },
  title: { fontSize: fontSizes.xl, fontWeight: fontWeights.bold, color: colors.textPrimary },
  profileCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, alignItems: 'center', marginBottom: spacing.xl, borderWidth: 1, borderColor: colors.border },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.backgroundCardLight, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  avatarText: { fontSize: fontSizes.xl },
  profileName: { fontSize: fontSizes.lg, fontWeight: fontWeights.bold, color: colors.textPrimary },
  menuSection: { gap: spacing.md },
  menuItem: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  menuItemLast: { marginBottom: spacing.xl },
  menuIconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.backgroundCardLight, justifyContent: 'center', alignItems: 'center', marginRight: spacing.md },
  menuIcon: { fontSize: fontSizes.lg },
  menuLabel: { fontSize: fontSizes.base, fontWeight: fontWeights.semibold, color: colors.textPrimary, flex: 1 },
  chevron: { fontSize: fontSizes.xl, color: colors.textSecondary },
});
