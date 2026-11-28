"use client";
import type { ReactNode } from "react";
import { Button } from "./button";
export function Toast({ children, tone = "success", onDismiss, dismissLabel }: { children: ReactNode; tone?: "success" | "danger" | "info"; onDismiss: () => void; dismissLabel: string }) {
  const styles = { success: "border-success-border bg-success-background text-success", danger: "border-danger-border bg-danger-background text-danger-foreground", info: "border-in-progress-border bg-in-progress-background text-in-progress" };
  return <div role={tone === "danger" ? "alert" : "status"} aria-live={tone === "danger" ? "assertive" : "polite"} className={`flex items-center justify-between gap-3 rounded-lg border p-4 text-sm ${styles[tone]}`}><p>{children}</p><Button variant="ghost" onClick={onDismiss}>{dismissLabel}</Button></div>;
}
