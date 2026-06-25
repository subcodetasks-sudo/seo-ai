"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { Integration } from "../types";

type IntegrationCardProps = {
  integration: Integration;
  onDisconnect: () => void;
  onConnect: () => void;
};

export function IntegrationCard({
  integration,
  onDisconnect,
  onConnect,
}: IntegrationCardProps) {
  const t = useTranslations("settings.integrations");

  return (
    <Card className="settings-card border border-neutral-200 bg-white shadow-none ring-0">
      <CardContent className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white">
            <Image
              src="/imgs/wordpress.webp"
              alt=""
              width={32}
              height={32}
              className="size-8 object-contain"
            />
          </div>
          <div className="flex flex-col gap-1 text-start">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-label-md font-semibold text-secondary-500">
                {t(integration.nameKey)}
              </p>
              {integration.connected ? (
                <Badge className="w-fit bg-primary-50 text-primary-700 hover:bg-primary-50">
                  {t("connected")}
                </Badge>
              ) : null}
            </div>
            <p className="text-label-sm text-neutral-500">
              {t(integration.descriptionKey)}
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={integration.connected ? onDisconnect : onConnect}
          className={cn(
            "shrink-0",
            integration.connected
              ? "border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive"
              : "border-primary-300 text-primary-700 hover:bg-primary-50",
          )}
        >
          {integration.connected ? t("disconnect") : t("connect")}
        </Button>
      </CardContent>
    </Card>
  );
}
