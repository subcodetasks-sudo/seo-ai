"use client";

import { useEffect } from "react";
import { getToken, type MessagePayload } from "firebase/messaging";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { env } from "@/config/env";
import { useRouter } from "@/i18n/navigation";
import { getFirebaseMessaging, onForegroundMessage } from "../services/firebase-client";
import { updateFcmToken } from "../queries/api";
import { notificationsKeys } from "../queries/query-keys";

const FCM_TOKEN_KEY = "fcm_token";
const VAPID_KEY = env.FIREBASE_VAPID_KEY ?? "";

function pickField(
  dataValue: string | undefined,
  notificationValue: string | undefined,
): string | undefined {
  const data = dataValue?.trim();
  const notification = notificationValue?.trim();
  // Prefer the richer payload field — backends often send a generic
  // notification.title ("New Notification") alongside the real title in data.
  if (data && notification) {
    const generic = /^(new notification|إشعار جديد)$/i.test(notification);
    return generic ? data : notification.length >= data.length ? notification : data;
  }
  return data || notification || undefined;
}

async function dismissOsNotifications(matchTitles: string[]) {
  if (!("serviceWorker" in navigator)) return;
  try {
    const registration = await navigator.serviceWorker.ready;
    const notifications = await registration.getNotifications();
    const titles = new Set(matchTitles.map((title) => title.trim().toLowerCase()).filter(Boolean));
    for (const notification of notifications) {
      if (titles.has(notification.title.trim().toLowerCase())) {
        notification.close();
      }
    }
  } catch {
    // Best-effort: OS notifications may already have been dismissed.
  }
}

export function useFirebaseNotifications() {
  const router = useRouter();
  const t = useTranslations("notifications");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    async function init() {
      try {
        // Only prompt when the user hasn't already decided — once granted or
        // denied, re-requesting is a no-op that the browser resolves silently,
        // so skip it to avoid redundant work on every remount.
        const permission =
          Notification.permission === "default"
            ? await Notification.requestPermission()
            : Notification.permission;
        if (permission !== "granted") return;

        const messaging = getFirebaseMessaging();
        if (!messaging) return;

        const token = await getToken(messaging, { vapidKey: VAPID_KEY });
        if (!token) return;

        // Only send the token to the server when it changes.
        const stored = localStorage.getItem(FCM_TOKEN_KEY);
        if (token !== stored) {
          await updateFcmToken({ fcm_token: token });
          localStorage.setItem(FCM_TOKEN_KEY, token);
        }
      } catch (error) {
        console.error("[FCM] Initialisation failed:", error);
      }
    }

    init();

    // Subscribe to foreground messages.
    const unsubscribe = onForegroundMessage((payload: MessagePayload) => {
      const title =
        pickField(payload.data?.title, payload.notification?.title) ??
        t("newNotification");
      const body =
        pickField(payload.data?.body, payload.notification?.body) ?? "";

      // Keep the bell badge and list in sync with the live push instead of
      // waiting for an unrelated refetch trigger.
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });

      // FCM messages with a `notification` payload can also raise an OS
      // banner while the tab is focused. Close those so only the in-app toast
      // remains visible.
      void dismissOsNotifications([
        title,
        payload.notification?.title ?? "",
        payload.data?.title ?? "",
        "New Notification",
        t("newNotification"),
      ]);

      toast(title, {
        id: payload.messageId ?? `fcm-${title}-${body}`,
        description: body || undefined,
        icon: <Bell className="size-4" />,
        action: {
          label: t("viewAll"),
          onClick: () => router.push("/dashboard/notifications"),
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router, t, queryClient]);
}
