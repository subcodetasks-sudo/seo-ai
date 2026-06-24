import { useEditSuggestion } from "../../queries/mutations";

// Shared wiring for every per-type edit form: PATCHes the suggestion with the
// type-specific `suggested_value` and closes the modal on success.
export function useSubmitEdit(projectId: string, suggestionId: string, onSuccess: () => void) {
  const mutation = useEditSuggestion();

  function submit(suggestedValue: Record<string, unknown>) {
    mutation.mutate({ projectId, suggestionId, suggestedValue }, { onSuccess });
  }

  return { submit, isPending: mutation.isPending };
}
