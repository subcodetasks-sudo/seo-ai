import { setRequestLocale } from "next-intl/server";
import EmptyProjects from "@/features/home/components/empty-projects";
import Projects from "@/features/home/components/Projects";
import { QueryClient } from "@tanstack/react-query";
import { allProjectsQueryOptions } from "@/features/home";

// const FAKE_PROJECTS: ProjectListItem[] = [];



type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const queryClient = new QueryClient();
  const data = await queryClient.prefetchQuery(allProjectsQueryOptions());
  console.log(data)
  // const projects = data  [];
  const hasProjects = false;

  return (
    <div className="flex flex-1 bg-neutral-75 px-6 py-8 lg:px-10">
      {hasProjects ? (
        <div className="flex-1 animate-fade-in-up">
          <Projects projects={[]} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center animate-fade-in-up">
          <EmptyProjects />
        </div>
      )}
    </div>
  );
}
