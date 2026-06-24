import { setRequestLocale } from "next-intl/server";

import { SuggestionReview } from "@/features/ai-suggestions/components/suggestion-review";

type PageProps = {
  params: Promise<{ locale: string; suggestion_id: string }>;
};

export default async function SuggestionReviewPage({ params }: PageProps) {
  const { locale, suggestion_id } = await params;
  setRequestLocale(locale);

  return <SuggestionReview suggestionId={suggestion_id} />;
}
