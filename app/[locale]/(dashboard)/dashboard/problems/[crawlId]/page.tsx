import { setRequestLocale } from "next-intl/server";

import { ProblemDetail } from "@/features/problems/components/problem-detail";

type PageProps = {
  params: Promise<{ locale: string; crawlId: string }>;
  searchParams: Promise<{ type?: string; severity?: string; suggestion_type?: string }>;
};

export default async function ProblemDetailPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  const { type, severity, suggestion_type } = await searchParams;
  setRequestLocale(locale);

  return (
    <ProblemDetail
      type={type ?? "missing_meta_title"}
      severity={severity}
      suggestionType={suggestion_type ?? null}
    />
  );
}
