"use client";

import { useTranslations } from "next-intl";

import { Switch } from "@/components/ui/switch";

type NotificationPreferenceRowProps = {
  labelKey: string;
  descriptionKey: string;
  emailEnabled: boolean;
  inAppEnabled: boolean;
  isLast: boolean;
  onEmailToggle: (enabled: boolean) => void;
  onInAppToggle: (enabled: boolean) => void;
};

export function NotificationPreferenceRow({
  labelKey,
  descriptionKey,
  emailEnabled,
  inAppEnabled,
  isLast,
  onEmailToggle,
  onInAppToggle,
}: NotificationPreferenceRowProps) {
  const t = useTranslations("settings.notifications");
  const border = isLast ? "" : "border-b border-neutral-100";

  return (
    <>
      <div className={`flex flex-col justify-center gap-1 py-4 pe-4 text-start ${border}`}>
        <p className="text-label-md font-medium text-secondary-500">{t(labelKey as any)}</p>
        <p className="text-label-sm text-neutral-500">{t(descriptionKey as any)}</p>
      </div>
      <div className={`flex items-center justify-center px-6 py-4 ${border}`}>
        <Switch checked={emailEnabled} onCheckedChange={onEmailToggle} />
      </div>
      <div className={`flex items-center justify-center py-4 ps-6 ${border}`}>
        <Switch checked={inAppEnabled} onCheckedChange={onInAppToggle} />
      </div>
    </>
  );
}
