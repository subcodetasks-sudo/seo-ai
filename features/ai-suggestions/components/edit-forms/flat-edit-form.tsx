"use client";

import { useForm, useWatch } from "react-hook-form";
import { useTranslations } from "next-intl";

import type { AiSuggestionDetail } from "../../types";
import { EditFormFooter } from "./edit-form-footer";
import { EditTextField } from "./edit-text-field";
import { FLAT_EDIT_CONFIGS } from "./flat-edit-config";
import { useSubmitEdit } from "./use-submit-edit";

type FlatEditFormProps = {
  suggestion: AiSuggestionDetail;
  projectId: string;
  onClose: () => void;
};

export function FlatEditForm({ suggestion, projectId, onClose }: FlatEditFormProps) {
  const t = useTranslations("aiSuggestions");
  const config = FLAT_EDIT_CONFIGS[suggestion.type];

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<Record<string, string>>({
    defaultValues: config.getInitial(suggestion.rawSuggestedValue),
  });
  const values = useWatch({ control });
  const { submit, isPending } = useSubmitEdit(projectId, suggestion.id, onClose);

  function onSubmit(formValues: Record<string, string>) {
    submit(config.build(formValues, suggestion.rawSuggestedValue));
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {config.fields.map((field) => (
        <EditTextField
          key={field.name}
          label={t(field.labelKey)}
          registration={register(field.name, { required: true })}
          value={values[field.name] ?? ""}
          multiline={field.multiline}
          rows={field.rows}
          charHint={field.charHint}
        />
      ))}
      <EditFormFooter onCancel={onClose} isPending={isPending} disabled={!isDirty} />
    </form>
  );
}
