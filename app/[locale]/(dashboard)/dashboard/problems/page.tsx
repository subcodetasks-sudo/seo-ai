import { setRequestLocale } from "next-intl/server";

import { ProblemsContent } from "@/features/problems/components/problems-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function ProblemsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <ProblemsContent />;
}
