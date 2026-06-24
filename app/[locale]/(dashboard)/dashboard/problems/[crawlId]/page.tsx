import { setRequestLocale } from "next-intl/server";

import { ProblemDetail } from "@/features/problems/components/problem-detail";

type PageProps = {
  params: Promise<{ locale: string; crawlId: string }>;
  searchParams: Promise<{ type?: string; severity?: string }>;
};

export default async function ProblemDetailPage({ params, searchParams }: PageProps) {
  const { locale, crawlId } = await params;
  const { type, severity } = await searchParams;
  setRequestLocale(locale);

  return (
    <ProblemDetail
      crawlId={crawlId}
      type={type ?? "missing_meta_title"}
      severity={severity}
    />
  );
}
