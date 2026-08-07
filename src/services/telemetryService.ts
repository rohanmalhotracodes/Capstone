import { generateTelemetryHistory, telemetryReadings } from "../data/telemetry";
import type { TelemetryHistoryPoint, TelemetryReading } from "../types/telemetry";
import { mockDelay } from "./api";

export const telemetryService = {
  listTelemetry(): Promise<TelemetryReading[]> {
    return mockDelay(telemetryReadings);
  },

  getTelemetryHistory(reading: TelemetryReading): Promise<TelemetryHistoryPoint[]> {
    return mockDelay(generateTelemetryHistory(reading), 180);
  }
};
