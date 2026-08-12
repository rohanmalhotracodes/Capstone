import {
  AlertTriangle,
  BatteryCharging,
  Bot,
  Building2,
  CircleGauge,
  Gauge,
  PanelsTopLeft,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { Drawer } from "../components/Drawer";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { generateGenerationSeries, type Timeframe } from "../data/generation";
import { useSolarData } from "../hooks/useSolarData";
import type { SolarSite } from "../types/site";
import { formatMw, formatPercent } from "../utils/format";

const timeframeOptions: Timeframe[] = ["Today", "7 Days", "30 Days"];

export function OverviewPage() {
  const { loading, summary, sites, activities } = useSolarData();
  const [timeframe, setTimeframe] = useState<Timeframe>("Today");
  const [selectedSite, setSelectedSite] = useState<SolarSite | null>(null);
  const generationData = useMemo(() => generateGenerationSeries(timeframe), [timeframe]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Solar Sweeper"
        description="Autonomous Solar Panel Monitoring & Cleaning Platform"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard
          title="Total Solar Sites"
          value={String(summary.totalSites)}
          subtitle="North region portfolio"
          trend="+2 commissioned"
          icon={Building2}
          tone="blue"
        />
        <StatCard
          title="Active Devices"
          value={String(summary.activeDevices)}
          subtitle="ESP32, sensors, meters"
          trend="97.4% online"
          icon={BatteryCharging}
          tone="green"
        />
        <StatCard
          title="Current Power Generation"
          value={formatMw(summary.currentPowerMw)}
          subtitle="Across monitored sites"
          trend="+4.8% vs hour ago"
          icon={Zap}
          tone="blue"
        />
        <StatCard
          title="Estimated Power Loss"
          value={formatPercent(summary.estimatedPowerLossPct)}
          subtitle="Soiling-adjusted"
          trend="Cleaning recommended"
          icon={CircleGauge}
          tone="amber"
        />
        <StatCard
          title="Active Alerts"
          value={String(summary.activeAlerts)}
          subtitle="Unresolved events"
          trend="2 high severity"
          icon={AlertTriangle}
          tone={summary.activeAlerts > 0 ? "red" : "green"}
        />
        <StatCard
          title="Cleaning Robots Active"
          value={String(summary.cleaningRobotsActive)}
          subtitle="Autonomous sweepers"
          trend="3 rows in progress"
          icon={Bot}
          tone="green"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(320px,0.9fr)]">
        <ChartCard
          title="Power Generation vs Expected Generation"
          description="Expected generation follows irradiance and time-of-day; actual generation reflects soiling losses."
          actions={
            <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
              {timeframeOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setTimeframe(option)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold ${
                    timeframe === option ? "bg-blue-600 text-white shadow-sm" : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          }
        >
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={generationData} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="power" tick={{ fontSize: 12 }} />
                <YAxis yAxisId="loss" orientation="right" tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value, name) => [
                    name === "lossPct"
                      ? `${Number(value).toFixed(1)}%`
                      : `${Number(value).toFixed(2)} ${timeframe === "Today" ? "MW" : "MWh"}`,
                    name === "actualPower" ? "Actual Power" : name === "expectedPower" ? "Expected Power" : "Power Loss"
                  ]}
                  labelFormatter={(label) => `Time: ${label}`}
                />
                <Legend />
                <Line yAxisId="power" type="monotone" dataKey="expectedPower" name="Expected Power" stroke="#0f766e" strokeWidth={3} dot={false} />
                <Line yAxisId="power" type="monotone" dataKey="actualPower" name="Actual Power" stroke="#2563eb" strokeWidth={3} dot={false} />
                <Area yAxisId="loss" type="monotone" dataKey="lossPct" name="Power Loss" stroke="#d97706" fill="#fef3c7" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-950">Estimated Soiling Loss</h2>
              <p className="mt-1 text-sm text-slate-500">Recoverable output from cleaning action</p>
            </div>
            <StatusBadge status="Cleaning Recommended" />
          </div>
          <div className="mt-6 flex flex-col items-center">
            <div
              className="flex h-44 w-44 items-center justify-center rounded-full"
              style={{
                background: `conic-gradient(#d97706 ${summary.estimatedPowerLossPct * 3.6}deg, #e2e8f0 0deg)`
              }}
            >
              <div className="flex h-32 w-32 flex-col items-center justify-center rounded-full bg-white shadow-inner">
                <span className="text-3xl font-bold text-slate-950">{formatPercent(summary.estimatedPowerLossPct)}</span>
                <span className="text-xs font-semibold uppercase text-slate-500">Soiling Loss</span>
              </div>
            </div>
          </div>
          <div className="mt-6 grid gap-3 text-sm">
            <GaugeMetric label="Recoverable Power" value="356 kW" />
            <GaugeMetric label="Last Cleaned" value="3 days ago" />
            <GaugeMetric label="Next Recommended" value="Within 24 hours" />
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.8fr)]">
        <ChartCard title="Solar Site Status" description="Click a site to inspect live operating status.">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {sites.map((site) => (
              <button
                key={site.id}
                type="button"
                onClick={() => setSelectedSite(site)}
                className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{site.shortName}</p>
                    <p className="mt-1 text-sm text-slate-500">{site.name}</p>
                  </div>
                  <StatusBadge status={site.health} />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white">
                  <div
                    className={`h-2 rounded-full ${
                      site.health === "Power Loss"
                        ? "bg-amber-500"
                        : site.health === "Offline"
                          ? "bg-red-500"
                          : site.health === "Cleaning"
                            ? "bg-blue-500"
                            : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.max(8, 100 - site.powerLossPct)}%` }}
                  />
                </div>
                <p className="mt-3 flex items-center justify-between text-sm text-slate-600">
                  Loss <span className="font-bold">{formatPercent(site.powerLossPct)}</span>
                </p>
              </button>
            ))}
          </div>
        </ChartCard>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="text-base font-bold text-slate-950">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 rounded-full ${
                    activity.tone === "critical"
                      ? "bg-red-500"
                      : activity.tone === "warning"
                        ? "bg-amber-500"
                        : activity.tone === "success"
                          ? "bg-emerald-500"
                          : "bg-blue-500"
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-slate-800">{activity.message}</p>
                  <p className="mt-1 text-xs text-slate-500">{activity.timestamp}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Drawer open={Boolean(selectedSite)} title={selectedSite?.name ?? "Site Detail"} onClose={() => setSelectedSite(null)}>
        {selectedSite ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <GaugeMetric label="Location" value={selectedSite.location} />
              <GaugeMetric label="Current Production" value={formatMw(selectedSite.currentProductionMw)} />
              <GaugeMetric label="Expected Production" value={formatMw(selectedSite.expectedProductionMw)} />
              <GaugeMetric label="Power Loss" value={formatPercent(selectedSite.powerLossPct)} />
              <GaugeMetric label="Panels" value={selectedSite.panels.toLocaleString()} />
              <GaugeMetric label="Robot State" value={selectedSite.robotState} />
            </div>
            <div className="rounded-lg border border-slate-200 p-4">
              <div className="mb-3 flex items-center gap-2 font-bold text-slate-900">
                <PanelsTopLeft className="h-5 w-5 text-blue-600" />
                Cleaning Status
              </div>
              <p className="text-sm leading-6 text-slate-600">
                {selectedSite.cleaningStatus}. Last cleaned {selectedSite.lastCleaning}; next cleaning {selectedSite.nextCleaning}.
              </p>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}

function GaugeMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-right text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}
