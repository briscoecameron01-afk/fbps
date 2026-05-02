const emptyList = async () => ({ data: [], error: null });
const emptyItem = async () => ({ data: null, error: null });
const ok = async () => ({ data: null, error: null });

export const ProfileService = {
  getProfile: emptyItem,
  updateProfile: ok,
  upgradePlan: ok,
  linkEmployer: ok,
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
