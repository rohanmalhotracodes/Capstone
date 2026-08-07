import { mutateTelemetryReading } from "../data/telemetry";
import type { TelemetryReading } from "../types/telemetry";

export type TelemetryMessageHandler = (reading: TelemetryReading) => void;
export type ConnectionHandler = (connected: boolean) => void;

export class MockTelemetryStream {
  private intervalId: number | undefined;

  constructor(
    private readonly getReadings: () => TelemetryReading[],
    private readonly onMessage: TelemetryMessageHandler,
    private readonly onConnectionChange: ConnectionHandler
  ) {}

  start(): void {
    if (this.intervalId !== undefined) {
      return;
    }

    this.onConnectionChange(true);
    this.intervalId = window.setInterval(() => {
      const readings = this.getReadings().filter((reading) => reading.status !== "Offline");
      if (readings.length === 0) {
        return;
      }

      const reading = readings[Math.floor(Math.random() * readings.length)];
      this.onMessage(mutateTelemetryReading(reading));
    }, 2800);
  }

  stop(): void {
    if (this.intervalId !== undefined) {
      window.clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.onConnectionChange(false);
  }
}
