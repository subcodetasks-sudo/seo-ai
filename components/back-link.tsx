"use client";

import type { ComponentProps, ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const backLinkClassName =
  "h-9 w-fit gap-2 border-primary-200 bg-primary-100 px-3.5 text-label-md font-medium text-primary-700 shadow-sm hover:border-primary-300 hover:bg-primary-200 hover:text-primary-800";

type BackLinkBaseProps = {
  children: ReactNode;
  className?: string;
  disabled?: boolean;
};

type BackLinkWithHref = BackLinkBaseProps & {
  href: ComponentProps<typeof Link>["href"];
  onClick?: never;
};

type BackLinkWithOnClick = BackLinkBaseProps & {
  href?: never;
  onClick: () => void;
};

type BackLinkProps = BackLinkWithHref | BackLinkWithOnClick;

export default function BackLink({ children, href, onClick, className, disabled }: BackLinkProps) {
  const content = (
    <>
      <ArrowLeft className="size-4 rtl:rotate-180" aria-hidden="true" />
      {children}
    </>
  );

  if (href !== undefined) {
    return (
      <Button
        variant="outline"
        size="lg"
        asChild
        disabled={disabled}
        className={cn(backLinkClassName, className)}
      >
        <Link href={href}>{content}</Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={disabled}
      className={cn(backLinkClassName, className)}
    >
      {content}
    </Button>
  );
}
