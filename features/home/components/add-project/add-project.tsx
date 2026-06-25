"use client";

import { useDirection } from "@/components/ui/direction";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAddProject } from "./add-project-provider";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import ProjectAnalysis from "../project-analysis/ProjectAnalysis";

export function AddProject() {
  const dir = useDirection();

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
    viewIssues,
  } = useAddProject();

  if (!step) {
    return null;
  }

  return (
    <div
      className="flex min-h-screen flex-col items-start justify-start gap-6 bg-neutral-75 px-4 py-8 lg:px-10"
      dir={dir}
    >
      <div className="flex w-full items-center justify-between">
        <div />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={exitAddProject}
          className="size-9 rounded-lg text-neutral-500 hover:bg-neutral-200 hover:text-secondary-500"
        >
          <X className="size-5" />
          <span className="sr-only">Cancel</span>
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
            onViewIssues={viewIssues}
            onViewProject={viewProject}
          />
        )}
      </div>
    </div>
  );
}
