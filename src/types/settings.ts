export interface DashboardSettings {
  refreshIntervalSec: number;
  units: "Metric" | "Imperial";
  timezone: string;
  mqttBrokerHost: string;
  mqttBrokerPort: number;
  telemetryTopic: string;
  commandTopic: string;
  apiBaseUrl: string;
  websocketUrl: string;
  weatherProvider: string;
  notifications: {
    powerLoss: boolean;
    deviceOffline: boolean;
    cleaning: boolean;
    emergency: boolean;
  };
}
