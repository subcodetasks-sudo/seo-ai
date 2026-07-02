import { setRequestLocale } from "next-intl/server";

import { CrawlPageDetailContent } from "@/features/crawling";

type PageProps = {
  params: Promise<{ locale: string; crawlId: string; pageId: string }>;
};

export default async function CrawlPageDetailPage({ params }: PageProps) {
  const { locale, crawlId, pageId } = await params;
  setRequestLocale(locale);

  return <CrawlPageDetailContent crawlId={crawlId} pageId={pageId} />;
}
