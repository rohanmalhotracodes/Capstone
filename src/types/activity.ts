export type ActivityTone = "info" | "success" | "warning" | "critical";

export interface ActivityEntry {
  id: string;
  timestamp: string;
  message: string;
  tone: ActivityTone;
}
