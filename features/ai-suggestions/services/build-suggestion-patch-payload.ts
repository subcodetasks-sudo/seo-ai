import type {
  FaqPair,
  InternalLink,
  RedirectCandidate,
  SuggestionPatchPayload,
  UnknownPatchPayload,
} from "../types";

const str = (v: unknown): string => (v == null ? "" : String(v));
const num = (v: unknown): number => (typeof v === "number" ? v : Number(v ?? 0));
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === "object" ? (v as Record<string, unknown>) : {};

// Builds the exact suggested_value shape the backend accepts for a given
// suggestion_type, keeping only the keys that type is allowed to carry.
// Any AI metadata or stale keys present on `candidate` (e.g. from spreading
// the original suggested_value) are dropped rather than sent to the API.
export function buildSuggestionPatchPayload(
  suggestionType: string,
  candidate: Record<string, unknown>,
): SuggestionPatchPayload | UnknownPatchPayload {
  switch (suggestionType) {
    case "meta":
      return {
        suggestion_type: "meta",
        suggested_value: {
          meta_title: str(candidate.meta_title),
          meta_description: str(candidate.meta_description),
        },
      };

    case "og_title":
      return {
        suggestion_type: "og_title",
        suggested_value: { og_title: str(candidate.og_title) },
      };

    case "og_description":
      return {
        suggestion_type: "og_description",
        suggested_value: { og_description: str(candidate.og_description) },
      };

    case "alt_text":
      return {
        suggestion_type: "alt_text",
        suggested_value: {
          alt_text: str(candidate.alt_text),
          image_url: str(candidate.image_url),
        },
      };

    case "faq": {
      const pairs = arr<FaqPair>(candidate.pairs);
      return {
        suggestion_type: "faq",
        suggested_value: { pairs, pair_count: pairs.length },
      };
    }

    case "schema":
      return {
        suggestion_type: "schema",
        suggested_value: {
          schema: obj(candidate.schema),
          page_type: str(candidate.page_type),
          language_detected: str(candidate.language_detected),
          validation_warnings: arr<string>(candidate.validation_warnings),
        },
      };

    case "internal_link":
      return {
        suggestion_type: "internal_link",
        suggested_value: { links: arr<InternalLink>(candidate.links) },
      };

    case "redirect": {
      const diagnosis = obj(candidate.diagnosis);
      const redirect = obj(candidate.redirect);
      return {
        suggestion_type: "redirect",
        suggested_value: {
          diagnosis: {
            break_type: str(diagnosis.break_type),
            explanation: str(diagnosis.explanation),
            suggestion: str(diagnosis.suggestion),
            confidence: num(diagnosis.confidence),
          },
          redirect: {
            target_url: str(redirect.target_url),
            confidence: num(redirect.confidence),
            reason: str(redirect.reason),
            top_candidates: arr<RedirectCandidate>(redirect.top_candidates),
          },
        },
      };
    }

    default:
      return { suggestion_type: suggestionType, suggested_value: candidate };
  }
}
