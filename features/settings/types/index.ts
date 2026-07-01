export type SettingsTab = "profile" | "notifications" | "integrations" | "billing";

export const SETTINGS_TABS: SettingsTab[] = [
  "profile",
  "notifications",
  "integrations",
  "billing",
];

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
