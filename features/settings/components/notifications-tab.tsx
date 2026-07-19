"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { useUpdateNotificationPrefs } from "../queries/mutations";
import { notificationPrefsQueryOptions } from "../queries/queries";
import type { NotificationPrefs } from "../queries/api";
import { NotificationPreferenceRow } from "./notification-preference-row";

const DEBOUNCE_MS = 800;

const PREFS_CONFIG = [
  {
    labelKey: "crawlDone",
    descriptionKey: "crawlDoneDesc",
    emailKey: "crawl_done_email",
    inAppKey: "crawl_done_inapp",
  },
  {
    labelKey: "criticalIssue",
    descriptionKey: "criticalIssueDesc",
    emailKey: "critical_issue_email",
    inAppKey: "critical_issue_inapp",
  },
  {
    labelKey: "new404",
    descriptionKey: "new404Desc",
    emailKey: "new_404_email",
    inAppKey: "new_404_inapp",
  },
  {
    labelKey: "planLimit",
    descriptionKey: "planLimitDesc",
    emailKey: "plan_limit_email",
    inAppKey: "plan_limit_inapp",
  },
] as const;

export function NotificationsTab() {
  const t = useTranslations("settings.notifications");
  const { data } = useQuery(notificationPrefsQueryOptions());
  const { mutate: updatePrefs } = useUpdateNotificationPrefs();

  const [prefs, setPrefs] = useState<NotificationPrefs | null>(null);
  const serverPrefsRef = useRef<NotificationPrefs | null>(null);
  const pendingRef = useRef<Partial<NotificationPrefs>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (data?.data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPrefs(data.data);
      serverPrefsRef.current = data.data;
    }
  }, [data]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleToggle(key: keyof NotificationPrefs, value: boolean) {
    setPrefs((prev) => (prev ? { ...prev, [key]: value } : prev));

    pendingRef.current = { ...pendingRef.current, [key]: value };

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const patch = pendingRef.current;
      pendingRef.current = {};

      const serverPrefs = serverPrefsRef.current;
      if (!serverPrefs) return;

      const diff = Object.fromEntries(
        Object.entries(patch).filter(
          ([k, v]) => serverPrefs[k as keyof NotificationPrefs] !== v,
        ),
      ) as Partial<NotificationPrefs>;

      if (Object.keys(diff).length === 0) return;

      updatePrefs(diff, {
        onSuccess: (response) => {
          if (response.data) serverPrefsRef.current = response.data;
        },
        onError: (error) => toast.error(error.message),
      });
    }, DEBOUNCE_MS);
  }

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardContent className="pt-0">
        <div className="grid grid-cols-[1fr_auto_auto]">
          {/* Title + column headers — same row */}
          <div className="border-b border-neutral-100 py-4">
            <p className="text-label-lg font-semibold text-secondary-500">{t("title")}</p>
          </div>
          <div className="flex items-center justify-center border-b border-neutral-100 px-6 py-4">
            <span className="text-label-sm font-medium text-neutral-400">{t("channelEmail")}</span>
          </div>
          <div className="flex items-center justify-center border-b border-neutral-100 py-4 ps-6">
            <span className="text-label-sm font-medium text-neutral-400">{t("channelInApp")}</span>
          </div>

          {/* Preference rows */}
          {prefs &&
            PREFS_CONFIG.map(({ labelKey, descriptionKey, emailKey, inAppKey }, index) => (
              <NotificationPreferenceRow
                key={emailKey}
                labelKey={labelKey}
                descriptionKey={descriptionKey}
                emailEnabled={prefs[emailKey]}
                inAppEnabled={prefs[inAppKey]}
                isLast={index === PREFS_CONFIG.length - 1}
                onEmailToggle={(val) => handleToggle(emailKey, val)}
                onInAppToggle={(val) => handleToggle(inAppKey, val)}
              />
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
