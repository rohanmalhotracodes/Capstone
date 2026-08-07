import type { CleaningHistoryEntry, CleaningRobot } from "../types/robot";

export const robots: CleaningRobot[] = [
  {
    id: "SWEEPER-01",
    name: "Sweeper-01",
    currentSiteId: "gamma",
    currentSite: "Solar Site Gamma",
    status: "Cleaning",
    batteryPct: 78,
    waterTankPct: 64,
    progressPct: 42,
    section: "Row G-12"
  },
  {
    id: "SWEEPER-02",
    name: "Sweeper-02",
    currentSiteId: "delta",
    currentSite: "Solar Site Delta",
    status: "Cleaning",
    batteryPct: 69,
    waterTankPct: 72,
    progressPct: 58,
    section: "Row D-14"
  },
  {
    id: "SWEEPER-03",
    name: "Sweeper-03",
    currentSiteId: "epsilon",
    currentSite: "Solar Site Epsilon",
    status: "Idle",
    batteryPct: 88,
    waterTankPct: 93,
    progressPct: 0,
    section: "Dock E-1"
  },
  {
    id: "SWEEPER-04",
    name: "Sweeper-04",
    currentSiteId: "zeta",
    currentSite: "Solar Site Zeta",
    status: "Maintenance",
    batteryPct: 39,
    waterTankPct: 52,
    progressPct: 0,
    section: "Service bay"
  },
  {
    id: "SWEEPER-05",
    name: "Sweeper-05",
    currentSiteId: "alpha",
    currentSite: "Solar Site Alpha",
    status: "Cleaning",
    batteryPct: 82,
    waterTankPct: 77,
    progressPct: 26,
    section: "Row A-08"
  },
  {
    id: "SWEEPER-06",
    name: "Sweeper-06",
    currentSiteId: "beta",
    currentSite: "Solar Site Beta",
    status: "Returning",
    batteryPct: 71,
    waterTankPct: 35,
    progressPct: 96,
    section: "Dock path"
  },
  {
    id: "SWEEPER-07",
    name: "Sweeper-07",
    currentSiteId: "gamma",
    currentSite: "Solar Site Gamma",
    status: "Paused",
    batteryPct: 61,
    waterTankPct: 43,
    progressPct: 74,
    section: "Row G-15"
  },
  {
    id: "SWEEPER-08",
    name: "Sweeper-08",
    currentSiteId: "alpha",
    currentSite: "Solar Site Alpha",
    status: "Cleaning",
    batteryPct: 84,
    waterTankPct: 69,
    progressPct: 34,
    section: "Row A-12"
  }
];

export const cleaningHistory: CleaningHistoryEntry[] = [
  {
    id: "clean-101",
    date: "Aug 7, 2026",
    site: "Solar Site Alpha",
    robot: "Sweeper-08",
    duration: "44 min",
    panelsCleaned: 340,
    waterUsedL: 96,
    estimatedPowerRecoveryKw: 42,
    status: "Completed"
  },
  {
    id: "clean-102",
    date: "Aug 7, 2026",
    site: "Solar Site Beta",
    robot: "Sweeper-06",
    duration: "51 min",
    panelsCleaned: 410,
    waterUsedL: 118,
    estimatedPowerRecoveryKw: 38,
    status: "Completed"
  },
  {
    id: "clean-103",
    date: "Aug 6, 2026",
    site: "Solar Site Gamma",
    robot: "Sweeper-01",
    duration: "38 min",
    panelsCleaned: 285,
    waterUsedL: 82,
    estimatedPowerRecoveryKw: 57,
    status: "Completed"
  },
  {
    id: "clean-104",
    date: "Aug 6, 2026",
    site: "Solar Site Delta",
    robot: "Sweeper-02",
    duration: "21 min",
    panelsCleaned: 140,
    waterUsedL: 39,
    estimatedPowerRecoveryKw: 17,
    status: "Interrupted"
  },
  {
    id: "clean-105",
    date: "Aug 5, 2026",
    site: "Solar Site Epsilon",
    robot: "Sweeper-03",
    duration: "47 min",
    panelsCleaned: 365,
    waterUsedL: 101,
    estimatedPowerRecoveryKw: 31,
    status: "Completed"
  }
];
