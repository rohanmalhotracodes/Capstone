import { BatteryCharging, CloudSun, MapPin, PanelsTopLeft } from "lucide-react";
import type { SolarSite } from "../types/site";
import { formatMw, formatPercent } from "../utils/format";
import { StatusBadge } from "./StatusBadge";

export function SiteCard({ site }: { site: SolarSite }) {
  return (
    <article className="h-full rounded-lg border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{site.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
            <MapPin className="h-4 w-4" />
            {site.location}
          </p>
        </div>
        <StatusBadge status={site.health} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-slate-500">Capacity</p>
          <p className="mt-1 font-bold text-slate-900">{formatMw(site.capacityMw)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="text-slate-500">Production</p>
          <p className="mt-1 font-bold text-slate-900">{formatMw(site.currentProductionMw)}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-slate-500">
            <PanelsTopLeft className="h-4 w-4" />
            Panels
          </p>
          <p className="mt-1 font-bold text-slate-900">{site.panels.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-slate-50 p-3">
          <p className="flex items-center gap-1 text-slate-500">
            <BatteryCharging className="h-4 w-4" />
            Devices
          </p>
          <p className="mt-1 font-bold text-slate-900">
            {site.onlineDevices}/{site.totalDevices}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm">
        <span className="flex items-center gap-1.5 text-slate-600">
          <CloudSun className="h-4 w-4 text-blue-600" />
          {site.weatherCondition}
        </span>
        <span className="font-bold text-amber-700">Loss {formatPercent(site.powerLossPct)}</span>
      </div>
      <p className="mt-3 text-sm text-slate-500">{site.cleaningStatus}</p>
    </article>
  );
}
