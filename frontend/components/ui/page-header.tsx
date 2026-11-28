import type { ReactElement, ReactNode } from "react";
export function PageHeader({ title, hint, primaryAction, children }: { title: ReactNode; hint?: ReactNode; primaryAction?: ReactElement; children?: ReactNode }) {
  return <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
    <div className="min-w-0"><h2 className="text-xl font-semibold leading-7 text-brand-navy">{title}</h2>{hint && <p className="mt-1 text-sm leading-6 text-muted-foreground">{hint}</p>}</div>
    <div className="flex flex-wrap items-center gap-3">{children}{primaryAction}</div>
  </div>;
}
