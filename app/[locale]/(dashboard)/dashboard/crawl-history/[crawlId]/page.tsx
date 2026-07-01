import { setRequestLocale } from "next-intl/server";

import { CrawlPagesContent } from "@/features/crawling";

type PageProps = {
  params: Promise<{ locale: string; crawlId: string }>;
};

export default async function CrawlPagesPage({ params }: PageProps) {
  const { locale, crawlId } = await params;
  setRequestLocale(locale);

  return <CrawlPagesContent crawlId={crawlId} />;
}
