import { StatusBadge } from "@/components/ui/status-badge";
import { useLocale } from "@/lib/i18n";
import type { DriverStatus } from "../drivers.types";

export function DriverStatusBadge({ status }: { status: DriverStatus }) {
  const { t } = useLocale();
  const labels: Record<DriverStatus, "Active" | "Offline" | "On break" | "Suspended"> = {
    ACTIVE: "Active",
    OFFLINE: "Offline",
    ON_BREAK: "On break",
    SUSPENDED: "Suspended",
  };
  return <StatusBadge value={status}>{t(labels[status])}</StatusBadge>;
}
