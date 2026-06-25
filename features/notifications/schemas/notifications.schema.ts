import { z } from "zod";

import type { AppNotification } from "../types";

/**
 * The GET /notifications response shape isn't documented yet, so we parse
 * defensively: ids may arrive as numbers, the read flag may be `is_read`,
 * `read`, or implied by a non-null `read_at`, and the body may live under
 * `body` or `message`. Unknown fields are ignored.
 */
const rawNotificationSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string().nullish(),
  body: z.string().nullish(),
  message: z.string().nullish(),
  type: z.string().nullish(),
  is_read: z.boolean().nullish(),
  read: z.boolean().nullish(),
  read_at: z.string().nullish(),
  created_at: z.string().nullish(),
  created: z.string().nullish(),
  data: z.record(z.string(), z.unknown()).nullish(),
});

type RawNotification = z.infer<typeof rawNotificationSchema>;

// `data` is either a bare array or a paginated `{ items: [...] }` envelope.
const notificationsResponseSchema = z.object({
  data: z.union([
    z.array(rawNotificationSchema),
    z.object({ items: z.array(rawNotificationSchema) }),
  ]),
});

export const unreadCountResponseSchema = z.object({
  data: z.object({ unread_count: z.number() }),
});

function normalizeNotification(raw: RawNotification): AppNotification {
  const isRead = raw.is_read ?? raw.read ?? Boolean(raw.read_at);
  return {
    id: String(raw.id),
    title: raw.title ?? "",
    body: raw.body ?? raw.message ?? "",
    type: raw.type ?? null,
    is_read: isRead,
    read_at: raw.read_at ?? null,
    created_at: raw.created_at ?? raw.created ?? null,
    data: (raw.data as Record<string, unknown> | null | undefined) ?? null,
  };
}

export function parseNotifications(response: unknown): AppNotification[] {
  const { data } = notificationsResponseSchema.parse(response);
  const items = Array.isArray(data) ? data : data.items;
  return items.map(normalizeNotification);
}
