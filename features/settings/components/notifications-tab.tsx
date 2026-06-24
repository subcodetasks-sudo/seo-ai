"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { MOCK_NOTIFICATION_PREFS } from "../services/mock-data";
import type { NotificationPreference } from "../types";
import { NotificationPreferenceRow } from "./notification-preference-row";

export function NotificationsTab() {
  const t = useTranslations("settings.notifications");
  const [preferences, setPreferences] = useState<NotificationPreference[]>(
    MOCK_NOTIFICATION_PREFS,
  );

  function handleToggle(id: string, enabled: boolean) {
    setPreferences((current) =>
      current.map((pref) => (pref.id === id ? { ...pref, enabled } : pref)),
    );
  }

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardHeader className="border-b border-neutral-100 pb-4">
        <CardTitle className="text-label-lg font-semibold text-secondary-500">
          {t("title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        {preferences.map((pref) => (
          <NotificationPreferenceRow
            key={pref.id}
            labelKey={pref.labelKey}
            descriptionKey={pref.descriptionKey}
            enabled={pref.enabled}
            onToggle={(enabled) => handleToggle(pref.id, enabled)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
