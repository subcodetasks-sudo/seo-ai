import type { ReactNode } from "react";

type BreakdownCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function BreakdownCard({ title, subtitle, children }: BreakdownCardProps) {
  return (
    <section className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-start text-h4 font-semibold text-secondary-500">{title}</h3>
        {subtitle ? (
          <span className="text-label-sm text-neutral-400">{subtitle}</span>
        ) : null}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  );
}
