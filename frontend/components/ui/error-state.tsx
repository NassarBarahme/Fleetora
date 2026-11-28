import type { ReactNode } from "react";
import { Card } from "./card";
export function ErrorState({ title, hint, action }: { title: ReactNode; hint?: ReactNode; action?: ReactNode }) {
  return <Card role="alert" className="border-danger-border"><p className="font-medium text-danger-foreground">{title}</p>{hint && <p className="mt-2 text-sm leading-6">{hint}</p>}{action && <div className="mt-3">{action}</div>}</Card>;
}
