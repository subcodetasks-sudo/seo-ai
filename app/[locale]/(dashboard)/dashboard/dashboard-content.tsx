"use client";

import EmptyProjects from "@/features/home/components/empty-projects";
import Projects from "@/features/home/components/Projects";
import { AddProject } from "@/features/home/components/add-project/add-project";
import { useAllProjects, useAddProject } from "@/features/home";

export function DashboardContent() {
  const { data, isLoading, error } = useAllProjects();
  const { step } = useAddProject();

  if (step !== null) {
    return <AddProject />;
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <div className="text-center">
          <p>Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center bg-neutral-75 px-6 py-8 lg:px-10">
        <div className="text-center">
          <p>Error loading projects</p>
        </div>
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
