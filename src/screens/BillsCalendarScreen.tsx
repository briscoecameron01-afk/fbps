import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';

interface Props {
  navigation: any;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasBills: boolean;
  isSelected: boolean;
}

const mockBills = [
  { id: '1', name: 'Electricity', dueDate: 'Mar 10', amount: '$120', status: 'Completed' as const },
  { id: '2', name: 'Internet', dueDate: 'Mar 15', amount: '$79', status: 'Current' as const },
  { id: '3', name: 'Water', dueDate: 'Mar 20', amount: '$50', status: 'Upcoming' as const },
  { id: '4', name: 'Insurance', dueDate: 'Mar 25', amount: '$150', status: 'Upcoming' as const },
];

const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

const generateCalendarDays = (date: Date): CalendarDay[] => {
  const daysInMonth = getDaysInMonth(date);
  const firstDay = getFirstDayOfMonth(date);
  const days: CalendarDay[] = [];

  // Previous month days
  const prevMonthDays = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      date: prevMonthDays - i,
      isCurrentMonth: false,
      hasBills: false,
      isSelected: false,
    });
  }

  // Current month days
  const billDates = [10, 15, 20, 25];
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      hasBills: billDates.includes(i),
      isSelected: i === date.getDate(),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: i,
      isCurrentMonth: false,
      hasBills: false,
      isSelected: false,
    });
  }

  return days;
};

export function BillsCalendarScreen({ navigation }: Props) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

  const calendarDays = generateCalendarDays(currentDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bills Calendar</Text>
        <TouchableOpacity>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar Card */}
        <View style={styles.calendarCard}>
          {/* Month Navigation */}
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.navArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.navArrow}>→</Text>
            </TouchableOpacity>
          </View>

          {/* Day Headers */}
          <View style={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.dayHeader}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.calendarDay,
                  !day.isCurrentMonth && styles.calendarDayOtherMonth,
                  day.isSelected && styles.calendarDaySelected,
                  day.hasBills && !day.isSelected && styles.calendarDayWithBills,
                ]}
                onPress={() => day.isCurrentMonth && setSelectedDate(day.date)}
              >
                <Text
                  style={[
                    styles.calendarDayText,
                    !day.isCurrentMonth && styles.calendarDayTextOtherMonth,
                    day.isSelected && styles.calendarDayTextSelected,
                  ]}
                >
                  {day.date}
                </Text>
                {day.hasBills && (
                  <View
                    style={[
                      styles.billIndicator,
                      day.isSelected && styles.billIndicatorSelected,
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.primary }]}
              />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors.current }]}
              />
              <Text style={styles.legendText}>Bill Due</Text>
            </View>
          </View>
        </View>

        {/* Bills List */}
        <View style={styles.billsSection}>
          <Text style={styles.billsTitle}>Bills</Text>
          {mockBills.map((bill) => (
            <TouchableOpacity key={bill.id} style={styles.billRow} activeOpacity={0.7}>
              <View style={styles.billInfo}>
                <Text style={styles.billName}>{bill.name}</Text>
                <Text style={styles.billDate}>{bill.dueDate}</Text>
              </View>
              <View style={styles.billRight}>
                <Text style={styles.billAmount}>{bill.amount}</Text>
                <Text
                  style={[
                    styles.billStatusText,
                    {
                      color:
                        bill.status === 'Completed'
                          ? colors.completed
                          : bill.status === 'Current'
                          ? colors.current
                          : colors.upcoming,
                    },
                  ]}
                >
                  {bill.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Add Bill Button */}
        <TouchableOpacity style={styles.addBillButton}>
          <Text style={styles.addBillButtonText}>+ Add Bill</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  menuButton: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '600',
  },
  calendarCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  navArrow: {
    color: colors.textPrimary,
    fontSize: fontSizes.xl,
    fontWeight: '600',
  },
  monthName: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
  },
  dayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  dayHeader: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
    fontWeight: '600',
    width: '14.2%',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.lg,
  },
  calendarDay: {
    width: '14.2%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  calendarDayOtherMonth: {
    opacity: 0.4,
  },
  calendarDaySelected: {
    backgroundColor: colors.primary,
  },
  calendarDayWithBills: {
    backgroundColor: colors.current + '20',
    borderWidth: 1,
    borderColor: colors.current,
  },
  calendarDayText: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  calendarDayTextOtherMonth: {
    color: colors.textMuted,
  },
  calendarDayTextSelected: {
    color: colors.background,
  },
  billIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.current,
    marginTop: 2,
  },
  billIndicatorSelected: {
    backgroundColor: colors.background,
  },
  legend: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    color: colors.textSecondary,
    fontSize: fontSizes.xs,
  },
  billsSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },
  billsTitle: {
    color: colors.textPrimary,
    fontSize: fontSizes.lg,
    fontWeight: '700',
    marginBottom: spacing.lg,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  billInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  billName: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
  billDate: {
    color: colors.textSecondary,
    fontSize: fontSizes.sm,
  },
  billRight: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  billAmount: {
    color: colors.textPrimary,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
  billStatusText: {
    fontSize: fontSizes.xs,
    fontWeight: '600',
  },
  addBillButton: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addBillButtonText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '700',
  },
});
