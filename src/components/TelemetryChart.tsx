import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TelemetryHistoryPoint } from "../types/telemetry";

interface TelemetryChartProps {
  data: TelemetryHistoryPoint[];
}

const charts = [
  { key: "voltage", title: "Voltage", color: "#2563eb", unit: "V" },
  { key: "current", title: "Current", color: "#059669", unit: "A" },
  { key: "powerKw", title: "Power", color: "#7c3aed", unit: "kW" },
  { key: "panelTempC", title: "Temperature", color: "#dc2626", unit: "C" },
  { key: "powerLossPct", title: "Power Loss", color: "#d97706", unit: "%" }
] as const;

export function TelemetryChart({ data }: TelemetryChartProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {charts.map((chart) => (
        <section key={chart.key} className="rounded-lg border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">{chart.title}</h3>
            <span className="text-xs font-semibold text-slate-500">Last 60 min</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <XAxis dataKey="time" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => [`${value} ${chart.unit}`, chart.title]} />
                <Line type="monotone" dataKey={chart.key} stroke={chart.color} strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      ))}
    </div>
  );
}
