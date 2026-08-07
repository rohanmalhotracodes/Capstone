export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatKw(value: number): string {
  return `${value.toFixed(2)} kW`;
}

export function formatMw(value: number): string {
  return `${value.toFixed(2)} MW`;
}

export function nowLabel(): string {
  return new Date().toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
