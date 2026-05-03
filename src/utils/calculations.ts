import { Cadence } from '../types/bill';

/**
 * Calculate micro-contribution amount based on cadence and days until due
 */
export function calculateContribution(
  amount: number,
  dueDay: number,
  cadence: Cadence
): { perPeriod: number; periods: number; label: string } {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  let dueDate = new Date(thisYear, thisMonth, dueDay);
  if (dueDate <= today) {
    dueDate = new Date(thisYear, thisMonth + 1, dueDay);
  }

  const daysUntilDue = Math.max(
    1,
    Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  );

  switch (cadence) {
    case 'daily': {
      const periods = daysUntilDue;
      return {
        perPeriod: Math.ceil((amount / periods) * 100) / 100,
        periods,
        label: '/day',
      };
    }
    case 'weekly': {
      const periods = Math.max(1, Math.ceil(daysUntilDue / 7));
      return {
        perPeriod: Math.ceil((amount / periods) * 100) / 100,
        periods,
        label: '/week',
      };
    }
    case 'biweekly': {
      const periods = Math.max(1, Math.ceil(daysUntilDue / 14));
      return {
        perPeriod: Math.ceil((amount / periods) * 100) / 100,
        periods,
        label: '/2 weeks',
      };
    }
    case 'monthly': {
      return {
        perPeriod: amount,
        periods: 1,
        label: '/month',
      };
    }
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, showCents = true): string {
  if (showCents) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `$${Math.round(amount).toLocaleString('en-US')}`;
}

/**
 * Get the next due date for a bill
 */
export function getNextDueDate(dueDay: number): Date {
  const today = new Date();
  const thisMonth = today.getMonth();
  const thisYear = today.getFullYear();

  let dueDate = new Date(thisYear, thisMonth, dueDay);
  if (dueDate <= today) {
    dueDate = new Date(thisYear, thisMonth + 1, dueDay);
  }
  return dueDate;
}

/**
 * Format a date nicely
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Get funded percentage
 */
export function getFundedPercent(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((current / target) * 100));
}
