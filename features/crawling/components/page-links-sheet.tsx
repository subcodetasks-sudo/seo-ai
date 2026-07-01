"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Link2, Search } from "lucide-react";
import { useTranslations } from "next-intl";

import EmptyState from "@/components/empty-state";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDirection } from "@/components/ui/direction";
import { decodeUrlForDisplay } from "@/lib/utils";
import type { CrawlPageItem } from "../types";

type PageLinksSheetProps = {
  page: CrawlPageItem | null;
  defaultTab: "internal" | "external";
  onOpenChange: (open: boolean) => void;
};

function LinksList({
  links,
  emptyLabel,
  searchPlaceholder,
}: {
  links: string[];
  emptyLabel: string;
  searchPlaceholder: string;
}) {
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
        <ScrollArea className="h-[50vh]">
          <ul className="flex flex-col divide-y divide-neutral-100 pe-3">
            {filtered.map((link) => (
              <li key={link} className="flex items-center justify-between gap-3 py-2.5">
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
        </ScrollArea>
      )}
    </div>
  );
}

export function PageLinksSheet({ page, defaultTab, onOpenChange }: PageLinksSheetProps) {
  const t = useTranslations("crawlHistory.linksSheet");
  const dir = useDirection();

  const internalLinks = page?.seo_data.internal_link_urls ?? [];
  const externalLinks = page?.seo_data.external_link_urls ?? [];

  return (
    <Sheet open={page !== null} onOpenChange={onOpenChange}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link2 className="size-4 text-neutral-400" aria-hidden="true" />
            {t("title")}
          </SheetTitle>
          {page && (
            <SheetDescription className="truncate">
              <bdi dir="ltr">{decodeUrlForDisplay(page.url)}</bdi>
            </SheetDescription>
          )}
        </SheetHeader>

        <Tabs defaultValue={defaultTab} className="flex-1 px-4 pb-4">
          <TabsList className="w-full">
            <TabsTrigger value="internal" className="flex-1 gap-1.5">
              {t("internal")}
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                {internalLinks.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="external" className="flex-1 gap-1.5">
              {t("external")}
              <span className="rounded-full bg-neutral-200 px-1.5 py-0.5 text-label-xs leading-none text-neutral-600">
                {externalLinks.length}
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="internal" className="mt-4">
            <LinksList
              links={internalLinks}
              emptyLabel={t("empty")}
              searchPlaceholder={t("search")}
            />
          </TabsContent>
          <TabsContent value="external" className="mt-4">
            <LinksList
              links={externalLinks}
              emptyLabel={t("empty")}
              searchPlaceholder={t("search")}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
