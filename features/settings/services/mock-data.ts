import type { Integration, NotificationPreference } from "../types";

export const MOCK_NOTIFICATION_PREFS: NotificationPreference[] = [
  {
    id: "email-alerts",
    labelKey: "emailAlerts",
    descriptionKey: "emailAlertsDesc",
    enabled: true,
  },
  {
    id: "alerts-404",
    labelKey: "alerts404",
    descriptionKey: "alerts404Desc",
    enabled: true,
  },
  {
    id: "ai-suggestions",
    labelKey: "aiSuggestions",
    descriptionKey: "aiSuggestionsDesc",
    enabled: true,
  },
  {
    id: "crawl-completed",
    labelKey: "crawlCompleted",
    descriptionKey: "crawlCompletedDesc",
    enabled: false,
  },
  {
    id: "weekly-report",
    labelKey: "weeklyReport",
    descriptionKey: "weeklyReportDesc",
    enabled: false,
  },
];

export const MOCK_INTEGRATIONS: Integration[] = [
  {
    id: "wordpress",
    nameKey: "wordpress",
    descriptionKey: "wordpressDesc",
    connected: true,
  },
];
