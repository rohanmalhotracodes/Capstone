import { CloudSun, Droplets, Gauge, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { WeatherCard } from "../components/WeatherCard";
import { useSolarData } from "../hooks/useSolarData";

export function WeatherPage() {
  const { loading, weather } = useSolarData();
  const [selectedSiteId, setSelectedSiteId] = useState("gamma");
  const selectedWeather = useMemo(
    () => weather.find((snapshot) => snapshot.siteId === selectedSiteId) ?? weather[0],
    [selectedSiteId, weather]
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Weather"
        description="Site weather view connecting cloud cover, precipitation probability, wind, irradiance, and cleaning recommendations."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {weather.map((snapshot) => (
          <button key={snapshot.siteId} type="button" onClick={() => setSelectedSiteId(snapshot.siteId)} className="text-left">
            <WeatherCard weather={snapshot} />
          </button>
        ))}
      </div>

      {selectedWeather ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)]">
          <ChartCard
            title="7-Day Forecast"
            description={`${selectedWeather.site} forecast with cloud cover, rain probability, and solar irradiance estimate.`}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedWeather.forecast} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="irradianceWm2" name="Irradiance W/m2" stroke="#2563eb" strokeWidth={3} />
                  <Line type="monotone" dataKey="cloudCoverPct" name="Cloud Cover %" stroke="#64748b" strokeWidth={2} />
                  <Line type="monotone" dataKey="precipitationChancePct" name="Rain Chance %" stroke="#0f766e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="rounded-lg bg-amber-50 p-3 text-amber-700">
                <Sparkles className="h-6 w-6" />
              </span>
              <div>
                <h2 className="text-base font-bold text-slate-950">Cleaning Recommendation</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{selectedWeather.recommendation}</p>
              </div>
            </div>
            <div className="mt-5 grid gap-3">
              <WeatherMetric icon={CloudSun} label="Condition" value={selectedWeather.condition} />
              <WeatherMetric icon={Droplets} label="Humidity" value={`${selectedWeather.humidityPct}%`} />
              <WeatherMetric icon={Gauge} label="Solar Irradiance" value={`${selectedWeather.irradianceWm2} W/m2`} />
            </div>
            <div className="mt-5 h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedWeather.forecast}>
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="precipitationChancePct" name="Rain Chance %" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function WeatherMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
      <span className="flex items-center gap-2 text-slate-600">
        <Icon className="h-4 w-4 text-blue-600" />
        {label}
      </span>
      <span className="text-right font-bold text-slate-950">{value}</span>
    </div>
  );
}
