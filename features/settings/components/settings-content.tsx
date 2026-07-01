"use client";

import { Suspense } from "react";

import LoadingState from "@/components/loading-state";
import { useDirection } from "@/components/ui/direction";

import { useSettingsTab } from "../hooks/use-settings-tab";
import { BillingTab } from "./billing-tab";
import { IntegrationsTab } from "./integrations-tab";
import { NotificationsTab } from "./notifications-tab";
import { ProfileTab } from "./profile-tab";
import { SettingsHeader } from "./settings-header";
import { SettingsTabs } from "./settings-tabs";

function SettingsTabPanel({ tab }: { tab: string }) {
  switch (tab) {
    case "profile":
      return <ProfileTab />;
    case "notifications":
      return <NotificationsTab />;
    case "integrations":
      return <IntegrationsTab />;
    case "billing":
      return <BillingTab />;
    default:
      return <ProfileTab />;
  }
}

function SettingsTabPanels() {
  const { tab, setTab } = useSettingsTab();

  return (
    <>
      <SettingsTabs activeTab={tab} onTabChange={setTab} />
      <div key={tab} className="settings-panel" role="tabpanel">
        <SettingsTabPanel tab={tab} />
      </div>
    </>
  );
}

export function SettingsContent() {
  const dir = useDirection();

  return (
    <div dir={dir} className="flex flex-1 flex-col bg-neutral-75 px-6 py-8 lg:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <SettingsHeader />
        <Suspense fallback={<LoadingState fullPage={false} />}>
          <SettingsTabPanels />
        </Suspense>
      </div>
    </div>
  );
}
