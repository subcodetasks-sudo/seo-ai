"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEditSuggestion } from "../queries/mutations";
import type { AiSuggestionDetail, RedirectSuggestedValue } from "../types";

type FormValues = Record<string, string>;

type FieldConfig = {
  name: string;
  label: string;
  multiline?: boolean;
  rows?: number;
  charHint?: { min: number; max: number };
};

function buildInitialValues(type: string, sv: Record<string, unknown>): FormValues {
  switch (type) {
    case "meta":
      return {
        meta_title: String(sv.meta_title ?? ""),
        meta_description: String(sv.meta_description ?? ""),
      };
    case "og_title":
      return { og_title: String(sv.og_title ?? "") };
    case "og_description":
      return { og_description: String(sv.og_description ?? "") };
    case "alt_text":
      return { alt_text: String(sv.alt_text ?? "") };
    case "redirect": {
      const redirect = (sv as RedirectSuggestedValue).redirect;
      return { target_url: String(redirect?.target_url ?? "") };
    }
    case "schema":
      return { json: JSON.stringify(sv.schema ?? sv, null, 2) };
    case "faq":
      return { json: JSON.stringify(sv.pairs ?? sv, null, 2) };
    case "internal_link":
      return { json: JSON.stringify(sv.links ?? sv, null, 2) };
    default:
      return { json: JSON.stringify(sv, null, 2) };
  }
}

function buildSuggestedValue(
  type: string,
  values: FormValues,
  original: Record<string, unknown>,
): Record<string, unknown> {
  switch (type) {
    case "meta":
      return { ...original, meta_title: values.meta_title, meta_description: values.meta_description };
    case "og_title":
      return { ...original, og_title: values.og_title };
    case "og_description":
      return { ...original, og_description: values.og_description };
    case "alt_text":
      return { ...original, alt_text: values.alt_text };
    case "redirect": {
      const sv = original as unknown as RedirectSuggestedValue;
      return { ...sv, redirect: { ...sv.redirect, target_url: values.target_url } };
    }
    case "schema":
      try { return { ...original, schema: JSON.parse(values.json) }; } catch { return original; }
    case "faq":
      try { return { ...original, pairs: JSON.parse(values.json) }; } catch { return original; }
    case "internal_link":
      try { return { ...original, links: JSON.parse(values.json) }; } catch { return original; }
    default:
      try { return JSON.parse(values.json); } catch { return original; }
  }
}

function getFieldConfigs(
  type: string,
  t: ReturnType<typeof useTranslations<"aiSuggestions">>,
): FieldConfig[] {
  switch (type) {
    case "meta":
      return [
        { name: "meta_title", label: t("reviewPage.meta.title"), charHint: { min: 50, max: 60 } },
        {
          name: "meta_description",
          label: t("reviewPage.meta.description"),
          multiline: true,
          rows: 4,
          charHint: { min: 150, max: 160 },
        },
      ];
    case "og_title":
      return [{ name: "og_title", label: t("types.og_title"), charHint: { min: 60, max: 70 } }];
    case "og_description":
      return [
        {
          name: "og_description",
          label: t("types.og_description"),
          multiline: true,
          rows: 4,
          charHint: { min: 150, max: 160 },
        },
      ];
    case "alt_text":
      return [
        { name: "alt_text", label: t("reviewPage.altText.label"), multiline: true, rows: 3, charHint: { min: 10, max: 125 } },
      ];
    case "redirect":
      return [{ name: "target_url", label: t("reviewPage.redirect.targetUrl") }];
    default:
      return [{ name: "json", label: t("reviewPage.jsonValue"), multiline: true, rows: 12 }];
  }
}

type EditSuggestionModalProps = {
  open: boolean;
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function EditSuggestionModal({
  open,
  suggestion,
  projectId,
  onClose,
}: EditSuggestionModalProps) {
  const t = useTranslations("aiSuggestions");
  const editMutation = useEditSuggestion();

  const fields = getFieldConfigs(suggestion.type, t);

  const { register, handleSubmit, reset, watch, formState: { isDirty } } = useForm<FormValues>({
    defaultValues: buildInitialValues(suggestion.type, suggestion.rawSuggestedValue),
  });

  useEffect(() => {
    if (open) reset(buildInitialValues(suggestion.type, suggestion.rawSuggestedValue));
  }, [open, suggestion.type, suggestion.rawSuggestedValue, reset]);

  function onSubmit(values: FormValues) {
    const suggestedValue = buildSuggestedValue(
      suggestion.type,
      values,
      suggestion.rawSuggestedValue,
    );
    editMutation.mutate(
      { projectId, suggestionId: suggestion.id, suggestedValue },
      { onSuccess: onClose },
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-start text-secondary-500">
            {t("reviewPage.editTitle")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          {fields.map((field) => {
            const value = watch(field.name) ?? "";
            const isIdeal = field.charHint
              ? value.length >= field.charHint.min && value.length <= field.charHint.max
              : null;

            return (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="text-label-sm font-medium text-neutral-600">{field.label}</label>
                {field.multiline ? (
                  <textarea
                    rows={field.rows ?? 5}
                    className="w-full resize-none rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-label-md text-secondary-500 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30"
                    {...register(field.name, { required: true })}
                  />
                ) : (
                  <input
                    type="text"
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2.5 text-label-md text-secondary-500 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-300/30"
                    {...register(field.name, { required: true })}
                  />
                )}
                {field.charHint && (
                  <div className="flex items-center justify-between">
                    <span className="text-label-xs text-neutral-400">
                      {t("reviewPage.chars", { count: value.length })}
                    </span>
                    <span
                      className={
                        isIdeal
                          ? "text-label-xs font-medium text-success-600"
                          : "text-label-xs text-neutral-400"
                      }
                    >
                      {t("reviewPage.idealLength", { min: field.charHint.min, max: field.charHint.max })}
                    </span>
                  </div>
                )}
              </div>
            );
          })}

          <DialogFooter className="flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-neutral-200 text-neutral-500 hover:bg-neutral-50"
            >
              {t("reviewPage.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={!isDirty || editMutation.isPending}
              className="bg-primary-300 text-secondary-500 hover:bg-primary-400 font-medium disabled:opacity-50"
            >
              {editMutation.isPending ? t("reviewPage.saving") : t("reviewPage.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
