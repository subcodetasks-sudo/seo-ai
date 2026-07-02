import type {
  AiSuggestion,
  AiSuggestionDetail,
  ApiSuggestion,
  ImpactLevel,
  RedirectSuggestedValue,
  SuggestionStatus,
} from "../types";

export function scoreToLevel(score: number): ImpactLevel {
  if (score >= 0.8) return "high";
  if (score >= 0.5) return "medium";
  return "low";
}

// Overlay human modifications onto the AI suggested_value, but only for keys that
// belong to the suggestion's own shape. This keeps the canonical shape intact and
// ignores stray modification keys (e.g. a test PATCH that left mismatched fields).
function applyModifications(
  suggested: Record<string, unknown>,
  modifications: unknown,
): Record<string, unknown> {
  if (!modifications || typeof modifications !== "object") return suggested;
  const mods = modifications as Record<string, unknown>;
  const merged: Record<string, unknown> = { ...suggested };
  for (const key of Object.keys(suggested)) {
    if (key in mods) merged[key] = mods[key];
  }
  return merged;
}

function extractPrimaryText(type: string, value: Record<string, unknown>): string {
  switch (type) {
    case "meta": return String(value.meta_title ?? value.meta_description ?? "");
    case "og_title": return String(value.og_title ?? "");
    case "og_description": return String(value.og_description ?? "");
    case "alt_text": return String(value.alt_text ?? "");
    case "h1": return String(value.h1_text ?? value.h1 ?? "");
    case "content": {
      const sections = Array.isArray(value.sections) ? (value.sections as { heading?: string }[]) : [];
      return sections.map((section) => section.heading ?? "").filter(Boolean).join(", ");
    }
    default: return "";
  }
}

export function transformSuggestionDetail(s: ApiSuggestion): AiSuggestionDetail {
  const level = scoreToLevel(s.confidence_score);
  const suggestedValue = applyModifications(s.suggested_value, s.modifications);

  const base: AiSuggestion = {
    id: s.id,
    url: s.page_url,
    type: s.suggestion_type,
    status: s.status as SuggestionStatus,
    priority: level,
    impact: level,
  };

  if (s.suggestion_type === "redirect") {
    const sv = suggestedValue as unknown as RedirectSuggestedValue;
    return {
      ...base,
      suggestedText: sv.redirect?.target_url ?? "",
      currentText: s.page_url,
      explanation: sv.diagnosis?.explanation ?? "",
      keywords: [],
      rawSuggestedValue: suggestedValue,
      rawCurrentValue: s.current_value,
      redirectCandidates: sv.redirect?.top_candidates,
    };
  }

  return {
    ...base,
    suggestedText: extractPrimaryText(s.suggestion_type, suggestedValue),
    currentText: extractPrimaryText(s.suggestion_type, s.current_value),
    explanation: "",
    keywords: Array.isArray(s.keywords_used) ? s.keywords_used : [],
    rawSuggestedValue: suggestedValue,
    rawCurrentValue: s.current_value,
  };
}
