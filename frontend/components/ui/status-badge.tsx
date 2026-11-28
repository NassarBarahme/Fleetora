import type { ReactNode } from "react";
import { statusTone, type StatusTone } from "./status-map";
import { cn } from "@/lib/utils";

const tones: Record<StatusTone, string> = {
  success: "border-success-border bg-success-background text-success",
  warning: "border-warning-border bg-warning-background text-warning",
  danger: "border-danger-border bg-danger-background text-danger-foreground",
  info: "border-in-progress-border bg-in-progress-background text-in-progress",
  neutral: "border-border-strong bg-muted text-muted-foreground",
};
export function StatusBadge({ value, children, className }: { value: string; children: ReactNode; className?: string }) {
  return <span data-status={value} data-tone={statusTone(value)} className={cn("inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-4", tones[statusTone(value)], className)}>
    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />{children}
  </span>;
}
