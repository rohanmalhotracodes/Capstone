interface LiveIndicatorProps {
  live: boolean;
  label?: string;
}

export function LiveIndicator({ live, label = live ? "Live" : "Disconnected" }: LiveIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm">
      <span className={`h-2.5 w-2.5 rounded-full ${live ? "bg-emerald-500" : "bg-red-500"}`} />
      {label}
    </span>
  );
}
