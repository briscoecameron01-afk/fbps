export type Cadence = 'daily' | 'weekly' | 'biweekly' | 'monthly';

export type BillCategory =
  | 'housing'
  | 'transport'
  | 'utilities'
  | 'insurance'
  | 'subscriptions'
  | 'loans'
  | 'other';

export type BillType = 'recurring' | 'one_time';

export type BillStatus = 'on_track' | 'behind' | 'completed' | 'upcoming';

export interface LinkedAccount {
  id: string;
  bankName: string;
  accountMask: string;
  accountType: 'checking' | 'savings';
  isPrimary: boolean;
  institutionId: string;
  createdAt: string;
}

export interface Transfer {
  id: string;
  billId: string;
  billName: string;
  amount: number;
  date: string;
  status: 'success' | 'pending' | 'failed';
  fundingSource: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Notification {
  id: string;
  type: 'contribution_reminder' | 'due_date' | 'missed_contribution' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatarUrl?: string;
  plan: 'freemium' | 'premium';
  streakDays: number;
  employerLinked: boolean;
  hasCompletedOnboarding: boolean;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDay: number; // 1-31
  dueDate?: string; // ISO date
  billType?: BillType; // defaults to 'recurring'
  category: BillCategory;
  icon: string;
  isActive: boolean;
  autoPay: boolean;
  cadence: Cadence;
  createdAt: string;
  updatedAt: string;
}

export interface BillBucket {
  id: string;
  billId: string;
  targetAmount: number;
  currentAmount: number;
  billingPeriod: string; // ISO date of first of month
  status: 'funding' | 'ready' | 'paid';
  paidAt?: string;
}

export interface Contribution {
  id: string;
  billId: string;
  bucketId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  executedAt?: string;
  createdAt: string;
}

export interface ContributionSchedule {
  id: string;
  billId: string;
  cadence: Cadence;
  amount: number;
  nextRunAt: string;
  status: 'active' | 'paused';
}

export const CATEGORY_ICONS: Record<BillCategory, string> = {
  housing: '🏠',
  transport: '🚗',
  utilities: '⚡',
  insurance: '🛡️',
  subscriptions: '📺',
  loans: '🏦',
  other: '📋',
};

export const CATEGORY_LABELS: Record<BillCategory, string> = {
  housing: 'Housing',
  transport: 'Transport',
  utilities: 'Utilities',
  insurance: 'Insurance',
  subscriptions: 'Subscriptions',
  loans: 'Loans',
  other: 'Other',
};
