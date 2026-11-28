import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
export function Table({ className, "aria-label": label, ...props }: ComponentProps<"table"> & { "aria-label": string }) {
  return <div role="region" aria-label={label} tabIndex={0} className="relative min-w-0 max-w-full overflow-x-auto rounded-lg border bg-surface focus-visible:outline-2 focus-visible:outline-ring"><table aria-label={label} className={cn("w-full text-start text-sm tabular-nums", className)} {...props} /></div>;
}
export function TableHead({ className, ...props }: ComponentProps<"th">) { return <th scope="col" className={cn("bg-secondary px-4 py-3 text-start text-xs font-semibold text-muted-foreground", className)} {...props} />; }
export function TableCell({ className, ...props }: ComponentProps<"td">) { return <td className={cn("border-t px-4 py-4 text-start leading-6", className)} {...props} />; }
