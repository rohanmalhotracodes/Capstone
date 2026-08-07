import { CloudRain, CloudSun, Droplets, Gauge, Wind } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WeatherSnapshot } from "../types/weather";

export function WeatherCard({ weather }: { weather: WeatherSnapshot }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{weather.site}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <CloudSun className="h-4 w-4 text-blue-600" />
            {weather.condition}
          </p>
        </div>
        <p className="text-3xl font-bold text-slate-950">{weather.temperatureC}C</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <WeatherMetric icon={Droplets} label="Humidity" value={`${weather.humidityPct}%`} />
        <WeatherMetric icon={Wind} label="Wind" value={`${weather.windKph} kph`} />
        <WeatherMetric icon={CloudRain} label="Rain Chance" value={`${weather.precipitationChancePct}%`} />
        <WeatherMetric icon={Gauge} label="Irradiance" value={`${weather.irradianceWm2} W/m2`} />
      </div>
      <p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm leading-6 text-blue-800">{weather.recommendation}</p>
    </article>
  );
}

function WeatherMetric({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase text-slate-500">
        <Icon className="h-4 w-4" />
        {label}
      </p>
      <p className="mt-1 font-bold text-slate-900">{value}</p>
    </div>
  );
}
