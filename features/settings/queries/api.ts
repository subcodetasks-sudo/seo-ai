import { apiClient } from "@/lib/client";
import type { Plan } from "@/features/plans";
import type { ProfileFormValues } from "../types";

export type UserPlan = {
  name: string;
  max_projects: number;
  max_pages_per_crawl: number;
  max_crawls_per_month: number;
  max_ai_pages_per_month: number;
  price_monthly_usd: string;
  price_monthly_sar: string;
};

export type CurrentUserData = {
  id: string;
  email: string;
  display_name: string;
  is_verified: boolean;
  plan: UserPlan;
  usage: {
    pages_crawled: number;
    pages_crawled_limit: number;
    ai_pages_used: number;
    ai_pages_limit: number;
    crawls_run: number;
    crawls_limit: number;
    month: string;
  };
  created_at: string;
};

type UserResponse = {
  status: boolean;
  message: string;
  data: CurrentUserData;
};

export function getCurrentUser() {
  return apiClient<UserResponse>("users/me", { method: "GET" }, "Failed to fetch user");
}

export function updateProfile(values: ProfileFormValues) {
  return apiClient<UserResponse>(
    "users/me",
    { method: "PATCH", body: JSON.stringify(values) },
    "Failed to update profile",
  );
}

export function changePassword(values: { old_password: string; new_password: string }) {
  return apiClient<{ status: boolean; message: string }>(
    "users/me/change-password",
    { method: "POST", body: JSON.stringify(values) },
    "Failed to change password",
  );
}

export type NotificationPrefs = {
  crawl_done_email: boolean;
  crawl_done_inapp: boolean;
  critical_issue_email: boolean;
  critical_issue_inapp: boolean;
  new_404_email: boolean;
  new_404_inapp: boolean;
  plan_limit_email: boolean;
  plan_limit_inapp: boolean;
};

type NotificationPrefsResponse = {
  status: boolean;
  message: string;
  data: NotificationPrefs;
};

export function getNotificationPrefs() {
  return apiClient<NotificationPrefsResponse>(
    "users/me/notification-preferences",
    { method: "GET" },
    "Failed to fetch notification preferences",
  );
}

export function updateNotificationPrefs(values: Partial<NotificationPrefs>) {
  return apiClient<NotificationPrefsResponse>(
    "users/me/notification-preferences",
    { method: "PATCH", body: JSON.stringify(values) },
    "Failed to update notification preferences",
  );
}

export type UsageData = {
  pages_crawled: number;
  pages_crawled_limit: number;
  ai_pages_used: number;
  ai_pages_limit: number;
  crawls_run: number;
  crawls_limit: number;
  month: string;
};

type UsageResponse = {
  status: boolean;
  message: string;
  data: UsageData;
};

export function getUsage() {
  return apiClient<UsageResponse>("users/me/usage", { method: "GET" }, "Failed to fetch usage");
}

type PlansResponse = {
  status: boolean;
  message: string;
  data: { plans: Plan[] };
};

export function getBillingPlans() {
  return apiClient<PlansResponse>("billing/plans", { method: "GET" }, "Failed to fetch plans");
}

export type CurrentBilling = {
  plan_name: string;
  plan_id: string;
  price_monthly_usd: number;
  price_monthly_sar: number;
  expires_at: string;
  subscription_status: string | null;
  crawls_used: number;
  crawls_limit: number;
  ai_pages_used: number;
  ai_pages_limit: number;
  projects_used: number;
  projects_limit: number;
};

type CurrentBillingResponse = {
  status: boolean;
  message: string;
  data: CurrentBilling;
};

export function getCurrentBilling() {
  return apiClient<CurrentBillingResponse>(
    "billing/current",
    { method: "GET" },
    "Failed to fetch current plan",
  );
}

// Invoice line-item fields are best-effort: the backend contract for this
// endpoint hasn't been confirmed against a real response yet, so every
// field beyond `id` is optional and rendered defensively in the UI.
export type BillingInvoice = {
  id: string;
  plan_name?: string;
  amount_usd?: number;
  amount_sar?: number;
  status?: string;
  created_at?: string;
  invoice_pdf_url?: string;
};

type BillingInvoicesResponse = {
  status: boolean;
  message: string;
  data: {
    invoices: BillingInvoice[];
    total: number;
    page: number;
    per_page: number;
  };
};

export function getBillingInvoices(page: number, perPage: number) {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage) });
  return apiClient<BillingInvoicesResponse>(
    `billing/invoices?${params.toString()}`,
    { method: "GET" },
    "Failed to fetch invoices",
  );
}

type ChangePlanResponse = {
  status: boolean;
  message: string;
  data?: CurrentBilling;
};

export function changeBillingPlan(planName: string) {
  return apiClient<ChangePlanResponse>(
    "billing/change-plan",
    { method: "POST", body: JSON.stringify({ plan_name: planName }) },
    "Failed to change plan",
  );
}

export type BillingCheckout = {
  payment_url: string;
  reference: string;
  amount: number;
  currency: string;
  plan_name: string;
  expires_note: string;
};

type BillingCheckoutResponse = {
  status: boolean;
  message: string;
  data: BillingCheckout;
};

export function startBillingCheckout(planName: string) {
  return apiClient<BillingCheckoutResponse>(
    "billing/checkout",
    { method: "POST", body: JSON.stringify({ plan_name: planName }) },
    "Failed to start checkout",
  );
}

// The redirect field name isn't confirmed for this endpoint, so callers
// should read it defensively (see extractRedirectUrl in mutations.ts).
type BillingRedirectResponse = {
  status: boolean;
  message: string;
  data?: Record<string, unknown>;
};

export function openBillingPortal() {
  return apiClient<BillingRedirectResponse>(
    "billing/portal",
    { method: "POST" },
    "Failed to open billing portal",
  );
}
