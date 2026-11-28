import { expect, test } from "@playwright/test";
import { formatDate, formatTime, formatDateTime, parseDateInput } from "@/lib/date-time";
import { statusTone } from "@/components/ui/status-map";

test("OD-21 dates use Gregorian Latin dd/MM/yyyy in both languages without date-only shifts", () => {
  for (const locale of ["en", "ar"] as const) {
    expect(formatDate("2026-11-28", locale, "America/Los_Angeles")).toBe("28/11/2026");
    expect(formatDate("2026-11-28T23:30:00Z", locale, "Asia/Hebron")).toBe("29/11/2026");
    expect(formatDate(null, locale)).toBe("—");
    expect(formatDate("bad", locale)).toBe("—");
    expect(formatDate("2026-02-31", locale)).toBe("—");
  }
});
test("OD-21 times use Latin digits, localized 12-hour periods and the supplied zone", () => {
  expect(formatTime("2026-11-28T00:05:00Z", "en", "UTC")).toBe("12:05 AM");
  expect(formatTime("2026-11-28T12:05:00Z", "ar", "UTC")).toBe("12:05 م");
  expect(formatTime("2026-11-28T00:05:00Z", "ar", "UTC")).toBe("12:05 ص");
  expect(formatDateTime("2026-11-28T13:05:00Z", "en", "UTC")).toBe("28/11/2026, 1:05 PM");
  expect(formatTime("bad", "ar")).toBe("—");
});
test("OD-21 date inputs reject impossible dates and preserve ISO submission values", () => {
  expect(parseDateInput("29/02/2024")).toBe("2024-02-29");
  expect(parseDateInput("٢٨/١١/٢٠٢٦")).toBe("2026-11-28");
  for (const value of ["29/02/2025", "31/04/2026", "00/11/2026", "28/13/2026", "bad", ""]) expect(parseDateInput(value)).toBe("");
});
test("OD-22 one semantic map covers company, merchant, parcel, driver and invitation states", () => {
  for (const value of ["ACTIVE", "APPROVED", "DELIVERED", "ACCEPTED"]) expect(statusTone(value)).toBe("success");
  for (const value of ["SUSPENDED", "REJECTED", "FAILED_DELIVERY", "REVOKED"]) expect(statusTone(value)).toBe("danger");
  for (const value of ["PENDING", "ON_BREAK", "EXPIRED"]) expect(statusTone(value)).toBe("warning");
  expect(statusTone("OUT_FOR_DELIVERY")).toBe("info");
  expect(statusTone("OFFLINE")).toBe("neutral");
  expect(statusTone("FUTURE_UNKNOWN_STATE")).toBe("neutral");
});
