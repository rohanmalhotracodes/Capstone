import { AlertTriangle, Power, RotateCcw, ShieldAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { ConfirmModal } from "../components/ConfirmModal";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { StatusBadge } from "../components/StatusBadge";
import { useSolarData } from "../hooks/useSolarData";

export function EmergencyStopPage() {
  const { loading, sites, robots, alerts, emergencyStopRobot, resumeEmergencyRobot } = useSolarData();
  const [siteId, setSiteId] = useState("gamma");
  const [robotId, setRobotId] = useState("SWEEPER-01");
  const [confirmStop, setConfirmStop] = useState(false);
  const [confirmResume, setConfirmResume] = useState(false);

  const siteRobots = useMemo(() => robots.filter((robot) => robot.currentSiteId === siteId), [robots, siteId]);
  const selectedRobot = robots.find((robot) => robot.id === robotId) ?? siteRobots[0] ?? robots[0];
  const criticalAlerts = alerts.filter((alert) => alert.severity === "Critical").slice(0, 4);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Emergency Stop"
        description="Emergency control is intentionally confirmation-based and updates robot status, alerts, and activity history in the demo state."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <section className="rounded-lg border border-red-200 bg-white p-5 shadow-card">
          <div className="flex items-start gap-3 rounded-lg bg-red-50 p-4 text-red-800">
            <ShieldAlert className="h-7 w-7 flex-none" />
            <div>
              <h2 className="text-lg font-bold">Emergency Control</h2>
              <p className="mt-1 text-sm leading-6">
                Stopping a robot immediately halts the selected cleaning operation and generates a critical event.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Solar Site</span>
              <select
                value={siteId}
                onChange={(event) => {
                  const nextSiteId = event.target.value;
                  setSiteId(nextSiteId);
                  const firstRobot = robots.find((robot) => robot.currentSiteId === nextSiteId);
                  if (firstRobot) {
                    setRobotId(firstRobot.id);
                  }
                }}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Cleaning Robot / Device</span>
              <select
                value={selectedRobot?.id ?? ""}
                onChange={(event) => setRobotId(event.target.value)}
                className="mt-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                {siteRobots.map((robot) => (
                  <option key={robot.id} value={robot.id}>
                    {robot.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {selectedRobot ? (
            <div className="mt-6 rounded-lg border border-slate-200 p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-950">{selectedRobot.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{selectedRobot.currentSite}</p>
                </div>
                <StatusBadge status={selectedRobot.status} />
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <Metric label="Battery" value={`${selectedRobot.batteryPct}%`} />
                <Metric label="Water Tank" value={`${selectedRobot.waterTankPct}%`} />
                <Metric label="Current Section" value={selectedRobot.section} />
              </div>
            </div>
          ) : null}

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              disabled={!selectedRobot || selectedRobot.status === "Emergency Stopped"}
              onClick={() => setConfirmStop(true)}
              className="inline-flex items-center justify-center gap-3 rounded-lg bg-red-600 px-6 py-5 text-base font-black text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <Power className="h-6 w-6" />
              EMERGENCY STOP
            </button>
            <button
              type="button"
              disabled={!selectedRobot || selectedRobot.status !== "Emergency Stopped"}
              onClick={() => setConfirmResume(true)}
              className="inline-flex items-center justify-center gap-3 rounded-lg border border-slate-200 px-6 py-5 text-base font-bold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              <RotateCcw className="h-6 w-6" />
              Resume Operation
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-950">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Critical Events
          </h2>
          <div className="mt-4 space-y-3">
            {criticalAlerts.map((alert) => (
              <div key={alert.id} className="rounded-lg border border-red-100 bg-red-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-bold text-red-900">{alert.device}</p>
                  <StatusBadge status={alert.status} />
                </div>
                <p className="mt-2 text-sm leading-6 text-red-800">{alert.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <ConfirmModal
        open={confirmStop}
        tone="danger"
        title="Confirm Emergency Stop"
        message="Are you sure you want to trigger Emergency Stop for this device? This will immediately stop the selected cleaning operation."
        confirmLabel="Trigger Emergency Stop"
        onClose={() => setConfirmStop(false)}
        onConfirm={() => {
          if (selectedRobot) {
            emergencyStopRobot(selectedRobot.id);
          }
          setConfirmStop(false);
        }}
      />
      <ConfirmModal
        open={confirmResume}
        tone="success"
        title="Resume Operation"
        message="Confirm that the site is safe and the selected device can return to normal operation."
        confirmLabel="Resume Operation"
        onClose={() => setConfirmResume(false)}
        onConfirm={() => {
          if (selectedRobot) {
            resumeEmergencyRobot(selectedRobot.id);
          }
          setConfirmResume(false);
        }}
      />
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  );
}
