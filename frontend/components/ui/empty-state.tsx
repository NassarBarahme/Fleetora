import type { ReactElement, ReactNode } from "react";
import { Card } from "./card";
export function EmptyState({ title, hint, action }: { title: ReactNode; hint: ReactNode; action: ReactElement }) {
  return <Card className="space-y-3"><h3 className="font-semibold text-brand-navy">{title}</h3><p className="text-sm leading-6 text-muted-foreground">{hint}</p>{action}</Card>;
}
