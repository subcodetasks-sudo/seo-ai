"use client";

import { useEffect } from "react";
import { getToken } from "firebase/messaging";
import { useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { toast } from "sonner";

import { env } from "@/config/env";
import { useRouter } from "@/i18n/navigation";
import { getFirebaseMessaging, onForegroundMessage } from "../services/firebase-client";
import { updateFcmToken } from "../queries/api";

const FCM_TOKEN_KEY = "fcm_token";
const VAPID_KEY = env.FIREBASE_VAPID_KEY ?? "";

export function useFirebaseNotifications() {
  const router = useRouter();
  const t = useTranslations("notifications");

  useEffect(() => {
    if (typeof window === "undefined" || !("Notification" in window)) return;

    async function init() {
      try {
        const permission = await Notification.requestPermission();
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
    const unsubscribe = onForegroundMessage((payload) => {
      const title =
        payload.data?.title ?? payload.notification?.title ?? "New Notification";
      const body =
        payload.data?.body ?? payload.notification?.body ?? "";

      toast(title, {
        description: body,
        icon: <Bell className="size-4" />,
        action: {
          label: t("viewAll"),
          onClick: () => router.push("/notifications"),
        },
      });
    });

    return () => {
      unsubscribe();
    };
  }, [router, t]);
}
