"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";
export function ConfirmDialog({ open, title, children, confirmLabel, cancelLabel, pending = false, onConfirm, onClose }: { open: boolean; title: ReactNode; children: ReactNode; confirmLabel: string; cancelLabel: string; pending?: boolean; onConfirm: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId(), descriptionId = useId();
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    return () => { if (dialog.open) dialog.close(); if (previous instanceof HTMLElement) previous.focus(); };
  }, [open]);
  return <dialog ref={ref} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event => { event.preventDefault(); if (!pending) onClose(); }} onClose={() => { if (open && !pending) onClose(); }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%_-_var(--space-8))] max-w-md overflow-y-auto rounded-xl border bg-surface p-6 text-foreground shadow-lg backdrop:bg-sidebar-navy/55">
    <h2 id={titleId} className="text-lg font-semibold text-brand-navy">{title}</h2><div id={descriptionId} className="mt-3 text-sm leading-6">{children}</div><div className="mt-6 flex flex-wrap justify-end gap-3"><Button autoFocus variant="secondary" disabled={pending} onClick={onClose}>{cancelLabel}</Button><Button variant="danger" disabled={pending} onClick={onConfirm}>{confirmLabel}</Button></div>
  </dialog>;
}
