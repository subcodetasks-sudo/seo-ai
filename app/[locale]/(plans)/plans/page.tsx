import type { Metadata } from "next";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Header } from "@/components/Header";
import { PlansContent, publicPlansQueryOptions } from "@/features/plans";
import { getLocaleDirection } from "@/i18n/routing";

type PlansPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: PlansPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plans.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function PlansPage({ params }: PlansPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const direction = getLocaleDirection(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(publicPlansQueryOptions());

  return (
    <div dir={direction} className="flex min-h-screen flex-col bg-neutral-50">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PlansContent />
        </HydrationBoundary>
      </main>
    </div>
  );
}
