"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2, ChevronLeft, ChevronRight, LoaderCircle } from "lucide-react";
import BackLink from "@/components/back-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import type { Section } from "@/features/home/types";
import { useDirection } from "@/components/ui/direction";
import { step3Schema, type Step3FormData } from "@/features/home/schemas/add-project";

const PAGE_SIZE = 10;

interface Step3Props {
  onBack: () => void;
  onFinish: (selectedSections: Set<string>) => void;
  domain?: string;
  sections?: Section[];
  isSectionsLoading?: boolean;
}

export default function Step3({
  onBack,
  onFinish,
  domain = "",
  sections = [],
  isSectionsLoading = false,
}: Step3Props) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.step3");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<Step3FormData>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      selectedSections: new Set([sections[0]?.prefix].filter(Boolean)),
    },
  });

  const selectedSections = watch("selectedSections");
  const selectedPrefixes = selectedSections;

  const totalPages = Math.max(1, Math.ceil(sections.length / PAGE_SIZE));
  const paginatedSections = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return sections.slice(start, start + PAGE_SIZE);
  }, [currentPage, sections]);

  const visiblePrefixes = paginatedSections.map((section) => section.prefix);
  const allVisibleSelected =
    visiblePrefixes.length > 0 && visiblePrefixes.every((prefix) => selectedPrefixes.has(prefix));
  const someVisibleSelected = visiblePrefixes.some((prefix) => selectedPrefixes.has(prefix));

  const selectedCount = selectedPrefixes.size;
  const approxPageCount = sections
    .filter((section) => selectedPrefixes.has(section.prefix))
    .reduce((total, section) => total + section.count, 0);

  const getSectionLabel = (section: Section) =>
    section.label === "home" ? t("homePage") : section.label;

  return (
    <form
      onSubmit={handleSubmit((data) => onFinish(data.selectedSections))}
      className="flex w-full max-w-[720px] flex-col items-center gap-6"
      dir={dir}
    >
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-success-300 text-white">
          <CheckCircle2 className="size-8 stroke-[2.5px]" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-h1 font-bold text-secondary-500">{t("successTitle")}</h1>
          <p className="text-label-md text-neutral-500">{t("successSubtitle")}</p>
        </div>
        <div className="max-w-full rounded-[10px] border border-neutral-200 bg-white px-4 py-2.5 overflow-hidden">
          <span className="text-label-md text-secondary-500 block truncate max-w-[280px] xs:max-w-xs sm:max-w-md" dir="ltr">
            {domain}
          </span>
        </div>
      </div>

      <div className="w-full overflow-hidden rounded-[12px] border border-neutral-200 bg-white">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-200 px-4 py-3">
          <div className="flex items-center gap-3">
            <Controller
              name="selectedSections"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={allVisibleSelected ? true : someVisibleSelected ? "indeterminate" : false}
                  onCheckedChange={(checked) => {
                    const newSet = new Set(field.value);
                    visiblePrefixes.forEach((prefix) => {
                      if (checked) {
                        newSet.add(prefix);
                      } else {
                        newSet.delete(prefix);
                      }
                    });
                    field.onChange(newSet);
                  }}
                  className="size-4 rounded-[4px] border-neutral-300 data-checked:border-primary-300 data-checked:bg-primary-300 data-checked:text-secondary-500"
                />
              )}
            />
            <span className="text-label-md font-semibold text-secondary-500">{t("selectSections")}</span>
          </div>

          <div className="flex items-center gap-3 text-label-sm text-black ps-7 font-extrabold sm:ps-0">
            <span>{t("sectionsSelected", { count: selectedCount })}</span>
            <span className="text-neutral-300">-</span>
            <span>{t("approxPages", { count: approxPageCount })}</span>
          </div>
        </div>

        <div className="flex flex-col">
          {isSectionsLoading ? (
            <div className="flex items-center justify-center gap-2 px-4 py-10 text-label-md text-neutral-500">
              <LoaderCircle className="size-5 animate-spin" />
              <span>{t("loadingSections")}</span>
            </div>
          ) : (
          <Controller
            name="selectedSections"
            control={control}
            render={({ field }) => (
              <>
                {paginatedSections.map((section) => {
                  const isSelected = field.value.has(section.prefix);

                  return (
                    <label
                      key={section.prefix}
                      className={cn(
                        "flex cursor-pointer items-center justify-between gap-4 border-b border-neutral-100 px-4 py-3 transition-colors last:border-b-0",
                        isSelected && "bg-primary-50/60"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(checked) => {
                            const newSet = new Set(field.value);
                            if (checked) {
                              newSet.add(section.prefix);
                            } else {
                              newSet.delete(section.prefix);
                            }
                            field.onChange(newSet);
                          }}
                          className="size-4 rounded-[4px] border-neutral-300 data-checked:border-primary-300 data-checked:bg-primary-300 data-checked:text-secondary-500"
                        />
                        <span
                          className={cn(
                            "truncate text-body text-secondary-500",
                            section.label !== "home" && "text-left"
                          )}
                          dir={section.label === "home" ? dir : "ltr"}
                        >
                          {getSectionLabel(section)}
                        </span>
                      </div>

                      <span className="shrink-0 rounded-full bg-primary-100 px-2.5 py-1 text-label-sm font-bold text-primary-500">
                        {t("pageCount", { count: section.count })}
                      </span>
                    </label>
                  );
                })}
              </>
            )}
          />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-neutral-200 px-4 py-3">
          <span className="text-label-sm text-neutral-500">
            {t("showingResults", {
              shown: paginatedSections.length,
              total: sections.length,
            })}
          </span>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="size-8 rounded-[8px] text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              {dir === "rtl" ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              const isActive = page === currentPage;

              return (
                <Button
                  key={page}
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentPage(page)}
                  className={cn(
                    "size-8 rounded-[8px] text-label-md font-medium hidden sm:inline-flex",
                    isActive
                      ? "bg-primary-300 text-secondary-500 hover:bg-primary-300/90"
                      : "text-neutral-500 hover:bg-neutral-100"
                  )}
                >
                  {page}
                </Button>
              );
            })}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              className="size-8 rounded-[8px] text-neutral-500 hover:bg-neutral-100 disabled:opacity-40"
            >
              {dir === "rtl" ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row-reverse sm:justify-between">
        <Button
          type="submit"
          disabled={isSectionsLoading || isSubmitting}
          className="h-12 w-full sm:w-auto sm:px-8 rounded-[10px] bg-primary-300 text-body font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px disabled:opacity-50"
        >
          {isSubmitting && <LoaderCircle className="size-4 animate-spin" />}
          {t("scan")}
        </Button>

        <BackLink onClick={onBack} disabled={isSubmitting}>
          {t("back")}
        </BackLink>
      </div>
    </form>
  );
}
