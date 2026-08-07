export type SiteHealth = "Normal" | "Power Loss" | "Cleaning" | "Offline" | "Warning";

export interface SolarSite {
  id: string;
  name: string;
  shortName: string;
  location: string;
  capacityMw: number;
  panels: number;
  onlineDevices: number;
  totalDevices: number;
  currentProductionMw: number;
  expectedProductionMw: number;
  powerLossPct: number;
  cleaningStatus: string;
  weatherCondition: string;
  health: SiteHealth;
  ambientTempC: number;
  panelTempC: number;
  humidityPct: number;
  irradianceWm2: number;
  windKph: number;
  lastCleaning: string;
  nextCleaning: string;
  robotState: string;
  waterTankPct: number;
  cleaningProgressPct: number;
}

export interface PortfolioSummary {
  totalSites: number;
  activeDevices: number;
  currentPowerMw: number;
  estimatedPowerLossPct: number;
  activeAlerts: number;
  cleaningRobotsActive: number;
}
