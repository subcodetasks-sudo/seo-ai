import { setRequestLocale } from "next-intl/server";

import { ChangelogContent } from "@/features/changelog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ChangelogPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ChangelogContent />;
}
