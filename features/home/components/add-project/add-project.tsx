"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";

import BackLink from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { useDirection } from "@/components/ui/direction";
import { useAddProject } from "./add-project-provider";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ProjectAnalysis from "../project-analysis/ProjectAnalysis";

export function AddProject() {
  const dir = useDirection();
  const t = useTranslations("home.addProject");

  const {
    step,
    formData,
    sections,
    isSectionsLoading,
    crawlJobId,
    handleStep1Submit,
    handleStep2Submit,
    handleStep3Submit,
    backStep,
    exitAddProject,
    viewProject,
  } = useAddProject();

  if (!step) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen flex-col items-start justify-start gap-6 bg-neutral-75 px-4 py-8 lg:px-10"
      dir={dir}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <BackLink onClick={exitAddProject}>{t("exit")}</BackLink>

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={exitAddProject}
          className="size-9 shrink-0 rounded-lg border-neutral-200 bg-white text-secondary-500 shadow-sm hover:border-neutral-300 hover:bg-neutral-50 hover:text-secondary-700"
        >
          <X className="size-5" aria-hidden="true" />
          <span className="sr-only">{t("close")}</span>
        </Button>
      </div>

      <div className="flex w-full flex-col items-center gap-8">
        {step <= 3 && <Progress currentStep={step} />}

        {step === 1 && <Step1 onNext={handleStep1Submit} />}

        {step === 2 && (
          <Step2
            onNext={handleStep2Submit}
            onBack={backStep}
            setupLink={formData.setupLink}
            setupToken={formData.setupToken}
            platform={formData.platform}
            projectId={formData.projectId}
          />
        )}

        {step === 3 && (
          <Step3
            onBack={backStep}
            onFinish={handleStep3Submit}
            domain={formData.domain}
            sections={sections}
            isSectionsLoading={isSectionsLoading}
          />
        )}

        {step === 4 && formData.projectId && crawlJobId && (
          <ProjectAnalysis
            projectId={formData.projectId}
            crawlJobId={crawlJobId}
            url={formData.domain ?? ""}
            onViewProject={viewProject}
          />
        )}
      </div>
    </div>
  );
}
