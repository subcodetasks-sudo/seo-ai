import { queryOptions } from "@tanstack/react-query";
import { getCurrentUser, getNotificationPrefs, getUsage } from "./api";
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
