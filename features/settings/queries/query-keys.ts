export const settingsKeys = {
  all: ["settings"] as const,
  profile: () => [...settingsKeys.all, "profile"] as const,
  notificationPrefs: () => [...settingsKeys.all, "notification-prefs"] as const,
  usage: () => [...settingsKeys.all, "usage"] as const,
};
