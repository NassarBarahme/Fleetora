"use client";
import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { Input } from "./input";
import { useLocale } from "@/lib/i18n";
import { formatDate, formatTime, latinDigits, parseDateInput } from "@/lib/date-time";

type Props = Omit<ComponentProps<"input">, "type" | "value" | "onChange" | "defaultValue" | "min" | "max"> & {
  type?: "date" | "datetime-local"; defaultValue?: string | number; min?: string | number; max?: string | number;
};
export function LocalizedDateInput({ id, name, defaultValue = "", type = "date", min, max, required, ...props }: Props) {
  const { locale } = useLocale();
  const hintId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const datetime = type === "datetime-local";
  const [value, setValue] = useState(() => defaultValue ? datetime ? `${formatDate(String(defaultValue), locale)} ${formatTime(String(defaultValue), locale)}` : formatDate(String(defaultValue).slice(0, 10), locale) : "");
  useEffect(() => {
    const form = inputRef.current?.form;
    const reset = () => setValue(defaultValue ? datetime ? `${formatDate(String(defaultValue), locale)} ${formatTime(String(defaultValue), locale)}` : formatDate(String(defaultValue).slice(0, 10), locale) : "");
    form?.addEventListener("reset", reset);
    return () => form?.removeEventListener("reset", reset);
  }, [defaultValue, datetime, locale]);
  const normalized = latinDigits(value);
  const match = datetime ? /^(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d{1,2}):(\d{2})\s*(AM|PM|ص|م)$/i.exec(normalized) : null;
  const date = parseDateInput(datetime ? match?.[1] ?? "" : value);
  const hour = Number(match?.[2]), minute = Number(match?.[3]);
  const timeValid = match && hour >= 1 && hour <= 12 && minute <= 59;
  const afternoon = match && /^(PM|م)$/i.test(match[4]);
  const iso = datetime ? date && timeValid ? `${date}T${String(hour % 12 + (afternoon ? 12 : 0)).padStart(2, "0")}:${match[3]}` : "" : date;
  const valid = (!value && !required) || Boolean(iso && (!min || iso >= String(min)) && (!max || iso <= String(max)));
  const hint = datetime ? `dd/MM/yyyy h:mm ${locale === "ar" ? "ص/م" : "AM/PM"}` : "dd/MM/yyyy";
  const error = locale === "ar" ? `أدخل تاريخًا صحيحًا بالصيغة ${hint}.` : `Enter a valid date using ${hint}.`;
  return <>
    <Input {...props} ref={node => { inputRef.current = node; node?.setCustomValidity(valid ? "" : error); }} id={id} type="text" inputMode={datetime ? "text" : "numeric"} dir="ltr" required={required} placeholder={hint} value={value.replace(/(?:AM|PM|ص|م)$/i, period => locale === "ar" ? /^(AM|ص)$/i.test(period) ? "ص" : "م" : /^(AM|ص)$/i.test(period) ? "AM" : "PM")} aria-invalid={value ? !valid : undefined} aria-describedby={[props["aria-describedby"], hintId].filter(Boolean).join(" ")} onChange={event => { setValue(latinDigits(event.target.value)); }} onBlur={event => event.target.setCustomValidity(valid ? "" : error)} onInvalid={event => event.currentTarget.setCustomValidity(error)} />
    <span id={hintId} className="sr-only">{hint}</span>
    <input type="hidden" name={name} value={valid ? iso : ""} disabled={props.disabled} />
  </>;
}
