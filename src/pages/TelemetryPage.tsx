import { Download, Filter, RefreshCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer } from "../components/Drawer";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { LiveIndicator } from "../components/LiveIndicator";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { TelemetryChart } from "../components/TelemetryChart";
import { useSolarData } from "../hooks/useSolarData";
import { useToast } from "../hooks/useToast";
import { telemetryService } from "../services/telemetryService";
import { MockTelemetryStream } from "../services/websocketService";
import type { TelemetryHistoryPoint, TelemetryReading, TelemetryStatus } from "../types/telemetry";
import { exportCsv } from "../utils/csv";
import { formatKw, formatPercent } from "../utils/format";

const pageSize = 8;

export function TelemetryPage() {
  const { loading, telemetry, sites, updateTelemetryReading } = useSolarData();
  const { addToast } = useToast();
  const [query, setQuery] = useState("");
  const [siteFilter, setSiteFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [connected, setConnected] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedReadingId, setSelectedReadingId] = useState<string | null>(null);
  const [history, setHistory] = useState<TelemetryHistoryPoint[]>([]);
  const readingsRef = useRef(telemetry);

  useEffect(() => {
    readingsRef.current = telemetry;
  }, [telemetry]);

  useEffect(() => {
    if (!autoRefresh) {
      setConnected(false);
      return;
    }

    const stream = new MockTelemetryStream(() => readingsRef.current, updateTelemetryReading, setConnected);
    stream.start();
    return () => stream.stop();
  }, [autoRefresh, updateTelemetryReading]);

  const selectedReading = selectedReadingId ? telemetry.find((reading) => reading.id === selectedReadingId) ?? null : null;

  useEffect(() => {
    let active = true;
    if (!selectedReading) {
      setHistory([]);
      return;
    }

    telemetryService.getTelemetryHistory(selectedReading).then((data) => {
      if (active) {
        setHistory(data);
      }
    });

    return () => {
      active = false;
    };
  }, [selectedReading]);

  const statuses = useMemo<TelemetryStatus[]>(() => ["Normal", "Warning", "Critical", "Offline", "Cleaning"], []);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return telemetry.filter((reading) => {
      const matchesSearch =
        reading.site.toLowerCase().includes(search) ||
        reading.device.toLowerCase().includes(search) ||
        reading.status.toLowerCase().includes(search);
      const matchesSite = siteFilter === "All" || reading.siteId === siteFilter;
      const matchesStatus = statusFilter === "All" || reading.status === statusFilter;
      return matchesSearch && matchesSite && matchesStatus;
    });
  }, [query, siteFilter, statusFilter, telemetry]);

  useEffect(() => {
    setPage(1);
  }, [query, siteFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const columns: DataTableColumn<TelemetryReading>[] = [
    { header: "Timestamp", render: (row) => new Date(row.timestamp).toLocaleTimeString() },
    { header: "Site", accessor: "site" },
    { header: "Device", accessor: "device" },
    { header: "Voltage", render: (row) => `${row.voltage.toFixed(1)} V` },
    { header: "Current", render: (row) => `${row.current.toFixed(1)} A` },
    { header: "Power", render: (row) => formatKw(row.powerKw) },
    { header: "Panel Temp", render: (row) => `${row.panelTempC.toFixed(1)} C` },
    { header: "Ambient", render: (row) => `${row.ambientTempC.toFixed(1)} C` },
    { header: "Irradiance", render: (row) => `${row.irradianceWm2} W/m2` },
    { header: "Efficiency", render: (row) => formatPercent(row.efficiencyPct) },
    { header: "Power Loss", render: (row) => formatPercent(row.powerLossPct) },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  function handleExport() {
    exportCsv(
      "solar-sweeper-telemetry.csv",
      filtered.map((reading) => ({
        timestamp: reading.timestamp,
        site: reading.site,
        device: reading.device,
        voltage: reading.voltage,
        current: reading.current,
        powerKw: reading.powerKw,
        panelTempC: reading.panelTempC,
        ambientTempC: reading.ambientTempC,
        irradianceWm2: reading.irradianceWm2,
        efficiencyPct: reading.efficiencyPct,
        powerLossPct: reading.powerLossPct,
        status: reading.status
      }))
    );
    addToast("CSV exported", `${filtered.length} telemetry rows exported.`, "success");
  }

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Live Telemetry"
        description="Live telemetry stream for voltage, current, panel temperature, irradiance, efficiency, and power-loss detection."
        actions={
          <>
            <LiveIndicator live={connected} />
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Download className="h-4 w-4" />
              CSV Export
            </button>
          </>
        }
      />

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_180px_180px_auto]">
          <label className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search telemetry"
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </label>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select value={siteFilter} onChange={(event) => setSiteFilter(event.target.value)} className="w-full bg-transparent text-sm outline-none">
              <option value="All">All sites</option>
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          </label>
          <label className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="w-full bg-transparent text-sm outline-none">
              <option value="All">All status</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
            <span className="inline-flex items-center gap-2">
              <RefreshCcw className="h-4 w-4 text-blue-600" />
              Auto Refresh
            </span>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(event) => setAutoRefresh(event.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />
          </label>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} data={paginated} getRowKey={(row) => row.id} onRowClick={(row) => setSelectedReadingId(row.id)} />
        </div>
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {paginated.length} of {filtered.length} readings
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Previous
            </button>
            <span className="font-semibold text-slate-800">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <Drawer open={Boolean(selectedReading)} title={selectedReading?.device ?? "Telemetry Detail"} onClose={() => setSelectedReadingId(null)}>
        {selectedReading ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <DetailMetric label="Site" value={selectedReading.site} />
              <DetailMetric label="Power" value={formatKw(selectedReading.powerKw)} />
              <DetailMetric label="Expected" value={formatKw(selectedReading.expectedPowerKw)} />
              <DetailMetric label="Efficiency" value={formatPercent(selectedReading.efficiencyPct)} />
              <DetailMetric label="Power Loss" value={formatPercent(selectedReading.powerLossPct)} />
              <DetailMetric label="Status" value={selectedReading.status} />
            </div>
            <TelemetryChart data={history} />
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}
