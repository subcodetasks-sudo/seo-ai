import { setRequestLocale } from "next-intl/server";

import { SearchConsoleContent } from "@/features/search-console";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SearchConsolePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <SearchConsoleContent />;
}
