import { queryOptions } from "@tanstack/react-query";

import { getNotifications, getUnreadCount } from "./api";
import { notificationsKeys } from "./query-keys";

export function notificationsQueryOptions() {
  return queryOptions({
    queryKey: notificationsKeys.list(),
    queryFn: getNotifications,
    staleTime: 1000 * 30,
  });
}

export function unreadCountQueryOptions() {
  return queryOptions({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: getUnreadCount,
    staleTime: 1000 * 30,
  });
}
