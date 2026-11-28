"use client";
import { Children, isValidElement, useRef, type ReactNode } from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: ReactNode; disabled: boolean };
function optionsFrom(children: ReactNode): Option[] {
  const options: Option[] = [];
  Children.forEach(children, child => {
    if (!isValidElement<{ value?: string | number; children?: ReactNode; disabled?: boolean }>(child)) return;
    if (child.type === "option") options.push({ value: String(child.props.value ?? (typeof child.props.children === "string" || typeof child.props.children === "number" ? child.props.children : "")), label: child.props.children, disabled: Boolean(child.props.disabled) });
    else options.push(...optionsFrom(child.props.children));
  });
  return options;
}
type SelectProps = {
  id?: string; name?: string; value?: string | number; defaultValue?: string | number;
  disabled?: boolean; required?: boolean; className?: string; children: ReactNode; dir?: string;
  "aria-label"?: string; "aria-labelledby"?: string; "aria-describedby"?: string; "aria-invalid"?: boolean;
  onChange?: (event: { target: { value: string }; currentTarget: { value: string } }) => void;
};
/** Short enums only. Record selection belongs to the authenticated Combobox. */
export function Select({ id, name, value, defaultValue, disabled, required, className, children, onChange, ...aria }: SelectProps) {
  const options = optionsFrom(children);
  const portalContainer = useRef<HTMLElement | null>(null);
  return <BaseSelect.Root name={name} value={value === undefined ? undefined : String(value)} defaultValue={defaultValue === undefined ? options[0]?.value : String(defaultValue)} disabled={disabled} required={required} items={options} onValueChange={next => { const target = { value: next ?? "" }; onChange?.({ target, currentTarget: target }); }}>
    <BaseSelect.Trigger ref={node => { portalContainer.current = node?.closest("dialog") ?? null; }} id={id} {...aria} className={cn("flex min-h-10 w-full cursor-pointer items-center justify-between gap-3 rounded-md border bg-surface px-3 py-2 text-start text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", className, "border-control-border focus-visible:ring-ring")}>
      <BaseSelect.Value className="min-w-0 truncate" /><BaseSelect.Icon><ChevronDown aria-hidden="true" className="size-4" /></BaseSelect.Icon>
    </BaseSelect.Trigger>
    <BaseSelect.Portal container={portalContainer}><BaseSelect.Positioner sideOffset={4} className="z-50 outline-none"><BaseSelect.Popup className="max-h-[min(20rem,var(--available-height))] min-w-[var(--anchor-width)] overflow-y-auto rounded-md border bg-surface p-1 text-foreground shadow-lg outline-none">
      {options.map(option => <BaseSelect.Item key={option.value} value={option.value} disabled={option.disabled} data-value={option.value} className="flex min-h-10 cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm outline-none data-[highlighted]:bg-brand-navy-hover data-[highlighted]:text-sidebar-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sidebar-foreground data-[disabled]:opacity-50"><BaseSelect.ItemIndicator><Check aria-hidden="true" className="size-4" /></BaseSelect.ItemIndicator><BaseSelect.ItemText>{option.label}</BaseSelect.ItemText></BaseSelect.Item>)}
    </BaseSelect.Popup></BaseSelect.Positioner></BaseSelect.Portal>
  </BaseSelect.Root>;
}
