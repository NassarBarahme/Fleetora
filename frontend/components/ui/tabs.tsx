"use client";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
export const Tabs = BaseTabs.Root;
export const TabPanel = BaseTabs.Panel;
export function TabList(props: BaseTabs.List.Props) { return <BaseTabs.List className="flex gap-1 overflow-x-auto border-b" {...props} />; }
export function Tab(props: BaseTabs.Tab.Props) { return <BaseTabs.Tab className="min-h-10 cursor-pointer border-b-2 border-transparent px-4 py-2 text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring data-[active]:border-brand-navy data-[active]:text-brand-navy" {...props} />; }
