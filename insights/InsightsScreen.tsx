import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '@/theme';

export default function InsightsScreen() {
  const insets = useSafeAreaInsets();

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
        <Text style={{ ...typography.h2, color: colors.text, marginBottom: spacing['2xl'] }}>
          Insights
        </Text>

        {/* Monthly Summary Card */}
        <View
          style={{
            backgroundColor: colors.bgCard,
            borderRadius: 12,
            padding: spacing.lg,
            marginBottom: spacing.lg,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.lg }}>
            <MaterialIcons name="calendar-today" size={24} color={colors.primary} />
            <Text style={{ ...typography.h4, color: colors.text, marginLeft: spacing.md }}>
              April 2026
            </Text>
          </View>

          <View style={{ marginBottom: spacing.lg }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Total Bills</Text>
              <Text style={{ ...typography.bodyLarge, color: colors.text, fontWeight: '600' }}>
                $0.00
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Funded</Text>
              <Text style={{ ...typography.bodyLarge, color: colors.success, fontWeight: '600' }}>
                $0.00
              </Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...typography.bodySmall, color: colors.textSecondary }}>Remaining</Text>
              <Text style={{ ...typography.bodyLarge, color: colors.warning, fontWeight: '600' }}>
                $0.00
              </Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        <View>
          <Text style={{ ...typography.h4, color: colors.text, marginBottom: spacing.lg }}>
            Performance
          </Text>

          <View
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 12,
              padding: spacing.lg,
              marginBottom: spacing.lg,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg }}>
              <Text style={{ ...typography.bodyLarge, color: colors.text }}>Contribution Streak</Text>
              <Text style={{ ...typography.h3, color: colors.primary }}>0 days</Text>
            </View>
          </View>

          <View
            style={{
              backgroundColor: colors.bgCard,
              borderRadius: 12,
              padding: spacing.lg,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...typography.bodyLarge, color: colors.text }}>On-Time Rate</Text>
              <Text style={{ ...typography.h3, color: colors.success }}>0%</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
