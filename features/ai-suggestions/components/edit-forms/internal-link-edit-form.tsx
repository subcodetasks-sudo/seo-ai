"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiSuggestionDetail, InternalLinkSuggestedValue } from "../../types";
import { EditFormFooter } from "./edit-form-footer";
import { EDIT_INPUT_CLASS } from "./edit-styles";
import { useSubmitEdit } from "./use-submit-edit";

type LinkFormValues = {
  links: { target_url: string; anchor_text: string; relevance_reason: string; confidence: number }[];
};

const DEFAULT_CONFIDENCE = 0.9;

type InternalLinkEditFormProps = {
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function InternalLinkEditForm({ suggestion, projectId, onClose }: InternalLinkEditFormProps) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = suggestion.rawSuggestedValue as unknown as InternalLinkSuggestedValue;

  const { register, control, handleSubmit } = useForm<LinkFormValues>({
    defaultValues: {
      links: (sv.links ?? []).map((l) => ({
        target_url: l.target_url,
        anchor_text: l.anchor_text,
        relevance_reason: l.relevance_reason,
        confidence: l.confidence ?? DEFAULT_CONFIDENCE,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "links" });
  const { submit, isPending } = useSubmitEdit(projectId, suggestion.id, onClose);

  function onSubmit(values: LinkFormValues) {
    submit({ ...suggestion.rawSuggestedValue, links: values.links });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {fields.length === 0 && (
          <p className="text-label-sm text-neutral-400">{t("editForm.emptyList")}</p>
        )}
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-label-xs font-medium text-neutral-400">#{index + 1}</span>
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-neutral-400 transition-colors hover:text-error-500"
                aria-label={t("editForm.remove")}
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            </div>
            <input type="hidden" {...register(`links.${index}.confidence`, { valueAsNumber: true })} />
            <input
              className={cn(EDIT_INPUT_CLASS, "bg-white")}
              placeholder={t("editForm.anchorText")}
              {...register(`links.${index}.anchor_text`, { required: true })}
            />
            <input
              dir="ltr"
              className={cn(EDIT_INPUT_CLASS, "bg-white")}
              placeholder={t("editForm.targetUrl")}
              {...register(`links.${index}.target_url`, { required: true })}
            />
            <textarea
              rows={2}
              className={cn(EDIT_INPUT_CLASS, "resize-none bg-white")}
              placeholder={t("editForm.relevanceReason")}
              {...register(`links.${index}.relevance_reason`)}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ target_url: "", anchor_text: "", relevance_reason: "", confidence: DEFAULT_CONFIDENCE })
        }
        className="gap-2 border-dashed border-neutral-300 text-neutral-500 hover:bg-neutral-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        {t("editForm.addLink")}
      </Button>

      <EditFormFooter onCancel={onClose} isPending={isPending} />
    </form>
  );
}
