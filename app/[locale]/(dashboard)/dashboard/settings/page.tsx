import { setRequestLocale } from "next-intl/server";

import { SettingsContent } from "@/features/settings";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SettingsContent />;
}
