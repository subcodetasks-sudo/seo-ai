"use client";

import { useEffect, useState } from "react";
import { useDirection } from "@/components/ui/direction";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useAddProject } from "./add-project-provider";
import { useStartCrawl } from "@/features/home/queries/mutations";
import { useCrawlProgress } from "@/features/home/hooks/useCrawlProgress";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import AnalysisLoading from "../project-analysis/AnalysisLoading";
import AnalysisSuccess from "../project-analysis/AnalysisSuccess";

export function AddProject() {
  const dir = useDirection();
  const [crawlId, setCrawlId] = useState<string | null>(null);

  const {
    step,
    formData,
    sections,
    isSectionsLoading,
    handleStep1Submit,
    handleStep2Submit,
    handleStep3Submit,
    backStep,
    exitAddProject,
    completeAnalysis,
  } = useAddProject();

  const startCrawlMutation = useStartCrawl();
  const crawlProgress = useCrawlProgress({
    projectId: formData.projectId || "",
    crawlId: crawlId || "",
    url: formData.domain || "",
  });

  // Start crawl when entering loading state
  useEffect(() => {
    if (formData.analysisState === "loading" && formData.projectId && !crawlId) {
      startCrawlMutation.mutate(formData.projectId, {
        onSuccess: (data) => {
          setCrawlId(data.data.crawl_job_id);
        },
      });
    }
  }, [formData.analysisState, formData.projectId, crawlId, startCrawlMutation]);

  // Complete analysis when crawl finishes
  useEffect(() => {
    if (crawlId && crawlProgress?.isDone && formData.analysisState === "loading") {
      completeAnalysis({
        aiSuggestionsCount: 42,
        issuesCount: 15,
        pagesCount: 221,
      });
    }
  }, [crawlId, crawlProgress?.isDone, formData.analysisState, completeAnalysis]);

  if (!step) {
    return null;
  }

  const analysisState = formData.analysisState;

  if (analysisState === "loading") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-75">
        <AnalysisLoading
          url={formData.domain || ""}
          steps={crawlProgress?.loadingProps.steps}
        />
      </div>
    );
  }

  if (analysisState === "success") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-75">
        <AnalysisSuccess
          url={formData.domain || ""}
          aiSuggestionsCount={formData.analysisData?.aiSuggestionsCount ?? 0}
          issuesCount={formData.analysisData?.issuesCount ?? 0}
          pagesCount={formData.analysisData?.pagesCount ?? 0}
          onViewIssues={exitAddProject}
          onViewProject={exitAddProject}
        />
      </div>
    );
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
      </div>
    </div>
  );
}
