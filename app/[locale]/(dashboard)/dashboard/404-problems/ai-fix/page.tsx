import { setRequestLocale } from "next-intl/server";
import { AiFixContent } from "@/features/not-found-problems/components/ai-fix-content";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AiFixPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <AiFixContent />;
}
