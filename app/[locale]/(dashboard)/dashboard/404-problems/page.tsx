import { setRequestLocale } from "next-intl/server";
import { NotFoundProblemsContent } from "@/features/not-found-problems/components/not-found-problems-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NotFoundProblemsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <NotFoundProblemsContent />;
}
