import type { ActivityEntry } from "../types/activity";

export const activityFeed: ActivityEntry[] = [
  {
    id: "ACT-501",
    timestamp: "12:45 PM",
    message: "Power loss detected at Solar Site Gamma",
    tone: "warning"
  },
  {
    id: "ACT-500",
    timestamp: "12:31 PM",
    message: "Sweeper-02 started cleaning row D-14",
    tone: "info"
  },
  {
    id: "ACT-499",
    timestamp: "12:12 PM",
    message: "Cleaning completed on Solar Site Alpha",
    tone: "success"
  },
  {
    id: "ACT-498",
    timestamp: "11:54 AM",
    message: "Device INV-014 came back online after network retry",
    tone: "success"
  },
  {
    id: "ACT-497",
    timestamp: "11:25 AM",
    message: "Weather forecast updated for all north-region sites",
    tone: "info"
  },
  {
    id: "ACT-496",
    timestamp: "10:52 AM",
    message: "Emergency stop checklist acknowledged by operator",
    tone: "critical"
  }
];
