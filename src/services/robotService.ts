import { cleaningHistory, robots } from "../data/robots";
import type { CleaningHistoryEntry, CleaningRobot } from "../types/robot";
import { mockDelay } from "./api";

export const robotService = {
  listRobots(): Promise<CleaningRobot[]> {
    return mockDelay(robots);
  },

  listCleaningHistory(): Promise<CleaningHistoryEntry[]> {
    return mockDelay(cleaningHistory);
  },

  startCleaning(robotId: string): Promise<{ robotId: string; accepted: true }> {
    return mockDelay({ robotId, accepted: true }, 360);
  }
};
