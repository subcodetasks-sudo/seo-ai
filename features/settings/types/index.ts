export type SettingsTab = "profile" | "notifications" | "integrations" | "billing";

export const SETTINGS_TABS: SettingsTab[] = [
  "profile",
  "notifications",
  "integrations",
  "billing",
];

export type Subscription = {
  planName: string;
  planLabelKey: string;
  priceMonthly: number;
  usedPages: number;
  totalPages: number;
  nextInvoiceDate: string;
  status: "active" | "inactive";
};

export type Invoice = {
  id: string;
  date: string;
  planLabelKey: string;
  amount: number;
  status: "paid" | "pending";
};

export type NotificationPreference = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  enabled: boolean;
};

export type Integration = {
  id: string;
  nameKey: string;
  descriptionKey: string;
  connected: boolean;
};

export type ProfileFormValues = {
  email: string;
  display_name: string;
};

export type ChangePasswordFormValues = {
  current_password: string;
  new_password: string;
};
