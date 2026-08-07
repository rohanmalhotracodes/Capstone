import { CheckCircle2, Eye, Search, ShieldCheck } from "lucide-react";
import { MouseEvent, useMemo, useState } from "react";
import { AlertBadge } from "../components/AlertBadge";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { Drawer } from "../components/Drawer";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useSolarData } from "../hooks/useSolarData";
import type { AlertSeverity, AlertStatus, SolarAlert } from "../types/alert";

const severities: AlertSeverity[] = ["Critical", "High", "Medium", "Low"];
const statuses: AlertStatus[] = ["New", "Acknowledged", "Resolved"];

export function AlertsPage() {
  const { loading, alerts, updateAlertStatus } = useSolarData();
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedAlert, setSelectedAlert] = useState<SolarAlert | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.site.toLowerCase().includes(search) ||
        alert.device.toLowerCase().includes(search) ||
        alert.message.toLowerCase().includes(search) ||
        alert.type.toLowerCase().includes(search);
      const matchesSeverity = severityFilter === "All" || alert.severity === severityFilter;
      const matchesStatus = statusFilter === "All" || alert.status === statusFilter;
      return matchesSearch && matchesSeverity && matchesStatus;
    });
  }, [alerts, query, severityFilter, statusFilter]);

  function stopAndRun(event: MouseEvent<HTMLButtonElement>, callback: () => void) {
    event.stopPropagation();
    callback();
  }

  const columns: DataTableColumn<SolarAlert>[] = [
    { header: "Timestamp", accessor: "timestamp" },
    { header: "Site", accessor: "site" },
    { header: "Device", accessor: "device" },
    { header: "Message", accessor: "message" },
    { header: "Severity", render: (row) => <AlertBadge severity={row.severity} /> },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            type="button"
            disabled={row.status !== "New"}
            onClick={(event) => stopAndRun(event, () => updateAlertStatus(row.id, "Acknowledged"))}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Acknowledge
          </button>
          <button
            type="button"
            disabled={row.status === "Resolved"}
            onClick={(event) => stopAndRun(event, () => updateAlertStatus(row.id, "Resolved"))}
            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Resolve
          </button>
        </div>
      )
    }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Alerts"
        description="Power loss, high temperature, device outage, sensor error, cleaning, water, battery, communication, and emergency events."
      />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px]">
          <label className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search alerts"
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            <option value="All">All severity</option>
            {severities.map((severity) => (
              <option key={severity} value={severity}>
                {severity}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            <option value="All">All status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} data={filtered} getRowKey={(row) => row.id} onRowClick={(row) => setSelectedAlert(row)} />
        </div>
      </section>

      <Drawer open={Boolean(selectedAlert)} title={selectedAlert?.type ?? "Alert Details"} onClose={() => setSelectedAlert(null)}>
        {selectedAlert ? (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <AlertBadge severity={selectedAlert.severity} />
              <StatusBadge status={selectedAlert.status} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Detail label="Timestamp" value={selectedAlert.timestamp} />
              <Detail label="Site" value={selectedAlert.site} />
              <Detail label="Device" value={selectedAlert.device} />
              <Detail label="Alert ID" value={selectedAlert.id} />
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="flex items-center gap-2 font-bold text-slate-950">
                <Eye className="h-5 w-5 text-blue-600" />
                Event Message
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedAlert.message}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={selectedAlert.status !== "New"}
                onClick={() => {
                  updateAlertStatus(selectedAlert.id, "Acknowledged");
                  setSelectedAlert({ ...selectedAlert, status: "Acknowledged" });
                }}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Acknowledge
              </button>
              <button
                type="button"
                disabled={selectedAlert.status === "Resolved"}
                onClick={() => {
                  updateAlertStatus(selectedAlert.id, "Resolved");
                  setSelectedAlert({ ...selectedAlert, status: "Resolved" });
                }}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Resolve Alert
              </button>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}
