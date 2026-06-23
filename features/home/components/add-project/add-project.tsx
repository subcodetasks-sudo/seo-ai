"use client";

import { useDirection } from "@/components/ui/direction";
import { useAddProject } from "./add-project-provider";
import Progress from "./Progress";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import AnalysisLoading from "../project-analysis/AnalysisLoading";
import AnalysisSuccess from "../project-analysis/AnalysisSuccess";

export function AddProject() {
  const dir = useDirection();
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
  } = useAddProject();

  if (!step) {
    return null;
  }

  const analysisState = formData.analysisState;

  if (analysisState === "loading") {
    return (
      <AnalysisLoading url={formData.domain || ""} />
    );
  }

  if (analysisState === "success") {
    return (
      <AnalysisSuccess
        url={formData.domain || ""}
        aiSuggestionsCount={formData.analysisData?.aiSuggestionsCount ?? 0}
        issuesCount={formData.analysisData?.issuesCount ?? 0}
        pagesCount={formData.analysisData?.pagesCount ?? 0}
        onViewIssues={exitAddProject}
        onViewProject={exitAddProject}
      />
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-75 px-4 py-8"
      dir={dir}
    >
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
  );
}
