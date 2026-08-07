import { weatherSnapshots } from "../data/weather";
import type { WeatherSnapshot } from "../types/weather";
import { mockDelay } from "./api";

export const weatherService = {
  listWeather(): Promise<WeatherSnapshot[]> {
    return mockDelay(weatherSnapshots);
  },

  getWeather(siteId: string): Promise<WeatherSnapshot | undefined> {
    return mockDelay(weatherSnapshots.find((snapshot) => snapshot.siteId === siteId));
  }
};
