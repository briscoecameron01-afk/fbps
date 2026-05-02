import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { colors, typography, spacing } from '@/theme';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, signOut } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const menuItems = [
    { icon: 'person', label: 'Edit Profile' },
    { icon: 'payment', label: 'Payment Methods' },
    { icon: 'account-balance-wallet', label: 'Linked Accounts' },
    { icon: 'star', label: 'Premium' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'help', label: 'Help & Support' },
  ];

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: insets.top,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          paddingBottom: spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View
          style={{
            backgroundColor: colors.bgCard,
            borderRadius: 12,
            padding: spacing.lg,
            marginBottom: spacing['2xl'],
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.primary,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: spacing.lg,
            }}
          >
            <MaterialIcons name="person" size={48} color={colors.bg} />
          </View>
          <Text style={{ ...typography.h3, color: colors.text }}>
            {user?.full_name || 'User'}
          </Text>
          <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs }}>
            {user?.email}
          </Text>
        </View>

        {/* Menu Items */}
        <View>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: spacing.lg,
                marginBottom: spacing.md,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <MaterialIcons name={item.icon as any} size={24} color={colors.primary} />
                <Text style={{ ...typography.bodyLarge, color: colors.text, marginLeft: spacing.md }}>
                  {item.label}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: colors.error,
            borderRadius: 12,
            padding: spacing.md,
            alignItems: 'center',
            marginTop: spacing['2xl'],
          }}
        >
          <Text style={{ ...typography.bodyLarge, color: colors.white, fontWeight: '600' }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
