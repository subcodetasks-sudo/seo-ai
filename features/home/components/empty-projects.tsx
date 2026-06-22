"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useAddProject } from "@/features/home/components/add-project/add-project-provider";

export default function EmptyProjects() {
  const t = useTranslations("home.emptyProjects");
  const { startAddProject } = useAddProject();

  return (
    <div className="flex flex-col items-center justify-center gap-6 text-center">
      <div
        className="flex size-22 items-center justify-center rounded-[20px] border border-primary-100 bg-primary-50"
        aria-hidden="true"
      >
        <svg
          width="40"
          height="40"
          viewBox="23.75 21.5 43 43"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M57.5 44C56.2625 44 55.25 45.0125 55.25 46.25V57.995C55.25 59.2325 54.2375 60.245 53 60.245H30.5C29.2625 60.245 28.25 59.2325 28.25 57.995V35C28.25 33.7625 29.2625 32.75 30.5 32.75H41.75C42.9875 32.75 44 31.7375 44 30.5C44 29.2625 42.9875 28.25 41.75 28.25H28.25C25.775 28.25 23.75 30.275 23.75 32.75V59.75C23.75 62.225 25.775 64.25 28.25 64.25H55.25C57.725 64.25 59.75 62.225 59.75 59.75V46.25C59.75 45.0125 58.7375 44 57.5 44ZM64.295 28.25H59.75V23.705C59.75 22.49 58.76 21.5 57.545 21.5H57.4775C56.24 21.5 55.25 22.49 55.25 23.705V28.25H50.7275C49.5125 28.25 48.5225 29.24 48.5 30.455V30.5225C48.5 31.76 49.49 32.75 50.7275 32.75H55.25V37.2725C55.25 38.4875 56.24 39.5 57.4775 39.4775H57.545C58.76 39.4775 59.75 38.4875 59.75 37.2725V32.75H64.295C65.51 32.75 66.5 31.76 66.5 30.545V30.455C66.5 29.24 65.51 28.25 64.295 28.25Z"
            className="fill-secondary-500"
          />
          <path
            d="M48.5 37.25H35C33.7625 37.25 32.75 38.2625 32.75 39.5C32.75 40.7375 33.7625 41.75 35 41.75H48.5C49.7375 41.75 50.75 40.7375 50.75 39.5C50.75 38.2625 49.7375 37.25 48.5 37.25ZM48.5 44H35C33.7625 44 32.75 45.0125 32.75 46.25C32.75 47.4875 33.7625 48.5 35 48.5H48.5C49.7375 48.5 50.75 47.4875 50.75 46.25C50.75 45.0125 49.7375 44 48.5 44ZM48.5 50.75H35C33.7625 50.75 32.75 51.7625 32.75 53C32.75 54.2375 33.7625 55.25 35 55.25H48.5C49.7375 55.25 50.75 54.2375 50.75 53C50.75 51.7625 49.7375 50.75 48.5 50.75Z"
            className="fill-secondary-500"
          />
        </svg>
      </div>

      <div className="flex max-w-md flex-col items-center gap-2">
        <h2 className="text-h2 font-semibold text-secondary-500">{t("title")}</h2>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={startAddProject}
        className="h-10 gap-2 px-5 bg-primary-300 text-secondary-500 font-semibold cursor-pointer hover:bg-primary-300/90"
      >
        <Plus className="size-4" aria-hidden="true" />
        {t("addProject")}
      </Button>
    </div>
  );
}
