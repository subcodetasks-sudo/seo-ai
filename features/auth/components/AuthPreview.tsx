import Image from "next/image";
import { Sparkles } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

import { cn } from "@/lib/utils";

type AuthPreviewProps = {
  className?: string;
};

function FeaturePill({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-300 text-primary-500">
        <Sparkles className="size-4" strokeWidth={2.25} />
      </span>
      <div className="min-w-0 space-y-0.5">
        <p className="text-sm font-medium leading-4 text-secondary-500">{title}</p>
        <p className="text-xs leading-4 text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}

function TrustedLogoImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={120}
      height={32}
      className="h-7 w-auto object-contain opacity-60 grayscale"
    />
  );
}

export async function AuthPreview({ className }: AuthPreviewProps) {
  const t = await getTranslations("auth.preview");
    const local = await getLocale();
  const trustedLogos = [
    { key: "wordpress-1", src: "/imgs/wordpress.png", alt: t("wordpress") },
    { key: "shopify-1", src: "/imgs/shopify.webp", alt: t("shopify") },
    { key: "zid-1", src: "/imgs/zid.png", alt: t("zid") },
    { key: "salla", src: "/imgs/salla.png", alt: t("salla") }

  ] as const;

  return (
    <aside
      className={cn(
        "hidden flex-col justify-around px-8 py-10 xl:px-12 xl:py-8 lg:flex",
        className
      )}
    >
      <div className="flex  flex-col gap-4">
        <div className="space-y-4">
          <h1 className="max-w-xl text-h1 font-medium leading-tight text-secondary-500">
            {t("headline")}
          </h1>
          <p className="max-w-xl text-sm leading-6 text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>
{/* 
        <ul className="flex gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <li key={index} className="min-w-0 flex-1">
              <FeaturePill
                title={t("featureTitle")}
                subtitle={t("featureSubtitle")}
              />
            </li>
          ))}
        </ul> */}

        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-6 top-1/2 h-3/5 -translate-y-1/2 rounded-full bg-primary-100/60 blur-3xl"
          />
          <div className="relative w-full overflow-hidden rounded-3xl shadow-[0_20px_60px_rgba(54,53,57,0.12)] ">
            <Image
              src={local === "en" ? "/imgs/auth-imgEN.png" : "/imgs/auth-img.png"}
              alt={t("heroImageAlt")}
              width={720}
              height={540}
              className="h-auto w-full object-cover"
              priority
            />
          </div>
        </div>
      </div>

      <div className="space-y-5 text-center">
        <p className="text-sm text-muted-foreground">{t("trustedBy")}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {trustedLogos.map((logo) => (
            <TrustedLogoImage key={logo.key} src={logo.src} alt={logo.alt} />
          ))}
        </div>
      </div>
    </aside>
  );
}
