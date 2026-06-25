import { setRequestLocale } from "next-intl/server";

import { GoogleAnalyticsContent } from "@/features/google-analytics";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function GoogleAnalyticsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <GoogleAnalyticsContent />;
}
