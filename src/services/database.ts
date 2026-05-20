import { supabase } from './supabase';

const emptyList = async () => ({ data: [], error: null });
const ok = async () => ({ data: null, error: null });

function isSchemaCacheColumnError(error: any, column: string) {
  const message = `${error?.message || ''} ${error?.details || ''}`;
  return message.includes(`'${column}' column`) || message.includes(`column "${column}"`);
}

function isMissingTableError(error: any, table: string) {
  const message = `${error?.message || ''} ${error?.details || ''}`;
  return message.includes(`'${table}'`) || message.includes(`relation "${table}"`);
}

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
  async getBills() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error: error?.message ?? null };
  },

  async addBill(bill: Record<string, unknown>) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const dueDay = Number(bill.dueDay);
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth(), dueDay);
    if (dueDate <= now) dueDate.setMonth(dueDate.getMonth() + 1);

    const billInsert: Record<string, unknown> = {
      user_id: userId,
      name: bill.name,
      description: bill.description || null,
      amount: bill.amount,
      due_day: dueDay,
      due_date: dueDate.toISOString().split('T')[0],
      bill_type: bill.billType || 'recurring',
      category: bill.category || 'other',
      icon: bill.icon || '',
      cadence: bill.cadence || 'daily',
      is_active: bill.isActive ?? true,
      auto_pay: bill.autoPay ?? true,
    };

    let { data, error } = await supabase
      .from('bills')
      .insert(billInsert)
      .select()
      .single();

    if (error && isSchemaCacheColumnError(error, 'description')) {
      delete billInsert.description;
      const retry = await supabase
        .from('bills')
        .insert(billInsert)
        .select()
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error) return { data: null, error: error.message };

    const bucketPeriod = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const { error: bucketError } = await supabase
      .from('bill_buckets')
      .insert({
        bill_id: data.id,
        user_id: userId,
        target_amount: data.amount,
        current_amount: 0,
        billing_period: bucketPeriod,
        status: 'funding',
      });

    return { data, error: bucketError?.message ?? null };
  },

  async updateBill(id: string, updates: Record<string, unknown>) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const dbUpdates: Record<string, unknown> = {};
    if ('name' in updates) dbUpdates.name = updates.name;
    if ('description' in updates) dbUpdates.description = updates.description || null;
    if ('amount' in updates) dbUpdates.amount = updates.amount;
    if ('dueDay' in updates) dbUpdates.due_day = updates.dueDay;
    if ('dueDate' in updates) dbUpdates.due_date = updates.dueDate;
    if ('billType' in updates) dbUpdates.bill_type = updates.billType;
    if ('category' in updates) dbUpdates.category = updates.category;
    if ('icon' in updates) dbUpdates.icon = updates.icon;
    if ('isActive' in updates) dbUpdates.is_active = updates.isActive;
    if ('autoPay' in updates) dbUpdates.auto_pay = updates.autoPay;
    if ('cadence' in updates) dbUpdates.cadence = updates.cadence;

    const { data, error } = await supabase
      .from('bills')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (!error && 'amount' in updates) {
      await supabase
        .from('bill_buckets')
        .update({ target_amount: updates.amount })
        .eq('bill_id', id)
        .eq('user_id', userId)
        .neq('status', 'paid');
    }

    return { data, error: error?.message ?? null };
  },

  async deleteBill(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const { error } = await supabase
      .from('bills')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return { data: null, error: error?.message ?? null };
  },
};

export const BucketService = {
  async getBuckets() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('bill_buckets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error: error?.message ?? null };
  },

  async markBillPaid(billId: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const { data: bucket, error: findError } = await supabase
      .from('bill_buckets')
      .select('*')
      .eq('user_id', userId)
      .eq('bill_id', billId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError || !bucket) {
      return { data: null, error: findError?.message || 'No funding bucket found for this bill' };
    }

    const { data, error } = await supabase
      .from('bill_buckets')
      .update({
        current_amount: bucket.target_amount,
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', bucket.id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    return { data, error: error?.message ?? null };
  },
};

export const ContributionService = {
  async getContributions() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data: data || [], error: error?.message ?? null };
  },

  async makeContribution(billId: string, amount: number, source?: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const { data: bucket, error: bucketFindError } = await supabase
      .from('bill_buckets')
      .select('*')
      .eq('user_id', userId)
      .eq('bill_id', billId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (bucketFindError || !bucket) {
      return { data: null, error: bucketFindError?.message || 'No funding bucket found for this bill' };
    }

    const nextAmount = Math.min(Number(bucket.current_amount) + amount, Number(bucket.target_amount));

    const { error: bucketUpdateError } = await supabase
      .from('bill_buckets')
      .update({
        current_amount: nextAmount,
        status: nextAmount >= Number(bucket.target_amount) ? 'ready' : 'funding',
      })
      .eq('id', bucket.id);

    if (bucketUpdateError) return { data: null, error: bucketUpdateError.message };

    const { data, error } = await supabase
      .from('contributions')
      .insert({
        bill_id: billId,
        bucket_id: bucket.id,
        user_id: userId,
        amount,
        funding_source: source || null,
        status: 'completed',
        executed_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error: error?.message ?? null };
  },
};

export const TransferService = {
  async getTransfers() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], error: null };

    const { data, error } = await (supabase as any)
      .from('unit_transfers')
      .select('*, bills(name), linked_accounts(institution_name,account_name,account_mask)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      if (isMissingTableError(error, 'unit_transfers')) {
        return { data: [], error: null };
      }
      return { data: [], error: error.message };
    }

    return { data: data || [], error: null };
  },
  retryTransfer: ok,
};

export const LinkedAccountService = {
  async getLinkedAccounts() {
    const userId = await getCurrentUserId();
    if (!userId) return { data: [], error: null };

    const { data, error } = await supabase
      .from('linked_accounts')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    return { data: data || [], error: error?.message ?? null };
  },

  async removeLinkedAccount(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('linked_accounts')
      .update({ is_active: false })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    return { data, error: error?.message ?? null };
  },

  async setPrimaryAccount(id: string) {
    const userId = await getCurrentUserId();
    if (!userId) return { data: null, error: 'Not authenticated' };

    const { error: clearError } = await supabase
      .from('linked_accounts')
      .update({ is_primary: false })
      .eq('user_id', userId);

    if (clearError) return { data: null, error: clearError.message };

    const { data, error } = await supabase
      .from('linked_accounts')
      .update({ is_primary: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    return { data, error: error?.message ?? null };
  },

  addLinkedAccount: ok,
};

export const NotificationService = {
  getNotifications: emptyList,
  markNotificationRead: ok,
};

export const AchievementService = {
  getAchievements: emptyList,
};
