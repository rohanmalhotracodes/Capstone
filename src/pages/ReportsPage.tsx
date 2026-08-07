import { CalendarDays, Download, FileText, Gauge, PanelsTopLeft, Recycle, Waves, Zap } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChartCard } from "../components/ChartCard";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { cleaningImpact, dailyEnergyData, generateGenerationSeries, powerLossTrend } from "../data/generation";
import { useSolarData } from "../hooks/useSolarData";
import { useToast } from "../hooks/useToast";
import { exportCsv } from "../utils/csv";

export function ReportsPage() {
  const { loading } = useSolarData();
  const { addToast } = useToast();
  const [fromDate, setFromDate] = useState("2026-08-01");
  const [toDate, setToDate] = useState("2026-08-07");
  const comparisonData = generateGenerationSeries("7 Days");

  function handleExport() {
    exportCsv(
      "solar-sweeper-report.csv",
      dailyEnergyData.map((row) => ({
        label: row.label,
        generated: row.generated,
        expected: row.expected,
        lost: row.lost
      }))
    );
    addToast("CSV exported", "Report data exported for the selected date range.", "success");
  }

  function handlePdf() {
    addToast("Report generation initiated", "A backend PDF service would prepare the report package.", "info");
  }

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Energy performance, estimated losses, cleaning impact, water consumption, and recovery reporting for capstone review."
        actions={
          <>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <input type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} className="outline-none" />
            </label>
            <label className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <input type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} className="outline-none" />
            </label>
            <button
              type="button"
              disabled={loading}
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              type="button"
              onClick={handlePdf}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="h-4 w-4" />
              Generate PDF
            </button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        <StatCard title="Average Efficiency" value="88.7%" subtitle={`${fromDate} to ${toDate}`} trend="+6.1% after cleaning" icon={Gauge} tone="green" />
        <StatCard title="Total Energy Generated" value="140.3 MWh" subtitle="Selected period" trend="+4.8%" icon={Zap} tone="blue" />
        <StatCard title="Estimated Energy Lost" value="16.5 MWh" subtitle="Soiling and outages" trend="-3.2 MWh after cleaning" icon={PanelsTopLeft} tone="amber" />
        <StatCard title="Energy Recovered" value="9.8 MWh" subtitle="After cleaning cycles" trend="Recovered output" icon={Recycle} tone="green" />
        <StatCard title="Cleaning Cycles" value="42" subtitle="Completed runs" trend="7 active robots" icon={FileText} tone="blue" />
        <StatCard title="Water Consumption" value="4,280 L" subtitle="Optimized spray usage" trend="102 L average" icon={Waves} tone="slate" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ChartCard title="Daily Energy Generation">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyEnergyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="generated" name="Generated MWh" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="lost" name="Lost MWh" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Actual vs Expected Generation">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="expectedPower" name="Expected MWh" stroke="#059669" strokeWidth={3} />
                <Line type="monotone" dataKey="actualPower" name="Actual MWh" stroke="#2563eb" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Power Loss Trend">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={powerLossTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                <Line type="monotone" dataKey="loss" name="Power Loss %" stroke="#d97706" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Cleaning Impact" description="Efficiency comparison before and after a Solar Sweeper run.">
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cleaningImpact}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                  <Bar dataKey="efficiency" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid content-center gap-3">
              <ImpactMetric label="Before Cleaning Efficiency" value="78%" />
              <ImpactMetric label="After Cleaning Efficiency" value="92%" />
              <ImpactMetric label="Estimated Recovery" value="+14 percentage points" />
            </div>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}

function ImpactMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}
