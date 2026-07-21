"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ApiError } from "@/lib/errors";

import { useSelectSearchConsoleSite } from "../queries/mutations";
import { searchConsoleSitesQueryOptions } from "../queries/queries";

type SearchConsoleSiteSetupProps = {
  projectId: string;
  onDisconnect: () => void;
};

export function SearchConsoleSiteSetup({ projectId, onDisconnect }: SearchConsoleSiteSetupProps) {
  const t = useTranslations("searchConsole.sitePicker");
  const tErrors = useTranslations("searchConsole.errors");
  const {
    data: sites,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery(searchConsoleSitesQueryOptions(projectId, true));
  const { mutate: selectSite, isPending } = useSelectSearchConsoleSite(projectId);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const autoSelected = useRef(false);

  useEffect(() => {
    if (!sites || sites.length !== 1 || autoSelected.current) return;
    autoSelected.current = true;
    selectSite(sites[0].siteUrl);
  }, [sites, selectSite]);

  if (isLoading || isPending || sites?.length === 1) {
    return <LoadingState fullPage={false} />;
  }

  if (isError) {
    const isGoogleForbidden = error instanceof ApiError && error.status === 403;
    return (
      <ErrorState
        title={isGoogleForbidden ? tErrors("apiUnreachable") : t("loadError")}
        retryLabel={t("retry")}
        onRetry={() => refetch()}
        secondaryLabel={t("disconnect")}
        onSecondary={onDisconnect}
        fullPage={false}
      />
    );
  }

  if (!sites || sites.length === 0) {
    return <ErrorState title={t("noSites")} description={t("noSitesDescription")} fullPage={false} />;
  }

  const chosenUrl = selectedUrl ?? sites[0].siteUrl;

  function handleConfirm() {
    const site = sites?.find((item) => item.siteUrl === chosenUrl);
    if (!site) return;
    selectSite(site.siteUrl);
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-heading-sm font-semibold text-secondary-500">{t("title")}</h2>
        <p className="text-label-md text-neutral-500">{t("description")}</p>
      </div>

      <RadioGroup value={chosenUrl} onValueChange={setSelectedUrl} className="gap-3">
        {sites.map((site) => (
          <Label
            key={site.siteUrl}
            htmlFor={site.siteUrl}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 has-[[data-state=checked]]:border-primary-400 has-[[data-state=checked]]:bg-primary-50"
          >
            <RadioGroupItem id={site.siteUrl} value={site.siteUrl} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-label-sm font-medium text-secondary-500" dir="ltr">
                {site.siteUrl}
              </span>
              <span className="truncate text-label-xs text-neutral-400">{site.permissionLevel}</span>
            </span>
          </Label>
        ))}
      </RadioGroup>

      <Button type="button" onClick={handleConfirm} disabled={isPending} className="h-11 w-full">
        {isPending ? t("connecting") : t("confirm")}
      </Button>
    </div>
  );
}
