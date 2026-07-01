"use client";

import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import EmptyProjects from "@/features/home/components/empty-projects";
import Projects from "@/features/home/components/Projects";
import { AddProject } from "@/features/home/components/add-project/add-project";
import { useAllProjects, useAddProject } from "@/features/home";

export function DashboardContent() {
  const t = useTranslations("home");
  const tCommon = useTranslations("common.state");
  const { data, isLoading, error, refetch } = useAllProjects();
  const { step } = useAddProject();

  if (step !== null) {
    return <AddProject />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 bg-neutral-75 px-6 py-8 lg:px-10">
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 bg-neutral-75 px-6 py-8 lg:px-10">
        <ErrorState
          title={t("loadError")}
          retryLabel={tCommon("retry")}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const projects = data?.data?.items ?? [];
  const hasProjects = projects.length > 0;

  return (
    <div className="flex flex-1 bg-neutral-75 px-6 py-8 lg:px-10">
      {hasProjects ? (
        <div className="flex-1 animate-fade-in-up">
          <Projects projects={projects} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center animate-fade-in-up">
          <EmptyProjects />
        </div>
      )}
    </div>
  );
}
