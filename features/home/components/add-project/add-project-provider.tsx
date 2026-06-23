"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useCreateProject } from "@/features/home";
import { siteSectionsQueryOptions } from "@/features/home/queries/queries";
import type { Section } from "@/features/home/types";
import type { Step1FormData, Step2FormData } from "@/features/home/schemas/add-project";
import { homeKeys } from "@/features/home/queries/query-keys";
import { toast } from "sonner";

type AddProjectFormData = {
  websiteUrl: string;
  projectType: "wordpress" | "salla" | "custom";
  token: string;
  domain: string;
  projectId?: string;
  sections: Section[];
  selectedSections: Set<string>;
  analysisState?: "loading" | "success" | null;
  analysisData?: {
    aiSuggestionsCount: number;
    issuesCount: number;
    pagesCount: number;
  };
};

type AddProjectContextValue = {
  step: number | null;
  formData: Partial<AddProjectFormData>;
  sections: Section[];
  isSectionsLoading: boolean;
  startAddProject: () => void;
  handleStep1Submit: (data: Step1FormData) => void;
  handleStep2Submit: (data: Step2FormData) => void;
  handleStep3Submit: (selectedSections: Set<string>) => Promise<void>;
  backStep: () => void;
  exitAddProject: () => void;
  setAnalysisState: (state: "loading" | "success" | null) => void;
  completeAnalysis: (data: { aiSuggestionsCount: number; issuesCount: number; pagesCount: number }) => void;
};

const AddProjectContext = createContext<AddProjectContextValue | null>(null);

export function AddProjectProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createProjectMutation = useCreateProject();
  const [step, setStep] = useState<number | null>(null);
  const [formData, setFormDataState] = useState<Partial<AddProjectFormData>>({
    websiteUrl: "",
    projectType: "wordpress",
    token: "",
    domain: "",
    projectId: "",
    sections: [],
    selectedSections: new Set(),
    analysisState: null,
  });

  const normalizedUrl = formData.websiteUrl
    ? formData.websiteUrl.startsWith("http")
      ? formData.websiteUrl
      : `https://${formData.websiteUrl}`
    : "";

  const { data: sectionsApiResponse, isLoading: isSectionsLoading } = useQuery({
    ...siteSectionsQueryOptions(normalizedUrl),
    enabled: !!normalizedUrl && step !== null && step >= 3,
  });

  const sections = sectionsApiResponse?.data?.sections ?? [];

  const startAddProject = useCallback(() => {
    setStep(1);
    setFormDataState({
      websiteUrl: "",
      projectType: "wordpress",
      token: "",
      domain: "",
      projectId: "",
      sections: [],
      selectedSections: new Set(),
      analysisState: null,
    });
  }, []);

  const handleStep1Submit = useCallback((data: Step1FormData) => {
    const fullUrl = data.websiteUrl.startsWith("http") ? data.websiteUrl : `https://${data.websiteUrl}`;
    setFormDataState((prev) => ({
      ...prev,
      websiteUrl: fullUrl,
      projectType: data.projectType,
      domain: fullUrl,
    }));
    setStep(2);
  }, []);

  const handleStep2Submit = useCallback((data: Step2FormData) => {
    setFormDataState((prev) => ({
      ...prev,
      token: data.token,
    }));
    setStep(3);
  }, []);

  const handleStep3Submit = useCallback(
    async (selectedSections: Set<string>) => {
      if (!formData.websiteUrl || !formData.projectType || !selectedSections.size) {
        toast.error("Please complete all steps");
        return;
      }

      try {
        const projectName = new URL(formData.websiteUrl).hostname || "Untitled Project";
        const selectedPrefixes = Array.from(selectedSections);

        setFormDataState((prev) => ({
          ...prev,
          selectedSections,
          analysisState: "loading",
        }));
        setStep(4);

        const response = await createProjectMutation.mutateAsync({
          name: projectName,
          domain: formData.websiteUrl,
          platform: formData.projectType,
          sitemap_url: null,
          url_filter: selectedPrefixes.length > 0 ? selectedPrefixes : null,
        });

        const projectId = response.data.id;
        setFormDataState((prev) => ({
          ...prev,
          projectId,
        }));

        await queryClient.invalidateQueries({ queryKey: homeKeys.projects() });
      } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to create project";
        toast.error(message);
        setFormDataState((prev) => ({
          ...prev,
          analysisState: null,
        }));
        setStep(3);
      }
    },
    [formData.websiteUrl, formData.projectType, createProjectMutation, queryClient]
  );

  const backStep = useCallback(() => {
    setStep((current) => {
      if (current === null || current <= 1) {
        return null;
      }
      return current - 1;
    });
  }, []);

  const exitAddProject = useCallback(() => {
    setStep(null);
    setFormDataState({
      websiteUrl: "",
      projectType: "wordpress",
      token: "",
      domain: "",
      projectId: "",
      sections: [],
      selectedSections: new Set(),
      analysisState: null,
    });
    router.push("/dashboard");
  }, [router]);

  const setAnalysisState = useCallback((state: "loading" | "success" | null) => {
    setFormDataState((prev) => ({
      ...prev,
      analysisState: state,
    }));
  }, []);

  const completeAnalysis = useCallback(
    (data: { aiSuggestionsCount: number; issuesCount: number; pagesCount: number }) => {
      setFormDataState((prev) => ({
        ...prev,
        analysisState: "success",
        analysisData: data,
      }));
    },
    []
  );

  return (
    <AddProjectContext.Provider
      value={{
        step,
        formData,
        sections,
        isSectionsLoading,
        startAddProject,
        handleStep1Submit,
        handleStep2Submit,
        handleStep3Submit,
        backStep,
        exitAddProject,
        setAnalysisState,
        completeAnalysis,
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
