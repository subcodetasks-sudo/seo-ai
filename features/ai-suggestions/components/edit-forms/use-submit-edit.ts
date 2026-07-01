import { useEditSuggestion } from "../../queries/mutations";
import { buildSuggestionPatchPayload } from "../../services/build-suggestion-patch-payload";

// Shared wiring for every per-type edit form: builds the type-specific
// `suggested_value` (dropping any key that isn't valid for suggestionType),
// PATCHes the suggestion, and closes the modal on success.
export function useSubmitEdit(
  projectId: string,
  suggestionId: string,
  suggestionType: string,
  onSuccess: () => void,
) {
  const mutation = useEditSuggestion();

  function submit(candidateValue: Record<string, unknown>) {
    const { suggested_value } = buildSuggestionPatchPayload(suggestionType, candidateValue);
    mutation.mutate({ projectId, suggestionId, suggestedValue: suggested_value }, { onSuccess });
  }

  return { submit, isPending: mutation.isPending };
}
