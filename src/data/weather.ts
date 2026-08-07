import type { WeatherSnapshot } from "../types/weather";

const forecast = (cloudOffset: number): WeatherSnapshot["forecast"] => [
  {
    day: "Today",
    condition: cloudOffset > 25 ? "Hazy" : "Sunny",
    highC: 37,
    lowC: 28,
    cloudCoverPct: 14 + cloudOffset,
    precipitationChancePct: 8,
    irradianceWm2: 850 - cloudOffset * 4
  },
  {
    day: "Sat",
    condition: "Sunny",
    highC: 36,
    lowC: 27,
    cloudCoverPct: 16 + cloudOffset,
    precipitationChancePct: 6,
    irradianceWm2: 835 - cloudOffset * 3
  },
  {
    day: "Sun",
    condition: "Partly Cloudy",
    highC: 35,
    lowC: 27,
    cloudCoverPct: 32 + cloudOffset,
    precipitationChancePct: 18,
    irradianceWm2: 745 - cloudOffset * 2
  },
  {
    day: "Mon",
    condition: "Clear",
    highC: 36,
    lowC: 28,
    cloudCoverPct: 18 + cloudOffset,
    precipitationChancePct: 7,
    irradianceWm2: 830 - cloudOffset * 2
  },
  {
    day: "Tue",
    condition: "Cloudy",
    highC: 33,
    lowC: 26,
    cloudCoverPct: 54 + cloudOffset,
    precipitationChancePct: 34,
    irradianceWm2: 590 - cloudOffset
  },
  {
    day: "Wed",
    condition: "Sunny",
    highC: 35,
    lowC: 27,
    cloudCoverPct: 20 + cloudOffset,
    precipitationChancePct: 12,
    irradianceWm2: 810 - cloudOffset * 2
  },
  {
    day: "Thu",
    condition: "Dust Haze",
    highC: 38,
    lowC: 29,
    cloudCoverPct: 24 + cloudOffset,
    precipitationChancePct: 5,
    irradianceWm2: 865 - cloudOffset * 3
  }
];

export const weatherSnapshots: WeatherSnapshot[] = [
  {
    siteId: "alpha",
    site: "Solar Site Alpha",
    temperatureC: 32,
    humidityPct: 41,
    condition: "Clear",
    cloudCoverPct: 12,
    windKph: 10,
    precipitationChancePct: 8,
    irradianceWm2: 825,
    recommendation: "Panels are producing normally. Keep the next scheduled cleaning window.",
    forecast: forecast(0)
  },
  {
    siteId: "beta",
    site: "Solar Site Beta",
    temperatureC: 31,
    humidityPct: 46,
    condition: "Partly Cloudy",
    cloudCoverPct: 28,
    windKph: 12,
    precipitationChancePct: 15,
    irradianceWm2: 790,
    recommendation: "Moderate cloud cover is reducing expected generation; no urgent cleaning action required.",
    forecast: forecast(8)
  },
  {
    siteId: "gamma",
    site: "Solar Site Gamma",
    temperatureC: 36,
    humidityPct: 28,
    condition: "Dust Haze",
    cloudCoverPct: 10,
    windKph: 18,
    precipitationChancePct: 4,
    irradianceWm2: 875,
    recommendation: "Low rain probability and high dust accumulation detected. Cleaning recommended within 24 hours.",
    forecast: forecast(4)
  },
  {
    siteId: "delta",
    site: "Solar Site Delta",
    temperatureC: 33,
    humidityPct: 39,
    condition: "Clear",
    cloudCoverPct: 16,
    windKph: 8,
    precipitationChancePct: 9,
    irradianceWm2: 810,
    recommendation: "Cleaning is in progress. Resume monitoring panel temperature after completion.",
    forecast: forecast(2)
  },
  {
    siteId: "epsilon",
    site: "Solar Site Epsilon",
    temperatureC: 32,
    humidityPct: 43,
    condition: "Sunny",
    cloudCoverPct: 14,
    windKph: 11,
    precipitationChancePct: 10,
    irradianceWm2: 804,
    recommendation: "Good generation conditions expected for the next 48 hours.",
    forecast: forecast(1)
  },
  {
    siteId: "zeta",
    site: "Solar Site Zeta",
    temperatureC: 30,
    humidityPct: 55,
    condition: "Cloudy",
    cloudCoverPct: 62,
    windKph: 15,
    precipitationChancePct: 31,
    irradianceWm2: 520,
    recommendation: "Wait for communication recovery before dispatching cleaning equipment.",
    forecast: forecast(22)
  }
];
