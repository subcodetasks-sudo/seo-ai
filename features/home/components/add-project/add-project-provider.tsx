"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useStartCrawl, useUpdateProject } from "@/features/home";
import { siteSectionsQueryOptions } from "@/features/home/queries/queries";
import type { Project, Section } from "@/features/home/types";
import { homeKeys } from "@/features/home/queries/query-keys";
import { useSelectedProject } from "@/features/home/context/selected-project-context";

type AddProjectFormData = {
  projectId?: string;
  domain: string;
  platform: "wordpress" | "salla" | "custom";
  setupLink: string;
  setupToken: string;
  selectedSections: Set<string>;
};

type AddProjectContextValue = {
  step: number | null;
  formData: Partial<AddProjectFormData>;
  sections: Section[];
  isSectionsLoading: boolean;
  crawlJobId: string | null;
  startAddProject: () => void;
  enterAnalysis: (params: {
    projectId: string;
    domain: string;
    crawlJobId: string;
  }) => void;
  handleStep1Submit: (project: Project) => void;
  handleStep2Submit: () => void;
  handleStep3Submit: (selectedSections: Set<string>) => void;
  backStep: () => void;
  exitAddProject: () => void;
  viewProject: () => void;
  viewIssues: () => void;
};

// Step 4 is the live crawl analysis screen shown after the form is submitted.
const ANALYSIS_STEP = 4;

const initialFormData: Partial<AddProjectFormData> = {
  platform: "wordpress",
  domain: "",
  projectId: "",
  setupLink: "",
  setupToken: "",
  selectedSections: new Set(),
};

const AddProjectContext = createContext<AddProjectContextValue | null>(null);

export function AddProjectProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setSelectedProjectId } = useSelectedProject();
  const startCrawlMutation = useStartCrawl();
  const updateProjectMutation = useUpdateProject();
  const [step, setStep] = useState<number | null>(null);
  const [crawlJobId, setCrawlJobId] = useState<string | null>(null);
  const [formData, setFormDataState] = useState<Partial<AddProjectFormData>>(initialFormData);

  const { data: sectionsApiResponse, isLoading: isSectionsLoading } = useQuery({
    ...siteSectionsQueryOptions(formData.domain || ""),
    enabled: !!formData.domain && step !== null && step >= 3,
  });

  const sections = sectionsApiResponse?.data?.sections ?? [];

  const startAddProject = useCallback(() => {
    setStep(1);
    setCrawlJobId(null);
    setFormDataState(initialFormData);
  }, []);

  // Jump straight to the live analysis screen for an already-started crawl
  // (used by the projects-list rescan button).
  const enterAnalysis = useCallback(
    ({
      projectId,
      domain,
      crawlJobId: jobId,
    }: {
      projectId: string;
      domain: string;
      crawlJobId: string;
    }) => {
      setFormDataState((prev) => ({ ...prev, projectId, domain }));
      setCrawlJobId(jobId);
      setStep(ANALYSIS_STEP);
    },
    []
  );

  const handleStep1Submit = useCallback(
    (project: Project) => {
      setFormDataState((prev) => ({
        ...prev,
        projectId: project.id,
        domain: project.domain,
        platform: project.platform,
        setupLink: project.setup_link ?? "",
        setupToken: project.setup_token ?? "",
      }));
      queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
      setStep(2);
    },
    [queryClient]
  );

  const handleStep2Submit = useCallback(() => {
    setStep(3);
  }, []);

  const handleStep3Submit = useCallback(
    (selectedSections: Set<string>) => {
      if (!formData.projectId) return;

      if (selectedSections.size > 0) {
        updateProjectMutation.mutate({
          projectId: formData.projectId,
          body: { url_filter: Array.from(selectedSections) },
        });
      }

      startCrawlMutation.mutate(formData.projectId, {
        onSuccess: (response) => {
          setCrawlJobId(response.data.crawl_job_id);
          queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
          setStep(ANALYSIS_STEP);
        },
      });
    },
    [formData.projectId, startCrawlMutation, updateProjectMutation, queryClient]
  );

  const backStep = useCallback(() => {
    setStep((current) => {
      if (current === null || current <= 1) return null;
      return current - 1;
    });
  }, []);

  const resetFlow = useCallback(() => {
    setStep(null);
    setCrawlJobId(null);
    setFormDataState(initialFormData);
  }, []);

  const exitAddProject = useCallback(() => {
    resetFlow();
    router.push("/dashboard");
  }, [resetFlow, router]);

  const viewProject = useCallback(() => {
    if (formData.projectId) setSelectedProjectId(formData.projectId);
    resetFlow();
    router.push("/dashboard/overview");
  }, [formData.projectId, setSelectedProjectId, resetFlow, router]);

  const viewIssues = useCallback(() => {
    if (formData.projectId) setSelectedProjectId(formData.projectId);
    resetFlow();
    router.push("/dashboard/problems");
  }, [formData.projectId, setSelectedProjectId, resetFlow, router]);

  return (
    <AddProjectContext.Provider
      value={{
        step,
        formData,
        sections,
        isSectionsLoading,
        crawlJobId,
        startAddProject,
        enterAnalysis,
        handleStep1Submit,
        handleStep2Submit,
        handleStep3Submit,
        backStep,
        exitAddProject,
        viewProject,
        viewIssues,
      }}
    >
      {children}
    </AddProjectContext.Provider>
  );
}

export function useAddProject() {
  const context = useContext(AddProjectContext);
  if (!context) {
    throw new Error("useAddProject must be used within AddProjectProvider");
  }
  return context;
}
