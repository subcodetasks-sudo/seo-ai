"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";

import EmptyState from "@/components/empty-state";
import { Input } from "@/components/ui/input";
import { decodeUrlForDisplay } from "@/lib/utils";

type LinksListProps = {
  links: string[];
  emptyLabel: string;
  searchPlaceholder: string;
};

export function LinksList({ links, emptyLabel, searchPlaceholder }: LinksListProps) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return links;
    const needle = query.trim().toLowerCase();
    return links.filter((link) => link.toLowerCase().includes(needle));
  }, [links, query]);

  return (
    <div className="flex flex-col gap-3">
      {links.length > 0 && (
        <div className="relative">
          <Search
            className="absolute start-2.5 top-1/2 size-3.5 -translate-y-1/2 text-neutral-400"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-9 ps-8"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState title={emptyLabel} fullPage={false} className="py-8" />
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-100 rounded-lg border border-neutral-100">
          {filtered.map((link) => (
            <li key={link} className="flex items-center justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0 truncate text-label-sm text-neutral-600">
                <bdi dir="ltr">{decodeUrlForDisplay(link)}</bdi>
              </span>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-neutral-400 hover:text-primary-500"
                aria-label={link}
              >
                <ExternalLink className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
