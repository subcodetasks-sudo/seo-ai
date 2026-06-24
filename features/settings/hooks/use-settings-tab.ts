"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useRouter } from "@/i18n/navigation";

import { SETTINGS_TABS, type SettingsTab } from "../types";

function parseSettingsTab(value: string | null): SettingsTab {
  if (value && SETTINGS_TABS.includes(value as SettingsTab)) {
    return value as SettingsTab;
  }

  return "profile";
}

export function useSettingsTab() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = parseSettingsTab(searchParams.get("tab"));

  const setTab = useCallback(
    (nextTab: SettingsTab) => {
      router.replace(`/dashboard/settings?tab=${nextTab}`);
    },
    [router],
  );

  return { tab, setTab };
}
