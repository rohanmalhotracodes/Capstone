import type { DashboardSettings } from "../types/settings";

export const defaultSettings: DashboardSettings = {
  refreshIntervalSec: 3,
  units: "Metric",
  timezone: "Asia/Kolkata",
  mqttBrokerHost: "mqtt.solarsweeper.local",
  mqttBrokerPort: 1883,
  telemetryTopic: "solar/+/telemetry",
  commandTopic: "solar/+/commands",
  apiBaseUrl: "http://localhost:8000/api",
  websocketUrl: "ws://localhost:8000/ws/telemetry",
  weatherProvider: "WeatherAPI",
  notifications: {
    powerLoss: true,
    deviceOffline: true,
    cleaning: true,
    emergency: true
  }
};
