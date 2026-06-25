import { setRequestLocale } from "next-intl/server";
import { HydrationBoundary, QueryClient, dehydrate } from "@tanstack/react-query";

import { NotificationsContent } from "@/features/notifications/components/notifications-content";
import {
  notificationsQueryOptions,
  unreadCountQueryOptions,
} from "@/features/notifications/queries/queries";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NotificationsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const queryClient = new QueryClient();
  await Promise.all([
    queryClient.prefetchQuery(notificationsQueryOptions()),
    queryClient.prefetchQuery(unreadCountQueryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotificationsContent />
    </HydrationBoundary>
  );
}
