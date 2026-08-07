export interface ForecastDay {
  day: string;
  condition: string;
  highC: number;
  lowC: number;
  cloudCoverPct: number;
  precipitationChancePct: number;
  irradianceWm2: number;
}

export interface WeatherSnapshot {
  siteId: string;
  site: string;
  temperatureC: number;
  humidityPct: number;
  condition: string;
  cloudCoverPct: number;
  windKph: number;
  precipitationChancePct: number;
  irradianceWm2: number;
  recommendation: string;
  forecast: ForecastDay[];
}
