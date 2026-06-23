"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/navigation";
import { useStartCrawl, useUpdateProject } from "@/features/home";
import { siteSectionsQueryOptions } from "@/features/home/queries/queries";
import type { Project, Section } from "@/features/home/types";
import { homeKeys } from "@/features/home/queries/query-keys";

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
  startAddProject: () => void;
  handleStep1Submit: (project: Project) => void;
  handleStep2Submit: () => void;
  handleStep3Submit: (selectedSections: Set<string>) => void;
  backStep: () => void;
  exitAddProject: () => void;
};

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
  const startCrawlMutation = useStartCrawl();
  const updateProjectMutation = useUpdateProject();
  const [step, setStep] = useState<number | null>(null);
  const [formData, setFormDataState] = useState<Partial<AddProjectFormData>>(initialFormData);

  const { data: sectionsApiResponse, isLoading: isSectionsLoading } = useQuery({
    ...siteSectionsQueryOptions(formData.domain || ""),
    enabled: !!formData.domain && step !== null && step >= 3,
  });

  const sections = sectionsApiResponse?.data?.sections ?? [];

  const startAddProject = useCallback(() => {
    setStep(1);
    setFormDataState(initialFormData);
  }, []);

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
        onSuccess: () => {
          setStep(null);
          setFormDataState(initialFormData);
          router.push("/dashboard");
        },
      });
    },
    [formData.projectId, startCrawlMutation, updateProjectMutation, router]
  );

  const backStep = useCallback(() => {
    setStep((current) => {
      if (current === null || current <= 1) return null;
      return current - 1;
    });
  }, []);

  const exitAddProject = useCallback(() => {
    setStep(null);
    setFormDataState(initialFormData);
    router.push("/dashboard");
  }, [router]);

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
