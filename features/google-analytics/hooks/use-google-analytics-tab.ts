"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useRouter } from "@/i18n/navigation";

import { GOOGLE_ANALYTICS_TABS, type GoogleAnalyticsTab } from "../types";

function parseGoogleAnalyticsTab(value: string | null): GoogleAnalyticsTab {
  if (value && GOOGLE_ANALYTICS_TABS.includes(value as GoogleAnalyticsTab)) {
    return value as GoogleAnalyticsTab;
  }

  return "overview";
}

export function useGoogleAnalyticsTab() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = parseGoogleAnalyticsTab(searchParams.get("tab"));

  const setTab = useCallback(
    (nextTab: GoogleAnalyticsTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", nextTab);
      router.replace(`/dashboard/google-analytics?${params.toString()}`);
    },
    [router, searchParams],
  );

  return { tab, setTab };
}
