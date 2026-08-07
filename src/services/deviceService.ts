import { devices } from "../data/devices";
import type { Device } from "../types/device";
import { mockDelay } from "./api";

export const deviceService = {
  listDevices(): Promise<Device[]> {
    return mockDelay(devices);
  },

  getDevice(deviceId: string): Promise<Device | undefined> {
    return mockDelay(devices.find((device) => device.id === deviceId));
  },

  emergencyStop(deviceId: string): Promise<{ deviceId: string; status: "Emergency Stopped" }> {
    return mockDelay({ deviceId, status: "Emergency Stopped" }, 420);
  }
};
