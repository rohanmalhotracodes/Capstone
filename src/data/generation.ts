import { calculatePowerLossPct } from "../utils/calculations";

export type Timeframe = "Today" | "7 Days" | "30 Days";

export interface GenerationPoint {
  time: string;
  actualPower: number;
  expectedPower: number;
  lossPct: number;
}

export interface ReportPoint {
  label: string;
  generated: number;
  expected: number;
  lost: number;
}

function daylightCurve(hour: number): number {
  return Math.max(0, Math.sin(((hour - 6) / 12) * Math.PI));
}

export function generateGenerationSeries(timeframe: Timeframe): GenerationPoint[] {
  if (timeframe === "Today") {
    return Array.from({ length: 24 }, (_, hour) => {
      const daylight = daylightCurve(hour);
      const expected = Number((3.25 * daylight * (0.92 + Math.sin(hour / 4) * 0.04)).toFixed(2));
      const soilingDip = hour >= 11 && hour <= 15 ? 0.16 : hour >= 8 && hour <= 17 ? 0.08 : 0.03;
      const actual = Number((expected * (1 - soilingDip - Math.max(0, Math.sin(hour) * 0.02))).toFixed(2));
      return {
        time: `${String(hour).padStart(2, "0")}:00`,
        actualPower: actual,
        expectedPower: expected,
        lossPct: calculatePowerLossPct(expected, actual)
      };
    });
  }

  const days = timeframe === "7 Days" ? 7 : 30;
  return Array.from({ length: days }, (_, index) => {
    const cloudFactor = 0.9 + Math.sin(index / 2) * 0.08;
    const expected = Number((23.6 * cloudFactor).toFixed(2));
    const cleaningRecovery = index > days * 0.6 ? 0.06 : 0;
    const soiling = Math.max(0.05, 0.16 - cleaningRecovery + Math.sin(index / 3) * 0.025);
    const actual = Number((expected * (1 - soiling)).toFixed(2));
    return {
      time: timeframe === "7 Days" ? `Day ${index + 1}` : `${index + 1}`,
      actualPower: actual,
      expectedPower: expected,
      lossPct: calculatePowerLossPct(expected, actual)
    };
  });
}

export const dailyEnergyData: ReportPoint[] = [
  { label: "Mon", generated: 18.8, expected: 21.2, lost: 2.4 },
  { label: "Tue", generated: 20.1, expected: 22.4, lost: 2.3 },
  { label: "Wed", generated: 19.4, expected: 22.1, lost: 2.7 },
  { label: "Thu", generated: 17.9, expected: 21.6, lost: 3.7 },
  { label: "Fri", generated: 21.5, expected: 23.2, lost: 1.7 },
  { label: "Sat", generated: 22.0, expected: 23.4, lost: 1.4 },
  { label: "Sun", generated: 20.6, expected: 22.9, lost: 2.3 }
];

export const powerLossTrend = [
  { label: "Week 1", loss: 7.8 },
  { label: "Week 2", loss: 9.2 },
  { label: "Week 3", loss: 12.6 },
  { label: "Week 4", loss: 6.9 }
];

export const cleaningImpact = [
  { label: "Before Cleaning", efficiency: 78 },
  { label: "After Cleaning", efficiency: 92 }
];
