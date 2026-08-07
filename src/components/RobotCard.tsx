import { Home, Pause, Play, RotateCcw } from "lucide-react";
import type { CleaningRobot } from "../types/robot";
import { StatusBadge } from "./StatusBadge";

interface RobotCardProps {
  robot: CleaningRobot;
  onStart: (robotId: string) => void;
  onPause: (robotId: string) => void;
  onResume: (robotId: string) => void;
  onReturn: (robotId: string) => void;
}

export function RobotCard({ robot, onStart, onPause, onResume, onReturn }: RobotCardProps) {
  const disabled = robot.status === "Emergency Stopped" || robot.status === "Maintenance";

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-bold text-slate-950">{robot.name}</h3>
          <p className="mt-1 text-sm text-slate-500">{robot.currentSite}</p>
        </div>
        <StatusBadge status={robot.status} />
      </div>
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <Metric label="Battery" value={`${robot.batteryPct}%`} />
        <Metric label="Water" value={`${robot.waterTankPct}%`} />
        <Metric label="Section" value={robot.section} />
        <Metric label="Progress" value={`${robot.progressPct}%`} />
      </div>
      <div className="mt-4 h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-blue-600" style={{ width: `${robot.progressPct}%` }} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onStart(robot.id)}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          <Play className="h-4 w-4" />
          Start Cleaning
        </button>
        <button
          type="button"
          disabled={robot.status !== "Cleaning"}
          onClick={() => onPause(robot.id)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <Pause className="h-4 w-4" />
          Pause
        </button>
        <button
          type="button"
          disabled={robot.status !== "Paused"}
          onClick={() => onResume(robot.id)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <RotateCcw className="h-4 w-4" />
          Resume
        </button>
        <button
          type="button"
          disabled={disabled}
          onClick={() => onReturn(robot.id)}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
        >
          <Home className="h-4 w-4" />
          Return to Base
        </button>
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 truncate font-bold text-slate-900">{value}</p>
    </div>
  );
}
