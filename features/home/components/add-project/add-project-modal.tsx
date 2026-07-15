"use client";

import { useTranslations } from "next-intl";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAddProject } from "./add-project-provider";
import { AddProject } from "./add-project";

export function AddProjectModal() {
  const { step, exitAddProject } = useAddProject();
  const t = useTranslations("home.emptyProjects");

  const isOpen = step !== null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        exitAddProject();
      }
    }}>
      <DialogContent className="w-full max-w-4xl border-neutral-200 bg-neutral-75 px-4 py-8 sm:px-6 sm:py-10">
        <DialogTitle className="sr-only">{t("addProject")}</DialogTitle>
        <AddProject />
      </DialogContent>
    </Dialog>
  );
}
