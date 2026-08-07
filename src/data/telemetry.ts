import type { TelemetryHistoryPoint, TelemetryReading, TelemetryStatus } from "../types/telemetry";
import { calculateEfficiencyPct, calculatePowerLossPct, clamp } from "../utils/calculations";

function timestamp(minutesAgo: number): string {
  return new Date(Date.now() - minutesAgo * 60_000).toISOString();
}

function statusForLoss(lossPct: number): TelemetryStatus {
  if (lossPct >= 22) {
    return "Critical";
  }

  if (lossPct >= 14) {
    return "Warning";
  }

  return "Normal";
}

function reading(
  id: string,
  minutesAgo: number,
  siteId: string,
  site: string,
  device: string,
  voltage: number,
  current: number,
  expectedPowerKw: number,
  actualPowerKw: number,
  panelTempC: number,
  ambientTempC: number,
  irradianceWm2: number
): TelemetryReading {
  const loss = calculatePowerLossPct(expectedPowerKw, actualPowerKw);
  return {
    id,
    timestamp: timestamp(minutesAgo),
    siteId,
    site,
    device,
    voltage,
    current,
    powerKw: actualPowerKw,
    expectedPowerKw,
    panelTempC,
    ambientTempC,
    irradianceWm2,
    efficiencyPct: calculateEfficiencyPct(actualPowerKw, expectedPowerKw),
    powerLossPct: loss,
    status: statusForLoss(loss)
  };
}

export const telemetryReadings: TelemetryReading[] = [
  reading("TEL-001", 1, "alpha", "Solar Site Alpha", "MTR-014", 401.2, 12.3, 5.42, 4.94, 46, 32, 825),
  reading("TEL-002", 2, "alpha", "Solar Site Alpha", "ESP-001", 397.8, 11.8, 5.12, 4.69, 45, 32, 812),
  reading("TEL-003", 3, "alpha", "Solar Site Alpha", "TEMP-008", 399.1, 12.1, 5.30, 4.83, 47, 32, 830),
  reading("TEL-004", 1, "beta", "Solar Site Beta", "IRR-003", 392.4, 11.4, 4.88, 4.47, 43, 31, 790),
  reading("TEL-005", 4, "beta", "Solar Site Beta", "ESP-021", 396.0, 11.6, 4.96, 4.59, 42, 31, 776),
  reading("TEL-006", 1, "gamma", "Solar Site Gamma", "MTR-027", 384.7, 10.1, 5.12, 3.88, 54, 36, 875),
  reading("TEL-007", 2, "gamma", "Solar Site Gamma", "IRR-011", 386.3, 10.3, 5.06, 4.00, 53, 36, 868),
  reading("TEL-008", 5, "gamma", "Solar Site Gamma", "SWEEPER-01", 388.8, 10.7, 5.18, 4.16, 52, 36, 881),
  reading("TEL-009", 1, "delta", "Solar Site Delta", "MTR-031", 395.2, 11.2, 4.75, 4.43, 48, 33, 810),
  reading("TEL-010", 3, "delta", "Solar Site Delta", "SWEEPER-02", 398.6, 11.3, 4.80, 4.51, 49, 33, 818),
  reading("TEL-011", 4, "delta", "Solar Site Delta", "TEMP-017", 394.7, 10.9, 4.69, 4.30, 58, 33, 806),
  reading("TEL-012", 2, "epsilon", "Solar Site Epsilon", "MTR-041", 400.6, 12.0, 5.08, 4.81, 45, 32, 804),
  reading("TEL-013", 4, "epsilon", "Solar Site Epsilon", "SWEEPER-03", 399.5, 11.9, 5.02, 4.75, 44, 32, 798),
  reading("TEL-014", 6, "epsilon", "Solar Site Epsilon", "IRR-014", 397.9, 11.7, 4.94, 4.65, 44, 32, 793),
  reading("TEL-015", 1, "zeta", "Solar Site Zeta", "ESP-044", 0, 0, 3.20, 0, 38, 30, 520),
  reading("TEL-016", 7, "zeta", "Solar Site Zeta", "IRR-019", 361.2, 7.2, 3.14, 2.60, 39, 30, 518),
  reading("TEL-017", 8, "gamma", "Solar Site Gamma", "INV-014", 389.4, 10.5, 5.22, 4.05, 55, 36, 884),
  reading("TEL-018", 9, "alpha", "Solar Site Alpha", "INV-004", 402.1, 12.4, 5.46, 4.99, 46, 32, 829),
  reading("TEL-019", 10, "beta", "Solar Site Beta", "MTR-018", 394.8, 11.5, 4.92, 4.54, 43, 31, 782),
  reading("TEL-020", 11, "delta", "Solar Site Delta", "ESP-035", 396.8, 11.1, 4.73, 4.41, 50, 33, 814)
].map((item) => (item.powerKw === 0 ? { ...item, status: "Offline" } : item));

export function mutateTelemetryReading(readingToUpdate: TelemetryReading): TelemetryReading {
  if (readingToUpdate.status === "Offline") {
    return {
      ...readingToUpdate,
      timestamp: new Date().toISOString()
    };
  }

  const gammaSoiling = readingToUpdate.siteId === "gamma" ? 0.96 : 1;
  const voltage = clamp(readingToUpdate.voltage + (Math.random() - 0.5) * 4, 355, 410);
  const current = clamp(readingToUpdate.current + (Math.random() - 0.5) * 0.6, 6.5, 13.5);
  const expectedPowerKw = clamp(readingToUpdate.expectedPowerKw + (Math.random() - 0.4) * 0.18, 2.6, 5.7);
  const actualPowerKw = clamp(readingToUpdate.powerKw + (Math.random() - 0.52) * 0.16, 0, expectedPowerKw * gammaSoiling);
  const panelTempC = clamp(readingToUpdate.panelTempC + (Math.random() - 0.45) * 1.2, 35, 62);
  const irradianceWm2 = clamp(readingToUpdate.irradianceWm2 + (Math.random() - 0.45) * 24, 450, 920);
  const powerLossPct = calculatePowerLossPct(expectedPowerKw, actualPowerKw);

  return {
    ...readingToUpdate,
    timestamp: new Date().toISOString(),
    voltage: Number(voltage.toFixed(1)),
    current: Number(current.toFixed(1)),
    expectedPowerKw: Number(expectedPowerKw.toFixed(2)),
    powerKw: Number(actualPowerKw.toFixed(2)),
    panelTempC: Number(panelTempC.toFixed(1)),
    irradianceWm2: Math.round(irradianceWm2),
    efficiencyPct: calculateEfficiencyPct(actualPowerKw, expectedPowerKw),
    powerLossPct,
    status: statusForLoss(powerLossPct)
  };
}

export function generateTelemetryHistory(readingToPlot: TelemetryReading): TelemetryHistoryPoint[] {
  return Array.from({ length: 13 }, (_, index) => {
    const minutesBack = 60 - index * 5;
    const wave = Math.sin(index / 2.2) * 0.04;
    const expectedPower = readingToPlot.expectedPowerKw * (0.95 + wave);
    const actualPower = readingToPlot.powerKw * (0.96 + wave + Math.random() * 0.04);
    const loss = calculatePowerLossPct(expectedPower, actualPower);

    return {
      time: `${minutesBack === 0 ? "Now" : `-${minutesBack}m`}`,
      voltage: Number((readingToPlot.voltage * (0.98 + wave)).toFixed(1)),
      current: Number((readingToPlot.current * (0.97 + wave)).toFixed(1)),
      powerKw: Number(actualPower.toFixed(2)),
      panelTempC: Number((readingToPlot.panelTempC + Math.sin(index / 2) * 2).toFixed(1)),
      powerLossPct: loss
    };
  });
}
