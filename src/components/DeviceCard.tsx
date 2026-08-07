import { Battery, RadioTower, Router } from "lucide-react";
import type { Device } from "../types/device";
import { StatusBadge } from "./StatusBadge";

export function DeviceCard({ device }: { device: Device }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{device.id}</h3>
          <p className="mt-1 text-sm text-slate-500">{device.type}</p>
        </div>
        <StatusBadge status={device.status} />
      </div>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Router className="h-4 w-4 text-blue-600" />
          {device.siteName}
        </p>
        <p className="flex items-center gap-2">
          <Battery className="h-4 w-4 text-emerald-600" />
          Battery: {device.batteryPct === null ? "Line powered" : `${device.batteryPct}%`}
        </p>
        <p className="flex items-center gap-2">
          <RadioTower className="h-4 w-4 text-slate-500" />
          Signal: {device.signalStrengthPct}%
        </p>
      </div>
    </article>
  );
}
