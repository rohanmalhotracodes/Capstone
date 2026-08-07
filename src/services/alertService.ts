import { alerts } from "../data/alerts";
import type { AlertStatus, SolarAlert } from "../types/alert";
import { mockDelay } from "./api";

export const alertService = {
  listAlerts(): Promise<SolarAlert[]> {
    return mockDelay(alerts);
  },

  updateAlertStatus(alertId: string, status: AlertStatus): Promise<{ alertId: string; status: AlertStatus }> {
    return mockDelay({ alertId, status }, 280);
  }
};
