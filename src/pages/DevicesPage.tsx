import { Battery, Cpu, RadioTower, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { DeviceCard } from "../components/DeviceCard";
import { Drawer } from "../components/Drawer";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useSolarData } from "../hooks/useSolarData";
import type { Device, DeviceStatus, DeviceType } from "../types/device";

const deviceStatuses: DeviceStatus[] = ["Online", "Offline", "Warning", "Cleaning", "Emergency Stopped"];
const deviceTypes: DeviceType[] = ["ESP32 Controller", "Energy Meter", "Temperature Sensor", "Irradiance Sensor", "Solar Sweeper Robot"];

export function DevicesPage() {
  const { loading, devices } = useSolarData();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return devices.filter((device) => {
      const matchesSearch =
        device.id.toLowerCase().includes(search) ||
        device.siteName.toLowerCase().includes(search) ||
        device.type.toLowerCase().includes(search);
      const matchesStatus = statusFilter === "All" || device.status === statusFilter;
      const matchesType = typeFilter === "All" || device.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [devices, query, statusFilter, typeFilter]);

  const columns: DataTableColumn<Device>[] = [
    { header: "Device ID", accessor: "id" },
    { header: "Site", accessor: "siteName" },
    { header: "Device Type", accessor: "type" },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { header: "Last Seen", accessor: "lastSeen" },
    { header: "Firmware Version", accessor: "firmwareVersion" },
    { header: "Battery", render: (row) => (row.batteryPct === null ? "Line powered" : `${row.batteryPct}%`) },
    { header: "Signal Strength", render: (row) => `${row.signalStrengthPct}%` }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Devices"
        description="Status inventory for ESP32 controllers, energy meters, environmental sensors, irradiance sensors, and Solar Sweeper robots."
      />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
        <div className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_220px_220px]">
          <label className="flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search device ID, site, or type"
              className="ml-2 w-full bg-transparent text-sm outline-none"
            />
          </label>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            <option value="All">All status</option>
            {deviceStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
          >
            <option value="All">All device types</option>
            {deviceTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} data={filtered} getRowKey={(row) => row.id} onRowClick={(row) => setSelectedDevice(row)} />
        </div>
      </section>

      <Drawer open={Boolean(selectedDevice)} title={selectedDevice?.id ?? "Device Detail"} onClose={() => setSelectedDevice(null)}>
        {selectedDevice ? (
          <div className="space-y-5">
            <DeviceCard device={selectedDevice} />
            <div className="grid gap-3 sm:grid-cols-3">
              <Detail icon={Cpu} label="Firmware" value={selectedDevice.firmwareVersion} />
              <Detail icon={Battery} label="Battery" value={selectedDevice.batteryPct === null ? "Line powered" : `${selectedDevice.batteryPct}%`} />
              <Detail icon={RadioTower} label="Signal" value={`${selectedDevice.signalStrengthPct}%`} />
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <h3 className="font-bold text-slate-950">Diagnostic Notes</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{selectedDevice.notes}</p>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function Detail({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-2 text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}
