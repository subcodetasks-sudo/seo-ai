"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import ErrorState from "@/components/error-state";
import LoadingState from "@/components/loading-state";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { useSelectGoogleAnalyticsProperty } from "../queries/mutations";
import { googleAnalyticsPropertiesQueryOptions } from "../queries/queries";

type GoogleAnalyticsPropertySetupProps = {
  projectId: string;
};

export function GoogleAnalyticsPropertySetup({ projectId }: GoogleAnalyticsPropertySetupProps) {
  const t = useTranslations("googleAnalytics.propertyPicker");
  const {
    data: properties,
    isLoading,
    isError,
    refetch,
  } = useQuery(googleAnalyticsPropertiesQueryOptions(projectId, true));
  const { mutate: selectProperty, isPending } = useSelectGoogleAnalyticsProperty(projectId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const autoSelected = useRef(false);

  useEffect(() => {
    if (!properties || properties.length !== 1 || autoSelected.current) return;
    autoSelected.current = true;
    selectProperty({ propertyId: properties[0].propertyId, propertyName: properties[0].displayName });
  }, [properties, selectProperty]);

  if (isLoading || isPending || properties?.length === 1) {
    return <LoadingState fullPage={false} />;
  }

  if (isError) {
    return (
      <ErrorState
        title={t("loadError")}
        retryLabel={t("retry")}
        onRetry={() => refetch()}
        fullPage={false}
      />
    );
  }

  if (!properties || properties.length === 0) {
    return <ErrorState title={t("noProperties")} description={t("noPropertiesDescription")} fullPage={false} />;
  }

  const chosenId = selectedId ?? properties[0].propertyId;

  function handleConfirm() {
    const property = properties?.find((item) => item.propertyId === chosenId);
    if (!property) return;
    selectProperty({ propertyId: property.propertyId, propertyName: property.displayName });
  }

  return (
    <div className="flex w-full max-w-lg flex-col gap-6 rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-1 text-center">
        <h2 className="text-heading-sm font-semibold text-secondary-500">{t("title")}</h2>
        <p className="text-label-md text-neutral-500">{t("description")}</p>
      </div>

      <RadioGroup value={chosenId} onValueChange={setSelectedId} className="gap-3">
        {properties.map((property) => (
          <Label
            key={property.propertyId}
            htmlFor={property.propertyId}
            className="flex cursor-pointer items-center gap-3 rounded-lg border border-neutral-200 p-3 has-[[data-state=checked]]:border-primary-400 has-[[data-state=checked]]:bg-primary-50"
          >
            <RadioGroupItem id={property.propertyId} value={property.propertyId} />
            <span className="flex min-w-0 flex-col">
              <span className="truncate text-label-sm font-medium text-secondary-500">
                {property.displayName}
              </span>
              {property.websiteUrl ? (
                <span className="truncate text-label-xs text-neutral-400" dir="ltr">
                  {property.websiteUrl}
                </span>
              ) : null}
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
