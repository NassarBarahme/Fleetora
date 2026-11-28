import type { Locale } from "./i18n";

type DateValue = string | Date | null | undefined;
function validDate(value: DateValue) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}
export function formatDate(value: DateValue, locale: Locale, timeZone?: string): string {
  const date = validDate(value);
  if (!date) return "—";
  // Calendar-only values are dates, not instants; never shift them across zones.
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const display = value.split("-").reverse().join("/");
    return parseDateInput(display) === value ? display : "—";
  }
  return new Intl.DateTimeFormat(`${locale}-u-ca-gregory-nu-latn`, {
    day: "2-digit", month: "2-digit", year: "numeric", timeZone,
  }).formatToParts(date).filter(part => ["day", "month", "year"].includes(part.type))
    .sort((a, b) => ["day", "month", "year"].indexOf(a.type) - ["day", "month", "year"].indexOf(b.type))
    .map(part => part.value).join("/");
}
export function formatTime(value: DateValue, locale: Locale, timeZone?: string): string {
  const date = validDate(value);
  if (!date) return "—";
  const parts = new Intl.DateTimeFormat("en-US-u-nu-latn", { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find(item => item.type === type)?.value ?? "";
  const period = part("dayPeriod");
  return `${part("hour")}:${part("minute")} ${locale === "ar" ? period === "AM" ? "ص" : "م" : period}`;
}
export function formatDateTime(value: DateValue, locale: Locale, timeZone?: string): string {
  return validDate(value) ? `${formatDate(value, locale, timeZone)}, ${formatTime(value, locale, timeZone)}` : "—";
}
export function latinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit) >= 0 ? "٠١٢٣٤٥٦٧٨٩".indexOf(digit) : "۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}
export function parseDateInput(value: string): string {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(latinDigits(value));
  if (!match) return "";
  const [, day, month, year] = match;
  if (Number(year) < 1) return "";
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === iso ? iso : "";
}
