import { ArrowLeft, Bot, CloudSun, Droplets, Gauge, PanelsTopLeft, Thermometer, Wind, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { EmptyState } from "../components/EmptyState";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { generateGenerationSeries } from "../data/generation";
import { useSolarData } from "../hooks/useSolarData";
import type { SolarAlert } from "../types/alert";
import type { Device } from "../types/device";
import { formatMw, formatPercent } from "../utils/format";

export function SiteDetailPage() {
  const { siteId } = useParams();
  const { loading, sites, devices, alerts } = useSolarData();

  if (loading) {
    return <LoadingSkeleton />;
  }

  const site = sites.find((item) => item.id === siteId);

  if (!site) {
    return (
      <EmptyState
        icon={PanelsTopLeft}
        title="Site not found"
        description="The requested solar site is not available in the mock data set."
      />
    );
  }

  const siteDevices = devices.filter((device) => device.siteId === site.id);
  const siteAlerts = alerts.filter((alert) => alert.siteId === site.id).slice(0, 5);
  const chartData = generateGenerationSeries("Today");

  const deviceColumns: DataTableColumn<Device>[] = [
    { header: "Device ID", accessor: "id" },
    { header: "Device Type", accessor: "type" },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    { header: "Last Seen", accessor: "lastSeen" },
    { header: "Firmware", accessor: "firmwareVersion" },
    { header: "Signal", render: (row) => `${row.signalStrengthPct}%` }
  ];

  const alertColumns: DataTableColumn<SolarAlert>[] = [
    { header: "Timestamp", accessor: "timestamp" },
    { header: "Device", accessor: "device" },
    { header: "Message", accessor: "message" },
    { header: "Severity", render: (row) => <StatusBadge status={row.severity} /> },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  return (
    <div>
      <PageHeader
        title={site.name}
        description={`${site.location} - ${site.panels.toLocaleString()} panels monitored through ESP32 controllers, meters, sensors, and Solar Sweeper robots.`}
        actions={
          <Link
            to="/sites"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sites
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={Zap} label="Installed Capacity" value={formatMw(site.capacityMw)} />
        <Metric icon={Gauge} label="Current Generation" value={formatMw(site.currentProductionMw)} />
        <Metric icon={PanelsTopLeft} label="Expected Generation" value={formatMw(site.expectedProductionMw)} />
        <Metric icon={Thermometer} label="Efficiency" value={formatPercent(100 - site.powerLossPct)} />
        <Metric icon={CloudSun} label="Estimated Power Loss" value={formatPercent(site.powerLossPct)} />
        <Metric icon={PanelsTopLeft} label="Panels" value={site.panels.toLocaleString()} />
        <Metric icon={Bot} label="Device Status" value={`${site.onlineDevices}/${site.totalDevices} online`} />
        <Metric icon={Droplets} label="Cleaning Status" value={site.cleaningStatus} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <ChartCard title="Generation Chart" description="Actual vs expected generation across the current day.">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(2)} MW`} />
                <Legend />
                <Line type="monotone" dataKey="expectedPower" name="Expected" stroke="#059669" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="actualPower" name="Actual" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-slate-950">Environmental Conditions</h2>
          <div className="mt-4 grid gap-3">
            <Condition icon={Thermometer} label="Ambient Temperature" value={`${site.ambientTempC} C`} />
            <Condition icon={Thermometer} label="Panel Temperature" value={`${site.panelTempC} C`} />
            <Condition icon={Droplets} label="Humidity" value={`${site.humidityPct}%`} />
            <Condition icon={CloudSun} label="Irradiance" value={`${site.irradianceWm2} W/m2`} />
            <Condition icon={Wind} label="Wind Speed" value={`${site.windKph} kph`} />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(320px,0.8fr)_minmax(0,1.4fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-slate-950">Cleaning Status</h2>
          <div className="mt-4 space-y-3">
            <Condition icon={Bot} label="Last Cleaning" value={site.lastCleaning} />
            <Condition icon={Bot} label="Next Scheduled Cleaning" value={site.nextCleaning} />
            <Condition icon={Bot} label="Robot State" value={site.robotState} />
            <Condition icon={Droplets} label="Water Tank" value={`${site.waterTankPct}%`} />
            <div>
              <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700">
                <span>Current Cleaning Progress</span>
                <span>{site.cleaningProgressPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${site.cleaningProgressPct}%` }} />
              </div>
            </div>
          </div>
        </section>

        <ChartCard title="Recent Alerts">
          <DataTable
            columns={alertColumns}
            data={siteAlerts}
            getRowKey={(row) => row.id}
            emptyTitle="No recent alerts"
            emptyDescription="This site has no active alert history in the current demo state."
          />
        </ChartCard>
      </div>

      <div className="mt-6">
        <ChartCard title="Devices">
          <DataTable columns={deviceColumns} data={siteDevices} getRowKey={(row) => row.id} />
        </ChartCard>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
      <Icon className="h-5 w-5 text-blue-600" />
      <p className="mt-3 text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </article>
  );
}

function Condition({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3 text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        <Icon className="h-4 w-4 text-blue-600" />
        {label}
      </span>
      <span className="text-right font-bold text-slate-950">{value}</span>
    </div>
  );
}
