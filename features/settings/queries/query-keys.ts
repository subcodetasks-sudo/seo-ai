export const settingsKeys = {
  all: ["settings"] as const,
  profile: () => [...settingsKeys.all, "profile"] as const,
  notificationPrefs: () => [...settingsKeys.all, "notification-prefs"] as const,
  usage: () => [...settingsKeys.all, "usage"] as const,
  billingPlans: () => [...settingsKeys.all, "billing-plans"] as const,
  currentBilling: () => [...settingsKeys.all, "billing-current"] as const,
  invoices: (page: number, perPage: number) =>
    [...settingsKeys.all, "billing-invoices", page, perPage] as const,
};
