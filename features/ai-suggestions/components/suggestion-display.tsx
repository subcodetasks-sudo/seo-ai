"use client";

import { ExternalLink, Info } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type {
  AiSuggestionDetail,
  AltTextValue,
  FaqSuggestedValue,
  InternalLinkSuggestedValue,
  MetaCurrentValue,
  MetaSuggestedValue,
  RedirectSuggestedValue,
  SchemaSuggestedValue,
} from "../types";

// ---- Value accessors ----

function getSuggestedValue<T>(suggestion: AiSuggestionDetail): T {
  return suggestion.rawSuggestedValue as unknown as T;
}

function getCurrentValue<T>(suggestion: AiSuggestionDetail): T {
  return suggestion.rawCurrentValue as unknown as T;
}

// ---- Shared card primitives ----

function AiCard({ children }: { children: React.ReactNode }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  return (
    <div className="flex flex-col gap-3 rounded-xl border-2 border-primary-300 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-label-sm font-medium text-neutral-500">{t("aiSuggestion")}</span>
        <span className="rounded-full bg-primary-300 px-2.5 py-0.5 text-label-xs font-bold text-secondary-500">
          AI
        </span>
      </div>
      {children}
    </div>
  );
}

function CurrentCard({ children, isEmpty }: { children?: React.ReactNode; isEmpty?: boolean }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <span className="text-label-sm font-medium text-neutral-500">{t("currentValue")}</span>
        <div className="flex items-center gap-1.5">
          <span className="size-2 shrink-0 rounded-full bg-success-500" aria-hidden="true" />
          <span className="text-label-xs text-neutral-500">{t("currentVersion")}</span>
        </div>
      </div>
      {isEmpty ? (
        <span className="text-label-md italic text-neutral-300">{t("noCurrentValue")}</span>
      ) : (
        children
      )}
    </div>
  );
}

function LabeledField({ label, value }: { label: string; value?: string }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  return (
    <div className="flex flex-col gap-1">
      <span className="text-label-xs font-medium text-neutral-400">{label}</span>
      <p className="break-all text-label-md leading-relaxed text-secondary-500">
        {value || <span className="italic text-neutral-300">{t("noCurrentValue")}</span>}
      </p>
    </div>
  );
}

function TwoColumnLayout({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>;
}

// ---- Type-specific displays ----

function MetaDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<MetaSuggestedValue>(suggestion);
  const cv = getCurrentValue<Partial<MetaCurrentValue>>(suggestion);
  return (
    <TwoColumnLayout>
      <AiCard>
        <LabeledField label={t("meta.title")} value={sv.meta_title} />
        <LabeledField label={t("meta.description")} value={sv.meta_description} />
      </AiCard>
      <CurrentCard isEmpty={!cv.meta_title && !cv.meta_description}>
        <LabeledField label={t("meta.title")} value={cv.meta_title} />
        <LabeledField label={t("meta.description")} value={cv.meta_description} />
      </CurrentCard>
    </TwoColumnLayout>
  );
}

function SingleTextDisplay({
  aiValue,
  currentValue,
  hint,
}: {
  aiValue: string;
  currentValue?: string;
  hint?: { min: number; max: number };
}) {
  const t = useTranslations("aiSuggestions.reviewPage");
  return (
    <TwoColumnLayout>
      <AiCard>
        <p className="break-all text-label-md leading-relaxed text-secondary-500">{aiValue}</p>
        {hint && (
          <span className="text-label-xs text-neutral-400">
            {t("idealLength", { min: hint.min, max: hint.max })}
          </span>
        )}
      </AiCard>
      <CurrentCard isEmpty={!currentValue}>
        {currentValue && (
          <p className="break-all text-label-md leading-relaxed text-neutral-600">{currentValue}</p>
        )}
      </CurrentCard>
    </TwoColumnLayout>
  );
}

function OgFieldDisplay({
  suggestion,
  field,
  hint,
}: {
  suggestion: AiSuggestionDetail;
  field: "og_title" | "og_description";
  hint: { min: number; max: number };
}) {
  const sv = getSuggestedValue<Record<string, string>>(suggestion);
  const cv = getCurrentValue<Record<string, string>>(suggestion);
  return <SingleTextDisplay aiValue={sv[field] ?? ""} currentValue={cv[field] || undefined} hint={hint} />;
}

function AltTextDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<AltTextValue>(suggestion);
  const cv = getCurrentValue<Partial<AltTextValue>>(suggestion);
  return (
    <TwoColumnLayout>
      <AiCard>
        {sv.image_url && (
          <img
            src={sv.image_url}
            alt=""
            className="h-32 w-full rounded-lg border border-neutral-100 object-contain"
          />
        )}
        <LabeledField label={t("altText.label")} value={sv.alt_text} />
        <span className="text-label-xs text-neutral-400">{t("idealLength", { min: 10, max: 125 })}</span>
      </AiCard>
      <CurrentCard isEmpty={!cv.alt_text}>
        {cv.image_url && (
          <img
            src={cv.image_url}
            alt=""
            className="h-32 w-full rounded-lg border border-neutral-100 object-contain"
          />
        )}
        {cv.alt_text && <LabeledField label={t("altText.label")} value={cv.alt_text} />}
      </CurrentCard>
    </TwoColumnLayout>
  );
}

function FaqDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<FaqSuggestedValue>(suggestion);
  return (
    <AiCard>
      <div className="flex flex-col gap-3">
        {sv.pairs?.map((pair, i) => (
          <div
            key={i}
            className="flex flex-col gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-3"
          >
            <p className="text-label-sm font-medium text-secondary-500">{pair.question}</p>
            <p className="text-label-sm leading-relaxed text-neutral-600">{pair.answer}</p>
          </div>
        ))}
      </div>
      {sv.pair_count !== undefined && (
        <span className="text-label-xs text-neutral-400">
          {t("faq.pairsCount", { count: sv.pair_count })}
        </span>
      )}
    </AiCard>
  );
}

function SchemaDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<SchemaSuggestedValue>(suggestion);
  const schemaJson = sv.schema ? JSON.stringify(sv.schema, null, 2) : "";
  return (
    <AiCard>
      <div className="flex items-center gap-2">
        {sv.page_type && (
          <span className="rounded-full border border-secondary-200 px-2.5 py-0.5 text-label-xs text-secondary-500">
            {sv.page_type}
          </span>
        )}
      </div>
      <pre className="max-h-96 overflow-auto rounded-lg bg-neutral-900 p-4 text-left text-xs leading-relaxed text-green-400">
        {schemaJson}
      </pre>
      {(sv.validation_warnings?.length ?? 0) > 0 && (
        <div className="flex flex-col gap-1.5 rounded-lg border border-warning-200 bg-warning-50 p-3">
          <span className="text-label-xs font-medium text-warning-700">
            {t("schema.validationWarnings")}
          </span>
          {sv.validation_warnings.map((w, i) => (
            <p key={i} className="text-label-xs text-warning-600">
              {w}
            </p>
          ))}
        </div>
      )}
    </AiCard>
  );
}

function InternalLinkDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<InternalLinkSuggestedValue>(suggestion);
  return (
    <AiCard>
      <div className="flex flex-col divide-y divide-neutral-100">
        {sv.links?.map((link, i) => (
          <div key={i} className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-label-sm font-medium text-secondary-500">{link.anchor_text}</span>
              <span
                className={cn(
                  "shrink-0 rounded-full px-2 py-0.5 text-label-xs font-medium",
                  link.confidence >= 0.8
                    ? "bg-success-50 text-success-700"
                    : link.confidence >= 0.6
                      ? "bg-warning-50 text-warning-700"
                      : "bg-neutral-100 text-neutral-500",
                )}
              >
                {Math.round(link.confidence * 100)}%
              </span>
            </div>
            <a
              href={link.target_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 break-all text-label-xs text-primary-500 hover:underline"
            >
              {link.target_url}
              <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
            </a>
            <p className="text-label-xs leading-relaxed text-neutral-500">{link.relevance_reason}</p>
          </div>
        ))}
      </div>
      {sv.links && (
        <span className="text-label-xs text-neutral-400">
          {t("internalLink.count", { count: sv.links.length })}
        </span>
      )}
    </AiCard>
  );
}

function RedirectDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  const t = useTranslations("aiSuggestions.reviewPage");
  const sv = getSuggestedValue<RedirectSuggestedValue>(suggestion);
  const candidates = sv.redirect?.top_candidates ?? [];
  return (
    <div className="flex flex-col gap-4">
      <TwoColumnLayout>
        <AiCard>
          <p className="break-all text-label-md leading-relaxed text-secondary-500">
            {sv.redirect?.target_url}
          </p>
          {sv.redirect?.reason && (
            <div className="flex flex-col gap-1.5 rounded-lg border border-neutral-100 bg-neutral-50 p-3">
              <span className="text-label-xs font-medium text-neutral-500">{t("redirectReason")}</span>
              <p className="text-label-xs leading-relaxed text-neutral-500">{sv.redirect.reason}</p>
            </div>
          )}
        </AiCard>
        <CurrentCard isEmpty={!suggestion.currentText}>
          {suggestion.currentText && (
            <p className="break-all text-label-md leading-relaxed text-neutral-600">
              {suggestion.currentText}
            </p>
          )}
        </CurrentCard>
      </TwoColumnLayout>

      {(sv.diagnosis?.explanation || sv.diagnosis?.suggestion) && (
        <div className="flex flex-col gap-3">
          {sv.diagnosis?.explanation && (
            <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Info className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                <span className="text-label-sm font-medium text-neutral-600">
                  {t("diagnosisExplanation")}
                </span>
              </div>
              <p className="text-label-sm leading-relaxed text-neutral-500">{sv.diagnosis.explanation}</p>
            </div>
          )}
          {sv.diagnosis?.suggestion && (
            <div className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2">
                <Info className="size-4 shrink-0 text-primary-400" aria-hidden="true" />
                <span className="text-label-sm font-medium text-neutral-600">
                  {t("diagnosisSuggestion")}
                </span>
              </div>
              <p className="text-label-sm leading-relaxed text-neutral-500">{sv.diagnosis.suggestion}</p>
            </div>
          )}
        </div>
      )}

      {candidates.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <p className="mb-3 text-label-sm font-medium text-neutral-600">{t("redirectCandidates")}</p>
          <Accordion type="single" collapsible className="divide-y divide-neutral-100">
            {candidates.map((candidate, i) => (
              <AccordionItem key={candidate.url} value={candidate.url} className="border-0">
                <AccordionTrigger className="py-3 text-start hover:no-underline">
                  <div className="flex items-center gap-3 pe-4">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-label-xs font-semibold text-neutral-500">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5 text-start">
                      <span className="break-all text-label-sm font-medium text-secondary-500">
                        {candidate.title || candidate.url}
                      </span>
                      <span className="text-label-xs text-neutral-400">
                        {Math.round(candidate.confidence * 100)}% {t("confidence")}
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-9 pb-3">
                  <p className="text-label-xs text-neutral-400 break-all mb-1">{candidate.url}</p>
                  <p className="text-label-sm leading-relaxed text-neutral-500">{candidate.reason}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}

// ---- Main export ----

export function SuggestionDisplay({ suggestion }: { suggestion: AiSuggestionDetail }) {
  switch (suggestion.type) {
    case "meta":
      return <MetaDisplay suggestion={suggestion} />;
    case "og_title":
      return <OgFieldDisplay suggestion={suggestion} field="og_title" hint={{ min: 60, max: 70 }} />;
    case "og_description":
      return (
        <OgFieldDisplay suggestion={suggestion} field="og_description" hint={{ min: 150, max: 160 }} />
      );
    case "alt_text":
      return <AltTextDisplay suggestion={suggestion} />;
    case "faq":
      return <FaqDisplay suggestion={suggestion} />;
    case "schema":
      return <SchemaDisplay suggestion={suggestion} />;
    case "internal_link":
      return <InternalLinkDisplay suggestion={suggestion} />;
    case "redirect":
      return <RedirectDisplay suggestion={suggestion} />;
    default:
      return (
        <SingleTextDisplay
          aiValue={suggestion.suggestedText}
          currentValue={suggestion.currentText || undefined}
        />
      );
  }
}
