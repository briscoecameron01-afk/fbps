import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useBillStore } from '@/store/billStore';
import { colors, typography, spacing } from '@/theme';

export default function BillsScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { bills, isLoading, fetchBills } = useBillStore();

  useEffect(() => {
    if (user?.id) {
      fetchBills(user.id);
    }
  }, [user?.id]);

  const renderBill = ({ item }: any) => (
    <TouchableOpacity
      style={{
        backgroundColor: colors.bgCard,
        borderRadius: 12,
        padding: spacing.lg,
        marginBottom: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ ...typography.bodyLarge, color: colors.text, fontWeight: '600' }}>
            {item.name}
          </Text>
          <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs }}>
            Due on day {item.due_date} of each month
          </Text>
          {item.category && (
            <View
              style={{
                marginTop: spacing.md,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  backgroundColor: colors.border,
                  paddingHorizontal: spacing.md,
                  paddingVertical: spacing.xs,
                  borderRadius: 6,
                }}
              >
                <Text style={{ ...typography.caption, color: colors.textSecondary, textTransform: 'capitalize' }}>
                  {item.category}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ ...typography.h4, color: colors.primary, fontWeight: '700' }}>
            ${item.amount.toFixed(2)}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
            style={{ marginTop: spacing.sm }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingTop: insets.top,
      }}
    >
      <View
        style={{
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.lg,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Text style={{ ...typography.h2, color: colors.text }}>Bills</Text>
        <TouchableOpacity
          style={{
            backgroundColor: colors.primary,
            width: 44,
            height: 44,
            borderRadius: 22,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <MaterialIcons name="add" size={24} color={colors.bg} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bills.length > 0 ? (
        <FlatList
          data={bills}
          keyExtractor={(item) => item.id}
          renderItem={renderBill}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing['3xl'],
          }}
          scrollEnabled={true}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <MaterialIcons name="receipt-long" size={48} color={colors.border} />
          <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.lg }}>
            No bills yet
          </Text>
        </View>
      )}
    </View>
  );
}
