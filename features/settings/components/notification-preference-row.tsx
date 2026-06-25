"use client";

import { useTranslations } from "next-intl";

import { Switch } from "@/components/ui/switch";

type NotificationPreferenceRowProps = {
  labelKey: string;
  descriptionKey: string;
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
};

export function NotificationPreferenceRow({
  labelKey,
  descriptionKey,
  enabled,
  onToggle,
}: NotificationPreferenceRowProps) {
  const t = useTranslations("settings.notifications");

  return (
    <div className="flex items-center justify-between gap-4 border-b border-neutral-100 py-4 last:border-b-0">
      <div className="flex flex-col gap-1 text-start">
        <p className="text-label-md font-medium text-secondary-500">{t(labelKey)}</p>
        <p className="text-label-sm text-neutral-500">{t(descriptionKey)}</p>
      </div>
      <Switch checked={enabled} onCheckedChange={onToggle} />
    </div>
  );
}
