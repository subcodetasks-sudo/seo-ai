// Firebase Cloud Messaging push payload (foreground/background messages)
export interface Notification {
  title: string;
  body: string;
  icon?: string;
  data?: Record<string, string>;
}

// In-app notification record returned by GET /notifications
export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string | null;
  data: Record<string, unknown> | null;
}

export interface UnreadCountResponse {
  status: boolean;
  message: string;
  data: {
    unread_count: number;
  };
}

// `null` marks every notification as read (server-side bulk action)
export type MarkReadPayload = string[] | null;

export type NotificationsFilter = "all" | "unread";
