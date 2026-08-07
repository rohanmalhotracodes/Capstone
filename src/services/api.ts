export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";
export const WS_URL = import.meta.env.VITE_WS_URL ?? "ws://localhost:8000/ws/telemetry";

export const futureRoutes = {
  sites: "/api/sites",
  siteDetail: "/api/sites/:id",
  telemetry: "/api/telemetry",
  devices: "/api/devices",
  alerts: "/api/alerts",
  acknowledgeAlert: "/api/alerts/:id/acknowledge",
  emergencyStop: "/api/devices/:id/emergency-stop",
  startCleaning: "/api/robots/:id/start-cleaning",
  weather: "/api/weather/:siteId"
};

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export function mockDelay<T>(data: T, delayMs = 260): Promise<T> {
  return new Promise((resolve) => {
    window.setTimeout(() => resolve(clone(data)), delayMs);
  });
}
