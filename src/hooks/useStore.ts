import { create } from 'zustand';
import {
  Bill,
  BillBucket,
  Contribution,
  Cadence,
  LinkedAccount,
  Transfer,
  Achievement,
  Notification,
  UserProfile,
  BillStatus,
} from '../types/bill';

// Import Supabase services (try/catch for conditional availability)
let supabase: any = null;
let AuthService: any = null;
let DatabaseServices: any = null;

try {
  supabase = require('../services/supabase').supabase;
} catch (e) {
  // Supabase not available yet
}

try {
  AuthService = require('../services/auth');
} catch (e) {
  // Auth service not available yet
}

try {
  const db = require('../services/database');
  DatabaseServices = {
    ProfileService: db.ProfileService,
    BillService: db.BillService,
    BucketService: db.BucketService,
    ContributionService: db.ContributionService,
    TransferService: db.TransferService,
    LinkedAccountService: db.LinkedAccountService,
    NotificationService: db.NotificationService,
    AchievementService: db.AchievementService,
  };
} catch (e) {
  // Database services not available yet
}

// ── Type Definition ────────────────────────────────────────────
type User = any; // from @supabase/supabase-js

// ── Mapper Functions ────────────────────────────────────────────
// Convert snake_case DB rows to camelCase app types

const mapBill = (dbRow: any): Bill => ({
  id: dbRow.id,
  userId: dbRow.user_id,
  name: dbRow.name,
  description: dbRow.description || undefined,
  amount: dbRow.amount,
  dueDay: dbRow.due_day,
  dueDate: dbRow.due_date,
  billType: dbRow.bill_type || 'recurring',
  category: dbRow.category,
  icon: dbRow.icon,
  isActive: dbRow.is_active,
  autoPay: dbRow.auto_pay,
  cadence: dbRow.cadence,
  createdAt: dbRow.created_at,
  updatedAt: dbRow.updated_at,
});

const mapBucket = (dbRow: any): BillBucket => ({
  id: dbRow.id,
  billId: dbRow.bill_id,
  targetAmount: dbRow.target_amount,
  currentAmount: dbRow.current_amount,
  billingPeriod: dbRow.billing_period,
  status: dbRow.status,
  paidAt: dbRow.paid_at,
});

const mapContribution = (dbRow: any): Contribution => ({
  id: dbRow.id,
  billId: dbRow.bill_id,
  bucketId: dbRow.bucket_id,
  amount: dbRow.amount,
  fundingSource: dbRow.funding_source || undefined,
  status: dbRow.status,
  executedAt: dbRow.executed_at,
  createdAt: dbRow.created_at,
});

const mapTransferStatus = (status?: string): Transfer['status'] => {
  const normalized = (status || '').toLowerCase();
  if (normalized === 'sent' || normalized === 'completed' || normalized === 'success') return 'success';
  if (['rejected', 'returned', 'canceled', 'cancelled', 'failed'].includes(normalized)) return 'failed';
  return 'pending';
};

const mapTransfer = (dbRow: any): Transfer => {
  const linkedAccount = dbRow.linked_accounts;
  const accountMask = linkedAccount?.account_mask ? ` **** ${linkedAccount.account_mask}` : '';
  const fundingSource = linkedAccount
    ? `${linkedAccount.institution_name || 'Linked bank'} - ${linkedAccount.account_name || 'Account'}${accountMask}`
    : dbRow.funding_source || 'Unit account';

  return {
    id: dbRow.id,
    billId: dbRow.bill_id || '',
    billName:
      dbRow.bills?.name ||
      dbRow.bill_name ||
      (dbRow.direction === 'from_unit' ? 'Withdraw to bank' : 'Add money to Unit'),
    amount: Number(dbRow.amount || 0),
    date: dbRow.created_at || dbRow.date,
    status: mapTransferStatus(dbRow.status),
    fundingSource,
  };
};

const mapLinkedAccount = (dbRow: any): LinkedAccount => ({
  id: dbRow.id,
  bankName: dbRow.bank_name || dbRow.institution_name || 'Unknown Bank',
  accountMask: dbRow.account_mask,
  accountType: dbRow.account_subtype || dbRow.account_type,
  isPrimary: dbRow.is_primary,
  institutionId: dbRow.institution_id,
  createdAt: dbRow.created_at,
});

const mapNotification = (dbRow: any): Notification => ({
  id: dbRow.id,
  type: dbRow.type,
  title: dbRow.title,
  message: dbRow.message,
  read: dbRow.read,
  createdAt: dbRow.created_at,
});

const mapAchievement = (dbRow: any): Achievement => ({
  id: dbRow.id,
  name: dbRow.name,
  description: dbRow.description,
  icon: dbRow.icon,
  unlocked: dbRow.unlocked,
  unlockedAt: dbRow.unlocked_at,
});

const mapProfile = (dbRow: any): UserProfile => {
  const fallbackName = dbRow.full_name || dbRow.username || '';
  const [fallbackFirstName, ...fallbackLastNameParts] = fallbackName.trim().split(/\s+/).filter(Boolean);

  return {
    id: dbRow.id,
    username: dbRow.username || dbRow.full_name || '',
    firstName: dbRow.first_name || fallbackFirstName || '',
    lastName: dbRow.last_name || fallbackLastNameParts.join(' '),
    email: dbRow.email,
    phoneNumber: dbRow.phone_number || '',
    avatarUrl: dbRow.avatar_url,
    plan: dbRow.plan || 'freemium',
    streakDays: dbRow.streak_days || 0,
    employerLinked: dbRow.employer_linked || false,
    hasCompletedOnboarding: dbRow.has_completed_onboarding || false,
  };
};

const getProfileDisplayName = (profile?: Partial<UserProfile> | null, fallback?: string) => {
  const fullName = `${profile?.firstName || ''} ${profile?.lastName || ''}`.trim();
  return fullName || profile?.username || fallback || 'User';
};

const clearUnitReadyToLaunchSession = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem('unitCustomerToken');
  window.localStorage.removeItem('unitVerifiedCustomerToken');
};

const EMPTY_USER_PROFILE: UserProfile = {
  id: '',
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  plan: 'freemium',
  streakDays: 0,
  employerLinked: false,
  hasCompletedOnboarding: false,
};

// ── Mock Data ──────────────────────────────────────────
const MOCK_BILLS: Bill[] = [
  {
    id: '1',
    userId: 'user1',
    name: 'Electricity Bill',
    amount: 170,
    dueDay: 25,
    dueDate: '2026-03-25',
    billType: 'recurring',
    category: 'utilities',
    icon: '⚡',
    isActive: true,
    autoPay: true,
    cadence: 'monthly',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '2',
    userId: 'user1',
    name: 'Internet',
    amount: 450,
    dueDay: 28,
    dueDate: '2026-03-28',
    billType: 'recurring',
    category: 'utilities',
    icon: '📡',
    isActive: true,
    autoPay: true,
    cadence: 'monthly',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '3',
    userId: 'user1',
    name: 'Gas Bill',
    amount: 450,
    dueDay: 28,
    dueDate: '2026-03-28',
    billType: 'recurring',
    category: 'utilities',
    icon: '🔥',
    isActive: true,
    autoPay: true,
    cadence: 'monthly',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '4',
    userId: 'user1',
    name: 'Water Bill',
    amount: 450,
    dueDay: 28,
    dueDate: '2026-03-28',
    billType: 'recurring',
    category: 'utilities',
    icon: '💧',
    isActive: true,
    autoPay: true,
    cadence: 'monthly',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
  {
    id: '5',
    userId: 'user1',
    name: 'Rent',
    amount: 1200,
    dueDay: 1,
    dueDate: '2026-04-01',
    billType: 'recurring',
    category: 'housing',
    icon: '🏠',
    isActive: true,
    autoPay: true,
    cadence: 'monthly',
    createdAt: '2026-01-01',
    updatedAt: '2026-03-01',
  },
];

const MOCK_BUCKETS: BillBucket[] = [
  { id: 'b1', billId: '1', targetAmount: 170, currentAmount: 170, billingPeriod: '2026-03-01', status: 'paid' },
  { id: 'b2', billId: '2', targetAmount: 450, currentAmount: 270, billingPeriod: '2026-04-01', status: 'funding' },
  { id: 'b3', billId: '3', targetAmount: 450, currentAmount: 112.5, billingPeriod: '2026-04-01', status: 'funding' },
  { id: 'b4', billId: '4', targetAmount: 450, currentAmount: 67.5, billingPeriod: '2026-04-01', status: 'funding' },
  { id: 'b5', billId: '5', targetAmount: 1200, currentAmount: 1128, billingPeriod: '2026-04-01', status: 'funding' },
];

const MOCK_CONTRIBUTIONS: Contribution[] = Array.from({ length: 20 }, (_, i) => ({
  id: `c${i}`,
  billId: '5',
  bucketId: 'b5',
  amount: 56.4,
  status: 'completed' as const,
  executedAt: new Date(2026, 2, 20 - i).toISOString(),
  createdAt: new Date(2026, 2, 20 - i).toISOString(),
}));

const MOCK_USER_PROFILE: UserProfile = {
  id: 'user1',
  username: 'Cameron',
  firstName: 'Cameron',
  lastName: '',
  email: 'founder@fractionalbillpay.com',
  phoneNumber: '',
  plan: 'freemium',
  streakDays: 5,
  employerLinked: false,
  hasCompletedOnboarding: true,
};

const MOCK_LINKED_ACCOUNTS: LinkedAccount[] = [
  {
    id: 'account1',
    bankName: 'Bank of Habib',
    accountMask: '****1234',
    accountType: 'checking',
    isPrimary: true,
    institutionId: 'inst_001',
    createdAt: '2026-02-15',
  },
  {
    id: 'account2',
    bankName: 'Bank of Meezan',
    accountMask: '****5678',
    accountType: 'savings',
    isPrimary: false,
    institutionId: 'inst_002',
    createdAt: '2026-02-20',
  },
];

const MOCK_TRANSFERS: Transfer[] = [
  {
    id: 'tf1',
    billId: '5',
    billName: 'Rent',
    amount: 1200,
    date: '2026-03-20',
    status: 'success',
    fundingSource: 'Bank of Habib',
  },
  {
    id: 'tf2',
    billId: '1',
    billName: 'Electricity Bill',
    amount: 170,
    date: '2026-03-22',
    status: 'success',
    fundingSource: 'Bank of Habib',
  },
  {
    id: 'tf3',
    billId: '2',
    billName: 'Internet',
    amount: 200,
    date: '2026-03-23',
    status: 'pending',
    fundingSource: 'Bank of Meezan',
  },
  {
    id: 'tf4',
    billId: '3',
    billName: 'Gas Bill',
    amount: 100,
    date: '2026-03-24',
    status: 'failed',
    fundingSource: 'Bank of Habib',
  },
  {
    id: 'tf5',
    billId: '4',
    billName: 'Water Bill',
    amount: 50,
    date: '2026-03-25',
    status: 'success',
    fundingSource: 'Bank of Meezan',
  },
  {
    id: 'tf6',
    billId: '2',
    billName: 'Internet',
    amount: 70,
    date: '2026-03-26',
    status: 'success',
    fundingSource: 'Bank of Habib',
  },
];

const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach1',
    name: 'First Steps',
    description: 'Add your first bill',
    icon: '🎯',
    unlocked: true,
    unlockedAt: '2026-02-10',
  },
  {
    id: 'ach2',
    name: 'Week Warrior',
    description: 'Maintain a 7-day contribution streak',
    icon: '⚡',
    unlocked: true,
    unlockedAt: '2026-03-15',
  },
  {
    id: 'ach3',
    name: 'Budget Master',
    description: 'Fund 3 bills to 100%',
    icon: '💰',
    unlocked: false,
  },
  {
    id: 'ach4',
    name: 'Golden Saver',
    description: 'Save $1000 across all bills',
    icon: '🏆',
    unlocked: false,
  },
  {
    id: 'ach5',
    name: 'Perfect Payer',
    description: 'Pay all bills on time for a month',
    icon: '✅',
    unlocked: false,
  },
  {
    id: 'ach6',
    name: 'Premium Member',
    description: 'Upgrade to premium plan',
    icon: '👑',
    unlocked: false,
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'contribution_reminder',
    title: 'Daily Contribution Reminder',
    message: 'Time to contribute to your bills!',
    read: false,
    createdAt: '2026-03-27T09:00:00Z',
  },
  {
    id: 'n2',
    type: 'due_date',
    title: 'Internet Bill Due Soon',
    message: 'Your internet bill is due on March 28',
    read: false,
    createdAt: '2026-03-26T14:30:00Z',
  },
  {
    id: 'n3',
    type: 'missed_contribution',
    title: 'Missed Contribution',
    message: 'You missed yesterday\'s contribution',
    read: true,
    createdAt: '2026-03-25T08:00:00Z',
  },
  {
    id: 'n4',
    type: 'system',
    title: 'New Feature Available',
    message: 'Check out our new auto-transfer feature',
    read: true,
    createdAt: '2026-03-24T10:00:00Z',
  },
  {
    id: 'n5',
    type: 'due_date',
    title: 'Rent Payment Upcoming',
    message: 'Your rent is due on April 1',
    read: true,
    createdAt: '2026-03-20T12:00:00Z',
  },
];

// ── Store ──────────────────────────────────────────────
interface AppState {
  // Auth
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  userName: string;
  supabaseUser: User | null;

  // Bills
  bills: Bill[];
  buckets: BillBucket[];
  contributions: Contribution[];

  // User Profile & Accounts
  userProfile: UserProfile;
  linkedAccounts: LinkedAccount[];
  transfers: Transfer[];
  notifications: Notification[];
  achievements: Achievement[];

  // Settings
  autoTransferEnabled: boolean;
  autoTransferFrequency: Cadence;
  paySchedule: Cadence;

  // Loading & Error states
  isLoading: boolean;
  isInitialized: boolean;
  authError: string | null;
  dataError: string | null;

  // ── Bill Actions (sync + async) ────
  addBill: (bill: Omit<Bill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  updateBill: (id: string, updates: Partial<Bill>) => void;
  deleteBill: (id: string) => void;
  addBillAsync: (bill: Omit<Bill, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<{ error?: string }>;
  updateBillAsync: (id: string, updates: Partial<Bill>) => Promise<{ error?: string }>;
  deleteBillAsync: (id: string) => Promise<{ error?: string }>;
  setBillCadence: (billId: string, cadence: Cadence) => void;
  getBucket: (billId: string) => BillBucket | undefined;
  getBillContributions: (billId: string) => Contribution[];
  getTotalSaved: () => number;
  getTotalTarget: () => number;
  getOverallFundedPercent: () => number;

  // ── Account Actions (sync + async) ────
  addLinkedAccount: (account: Omit<LinkedAccount, 'id' | 'createdAt'>) => void;
  removeLinkedAccount: (id: string) => void;
  setPrimaryAccount: (id: string) => void;
  addLinkedAccountAsync: (account: Omit<LinkedAccount, 'id' | 'createdAt'>) => Promise<{ error?: string }>;
  removeLinkedAccountAsync: (id: string) => Promise<{ error?: string }>;
  setPrimaryAccountAsync: (id: string) => Promise<{ error?: string }>;

  // ── Notification Actions (sync + async) ────
  markNotificationRead: (id: string) => void;
  markNotificationReadAsync: (id: string) => Promise<void>;
  getUnreadNotificationCount: () => number;

  // ── Transfer Actions (sync + async) ────
  retryTransfer: (id: string) => void;
  retryTransferAsync: (id: string) => Promise<{ error?: string }>;

  // ── Contribution Actions (sync + async) ────
  makeManualContribution: (billId: string, amount: number, source: string) => void;
  makeManualContributionAsync: (billId: string, amount: number, source: string) => Promise<{ error?: string }>;
  markBillPaidAsync: (billId: string) => Promise<{ error?: string }>;

  // ── Settings Actions (sync + async) ────
  setPaySchedule: (cadence: Cadence) => void;
  setAutoTransfer: (enabled: boolean) => void;
  setAutoTransferFrequency: (frequency: Cadence) => void;
  upgradePlan: () => void;
  upgradePlanAsync: () => Promise<{ error?: string }>;
  linkEmployer: (code: string) => void;
  linkEmployerAsync: (code: string) => Promise<{ error?: string }>;
  updateProfileAsync: (updates: Partial<UserProfile>) => Promise<{ error?: string }>;

  // ── Compute Actions ────
  getBillStatus: (billId: string) => BillStatus;

  // ── Auth Actions (sync + async) ────
  login: () => void;
  logout: () => void;
  completeOnboarding: () => void;
  signUp: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<{ error?: string; errorCode?: string; errorStatus?: number; needsEmailConfirmation?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  sendOTP: (email: string) => Promise<{ error?: string }>;
  verifyOTP: (email: string, token: string) => Promise<{ error?: string }>;

  // ── Initialization & Sync ────
  initialize: () => Promise<void>;
  syncFromSupabase: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  // Initial state - Auth
  isAuthenticated: false,
  hasCompletedOnboarding: false,
  userName: '',
  supabaseUser: null,

  // Initial state - Bills
  bills: [],
  buckets: [],
  contributions: [],

  // Initial state - User Profile & Accounts
  userProfile: EMPTY_USER_PROFILE,
  linkedAccounts: [],
  transfers: [],
  notifications: [],
  achievements: [],

  // Initial state - Settings
  autoTransferEnabled: true,
  autoTransferFrequency: 'daily',
  paySchedule: 'daily',

  // Initial state - Loading & Error
  isLoading: false,
  isInitialized: false,
  authError: null,
  dataError: null,

  // ── Initialization & Sync ────────────────────────────────────────
  initialize: async () => {
    const state = get();
    if (state.isInitialized) return;

    set({ isLoading: true });

    try {
      if (!supabase) {
        set({ isLoading: false, isInitialized: true });
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        set({
          isAuthenticated: true,
          supabaseUser: session.user,
        });
        await get().syncFromSupabase();
      }

      set({ isLoading: false, isInitialized: true });

      // Listen for auth changes
      if (supabase.auth.onAuthStateChange) {
        supabase.auth.onAuthStateChange((event: string, session: any) => {
          if (event === 'SIGNED_OUT') {
            clearUnitReadyToLaunchSession();
            set({
              isAuthenticated: false,
              hasCompletedOnboarding: false,
              supabaseUser: null,
              authError: null,
            });
          } else if (event === 'SIGNED_IN' && session?.user) {
            set({ isAuthenticated: true, supabaseUser: session.user });
            get().syncFromSupabase();
          }
        });
      }
    } catch (err) {
      set({ isLoading: false, isInitialized: true, authError: 'Initialization failed' });
    }
  },

  syncFromSupabase: async () => {
    try {
      if (!DatabaseServices) {
        set({ dataError: 'Database services not available' });
        return;
      }

      const {
        ProfileService,
        BillService,
        BucketService,
        ContributionService,
        TransferService,
        LinkedAccountService,
        NotificationService,
        AchievementService,
      } = DatabaseServices;

      const [profileRes, billsRes, bucketsRes, contributionsRes, accountsRes, transfersRes, notificationsRes, achievementsRes] = await Promise.all(
        [
          ProfileService?.getProfile?.() || Promise.resolve({ data: null }),
          BillService?.getBills?.() || Promise.resolve({ data: null }),
          BucketService?.getBuckets?.() || Promise.resolve({ data: null }),
          ContributionService?.getContributions?.() || Promise.resolve({ data: null }),
          LinkedAccountService?.getLinkedAccounts?.() || Promise.resolve({ data: null }),
          TransferService?.getTransfers?.() || Promise.resolve({ data: null }),
          NotificationService?.getNotifications?.() || Promise.resolve({ data: null }),
          AchievementService?.getAchievements?.() || Promise.resolve({ data: null }),
        ]
      );

      const updates: Partial<AppState> = {};

      if (profileRes.data) {
        const profile = mapProfile(profileRes.data);
        updates.userProfile = profile;
        updates.userName = getProfileDisplayName(profile, profileRes.data.full_name);
        updates.hasCompletedOnboarding = profile.hasCompletedOnboarding;
        updates.paySchedule = profileRes.data.pay_schedule || 'daily';
        updates.autoTransferEnabled = profileRes.data.auto_transfer_enabled ?? true;
        updates.autoTransferFrequency = profileRes.data.auto_transfer_frequency || 'daily';
      }
      if (Array.isArray(billsRes.data)) updates.bills = billsRes.data.map(mapBill);
      if (Array.isArray(bucketsRes.data)) updates.buckets = bucketsRes.data.map(mapBucket);
      if (Array.isArray(contributionsRes.data)) updates.contributions = contributionsRes.data.map(mapContribution);
      if (Array.isArray(accountsRes.data)) updates.linkedAccounts = accountsRes.data.map(mapLinkedAccount);
      if (Array.isArray(transfersRes.data)) updates.transfers = transfersRes.data.map(mapTransfer);
      if (Array.isArray(notificationsRes.data)) updates.notifications = notificationsRes.data.map(mapNotification);
      if (Array.isArray(achievementsRes.data)) updates.achievements = achievementsRes.data.map(mapAchievement);

      set(updates);
    } catch (err) {
      set({ dataError: 'Failed to sync data from Supabase' });
    }
  },

  // ── Bill Actions (Sync) ────────────────────────────────────────
  addBill: (billData) => {
    const newBill: Bill = {
      ...billData,
      billType: billData.billType || 'recurring',
      id: Date.now().toString(),
      userId: 'user1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const newBucket: BillBucket = {
      id: `b-${Date.now()}`,
      billId: newBill.id,
      targetAmount: newBill.amount,
      currentAmount: 0,
      billingPeriod: new Date(2026, 3, 1).toISOString(),
      status: 'funding',
    };
    set((state) => ({
      bills: [...state.bills, newBill],
      buckets: [...state.buckets, newBucket],
    }));
  },

  updateBill: (id, updates) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
      ),
    })),

  deleteBill: (id) =>
    set((state) => ({
      bills: state.bills.filter((b) => b.id !== id),
      buckets: state.buckets.filter((b) => b.billId !== id),
    })),

  // ── Bill Actions (Async) ────────────────────────────────────────
  addBillAsync: async (billData) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.BillService) {
        // Fallback to sync
        get().addBill(billData);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.BillService.addBill(billData);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      // Add locally
      get().addBill(billData);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to add bill';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  updateBillAsync: async (id, updates) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.BillService) {
        get().updateBill(id, updates);
        if ('amount' in updates && typeof updates.amount === 'number') {
          set((state) => ({
            buckets: state.buckets.map((bucket) =>
              bucket.billId === id && bucket.status !== 'paid'
                ? { ...bucket, targetAmount: updates.amount as number }
                : bucket
            ),
          }));
        }
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.BillService.updateBill(id, updates);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().updateBill(id, updates);
      if ('amount' in updates && typeof updates.amount === 'number') {
        set((state) => ({
          buckets: state.buckets.map((bucket) =>
            bucket.billId === id && bucket.status !== 'paid'
              ? { ...bucket, targetAmount: updates.amount as number }
              : bucket
          ),
        }));
      }
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to update bill';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  deleteBillAsync: async (id) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.BillService) {
        get().deleteBill(id);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.BillService.deleteBill(id);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().deleteBill(id);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to delete bill';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  setBillCadence: (billId, cadence) =>
    set((state) => ({
      bills: state.bills.map((b) =>
        b.id === billId ? { ...b, cadence, updatedAt: new Date().toISOString() } : b
      ),
    })),

  setPaySchedule: (cadence) => set({ paySchedule: cadence }),

  // ── Account Actions (Sync) ────────────────────────────────────────
  addLinkedAccount: (accountData) => {
    const newAccount: LinkedAccount = {
      ...accountData,
      id: `account-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({
      linkedAccounts: [...state.linkedAccounts, newAccount],
    }));
  },

  removeLinkedAccount: (id) =>
    set((state) => ({
      linkedAccounts: state.linkedAccounts.filter((a) => a.id !== id),
    })),

  setPrimaryAccount: (id) =>
    set((state) => ({
      linkedAccounts: state.linkedAccounts.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      })),
    })),

  // ── Account Actions (Async) ────────────────────────────────────────
  addLinkedAccountAsync: async (accountData) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.LinkedAccountService) {
        get().addLinkedAccount(accountData);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.LinkedAccountService.addLinkedAccount(accountData);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().addLinkedAccount(accountData);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to add linked account';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  removeLinkedAccountAsync: async (id) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.LinkedAccountService) {
        get().removeLinkedAccount(id);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.LinkedAccountService.removeLinkedAccount(id);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().removeLinkedAccount(id);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to remove linked account';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  setPrimaryAccountAsync: async (id) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.LinkedAccountService) {
        get().setPrimaryAccount(id);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.LinkedAccountService.setPrimaryAccount(id);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().setPrimaryAccount(id);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to set primary account';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  // ── Notification Actions (Sync) ────────────────────────────────────────
  markNotificationRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  // ── Notification Actions (Async) ────────────────────────────────────────
  markNotificationReadAsync: async (id) => {
    try {
      if (!DatabaseServices?.NotificationService) {
        get().markNotificationRead(id);
        return;
      }

      await DatabaseServices.NotificationService.markNotificationRead(id);
      get().markNotificationRead(id);
    } catch (err) {
      // Silently fail for notifications
    }
  },

  getUnreadNotificationCount: () =>
    get().notifications.filter((n) => !n.read).length,

  // ── Transfer Actions (Sync) ────────────────────────────────────────
  retryTransfer: (id) =>
    set((state) => ({
      transfers: state.transfers.map((t) =>
        t.id === id ? { ...t, status: 'pending' } : t
      ),
    })),

  // ── Transfer Actions (Async) ────────────────────────────────────────
  retryTransferAsync: async (id) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.TransferService) {
        get().retryTransfer(id);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.TransferService.retryTransfer(id);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().retryTransfer(id);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to retry transfer';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  // ── Contribution Actions (Sync) ────────────────────────────────────────
  makeManualContribution: (billId, amount, source) => {
    const bill = get().bills.find((b) => b.id === billId);
    const bucket = get().buckets.find((b) => b.billId === billId);

    if (!bill || !bucket) return;

    const newContribution: Contribution = {
      id: `c-${Date.now()}`,
      billId,
      bucketId: bucket.id,
      amount,
      fundingSource: source,
      status: 'completed',
      executedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const newTransfer: Transfer = {
      id: `tf-${Date.now()}`,
      billId,
      billName: bill.name,
      amount,
      date: new Date().toISOString().split('T')[0],
      status: 'success',
      fundingSource: source,
    };

    set((state) => ({
      contributions: [...state.contributions, newContribution],
      transfers: [...state.transfers, newTransfer],
      buckets: state.buckets.map((b) =>
        b.id === bucket.id
          ? { ...b, currentAmount: Math.min(b.currentAmount + amount, b.targetAmount) }
          : b
      ),
    }));
  },

  // ── Contribution Actions (Async) ────────────────────────────────────────
  makeManualContributionAsync: async (billId, amount, source) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.ContributionService) {
        get().makeManualContribution(billId, amount, source);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.ContributionService.makeContribution(billId, amount, source);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().makeManualContribution(billId, amount, source);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to make contribution';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  markBillPaidAsync: async (billId) => {
    set({ isLoading: true, dataError: null });
    try {
      const bucket = get().buckets.find((item) => item.billId === billId);

      if (DatabaseServices?.BucketService?.markBillPaid) {
        const result = await DatabaseServices.BucketService.markBillPaid(billId);
        if (result.error) {
          set({ isLoading: false, dataError: result.error });
          return { error: result.error };
        }
      }

      set((state) => ({
        isLoading: false,
        buckets: state.buckets.map((item) =>
          item.billId === billId
            ? {
                ...item,
                currentAmount: item.targetAmount,
                status: 'paid',
                paidAt: new Date().toISOString(),
              }
            : item
        ),
      }));

      if (!bucket) await get().syncFromSupabase();
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to pay bill';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  // ── Settings Actions (Sync) ────────────────────────────────────────
  setAutoTransfer: (enabled) => set({ autoTransferEnabled: enabled }),

  setAutoTransferFrequency: (frequency) => set({ autoTransferFrequency: frequency }),

  upgradePlan: () =>
    set((state) => ({
      userProfile: { ...state.userProfile, plan: 'premium' },
    })),

  linkEmployer: (code) =>
    set((state) => ({
      userProfile: { ...state.userProfile, employerLinked: true },
    })),

  // ── Settings Actions (Async) ────────────────────────────────────────
  upgradePlanAsync: async () => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.ProfileService) {
        get().upgradePlan();
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.ProfileService.upgradePlan();
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().upgradePlan();
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to upgrade plan';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  linkEmployerAsync: async (code) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.ProfileService) {
        get().linkEmployer(code);
        set({ isLoading: false });
        return {};
      }

      const result = await DatabaseServices.ProfileService.linkEmployer(code);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      get().linkEmployer(code);
      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to link employer';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  updateProfileAsync: async (updates) => {
    set({ isLoading: true, dataError: null });
    try {
      if (!DatabaseServices?.ProfileService) {
        set((state) => ({
          userProfile: { ...state.userProfile, ...updates },
          userName: getProfileDisplayName({ ...state.userProfile, ...updates }, state.userName),
          isLoading: false,
        }));
        return {};
      }

      const result = await DatabaseServices.ProfileService.updateProfile(updates);
      if (result.error) {
        set({ isLoading: false, dataError: result.error });
        return { error: result.error };
      }

      set((state) => ({
        userProfile: { ...state.userProfile, ...updates },
        userName: getProfileDisplayName({ ...state.userProfile, ...updates }, state.userName),
        isLoading: false,
      }));
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Failed to update profile';
      set({ isLoading: false, dataError: errMsg });
      return { error: errMsg };
    }
  },

  // ── Computed Helpers ────────────────────────────────────────
  getBucket: (billId) => get().buckets.find((b) => b.billId === billId),

  getBillContributions: (billId) =>
    get().contributions.filter((c) => c.billId === billId).slice(0, 10),

  getTotalSaved: () => get().buckets.reduce((sum, b) => sum + b.currentAmount, 0),

  getTotalTarget: () => get().buckets.reduce((sum, b) => sum + b.targetAmount, 0),

  getOverallFundedPercent: () => {
    const total = get().getTotalTarget();
    if (total === 0) return 0;
    return Math.round((get().getTotalSaved() / total) * 100);
  },

  getBillStatus: (billId) => {
    const bucket = get().getBucket(billId);
    if (!bucket) return 'upcoming';

    if (bucket.status === 'paid') return 'completed';

    const fundedPercent = (bucket.currentAmount / bucket.targetAmount) * 100;
    if (fundedPercent === 100) return 'completed';
    if (fundedPercent >= 75) return 'on_track';
    if (fundedPercent > 0) return 'on_track';
    return 'upcoming';
  },

  // ── Auth Actions (Sync) ────────────────────────────────────────
  login: () => set({ isAuthenticated: true }),
  logout: () => {
    AuthService?.signOut?.();
    clearUnitReadyToLaunchSession();
    set({
      isAuthenticated: false,
      hasCompletedOnboarding: false,
      supabaseUser: null,
      authError: null,
      isLoading: false,
    });
  },
  completeOnboarding: () => {
    set((state) => ({
      hasCompletedOnboarding: true,
      isAuthenticated: true,
      userProfile: { ...state.userProfile, hasCompletedOnboarding: true },
    }));

    DatabaseServices?.ProfileService?.updateProfile?.({ hasCompletedOnboarding: true });
  },

  // ── Auth Actions (Async) ────────────────────────────────────────
  signUp: async (email, password, username, firstName, lastName) => {
    set({ isLoading: true, authError: null });
    try {
      if (!AuthService?.signUp) {
        set({ isLoading: false, authError: 'Auth service not available' });
        return { error: 'Auth service not available' };
      }

      const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
      const { user, session, needsEmailConfirmation, error, errorCode, errorStatus } = await AuthService.signUp({
        email,
        password,
        username,
        firstName,
        lastName,
      });
      if (error) {
        set({ isLoading: false, authError: error });
        return { error, errorCode, errorStatus };
      }

      set({
        isAuthenticated: !!session,
        supabaseUser: user,
        userName: fullName,
        userProfile: {
          ...get().userProfile,
          id: user?.id || get().userProfile.id,
          username: username.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
        },
        isLoading: false,
      });
      return { needsEmailConfirmation };
    } catch (err: any) {
      const errMsg = err?.message || 'Sign up failed';
      set({ isLoading: false, authError: errMsg });
      return { error: errMsg };
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true, authError: null });
    try {
      if (!AuthService?.signIn) {
        set({ isLoading: false, authError: 'Auth service not available' });
        return { error: 'Auth service not available' };
      }

      const { user, error } = await AuthService.signIn({ email, password });
      if (error) {
        set({ isLoading: false, authError: error });
        return { error };
      }

      set({
        isAuthenticated: true,
        supabaseUser: user,
        userName: user?.user_metadata?.full_name || user?.user_metadata?.username || user?.email || get().userName,
        isLoading: false,
      });

      // Load user data from Supabase
      await get().syncFromSupabase();
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Sign in failed';
      set({ isLoading: false, authError: errMsg });
      return { error: errMsg };
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      if (AuthService?.signOut) {
        await AuthService.signOut();
      }

      clearUnitReadyToLaunchSession();
      set({
        isAuthenticated: false,
        hasCompletedOnboarding: false,
        supabaseUser: null,
        authError: null,
        isLoading: false,
      });
    } catch (err: any) {
      set({ isLoading: false, authError: err?.message || 'Sign out failed' });
    }
  },

  resetPassword: async (email) => {
    set({ isLoading: true, authError: null });
    try {
      if (!AuthService?.resetPassword) {
        set({ isLoading: false, authError: 'Auth service not available' });
        return { error: 'Auth service not available' };
      }

      const { error } = await AuthService.resetPassword({ email });
      if (error) {
        set({ isLoading: false, authError: error });
        return { error };
      }

      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'Password reset failed';
      set({ isLoading: false, authError: errMsg });
      return { error: errMsg };
    }
  },

  sendOTP: async (email) => {
    set({ isLoading: true, authError: null });
    try {
      if (!AuthService?.sendOTP) {
        set({ isLoading: false, authError: 'Auth service not available' });
        return { error: 'Auth service not available' };
      }

      const { error } = await AuthService.sendOTP({ email });
      if (error) {
        set({ isLoading: false, authError: error });
        return { error };
      }

      set({ isLoading: false });
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'OTP send failed';
      set({ isLoading: false, authError: errMsg });
      return { error: errMsg };
    }
  },

  verifyOTP: async (email, token) => {
    set({ isLoading: true, authError: null });
    try {
      if (!AuthService?.verifyOTP) {
        set({ isLoading: false, authError: 'Auth service not available' });
        return { error: 'Auth service not available' };
      }

      const { user, error } = await AuthService.verifyOTP({ email, token });
      if (error) {
        set({ isLoading: false, authError: error });
        return { error };
      }

      set({
        isAuthenticated: true,
        supabaseUser: user,
        isLoading: false,
      });

      await get().syncFromSupabase();
      return {};
    } catch (err: any) {
      const errMsg = err?.message || 'OTP verification failed';
      set({ isLoading: false, authError: errMsg });
      return { error: errMsg };
    }
  },
}));
