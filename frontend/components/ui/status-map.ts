export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";
// Presentation only. This map never authorizes transitions or actions.
export const STATUS_TONES: Readonly<Record<string, StatusTone>> = {
  ACTIVE: "success", APPROVED: "success", ACCEPTED: "success", DELIVERED: "success", PAID: "success", RETURNED_TO_MERCHANT: "success", COMPLETED: "success", VERIFIED_DELIVERY: "success", VERIFIED_RETURN_HANDOFF: "success",
  PENDING: "warning", INVITED: "warning", ON_BREAK: "warning", EXPIRED: "warning", ON_HOLD: "warning", RESCHEDULED: "warning", HIGH: "warning", RETURN_IN_PROGRESS: "warning", RETURNED: "warning", RETURNED_TO_WAREHOUSE: "warning", GRACE: "warning",
  SUSPENDED: "danger", REJECTED: "danger", FAILED: "danger", FAILED_DELIVERY: "danger", CANCELLED: "danger", REVOKED: "danger", URGENT: "danger", DAMAGED: "danger", ACCESS_REVOKED: "danger",
  RECEIVED_FROM_MERCHANT: "info", AT_WAREHOUSE: "info", ASSIGNED: "info", OUT_FOR_DELIVERY: "info", PICKED_UP: "info", READY_FOR_DISPATCH: "info", FINALIZED: "info", ISSUED: "info",
  OFFLINE: "neutral", INACTIVE: "neutral", DRAFT: "neutral", CREATED: "neutral", NORMAL: "neutral", USED: "neutral", OFFBOARDED: "neutral", NONE: "neutral",
};
export function statusTone(value: string): StatusTone { return STATUS_TONES[value] ?? "neutral"; }
