import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MarkReadPayload } from "../types";
import { markNotificationsRead } from "./api";
import { notificationsKeys } from "./query-keys";

export function useMarkNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationIds: MarkReadPayload) => markNotificationsRead(notificationIds),
    onSuccess: () => {
      // Refresh both the list (read flags) and the unread badge count.
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
}
