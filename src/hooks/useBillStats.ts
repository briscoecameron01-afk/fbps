import { useMemo } from 'react';
import { Bill, MicroContribution } from '@/types';

interface BillStatsResult {
  totalBills: number;
  totalAmount: number;
  paidThisMonth: number;
  pendingThisMonth: number;
  dueSoonCount: number;
  averageBillAmount: number;
  on_track_count: number;
  behind_count: number;
}

export function useBillStats(
  bills: Bill[],
  contributions: MicroContribution[]
): BillStatsResult {
  return useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const totalBills = bills.length;
    const totalAmount = bills.reduce((sum, bill) => sum + bill.amount, 0);

    // Count contributions paid this month
    const paidThisMonth = contributions.filter((c) => {
      if (!c.is_paid || !c.paid_at) return false;
      const paidDate = new Date(c.paid_at);
      return (
        paidDate.getMonth() + 1 === currentMonth &&
        paidDate.getFullYear() === currentYear
      );
    }).length;

    const pendingThisMonth = contributions.filter((c) => {
      if (c.is_paid) return false;
      const dueDate = new Date(c.due_date);
      return (
        dueDate.getMonth() + 1 === currentMonth &&
        dueDate.getFullYear() === currentYear
      );
    }).length;

    // Count bills due in next 7 days
    const dueSoonCount = bills.filter((bill) => {
      const daysUntilDue = bill.due_date - now.getDate();
      return daysUntilDue > 0 && daysUntilDue <= 7;
    }).length;

    const averageBillAmount = totalBills > 0 ? totalAmount / totalBills : 0;

    // Count on-track and behind bills
    let on_track_count = 0;
    let behind_count = 0;

    bills.forEach((bill) => {
      const billContributions = contributions.filter((c) => c.bill_id === bill.id);
      const totalPaid = billContributions
        .filter((c) => c.is_paid)
        .reduce((sum, c) => sum + c.amount, 0);

      if (totalPaid >= bill.amount) {
        on_track_count++;
      } else if (totalPaid === 0 && bill.due_date < now.getDate()) {
        behind_count++;
      }
    });

    return {
      totalBills,
      totalAmount,
      paidThisMonth,
      pendingThisMonth,
      dueSoonCount,
      averageBillAmount,
      on_track_count,
      behind_count,
    };
  }, [bills, contributions]);
}
