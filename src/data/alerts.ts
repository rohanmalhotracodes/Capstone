import type { SolarAlert } from "../types/alert";

export const alerts: SolarAlert[] = [
  {
    id: "ALT-1007",
    timestamp: "Aug 7, 2026, 12:42 PM",
    siteId: "gamma",
    site: "Solar Site Gamma",
    device: "MTR-027",
    type: "Power Loss Detected",
    message: "Actual generation is 21.2% below irradiance-adjusted expected output.",
    severity: "High",
    status: "New"
  },
  {
    id: "ALT-1006",
    timestamp: "Aug 7, 2026, 12:20 PM",
    siteId: "gamma",
    site: "Solar Site Gamma",
    device: "SWEEPER-07",
    type: "Low Water Tank",
    message: "Water tank below 45% while cleaning is paused on row G-15.",
    severity: "Medium",
    status: "Acknowledged"
  },
  {
    id: "ALT-1005",
    timestamp: "Aug 7, 2026, 11:58 AM",
    siteId: "delta",
    site: "Solar Site Delta",
    device: "TEMP-017",
    type: "High Panel Temperature",
    message: "Panel temperature reached 58 C during peak irradiance.",
    severity: "Medium",
    status: "New"
  },
  {
    id: "ALT-1004",
    timestamp: "Aug 7, 2026, 11:32 AM",
    siteId: "zeta",
    site: "Solar Site Zeta",
    device: "ESP-044",
    type: "Communication Lost",
    message: "ESP32 controller has not reported telemetry for 28 minutes.",
    severity: "Critical",
    status: "New"
  },
  {
    id: "ALT-1003",
    timestamp: "Aug 7, 2026, 10:44 AM",
    siteId: "gamma",
    site: "Solar Site Gamma",
    device: "IRR-011",
    type: "Cleaning Required",
    message: "High irradiance and declining efficiency indicate possible dust accumulation.",
    severity: "High",
    status: "Acknowledged"
  },
  {
    id: "ALT-1002",
    timestamp: "Aug 7, 2026, 9:18 AM",
    siteId: "epsilon",
    site: "Solar Site Epsilon",
    device: "IRR-014",
    type: "Irradiance Sensor Error",
    message: "Irradiance values were outside expected calibration bounds for 4 samples.",
    severity: "Low",
    status: "Resolved"
  },
  {
    id: "ALT-1001",
    timestamp: "Aug 6, 2026, 5:34 PM",
    siteId: "alpha",
    site: "Solar Site Alpha",
    device: "SWEEPER-05",
    type: "Low Robot Battery",
    message: "Sweeper-05 returned to base with 18% battery after cleaning cycle.",
    severity: "Low",
    status: "Resolved"
  }
];
