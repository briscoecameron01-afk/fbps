import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { colors, spacing, fontSizes, borderRadius } from '../theme';
import { useStore } from '../hooks/useStore';
import { formatCurrency, formatDate, getNextDueDate } from '../utils/calculations';

interface Props {
  navigation: any;
}

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  hasBills: boolean;
  isSelected: boolean;
}

const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

const isSameMonth = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();

const generateCalendarDays = (date: Date, billDates: number[], selectedDate: number): CalendarDay[] => {
  const daysInMonth = getDaysInMonth(date);
  const firstDay = getFirstDayOfMonth(date);
  const days: CalendarDay[] = [];
  const prevMonthDays = getDaysInMonth(new Date(date.getFullYear(), date.getMonth() - 1));

  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ date: prevMonthDays - i, isCurrentMonth: false, hasBills: false, isSelected: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      hasBills: billDates.includes(i),
      isSelected: i === selectedDate,
    });
  }

  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({ date: i, isCurrentMonth: false, hasBills: false, isSelected: false });
  }

  return days;
};

export function BillsCalendarScreen({ navigation }: Props) {
  const { bills, buckets } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate.getDate());

  const activeBills = bills.filter((bill) => bill.isActive);
  const billsInMonth = activeBills.filter((bill) => {
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : getNextDueDate(bill.dueDay);
    return isSameMonth(dueDate, currentDate);
  });
  const selectedBills = billsInMonth.filter((bill) => {
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : getNextDueDate(bill.dueDay);
    return dueDate.getDate() === selectedDate;
  });
  const billDates = billsInMonth.map((bill) => {
    const dueDate = bill.dueDate ? new Date(bill.dueDate) : getNextDueDate(bill.dueDay);
    return dueDate.getDate();
  });

  const calendarDays = generateCalendarDays(currentDate, billDates, selectedDate);
  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(next);
    setSelectedDate(1);
  };

  const goToNextMonth = () => {
    const next = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(next);
    setSelectedDate(1);
  };

  const getStatus = (billId: string) => {
    const bucket = buckets.find((item) => item.billId === billId);
    if (bucket?.status === 'paid') return 'Completed';
    if ((bucket?.currentAmount ?? 0) > 0) return 'Current';
    return 'Upcoming';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Completed') return colors.success;
    if (status === 'Current') return colors.primary;
    return colors.warning;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bills Calendar</Text>
        <View style={{ width: 42 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.calendarCard}>
          <View style={styles.monthNav}>
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Text style={styles.navArrow}>‹</Text>
            </TouchableOpacity>
            <Text style={styles.monthName}>{monthName}</Text>
            <TouchableOpacity onPress={goToNextMonth}>
              <Text style={styles.navArrow}>›</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dayHeaders}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, idx) => (
              <TouchableOpacity
                key={`${idx}-${day.date}`}
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
                  <View style={[styles.billIndicator, day.isSelected && styles.billIndicatorSelected]} />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
              <Text style={styles.legendText}>Bill Due</Text>
            </View>
          </View>
        </View>

        <View style={styles.billsSection}>
          <Text style={styles.billsTitle}>Bills Due {monthName.split(' ')[0]} {selectedDate}</Text>
          {selectedBills.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No bills due on this day.</Text>
            </View>
          ) : selectedBills.map((bill) => {
            const status = getStatus(bill.id);
            return (
              <TouchableOpacity
                key={bill.id}
                style={styles.billRow}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('BillDetail', { billId: bill.id })}
              >
                <View style={styles.billInfo}>
                  <Text style={styles.billName}>{bill.name}</Text>
                  <Text style={styles.billDate}>{formatDate(bill.dueDate || getNextDueDate(bill.dueDay))}</Text>
                </View>
                <View style={styles.billRight}>
                  <Text style={styles.billAmount}>{formatCurrency(bill.amount)}</Text>
                  <Text style={[styles.billStatusText, { color: getStatusColor(status) }]}>{status}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.addBillButton} onPress={() => navigation.navigate('AddBill')}>
          <Text style={styles.addBillButtonText}>+ Add Bill</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: { color: colors.primary, fontSize: fontSizes.md, fontWeight: '600' },
  headerTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700' },
  calendarCard: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.lg,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  monthNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  navArrow: { color: colors.textPrimary, fontSize: fontSizes.xl, fontWeight: '600' },
  monthName: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700' },
  dayHeaders: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.md },
  dayHeader: { color: colors.textSecondary, fontSize: fontSizes.sm, fontWeight: '600', width: '14.2%', textAlign: 'center' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing.lg },
  calendarDay: { width: '14.2%', aspectRatio: 1, alignItems: 'center', justifyContent: 'center', borderRadius: borderRadius.sm, marginBottom: spacing.xs },
  calendarDayOtherMonth: { opacity: 0.4 },
  calendarDaySelected: { backgroundColor: colors.primary },
  calendarDayWithBills: { backgroundColor: 'rgba(255, 193, 7, 0.16)', borderWidth: 1, borderColor: colors.warning },
  calendarDayText: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '600' },
  calendarDayTextOtherMonth: { color: colors.textMuted },
  calendarDayTextSelected: { color: colors.background },
  billIndicator: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.warning, marginTop: 2 },
  billIndicatorSelected: { backgroundColor: colors.background },
  legend: { flexDirection: 'row', gap: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { color: colors.textSecondary, fontSize: fontSizes.xs },
  billsSection: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
  billsTitle: { color: colors.textPrimary, fontSize: fontSizes.lg, fontWeight: '700', marginBottom: spacing.lg },
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
  billInfo: { flex: 1, gap: spacing.xs },
  billName: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '600' },
  billDate: { color: colors.textSecondary, fontSize: fontSizes.sm },
  billRight: { alignItems: 'flex-end', gap: spacing.xs },
  billAmount: { color: colors.textPrimary, fontSize: fontSizes.md, fontWeight: '700' },
  billStatusText: { fontSize: fontSizes.xs, fontWeight: '600' },
  emptyCard: { backgroundColor: colors.backgroundCard, borderRadius: borderRadius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyText: { color: colors.textSecondary, fontSize: fontSizes.sm, textAlign: 'center' },
  addBillButton: {
    marginHorizontal: spacing.xl,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  addBillButtonText: { color: colors.background, fontSize: fontSizes.md, fontWeight: '700' },
});
