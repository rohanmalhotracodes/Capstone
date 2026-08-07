import { AlertCircle, CheckCircle2, Info, X, Zap } from "lucide-react";
import { useToast, type ToastKind } from "../hooks/useToast";

const iconForKind = {
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
  error: Zap
};

const classesForKind: Record<ToastKind, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  info: "border-blue-200 bg-blue-50 text-blue-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-red-200 bg-red-50 text-red-800"
};

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
      {toasts.map((toast) => {
        const Icon = iconForKind[toast.kind];
        return (
          <div key={toast.id} className={`rounded-lg border p-4 shadow-card ${classesForKind[toast.kind]}`}>
            <div className="flex items-start gap-3">
              <Icon className="mt-0.5 h-5 w-5 flex-none" />
              <div className="min-w-0 flex-1">
                <p className="font-bold">{toast.title}</p>
                {toast.message ? <p className="mt-1 text-sm opacity-90">{toast.message}</p> : null}
              </div>
              <button
                type="button"
                aria-label="Dismiss notification"
                onClick={() => removeToast(toast.id)}
                className="rounded-lg p-1 hover:bg-white/70"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
