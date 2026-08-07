export type RobotStatus = "Idle" | "Cleaning" | "Paused" | "Returning" | "Emergency Stopped" | "Maintenance";

export interface CleaningRobot {
  id: string;
  name: string;
  currentSiteId: string;
  currentSite: string;
  status: RobotStatus;
  batteryPct: number;
  waterTankPct: number;
  progressPct: number;
  section: string;
}

export interface CleaningHistoryEntry {
  id: string;
  date: string;
  site: string;
  robot: string;
  duration: string;
  panelsCleaned: number;
  waterUsedL: number;
  estimatedPowerRecoveryKw: number;
  status: "Completed" | "Interrupted" | "Scheduled";
}
