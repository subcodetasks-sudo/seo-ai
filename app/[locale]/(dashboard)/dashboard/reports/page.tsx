import { setRequestLocale } from "next-intl/server";

import { ReportsContent } from "@/features/reports";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ReportsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ReportsContent />;
}
