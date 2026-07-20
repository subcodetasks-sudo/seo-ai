"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { useRouter } from "@/i18n/navigation";

import { SEARCH_CONSOLE_TABS, type SearchConsoleTab } from "../types";

function parseSearchConsoleTab(value: string | null): SearchConsoleTab {
  if (value && SEARCH_CONSOLE_TABS.includes(value as SearchConsoleTab)) {
    return value as SearchConsoleTab;
  }

  return "overview";
}

export function useSearchConsoleTab() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const tab = parseSearchConsoleTab(searchParams.get("tab"));

  const setTab = useCallback(
    (nextTab: SearchConsoleTab) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", nextTab);
      router.replace(`/dashboard/search-console?${params.toString()}`);
    },
    [router, searchParams],
  );

  return { tab, setTab };
}
