import { portfolioSummary, solarSites } from "../data/sites";
import type { PortfolioSummary, SolarSite } from "../types/site";
import { mockDelay } from "./api";

export const siteService = {
  listSites(): Promise<SolarSite[]> {
    return mockDelay(solarSites);
  },

  getSite(siteId: string): Promise<SolarSite | undefined> {
    return mockDelay(solarSites.find((site) => site.id === siteId));
  },

  getPortfolioSummary(): Promise<PortfolioSummary> {
    return mockDelay(portfolioSummary);
  }
};
