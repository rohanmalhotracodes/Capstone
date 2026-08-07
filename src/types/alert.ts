export type AlertType =
  | "Power Loss Detected"
  | "High Panel Temperature"
  | "Device Offline"
  | "Irradiance Sensor Error"
  | "Communication Lost"
  | "Cleaning Required"
  | "Low Robot Battery"
  | "Low Water Tank"
  | "Emergency Stop";

export type AlertSeverity = "Critical" | "High" | "Medium" | "Low";
export type AlertStatus = "New" | "Acknowledged" | "Resolved";

export interface SolarAlert {
  id: string;
  timestamp: string;
  siteId: string;
  site: string;
  device: string;
  type: AlertType;
  message: string;
  severity: AlertSeverity;
  status: AlertStatus;
}
