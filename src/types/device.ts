export type DeviceType =
  | "ESP32 Controller"
  | "Energy Meter"
  | "Temperature Sensor"
  | "Irradiance Sensor"
  | "Solar Sweeper Robot";

export type DeviceStatus = "Online" | "Offline" | "Warning" | "Cleaning" | "Emergency Stopped";

export interface Device {
  id: string;
  siteId: string;
  siteName: string;
  type: DeviceType;
  status: DeviceStatus;
  lastSeen: string;
  firmwareVersion: string;
  batteryPct: number | null;
  signalStrengthPct: number;
  notes: string;
}
