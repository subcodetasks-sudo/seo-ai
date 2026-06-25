import type { Integration, Invoice, NotificationPreference, Subscription } from "../types";

export const MOCK_SUBSCRIPTION: Subscription = {
  planName: "Pro",
  planLabelKey: "paidPlan",
  priceMonthly: 149,
  usedPages: 80,
  totalPages: 100,
  nextInvoiceDate: "2025-10-31",
  status: "active",
};

export const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-1",
    date: "2026-04-01",
    planLabelKey: "paidPlan",
    amount: 149,
    status: "paid",
  },
  {
    id: "inv-2",
    date: "2026-03-01",
    planLabelKey: "paidPlan",
    amount: 149,
    status: "paid",
  },
  {
    id: "inv-3",
    date: "2026-02-01",
    planLabelKey: "paidPlan",
    amount: 149,
    status: "paid",
  },
];

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
