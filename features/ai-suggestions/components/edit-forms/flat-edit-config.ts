import type { RedirectSuggestedValue } from "../../types";

export type FlatField = {
  name: string;
  labelKey: string;
  multiline?: boolean;
  rows?: number;
  charHint?: { min: number; max: number };
};

export type FlatEditConfig = {
  fields: FlatField[];
  // Pull the editable fields out of the suggestion's suggested_value.
  getInitial: (sv: Record<string, unknown>) => Record<string, string>;
  // Rebuild the full suggested_value shape with the edited fields applied.
  build: (values: Record<string, string>, sv: Record<string, unknown>) => Record<string, unknown>;
};

const str = (v: unknown): string => (v == null ? "" : String(v));

// Types whose suggested_value is a flat object of text fields. The build()
// spreads the original value so non-edited keys (image_url, keywords_used,
// language_detected, …) are preserved exactly as the API returned them.
export const FLAT_EDIT_CONFIGS: Record<string, FlatEditConfig> = {
  meta: {
    fields: [
      { name: "meta_title", labelKey: "reviewPage.meta.title", charHint: { min: 50, max: 60 } },
      {
        name: "meta_description",
        labelKey: "reviewPage.meta.description",
        multiline: true,
        rows: 4,
        charHint: { min: 150, max: 160 },
      },
    ],
    getInitial: (sv) => ({
      meta_title: str(sv.meta_title),
      meta_description: str(sv.meta_description),
    }),
    build: (v, sv) => ({ ...sv, meta_title: v.meta_title, meta_description: v.meta_description }),
  },

  og_title: {
    fields: [
      { name: "og_title", labelKey: "reviewPage.editForm.ogTitle", charHint: { min: 60, max: 70 } },
    ],
    getInitial: (sv) => ({ og_title: str(sv.og_title) }),
    build: (v, sv) => ({ ...sv, og_title: v.og_title }),
  },

  og_description: {
    fields: [
      {
        name: "og_description",
        labelKey: "reviewPage.editForm.ogDescription",
        multiline: true,
        rows: 4,
        charHint: { min: 150, max: 160 },
      },
    ],
    getInitial: (sv) => ({ og_description: str(sv.og_description) }),
    build: (v, sv) => ({ ...sv, og_description: v.og_description }),
  },

  alt_text: {
    fields: [
      {
        name: "alt_text",
        labelKey: "reviewPage.altText.label",
        multiline: true,
        rows: 3,
        charHint: { min: 10, max: 125 },
      },
    ],
    getInitial: (sv) => ({ alt_text: str(sv.alt_text) }),
    // Keeps image_url from the original value.
    build: (v, sv) => ({ ...sv, alt_text: v.alt_text }),
  },

  h1: {
    fields: [{ name: "h1_text", labelKey: "reviewPage.h1.label" }],
    getInitial: (sv) => ({ h1_text: str(sv.h1_text) }),
    // Keeps action from the original value.
    build: (v, sv) => ({ ...sv, h1_text: v.h1_text }),
  },

  redirect: {
    fields: [{ name: "target_url", labelKey: "reviewPage.redirect.targetUrl" }],
    getInitial: (sv) => ({
      target_url: str((sv as unknown as RedirectSuggestedValue).redirect?.target_url),
    }),
    build: (v, sv) => {
      const r = sv as unknown as RedirectSuggestedValue;
      return { ...sv, redirect: { ...r.redirect, target_url: v.target_url } };
    },
  },
};
