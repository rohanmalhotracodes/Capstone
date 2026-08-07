import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { defaultSettings } from "../data/settings";
import { alertService } from "../services/alertService";
import { deviceService } from "../services/deviceService";
import { robotService } from "../services/robotService";
import { siteService } from "../services/siteService";
import { telemetryService } from "../services/telemetryService";
import { weatherService } from "../services/weatherService";
import type { ActivityEntry, ActivityTone } from "../types/activity";
import type { AlertStatus, SolarAlert } from "../types/alert";
import type { Device } from "../types/device";
import type { CleaningHistoryEntry, CleaningRobot } from "../types/robot";
import type { DashboardSettings } from "../types/settings";
import type { PortfolioSummary, SolarSite } from "../types/site";
import type { TelemetryReading } from "../types/telemetry";
import type { WeatherSnapshot } from "../types/weather";
import { calculatePowerLossPct, clamp } from "../utils/calculations";
import { nowLabel } from "../utils/format";
import { useToast } from "./useToast";

interface SolarDataContextValue {
  loading: boolean;
  summary: PortfolioSummary;
  sites: SolarSite[];
  devices: Device[];
  alerts: SolarAlert[];
  robots: CleaningRobot[];
  cleaningHistory: CleaningHistoryEntry[];
  telemetry: TelemetryReading[];
  weather: WeatherSnapshot[];
  activities: ActivityEntry[];
  settings: DashboardSettings;
  addActivity: (message: string, tone?: ActivityTone) => void;
  updateTelemetryReading: (reading: TelemetryReading) => void;
  updateAlertStatus: (alertId: string, status: AlertStatus) => void;
  startRobot: (robotId: string) => void;
  pauseRobot: (robotId: string) => void;
  resumeRobot: (robotId: string) => void;
  returnRobot: (robotId: string) => void;
  emergencyStopRobot: (robotId: string) => void;
  resumeEmergencyRobot: (robotId: string) => void;
  updateSettings: (settings: DashboardSettings) => void;
}

const SolarDataContext = createContext<SolarDataContextValue | undefined>(undefined);

const emptySummary: PortfolioSummary = {
  totalSites: 0,
  activeDevices: 0,
  currentPowerMw: 0,
  estimatedPowerLossPct: 0,
  activeAlerts: 0,
  cleaningRobotsActive: 0
};

export function SolarDataProvider({ children }: { children: ReactNode }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [baseSummary, setBaseSummary] = useState<PortfolioSummary>(emptySummary);
  const [sites, setSites] = useState<SolarSite[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [alerts, setAlerts] = useState<SolarAlert[]>([]);
  const [robots, setRobots] = useState<CleaningRobot[]>([]);
  const [cleaningHistory, setCleaningHistory] = useState<CleaningHistoryEntry[]>([]);
  const [telemetry, setTelemetry] = useState<TelemetryReading[]>([]);
  const [weather, setWeather] = useState<WeatherSnapshot[]>([]);
  const [activities, setActivities] = useState<ActivityEntry[]>([]);
  const [settings, setSettings] = useState<DashboardSettings>(() => {
    const raw = localStorage.getItem("solar-sweeper-settings");
    return raw ? (JSON.parse(raw) as DashboardSettings) : defaultSettings;
  });

  useEffect(() => {
    let active = true;

    Promise.all([
      siteService.listSites(),
      siteService.getPortfolioSummary(),
      deviceService.listDevices(),
      alertService.listAlerts(),
      robotService.listRobots(),
      robotService.listCleaningHistory(),
      telemetryService.listTelemetry(),
      weatherService.listWeather()
    ]).then(([siteData, summaryData, deviceData, alertData, robotData, historyData, telemetryData, weatherData]) => {
      if (!active) {
        return;
      }

      setSites(siteData);
      setBaseSummary(summaryData);
      setDevices(deviceData);
      setAlerts(alertData);
      setRobots(robotData);
      setCleaningHistory(historyData);
      setTelemetry(telemetryData);
      setWeather(weatherData);
      import("../data/activity").then(({ activityFeed }) => {
        if (active) {
          setActivities(activityFeed);
        }
      });
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, []);

  const addActivity = useCallback((message: string, tone: ActivityTone = "info") => {
    const entry: ActivityEntry = {
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      message,
      tone
    };
    setActivities((current) => [entry, ...current].slice(0, 24));
  }, []);

  const updateAlertStatus = useCallback(
    (alertId: string, status: AlertStatus) => {
      setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, status } : alert)));
      const label = status === "Acknowledged" ? "Alert acknowledged" : "Alert resolved";
      addActivity(`${label}: ${alertId}`, status === "Resolved" ? "success" : "info");
      addToast(label, `${alertId} marked as ${status.toLowerCase()}.`, status === "Resolved" ? "success" : "info");
    },
    [addActivity, addToast]
  );

  const completeRobot = useCallback(
    (robot: CleaningRobot) => {
      setSites((current) =>
        current.map((site) =>
          site.id === robot.currentSiteId
            ? {
                ...site,
                health: site.health === "Offline" ? site.health : "Normal",
                cleaningStatus: "Cleaned moments ago",
                lastCleaning: "Moments ago",
                nextCleaning: "In 7 days",
                robotState: "Docked",
                cleaningProgressPct: 100,
                currentProductionMw: Number(Math.min(site.expectedProductionMw * 0.94, site.capacityMw).toFixed(2)),
                powerLossPct: calculatePowerLossPct(site.expectedProductionMw, site.expectedProductionMw * 0.94)
              }
            : site
        )
      );
      setDevices((current) =>
        current.map((device) => (device.id === robot.id ? { ...device, status: "Online", lastSeen: "just now" } : device))
      );
      setCleaningHistory((current) => [
        {
          id: `clean-${Date.now()}`,
          date: nowLabel(),
          site: robot.currentSite,
          robot: robot.name,
          duration: "46 min",
          panelsCleaned: 360,
          waterUsedL: 104,
          estimatedPowerRecoveryKw: 64,
          status: "Completed"
        },
        ...current
      ]);
      addActivity(`Cleaning completed on ${robot.currentSite}; estimated efficiency improved`, "success");
      addToast("Cleaning completed", `${robot.name} completed a cleaning cycle at ${robot.currentSite}.`, "success");
    },
    [addActivity, addToast]
  );

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setRobots((current) =>
        current.map((robot) => {
          if (robot.status !== "Cleaning") {
            return robot;
          }

          const progressPct = Math.min(100, robot.progressPct + 6 + Math.round(Math.random() * 8));
          const nextRobot = {
            ...robot,
            progressPct,
            batteryPct: clamp(robot.batteryPct - 1, 5, 100),
            waterTankPct: clamp(robot.waterTankPct - 2, 0, 100)
          };

          if (progressPct >= 100) {
            window.setTimeout(() => completeRobot(nextRobot), 0);
            return {
              ...nextRobot,
              status: "Idle",
              section: "Docked"
            };
          }

          return nextRobot;
        })
      );
    }, 6000);

    return () => window.clearInterval(intervalId);
  }, [completeRobot]);

  const updateTelemetryReading = useCallback(
    (reading: TelemetryReading) => {
      setTelemetry((current) => current.map((item) => (item.id === reading.id ? reading : item)));
      setSites((current) =>
        current.map((site) =>
          site.id === reading.siteId
            ? {
                ...site,
                powerLossPct: reading.powerLossPct,
                health: reading.powerLossPct > 18 ? "Power Loss" : site.health === "Offline" ? "Offline" : site.health,
                panelTempC: Math.round(reading.panelTempC),
                irradianceWm2: reading.irradianceWm2
              }
            : site
        )
      );

      if (reading.powerLossPct >= 18) {
        setAlerts((current) => {
          const existing = current.some(
            (alert) => alert.device === reading.device && alert.type === "Power Loss Detected" && alert.status !== "Resolved"
          );

          if (existing) {
            return current;
          }

          const alert: SolarAlert = {
            id: `ALT-${Date.now()}`,
            timestamp: nowLabel(),
            siteId: reading.siteId,
            site: reading.site,
            device: reading.device,
            type: "Power Loss Detected",
            message: `${reading.device} is ${reading.powerLossPct.toFixed(1)}% below expected power under current irradiance.`,
            severity: reading.powerLossPct >= 24 ? "Critical" : "High",
            status: "New"
          };
          addActivity(`Power loss warning created for ${reading.site}`, "warning");
          addToast("Power loss detected", `${reading.site} is trending below expected output.`, "warning");
          return [alert, ...current];
        });
      }
    },
    [addActivity, addToast]
  );

  const startRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot || robot.status === "Emergency Stopped" || robot.status === "Maintenance") {
        addToast("Robot unavailable", "Select an idle or paused robot before starting cleaning.", "warning");
        return;
      }

      setRobots((current) =>
        current.map((item) =>
          item.id === robotId
            ? {
                ...item,
                status: "Cleaning",
                progressPct: item.progressPct >= 100 ? 0 : Math.max(item.progressPct, 8),
                section: item.section.includes("Dock") ? "Row A-01" : item.section
              }
            : item
        )
      );
      setDevices((current) =>
        current.map((device) => (device.id === robotId ? { ...device, status: "Cleaning", lastSeen: "just now" } : device))
      );
      setSites((current) =>
        current.map((site) =>
          site.id === robot.currentSiteId
            ? { ...site, health: "Cleaning", cleaningStatus: "Robot active", robotState: "Cleaning", cleaningProgressPct: 8 }
            : site
        )
      );
      addActivity(`${robot.name} started cleaning at ${robot.currentSite}`, "info");
      addToast("Cleaning started", `${robot.name} is now cleaning ${robot.currentSite}.`, "success");
    },
    [addActivity, addToast, robots]
  );

  const pauseRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot || robot.status !== "Cleaning") {
        addToast("Pause unavailable", "Only active cleaning robots can be paused.", "warning");
        return;
      }

      setRobots((current) => current.map((item) => (item.id === robotId ? { ...item, status: "Paused" } : item)));
      addActivity(`${robot.name} paused at ${robot.currentSite}`, "warning");
      addToast("Cleaning paused", `${robot.name} paused safely.`, "info");
    },
    [addActivity, addToast, robots]
  );

  const resumeRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot || robot.status !== "Paused") {
        addToast("Resume unavailable", "Only paused robots can resume cleaning.", "warning");
        return;
      }

      setRobots((current) => current.map((item) => (item.id === robotId ? { ...item, status: "Cleaning" } : item)));
      addActivity(`${robot.name} resumed cleaning at ${robot.currentSite}`, "info");
      addToast("Cleaning resumed", `${robot.name} is back in motion.`, "success");
    },
    [addActivity, addToast, robots]
  );

  const returnRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot || robot.status === "Emergency Stopped" || robot.status === "Maintenance") {
        addToast("Return unavailable", "This robot cannot return until the current fault is resolved.", "warning");
        return;
      }

      setRobots((current) =>
        current.map((item) => (item.id === robotId ? { ...item, status: "Returning", section: "Dock path" } : item))
      );
      addActivity(`${robot.name} returning to base from ${robot.currentSite}`, "info");
      addToast("Return to base", `${robot.name} is returning to its dock.`, "info");
    },
    [addActivity, addToast, robots]
  );

  const emergencyStopRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot) {
        return;
      }

      setRobots((current) => current.map((item) => (item.id === robotId ? { ...item, status: "Emergency Stopped" } : item)));
      setDevices((current) =>
        current.map((device) => (device.id === robotId ? { ...device, status: "Emergency Stopped", lastSeen: "just now" } : device))
      );
      const alert: SolarAlert = {
        id: `ALT-${Date.now()}`,
        timestamp: nowLabel(),
        siteId: robot.currentSiteId,
        site: robot.currentSite,
        device: robot.id,
        type: "Emergency Stop",
        message: `Emergency stop triggered for ${robot.name}. Cleaning motors halted immediately.`,
        severity: "Critical",
        status: "New"
      };
      setAlerts((current) => [alert, ...current]);
      addActivity(`Emergency stop triggered for ${robot.name}`, "critical");
      addToast("Emergency stop triggered", `${robot.name} is now emergency stopped.`, "error");
    },
    [addActivity, addToast, robots]
  );

  const resumeEmergencyRobot = useCallback(
    (robotId: string) => {
      const robot = robots.find((item) => item.id === robotId);
      if (!robot || robot.status !== "Emergency Stopped") {
        addToast("Resume unavailable", "Select a robot currently in emergency stop.", "warning");
        return;
      }

      setRobots((current) =>
        current.map((item) => (item.id === robotId ? { ...item, status: "Idle", section: "Docked", progressPct: 0 } : item))
      );
      setDevices((current) =>
        current.map((device) => (device.id === robotId ? { ...device, status: "Online", lastSeen: "just now" } : device))
      );
      addActivity(`${robot.name} resumed after emergency stop clearance`, "success");
      addToast("Operation resumed", `${robot.name} is available for dispatch.`, "success");
    },
    [addActivity, addToast, robots]
  );

  const updateSettings = useCallback(
    (nextSettings: DashboardSettings) => {
      setSettings(nextSettings);
      localStorage.setItem("solar-sweeper-settings", JSON.stringify(nextSettings));
      addActivity("System settings saved", "success");
      addToast("Settings saved", "Mock API, MQTT, and notification settings were updated.", "success");
    },
    [addActivity, addToast]
  );

  const summary = useMemo<PortfolioSummary>(() => {
    if (sites.length === 0) {
      return baseSummary;
    }

    const unresolvedAlerts = alerts.filter((alert) => alert.status !== "Resolved").length;
    const activeRobots = robots.filter((robot) => ["Cleaning", "Paused", "Returning"].includes(robot.status)).length;
    const currentPowerMw = Number(sites.reduce((total, site) => total + site.currentProductionMw, 0).toFixed(2));
    const estimatedPowerLossPct = Number(
      (sites.reduce((total, site) => total + site.powerLossPct, 0) / Math.max(1, sites.length)).toFixed(1)
    );

    return {
      ...baseSummary,
      currentPowerMw,
      estimatedPowerLossPct,
      activeAlerts: unresolvedAlerts,
      cleaningRobotsActive: activeRobots || baseSummary.cleaningRobotsActive
    };
  }, [alerts, baseSummary, robots, sites]);

  const value = useMemo<SolarDataContextValue>(
    () => ({
      loading,
      summary,
      sites,
      devices,
      alerts,
      robots,
      cleaningHistory,
      telemetry,
      weather,
      activities,
      settings,
      addActivity,
      updateTelemetryReading,
      updateAlertStatus,
      startRobot,
      pauseRobot,
      resumeRobot,
      returnRobot,
      emergencyStopRobot,
      resumeEmergencyRobot,
      updateSettings
    }),
    [
      activities,
      addActivity,
      alerts,
      cleaningHistory,
      devices,
      emergencyStopRobot,
      loading,
      resumeEmergencyRobot,
      resumeRobot,
      returnRobot,
      robots,
      settings,
      sites,
      startRobot,
      pauseRobot,
      summary,
      telemetry,
      updateAlertStatus,
      updateSettings,
      updateTelemetryReading,
      weather
    ]
  );

  return <SolarDataContext.Provider value={value}>{children}</SolarDataContext.Provider>;
}

export function useSolarData() {
  const context = useContext(SolarDataContext);
  if (!context) {
    throw new Error("useSolarData must be used inside SolarDataProvider");
  }

  return context;
}
