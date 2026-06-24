import { setRequestLocale } from "next-intl/server";

import { AiSuggestionsContent } from "@/features/ai-suggestions/components/ai-suggestions-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AiSuggestionsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AiSuggestionsContent />;
}
