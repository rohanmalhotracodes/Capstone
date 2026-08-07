import type { AlertSeverity } from "../types/alert";
import { StatusBadge } from "./StatusBadge";

export function AlertBadge({ severity }: { severity: AlertSeverity }) {
  return <StatusBadge status={severity} />;
}
