"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Archive,
  Clock,
  ExternalLink,
  FileText,
  Gauge,
  Globe,
  Link2Off,
  type LucideIcon,
  Plus,
  RefreshCw,
  ShieldCheck,
  ShieldX,
  Trash2,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAddProject } from "@/features/home/components/add-project/add-project-provider";
import { useDeleteProject, useStartCrawl } from "@/features/home/queries/mutations";
import { homeKeys } from "@/features/home/queries/query-keys";
import type { ProjectListItem } from "@/features/home/types";
import { cn } from "@/lib/utils";
import { VerifyPanel } from "./verify-panel";

type ProjectsProps = {
  projects: ProjectListItem[];
};

type ProjectCardProps = {
  project: ProjectListItem;
};

type ProjectStatProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  valueClassName?: string;
  iconClassName?: string;
};

function ProjectStat({ icon: Icon, value, label, valueClassName, iconClassName }: ProjectStatProps) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-neutral-100 bg-neutral-50 px-3 py-2.5">
      <Icon className={cn("size-4 shrink-0 text-neutral-400", iconClassName)} aria-hidden="true" />
      <div className="flex min-w-0 flex-col">
        <span className={cn("text-h4 font-semibold leading-tight text-secondary-500", valueClassName)}>
          {value}
        </span>
        <span className="truncate text-label-sm text-neutral-500">{label}</span>
      </div>
    </div>
  );
}

function VerifyProjectModal({ project }: { project: ProjectListItem }) {
  const t = useTranslations("home.projects");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  function handleVerified() {
    setOpen(false);
    queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 gap-2 border-primary-200 bg-primary-50 px-4 text-primary-600 hover:bg-primary-100 hover:text-primary-700"
        >
          <ShieldCheck className="size-4" aria-hidden="true" />
          {t("verifyToken")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl border-neutral-200 bg-neutral-75 p-6">
        <DialogTitle className="sr-only">{t("verifyToken")}</DialogTitle>
        <VerifyPanel projectId={project.id} onVerified={handleVerified} />
      </DialogContent>
    </Dialog>
  );
}

function ProjectCard({ project }: ProjectCardProps) {
  const t = useTranslations("home.projects");
  const locale = useLocale();
  const { enterAnalysis } = useAddProject();

  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();
  const { mutate: startCrawl, isPending: isRescanning } = useStartCrawl();

  const scanDate = project.last_crawl_at ?? project.created_at;
  const formattedDate = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(scanDate));

  const healthScore = project.health_score !== null ? `${project.health_score}` : "—";
  const numberFormatter = new Intl.NumberFormat(locale);
  const pagesCrawled = numberFormatter.format(project.pages_crawled);
  const totalIssues = numberFormatter.format(project.total_issues);
  const total404Pages = numberFormatter.format(project.total_404_pages);

  function handleDelete() {
    deleteProject(project.id, {
      onSuccess: () => toast.success(t("deleteSuccess")),
    });
  }

  function handleRescan() {
    startCrawl(project.id, {
      onSuccess: (response) => {
        enterAnalysis({
          projectId: project.id,
          domain: project.domain,
          crawlJobId: response.data.crawl_job_id,
        });
      },
    });
  }

  return (
    <article className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-primary-100 bg-primary-50 text-primary-500 capitalize">
              <Globe className="size-3" aria-hidden="true" />
              {t(`platforms.${project.platform}`)}
            </Badge>
            {project.is_archived && (
              <Badge className="border-warning-100 bg-warning-50 text-warning-600 capitalize">
                <Archive className="size-3" aria-hidden="true" />
                {t("archived")}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <h3 className="text-h4 font-semibold text-secondary-500">{project.name}</h3>
            <p className="truncate text-label-md text-neutral-500">{project.domain}</p>
          </div>

          <p className="flex items-center gap-1.5 text-label-sm text-neutral-400">
            <Clock className="size-3.5 shrink-0" aria-hidden="true" />
            {t("lastScan", { date: formattedDate })}
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={isDeleting}
              className="h-9 w-9 shrink-0 border-neutral-200 text-neutral-400 hover:border-error-200 hover:bg-error-50 hover:text-error-600"
              aria-label={t("delete")}
            >
              <Trash2 className="size-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteConfirmDesc", { name: project.name })}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-error-600 text-white hover:bg-error-700"
              >
                {t("deleteConfirmAction")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <ProjectStat
          icon={Gauge}
          value={healthScore}
          label={t("health")}
          valueClassName={project.health_score !== null ? "text-secondary-500" : "text-neutral-400"}
        />
        <ProjectStat
          icon={project.is_verified ? ShieldCheck : ShieldX}
          value={project.is_verified ? t("verified") : t("unverified")}
          label={t("status")}
          valueClassName={project.is_verified ? "text-success-500" : "text-warning-400"}
          iconClassName={project.is_verified ? "text-success-500" : "text-warning-400"}
        />
        <ProjectStat icon={FileText} value={pagesCrawled} label={t("pages")} />
        <ProjectStat
          icon={AlertTriangle}
          value={totalIssues}
          label={t("errors")}
          valueClassName={project.total_issues > 0 ? "text-warning-500" : "text-secondary-500"}
          iconClassName={project.total_issues > 0 ? "text-warning-500" : "text-neutral-400"}
        />
        <ProjectStat
          icon={Link2Off}
          value={total404Pages}
          label={t("errors404")}
          valueClassName={project.total_404_pages > 0 ? "text-error-500" : "text-secondary-500"}
          iconClassName={project.total_404_pages > 0 ? "text-error-500" : "text-neutral-400"}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
        {!project.is_verified && project.platform === "custom" && (
          <VerifyProjectModal project={project} />
        )}

        <Button
          type="button"
          variant="outline"
          asChild
          className="h-9 gap-2 border-neutral-200 bg-white px-4 text-secondary-500 hover:bg-neutral-50"
        >
          <a href={project.domain} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="size-4" aria-hidden="true" />
            {t("open")}
          </a>
        </Button>

        <Button
          type="button"
          onClick={handleRescan}
          disabled={isRescanning}
          className="h-9 gap-2 bg-primary-300 text-secondary-500 px-4 hover:bg-primary-400 disabled:opacity-60"
        >
          <RefreshCw className={cn("size-4", isRescanning && "animate-spin")} aria-hidden="true" />
          {isRescanning ? t("rescanning") : t("rescan")}
        </Button>
      </div>
    </article>
  );
}

export default function Projects({ projects }: ProjectsProps) {
  const t = useTranslations("home.projects");
  const { startAddProject } = useAddProject();

  const verifiedCount = projects.filter((p) => p.is_verified).length;
  const unverifiedCount = projects.length - verifiedCount;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-h1 font-semibold text-secondary-500">{t("title")}</h1>
          <p className="text-label-md text-neutral-500">
            {t("linkedSites", { count: projects.length })}
          </p>
        </div>
        <Button
          type="button"
          size="lg"
          onClick={startAddProject}
          className="h-10 shrink-0 gap-2 bg-primary-300 text-secondary-500 px-5 hover:bg-primary-400"
        >
          <Plus className="size-4" aria-hidden="true" />
          {t("addProject")}
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
          <p className="text-label-md text-secondary-400">
            {t("verified")} :{" "}
            <span className="font-semibold text-success-500">{verifiedCount}</span>
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white px-5 py-4">
          <p className="text-label-md text-secondary-400">
            {t("unverified")} :{" "}
            <span className="font-semibold text-warning-400">{unverifiedCount}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
