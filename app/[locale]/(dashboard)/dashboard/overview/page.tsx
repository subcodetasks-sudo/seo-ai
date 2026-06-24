import { setRequestLocale } from "next-intl/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { allProjectsQueryOptions } from "@/features/home";
import { OverviewContent } from "@/features/overview";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OverviewPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(allProjectsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <OverviewContent />
    </HydrationBoundary>
  );
}
