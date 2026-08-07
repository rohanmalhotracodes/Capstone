import { Bot, Droplets, Gauge, PanelsTopLeft, Play, Waves, Zap } from "lucide-react";
import { useMemo } from "react";
import { DataTable, type DataTableColumn } from "../components/DataTable";
import { LoadingSkeleton } from "../components/LoadingSkeleton";
import { PageHeader } from "../components/PageHeader";
import { RobotCard } from "../components/RobotCard";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { useSolarData } from "../hooks/useSolarData";
import type { CleaningHistoryEntry } from "../types/robot";

export function CleaningPage() {
  const { loading, robots, cleaningHistory, startRobot, pauseRobot, resumeRobot, returnRobot } = useSolarData();

  const metrics = useMemo(() => {
    const available = robots.filter((robot) => robot.status === "Idle").length;
    const cleaning = robots.filter((robot) => robot.status === "Cleaning").length;
    const completedToday = cleaningHistory.filter((entry) => entry.date.includes("Aug 7")).length;
    const waterUsed = cleaningHistory.reduce((total, entry) => total + entry.waterUsedL, 0);
    const recovered = cleaningHistory.reduce((total, entry) => total + entry.estimatedPowerRecoveryKw, 0);
    return { available, cleaning, completedToday, waterUsed, recovered };
  }, [cleaningHistory, robots]);

  const columns: DataTableColumn<CleaningHistoryEntry>[] = [
    { header: "Date", accessor: "date" },
    { header: "Site", accessor: "site" },
    { header: "Robot", accessor: "robot" },
    { header: "Duration", accessor: "duration" },
    { header: "Panels Cleaned", render: (row) => row.panelsCleaned.toLocaleString() },
    { header: "Water Used", render: (row) => `${row.waterUsedL} L` },
    { header: "Estimated Power Recovery", render: (row) => `${row.estimatedPowerRecoveryKw} kW` },
    { header: "Status", render: (row) => <StatusBadge status={row.status} /> }
  ];

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      <PageHeader
        title="Cleaning Operations"
        description="Autonomous cleaning controls for Solar Sweeper robots, water usage, cleaning progress, and recovery estimates."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Robots Available" value={String(metrics.available)} subtitle="Ready to dispatch" trend="Docked" icon={Bot} tone="green" />
        <StatCard title="Robots Cleaning" value={String(metrics.cleaning)} subtitle="Active cleaning runs" trend="Live progress" icon={Play} tone="blue" />
        <StatCard title="Completed Today" value={String(metrics.completedToday)} subtitle="Cleaning cycles" trend="+2 vs yesterday" icon={PanelsTopLeft} tone="green" />
        <StatCard title="Water Used Today" value={`${metrics.waterUsed} L`} subtitle="Across active sites" trend="Optimized spray" icon={Waves} tone="blue" />
        <StatCard title="Power Recovered" value={`${metrics.recovered} kW`} subtitle="Estimated after cleaning" trend="Recovered output" icon={Zap} tone="amber" />
      </div>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {robots.map((robot) => (
          <RobotCard
            key={robot.id}
            robot={robot}
            onStart={startRobot}
            onPause={pauseRobot}
            onResume={resumeRobot}
            onReturn={returnRobot}
          />
        ))}
      </div>

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-5 shadow-card">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-950">Cleaning History</h2>
            <p className="mt-1 text-sm text-slate-500">Completed and interrupted cleaning cycles with estimated energy recovery.</p>
          </div>
          <div className="flex gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-700">
              <Droplets className="h-4 w-4 text-blue-600" />
              Water efficient mode
            </span>
            <span className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 font-semibold text-slate-700">
              <Gauge className="h-4 w-4 text-emerald-600" />
              Recovery tracked
            </span>
          </div>
        </div>
        <DataTable columns={columns} data={cleaningHistory} getRowKey={(row) => row.id} />
      </section>
    </div>
  );
}
