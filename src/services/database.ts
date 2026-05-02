import { supabase } from './supabase';

const emptyList = async () => ({ data: [], error: null });
const ok = async () => ({ data: null, error: null });

async function getCurrentUserId() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user.id;
}

export const ProfileService = {
  async getProfile() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: null };

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    return { data, error: error?.message ?? null };
  },

  async updateProfile(updates: Record<string, unknown>) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const dbUpdates: Record<string, unknown> = {};
    if ('username' in updates) dbUpdates.username = updates.username;
    if ('firstName' in updates) dbUpdates.first_name = updates.firstName;
    if ('lastName' in updates) dbUpdates.last_name = updates.lastName;
    if ('email' in updates) dbUpdates.email = updates.email;
    if ('phoneNumber' in updates) dbUpdates.phone_number = updates.phoneNumber;
    if ('avatarUrl' in updates) dbUpdates.avatar_url = updates.avatarUrl;
    if ('plan' in updates) dbUpdates.plan = updates.plan;
    if ('streakDays' in updates) dbUpdates.streak_days = updates.streakDays;
    if ('employerLinked' in updates) dbUpdates.employer_linked = updates.employerLinked;
    if ('paySchedule' in updates) dbUpdates.pay_schedule = updates.paySchedule;
    if ('autoTransferEnabled' in updates) dbUpdates.auto_transfer_enabled = updates.autoTransferEnabled;
    if ('autoTransferFrequency' in updates) dbUpdates.auto_transfer_frequency = updates.autoTransferFrequency;
    if ('hasCompletedOnboarding' in updates) dbUpdates.has_completed_onboarding = updates.hasCompletedOnboarding;

    const firstName = typeof updates.firstName === 'string' ? updates.firstName.trim() : undefined;
    const lastName = typeof updates.lastName === 'string' ? updates.lastName.trim() : undefined;
    if (firstName !== undefined || lastName !== undefined) {
      const current = await ProfileService.getProfile();
      const nextFirstName = firstName ?? current.data?.first_name ?? '';
      const nextLastName = lastName ?? current.data?.last_name ?? '';
      const fullName = `${nextFirstName} ${nextLastName}`.trim();
      dbUpdates.full_name = fullName;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(dbUpdates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    return { data, error: error?.message ?? null };
  },

  async upgradePlan() {
    return ProfileService.updateProfile({ plan: 'premium' });
  },

  async linkEmployer() {
    return ProfileService.updateProfile({ employer_linked: true });
  },
};

export const BillService = {
  getBills: emptyList,
  addBill: ok,
  updateBill: ok,
  deleteBill: ok,
};

export const BucketService = {
  getBuckets: emptyList,
};

export const ContributionService = {
  getContributions: emptyList,
  makeContribution: ok,
};

export const TransferService = {
  getTransfers: emptyList,
  retryTransfer: ok,
};

export const LinkedAccountService = {
  getLinkedAccounts: emptyList,
  addLinkedAccount: ok,
  removeLinkedAccount: ok,
  setPrimaryAccount: ok,
};

export const NotificationService = {
  getNotifications: emptyList,
  markNotificationRead: ok,
};

export const AchievementService = {
  getAchievements: emptyList,
};
