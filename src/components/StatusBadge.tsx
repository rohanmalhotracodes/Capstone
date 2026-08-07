interface StatusBadgeProps {
  status: string;
  className?: string;
}

function classesForStatus(status: string): string {
  const value = status.toLowerCase();

  if (value.includes("critical") || value.includes("emergency") || value.includes("offline") || value.includes("high")) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (value.includes("warning") || value.includes("loss") || value.includes("paused") || value.includes("medium")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value.includes("cleaning") || value.includes("acknowledged") || value.includes("returning") || value.includes("info")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }

  if (value.includes("resolved") || value.includes("online") || value.includes("normal") || value.includes("completed")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${classesForStatus(
        status
      )} ${className}`}
    >
      {status}
    </span>
  );
}
