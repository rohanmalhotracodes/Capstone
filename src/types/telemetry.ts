export type TelemetryStatus = "Normal" | "Warning" | "Critical" | "Offline" | "Cleaning";

export interface TelemetryReading {
  id: string;
  timestamp: string;
  siteId: string;
  site: string;
  device: string;
  voltage: number;
  current: number;
  powerKw: number;
  expectedPowerKw: number;
  panelTempC: number;
  ambientTempC: number;
  irradianceWm2: number;
  efficiencyPct: number;
  powerLossPct: number;
  status: TelemetryStatus;
}

export interface TelemetryHistoryPoint {
  time: string;
  voltage: number;
  current: number;
  powerKw: number;
  panelTempC: number;
  powerLossPct: number;
}
