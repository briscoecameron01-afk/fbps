import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/authStore';
import { useBillStore } from '@/store/billStore';
import { colors, typography, spacing } from '@/theme';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const { bills, contributions, isLoading, fetchBills, fetchContributions } = useBillStore();

  useEffect(() => {
    if (user?.id) {
      fetchBills(user.id);
      fetchContributions(user.id);
    }
  }, [user?.id]);

  const totalDue = bills.reduce((sum, bill) => sum + bill.amount, 0);
  const paidContributions = contributions.filter((c) => c.is_paid).length;
  const totalContributions = contributions.length;

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
          paddingBottom: spacing['3xl'],
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginTop: spacing.lg, marginBottom: spacing['2xl'] }}>
          <Text style={{ ...typography.h2, color: colors.text }}>
            Welcome back!
          </Text>
          <Text style={{ ...typography.body, color: colors.textSecondary, marginTop: spacing.sm }}>
            {user?.full_name}
          </Text>
        </View>

        {/* Summary Cards */}
        {isLoading ? (
          <View style={{ alignItems: 'center', marginVertical: spacing['3xl'] }}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <>
            {/* Total Due Card */}
            <View
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: colors.primary,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm }}>
                    Total Monthly Bills
                  </Text>
                  <Text style={{ ...typography.h3, color: colors.text }}>
                    ${totalDue.toFixed(2)}
                  </Text>
                </View>
                <MaterialIcons name="receipt-long" size={32} color={colors.primary} />
              </View>
            </View>

            {/* Progress Card */}
            <View
              style={{
                backgroundColor: colors.bgCard,
                borderRadius: 12,
                padding: spacing.lg,
                marginBottom: spacing.lg,
                borderLeftWidth: 4,
                borderLeftColor: colors.success,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginBottom: spacing.sm }}>
                    Contributions Progress
                  </Text>
                  <Text style={{ ...typography.h3, color: colors.text }}>
                    {paidContributions} / {totalContributions}
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 6,
                      backgroundColor: colors.border,
                      borderRadius: 3,
                      marginTop: spacing.md,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: totalContributions > 0 ? `${(paidContributions / totalContributions) * 100}%` : '0%',
                        height: '100%',
                        backgroundColor: colors.success,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Upcoming Bills */}
            {bills.length > 0 ? (
              <View>
                <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.lg }}>
                  Upcoming Bills
                </Text>
                {bills.slice(0, 3).map((bill) => (
                  <View
                    key={bill.id}
                    style={{
                      backgroundColor: colors.bgCard,
                      borderRadius: 12,
                      padding: spacing.md,
                      marginBottom: spacing.md,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <View>
                      <Text style={{ ...typography.bodyLarge, color: colors.text }}>
                        {bill.name}
                      </Text>
                      <Text style={{ ...typography.bodySmall, color: colors.textSecondary, marginTop: spacing.xs }}>
                        Due on day {bill.due_date}
                      </Text>
                    </View>
                    <Text style={{ ...typography.bodyLarge, color: colors.primary, fontWeight: '600' }}>
                      ${bill.amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View style={{ alignItems: 'center', marginVertical: spacing['3xl'] }}>
                <Text style={{ ...typography.body, color: colors.textSecondary }}>
                  No bills yet. Add one to get started!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
