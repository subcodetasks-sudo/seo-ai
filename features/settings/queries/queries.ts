import { queryOptions } from "@tanstack/react-query";
import {
  getBillingInvoices,
  getBillingPlans,
  getCurrentBilling,
  getCurrentUser,
  getNotificationPrefs,
  getUsage,
} from "./api";
import { settingsKeys } from "./query-keys";

export function currentUserQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.profile(),
    queryFn: () => getCurrentUser(),
  });
}

export function notificationPrefsQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.notificationPrefs(),
    queryFn: () => getNotificationPrefs(),
  });
}

export function usageQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.usage(),
    queryFn: () => getUsage(),
  });
}

export function billingPlansQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.billingPlans(),
    queryFn: () => getBillingPlans(),
  });
}

export function currentBillingQueryOptions() {
  return queryOptions({
    queryKey: settingsKeys.currentBilling(),
    queryFn: () => getCurrentBilling(),
  });
}

export function invoicesQueryOptions(page: number, perPage: number) {
  return queryOptions({
    queryKey: settingsKeys.invoices(page, perPage),
    queryFn: () => getBillingInvoices(page, perPage),
  });
}
