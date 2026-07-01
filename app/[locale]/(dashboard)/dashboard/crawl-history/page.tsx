import { setRequestLocale } from "next-intl/server";

import { CrawlHistoryContent } from "@/features/crawling";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function CrawlHistoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <CrawlHistoryContent />;
}
