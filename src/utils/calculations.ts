export function calculatePowerLossPct(expectedPower: number, actualPower: number): number {
  if (expectedPower <= 0) {
    return 0;
  }

  return Math.max(0, Number((((expectedPower - actualPower) / expectedPower) * 100).toFixed(1)));
}

export function calculateEfficiencyPct(actualPower: number, expectedPower: number): number {
  if (expectedPower <= 0) {
    return 0;
  }

  return Number(Math.min(100, (actualPower / expectedPower) * 100).toFixed(1));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
