"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { AiSuggestionDetail, ContentSuggestedValue } from "../../types";
import { EditFormFooter } from "./edit-form-footer";
import { EDIT_INPUT_CLASS } from "./edit-styles";
import { useSubmitEdit } from "./use-submit-edit";

type ContentFormValues = {
  sections: { heading: string; content: string }[];
};

type ContentEditFormProps = {
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function ContentEditForm({ suggestion, projectId, onClose }: ContentEditFormProps) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = suggestion.rawSuggestedValue as unknown as ContentSuggestedValue;

  const { register, control, handleSubmit } = useForm<ContentFormValues>({
    defaultValues: {
      sections: (sv.sections ?? []).map((section) => ({
        heading: section.heading,
        content: section.content,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "sections" });
  const { submit, isPending } = useSubmitEdit(projectId, suggestion.id, suggestion.type, onClose);

  function onSubmit(values: ContentFormValues) {
    submit({ ...suggestion.rawSuggestedValue, sections: values.sections });
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
            <input
              className={cn(EDIT_INPUT_CLASS, "bg-white")}
              placeholder={t("editForm.heading")}
              {...register(`sections.${index}.heading`, { required: true })}
            />
            <textarea
              rows={4}
              className={cn(EDIT_INPUT_CLASS, "resize-none bg-white")}
              placeholder={t("editForm.sectionContent")}
              {...register(`sections.${index}.content`, { required: true })}
            />
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => append({ heading: "", content: "" })}
        className="gap-2 border-dashed border-neutral-300 text-neutral-500 hover:bg-neutral-50"
      >
        <Plus className="size-4" aria-hidden="true" />
        {t("editForm.addSection")}
      </Button>

      <EditFormFooter onCancel={onClose} isPending={isPending} />
    </form>
  );
}
