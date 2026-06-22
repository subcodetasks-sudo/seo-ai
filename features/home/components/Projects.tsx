"use client";

import {
  Clock,
  ExternalLink,
  Globe,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddProject } from "@/features/home/components/add-project/add-project-provider";
import type { ProjectListItem } from "@/features/home/types";
import { cn } from "@/lib/utils";

type ProjectsProps = {
  projects: ProjectListItem[];
};

type ProjectCardProps = {
  project: ProjectListItem;
};

type ProjectStatProps = {
  value: string;
  label: string;
  valueClassName?: string;
};

function formatPagesCount(count: number): string {
  if (count >= 1000) {
    const formatted = (count / 1000).toFixed(1);
    return `${formatted.endsWith(".0") ? formatted.slice(0, -2) : formatted}K`;
  }

  return new Intl.NumberFormat().format(count);
}

function formatCount(count: number, locale: string): string {
  return new Intl.NumberFormat(locale).format(count);
}

function ProjectStat({ value, label, valueClassName }: ProjectStatProps) {
  return (
    <div className="flex min-w-16 flex-col items-center gap-1 text-center">
      <span
        className={cn(
          "text-h4 font-semibold text-secondary-500",
          valueClassName,
        )}
      >
        {value}
      </span>
      <span className="text-label-sm text-neutral-500">{label}</span>
    </div>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("home.projects");
  const locale = useLocale();

  const lastScanDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(project.lastScanDate));

  return (
    <article className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="min-w-0 flex-1 space-y-2">
        <Badge className="border-primary-100 bg-primary-50 text-primary-500 capitalize">
          <Globe className="size-3" aria-hidden="true" />
          {t(`platforms.${project.platform}`)}
        </Badge>

        <div className="space-y-1">
          <h3 className="text-h4 font-semibold text-secondary-500">
            {project.name}
          </h3>
          <p className="truncate text-label-md text-neutral-500">{project.url}</p>
        </div>

        <p className="flex items-center gap-1.5 text-label-sm text-neutral-400">
          <Clock className="size-3.5 shrink-0" aria-hidden="true" />
          {t("lastScan", { date: lastScanDate })}
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 lg:px-4">
        <ProjectStat
          value={formatPagesCount(project.pagesCount)}
          label={t("pages")}
        />
        <div className="h-10 w-px bg-neutral-200" aria-hidden="true" />
        <ProjectStat
          value={formatCount(project.errorCount, locale)}
          label={t("errors")}
          valueClassName="text-error-300"
        />
        <div className="h-10 w-px bg-neutral-200" aria-hidden="true" />
        <ProjectStat
          value={formatCount(project.error404Count, locale)}
          label={t("errors404")}
          valueClassName="text-warning-400"
        />
      </div>

      <div className="flex items-center gap-2 lg:shrink-0">
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-neutral-200 bg-white px-4 text-secondary-500 hover:bg-neutral-50"
        >
          <ExternalLink className="size-4" aria-hidden="true" />
          {t("open")}
        </Button>
        <Button type="button" className="h-9 gap-2 bg-primary-300 text-secondary-500 px-4 hover:bg-primary-400">
          <RefreshCw className="size-4" aria-hidden="true" />
          {t("rescan")}
        </Button>
      </div>
    </article>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const t = useTranslations("home.projects");
  const locale = useLocale();
  const { startAddProject } = useAddProject();

  const totalErrors = projects.reduce((sum, project) => sum + project.errorCount, 0);
  const total404Errors = projects.reduce(
    (sum, project) => sum + project.error404Count,
    0,
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">
          {t("linkedSites", { count: projects.length })}
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="rounded-xl border border-error-75 bg-white px-5 py-4">
          <p className="text-label-md text-secondary-400">
            {t("totalErrors")} :{" "}
            <span className="font-semibold text-error-300">
              {formatCount(totalErrors, locale)}
            </span>
          </p>
        </div>
        <div className="rounded-xl border border-error-75 bg-white px-5 py-4">
          <p className="text-label-md text-secondary-400">
            {t("total404Errors")} :{" "}
            <span className="font-semibold text-error-300">
              {formatCount(total404Errors, locale)}
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="flex justify-start">
        <Button
          type="button"
          size="lg"
          onClick={startAddProject}
          className="h-10 gap-2 bg-primary-300 text-secondary-500 px-5 hover:bg-primary-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("addProject")}
        </Button>
      </div>
    </div>
  );
}
