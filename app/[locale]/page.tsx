import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PostsList } from "@/features/home/src/components/posts-list";
import { postsQueryOptions } from "@/features/home/src/queries/posts";
import { UploadDialog } from "@/features/uploads/components/upload-dialog";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "HomePage" });
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(postsQueryOptions);

  return (
    <div className="flex flex-1 justify-center bg-zinc-50 px-6 py-10 dark:bg-black">
      <main className="w-full max-w-3xl rounded-2xl bg-white p-8 dark:bg-zinc-950">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {t("title")}
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          TanStack Query is pre-fetched on the server and hydrated on the client.
        </p>
        <div className="mt-6">
          <UploadDialog />
        </div>

        <section className="mt-8">
          <h2 className="mb-4 text-lg font-medium text-zinc-900 dark:text-zinc-100">
            Server-rendered posts
          </h2>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <PostsList />
          </HydrationBoundary>
        </section>
      </main>
    </div>
  );
}
