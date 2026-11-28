"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import { LocalizedDateInput } from "@/components/ui/localized-date-input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Toast } from "@/components/ui/toast";
import { Table, TableHead, TableCell } from "@/components/ui/table";
import { Label } from "@/components/ui/label";

export default function DesignSystemProbe() {
  const [open, setOpen] = useState(false), [confirmed, setConfirmed] = useState(false), [toast, setToast] = useState(true);
  const [submitted, setSubmitted] = useState("");
  return <main className="space-y-6 p-4 sm:p-8">
    <PageHeader title="Design system" hint="Shared foundation probe" primaryAction={<Button variant="primary">Add record</Button>}><Button variant="danger" onClick={() => setOpen(true)}>Delete record</Button></PageHeader>
    <div className="flex flex-wrap gap-3">{["ACTIVE", "PENDING", "SUSPENDED", "OUT_FOR_DELIVERY", "OFFLINE"].map(value => <StatusBadge key={value} value={value}>{value}</StatusBadge>)}</div>
    <form className="space-y-3" onSubmit={event => { event.preventDefault(); const data = new FormData(event.currentTarget); setSubmitted(`${data.get("state")}|${data.get("date")}|${data.get("time")}`); }}>
      <Label htmlFor="state">State</Label><Select id="state" name="state" defaultValue="ACTIVE" required><option value="ACTIVE">Active</option><option value="PENDING">Pending</option><option value="SUSPENDED" disabled>Suspended</option></Select>
      <Label htmlFor="date">Calendar date</Label><LocalizedDateInput id="date" name="date" defaultValue="2026-11-28" required />
      <Label htmlFor="time">Appointment</Label><LocalizedDateInput id="time" name="time" type="datetime-local" required />
      <Button type="submit">Save values</Button><Button type="reset">Reset values</Button><output aria-label="Submitted values">{submitted}</output>
    </form>
    <ConfirmDialog open={open} title="Delete record?" confirmLabel="Delete record" cancelLabel="Keep record" onClose={() => setOpen(false)} onConfirm={() => { setConfirmed(true); setOpen(false); }}><p>Deletion cannot be undone.</p><Label htmlFor="dialog-choice">Decision</Label><Select id="dialog-choice" defaultValue="KEEP"><option value="KEEP">Keep</option><option value="DELETE">Delete</option></Select></ConfirmDialog>
    {confirmed && <p>Record deleted</p>}
    <Tabs defaultValue="one"><TabList aria-label="Probe panels"><Tab value="one">First panel</Tab><Tab value="two">Second panel</Tab></TabList><TabPanel value="one">First content</TabPanel><TabPanel value="two">Second content</TabPanel></Tabs>
    <EmptyState title="No records" hint="Create a record to begin." action={<Button>Create record</Button>} />
    <LoadingState>Loading records</LoadingState><ErrorState title="Records could not load." hint="Try loading them again." action={<Button>Reload records</Button>} />
    {toast && <Toast onDismiss={() => setToast(false)} dismissLabel="Dismiss message">Record saved.</Toast>}
    <Table aria-label="Probe records"><thead><tr><TableHead>Record</TableHead><TableHead>State</TableHead></tr></thead><tbody><tr><TableCell>Fixture</TableCell><TableCell>Active</TableCell></tr></tbody></Table>
  </main>;
}
