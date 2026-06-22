"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useCreateProject } from "@/features/home";
import { siteSectionsQueryOptions } from "@/features/home/queries/queries";
import type { Section } from "@/features/home/types";
import { homeKeys } from "@/features/home/queries/query-keys";
import { toast } from "sonner";

type AddProjectFormData = {
  websiteUrl: string;
  projectType: "wordpress" | "salla" | "custom";
  token: string;
  domain: string;
  sections: Section[];
  selectedSections: Set<string>;
  verificationMethod?: string;
};

type AddProjectContextValue = {
  step: number | null;
  formData: Partial<AddProjectFormData>;
  sections: Section[];
  isSectionsLoading: boolean;
  startAddProject: () => void;
  nextStep: () => void;
  backStep: () => void;
  exitAddProject: () => void;
  finishAddProject: (selectedSections: Set<string>) => Promise<void>;
  setFormData: (data: Partial<AddProjectFormData>) => void;
  updateFormData: (updates: Partial<AddProjectFormData>) => void;
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
    sections: [],
    selectedSections: new Set(),
  });

  const normalizedUrl = formData.websiteUrl
    ? formData.websiteUrl.startsWith("http")
      ? formData.websiteUrl
      : `https://${formData.websiteUrl}`
    : "";

  const { data: sectionsApiResponse, isLoading: isSectionsLoading } = useQuery({
    ...siteSectionsQueryOptions(normalizedUrl),
    enabled: !!normalizedUrl && step !== null && step >= 2,
  });

  const sections = sectionsApiResponse?.data?.sections ?? [];

  const startAddProject = useCallback(() => {
    setStep(1);
    setFormDataState({
      websiteUrl: "",
      projectType: "wordpress",
      token: "",
      domain: "",
      sections: [],
      selectedSections: new Set(),
    });
  }, []);

  const nextStep = useCallback(() => {
    setStep((current) => (current !== null && current < 3 ? current + 1 : current));
  }, []);

  const exitAddProject = useCallback(() => {
    setStep(null);
    setFormDataState({
      websiteUrl: "",
      projectType: "wordpress",
      token: "",
      domain: "",
      sections: [],
      selectedSections: new Set(),
    });
    router.push("/dashboard");
  }, [router]);

  const backStep = useCallback(() => {
    setStep((current) => {
      if (current === null || current <= 1) {
        return null;
      }
      return current - 1;
    });
  }, []);

  const setFormData = useCallback((data: Partial<AddProjectFormData>) => {
    setFormDataState(data);
  }, []);

  const updateFormData = useCallback((updates: Partial<AddProjectFormData>) => {
    setFormDataState((prev) => ({ ...prev, ...updates }));
  }, []);

  const finishAddProject = useCallback(async (selectedSections: Set<string>) => {
    if (!formData.websiteUrl || !formData.projectType || !selectedSections.size) {
      toast.error("Please complete all steps");
      return;
    }

    try {
      const fullUrl = formData.websiteUrl.startsWith("http")
        ? formData.websiteUrl
        : `https://${formData.websiteUrl}`;
      const parsed = new URL(fullUrl);
      const projectName = parsed.hostname;
      const selectedPrefixes = Array.from(selectedSections);

      await createProjectMutation.mutateAsync({
        name: projectName,
        domain: fullUrl,
        platform: formData.projectType,
        sitemap_url: null,
        url_filter: selectedPrefixes.length > 0 ? selectedPrefixes.join("|") : null,
      });

      await queryClient.invalidateQueries({ queryKey: homeKeys.projects() });

      toast.success("Project created successfully!");
      setStep(null);
      setFormDataState({
        websiteUrl: "",
        projectType: "wordpress",
        token: "",
        domain: "",
        sections: [],
        selectedSections: new Set(),
      });
      router.push("/dashboard");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create project";
      toast.error(message);
    }
  }, [formData, createProjectMutation, queryClient, router]);

  return (
    <AddProjectContext.Provider
      value={{
        step,
        formData,
        sections,
        isSectionsLoading,
        startAddProject,
        nextStep,
        backStep,
        exitAddProject,
        finishAddProject,
        setFormData,
        updateFormData,
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
