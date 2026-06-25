import { apiClient } from "@/lib/client";

import type { AppNotification, MarkReadPayload } from "../types";
import { parseNotifications, unreadCountResponseSchema } from "../schemas/notifications.schema";

export async function getNotifications(): Promise<AppNotification[]> {
  const response = await apiClient<unknown>("notifications");
  return parseNotifications(response);
}

export async function getUnreadCount(): Promise<number> {
  const response = await apiClient<unknown>("notifications/unread-count");
  return unreadCountResponseSchema.parse(response).data.unread_count;
}

export async function markNotificationsRead(notificationIds: MarkReadPayload): Promise<void> {
  await apiClient("notifications/mark-read", {
    method: "POST",
    body: JSON.stringify({ notification_ids: notificationIds }),
  });
}
