import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
  icon: LucideIcon;
  tone?: "blue" | "green" | "amber" | "red" | "slate";
}

const toneClasses = {
  blue: "bg-blue-50 text-blue-700",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-slate-100 text-slate-700"
};

export function StatCard({ title, value, subtitle, trend, icon: Icon, tone = "blue" }: StatCardProps) {
  return (
    <article className="flex min-h-44 flex-col rounded-lg border border-slate-200 bg-white p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="break-words text-sm font-medium leading-5 text-slate-500">{title}</p>
          <p className="mt-2 break-words text-2xl font-bold leading-tight text-slate-950">{value}</p>
        </div>
        <span className={`flex-none rounded-lg p-2.5 ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-auto space-y-1.5 pt-4 text-sm">
        <p className="break-words font-semibold leading-5 text-slate-700">{trend}</p>
        <p className="break-words leading-5 text-slate-500">{subtitle}</p>
      </div>
    </article>
  );
}
