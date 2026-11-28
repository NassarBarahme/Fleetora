import type { ReactNode } from "react";
import { Card } from "./card";
export function LoadingState({ children }: { children: ReactNode }) {
  return <Card role="status" aria-live="polite" aria-busy="true"><p className="text-sm text-muted-foreground">{children}</p><div aria-hidden="true" className="mt-4 space-y-3 motion-safe:animate-pulse"><div className="h-3 w-3/4 rounded-sm bg-border" /><div className="h-3 w-1/2 rounded-sm bg-border" /></div></Card>;
}
