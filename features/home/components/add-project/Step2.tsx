"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useDirection } from "@/components/ui/direction";
import { toast } from "sonner";

const PLUGIN_DOWNLOAD_URL = "#";
// const TOKEN_PATTERN = /^rank-ai-token-[a-zA-Z0-9-]+$/;

interface Step2Props {
  onNext: (data: { token: string }) => void;
  onBack: () => void;
}

const instructions = ["instruction1", "instruction2", "instruction3"] as const;

export default function Step2({ onNext, onBack }: Step2Props) {
  const dir = useDirection();
  const t = useTranslations("home.addProject.step2");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedToken = token.trim();
    if (!trimmedToken) {
      setError(t("tokenRequired"));
      return;
    }

    // if (!TOKEN_PATTERN.test(trimmedToken)) {
    //   setError(t("invalidToken"));
    //   return;
    // }

    setError("");
    setIsVerifying(true);

    const verificationPromise = new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    toast.promise(verificationPromise, {
      loading: t("verifying"),
      success: () => {
        setIsVerifying(false);
        onNext({ token: trimmedToken });
        return t("verificationSuccess");
      },
      error: () => {
        setIsVerifying(false);
        return t("verificationFailed");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-[600px] flex-col items-center gap-6"
      dir={dir}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-h1 font-bold text-secondary-500">{t("title")}</h1>
        <p className="text-label-md text-neutral-500">{t("subtitle")}</p>
      </div>

      <div className="w-full rounded-[12px] border border-neutral-200 bg-white p-5">
        <ol className="flex flex-col gap-5">
          {instructions.map((key, index) => (
            <li key={key} className="flex items-start gap-3 text-start">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-label-sm font-semibold text-secondary-500">
                {index + 1}
              </span>

              {key === "instruction1" ? (
                <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="text-body text-secondary-500">{t(key)}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 shrink-0 gap-2 rounded-[10px] border-neutral-200 bg-white px-4 text-label-md font-medium text-secondary-500 hover:bg-neutral-50"
                  >
                    <a href={PLUGIN_DOWNLOAD_URL} download>
                      <Download className="size-4" />
                      <span>{t("downloadPlugin")}</span>
                    </a>
                  </Button>
                </div>
              ) : (
                <span className="flex-1 text-body text-secondary-500">{t(key)}</span>
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex w-full flex-col gap-2 text-start">
        <label htmlFor="connection-token" className="text-label-md font-semibold text-secondary-500">
          {t("tokenLabel")}
        </label>
        <Input
          id="connection-token"
          type="text"
          placeholder={t("tokenPlaceholder")}
          value={token}
          onChange={(e) => {
            setToken(e.target.value);
            if (error) setError("");
          }}
          className={cn(
            "h-12 w-full rounded-[10px] border border-neutral-300 bg-white px-4 py-2 text-left text-body placeholder:text-neutral-400 focus-visible:border-primary-300 focus-visible:ring-3 focus-visible:ring-primary-100/50",
            error && "border-error-300 focus-visible:border-error-300 focus-visible:ring-error-100/50"
          )}
          dir="ltr"
        />
        {error ? (
          <span className="text-label-sm text-error-300">{error}</span>
        ) : (
          <span className="text-label-sm text-neutral-400">{t("tokenHint")}</span>
        )}
      </div>

      <div className="mt-4 flex w-full items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          disabled={isVerifying}
          className="flex h-11 items-center gap-2 px-2 text-label-md font-medium text-neutral-500 hover:bg-transparent hover:text-secondary-500"
        >
          {dir === "rtl" ? <ArrowRight className="size-4" /> : <ArrowLeft className="size-4" />}
          <span>{t("back")}</span>
        </Button>

        <Button
          type="submit"
          disabled={isVerifying}
          className="flex h-11 items-center gap-2 rounded-[10px] bg-primary-300 px-6 font-semibold text-secondary-500 transition-all hover:bg-primary-300/90 active:translate-y-px"
        >
          {isVerifying && <LoaderCircle className="size-4 animate-spin" />}
          <span>{t("verifyNow")}</span>
        </Button>
      </div>
    </form>
  );
}
