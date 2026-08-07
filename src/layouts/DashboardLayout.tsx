import { useMemo, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { TopNavbar } from "../components/TopNavbar";

const titleByPath: Record<string, string> = {
  "/dashboard": "Overview",
  "/telemetry": "Live Telemetry",
  "/sites": "Solar Sites",
  "/devices": "Devices",
  "/cleaning": "Cleaning Operations",
  "/alerts": "Alerts",
  "/weather": "Weather",
  "/reports": "Reports",
  "/emergency-stop": "Emergency Stop",
  "/settings": "Settings"
};

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const title = useMemo(() => {
    if (location.pathname.startsWith("/sites/")) {
      return "Site Detail";
    }

    return titleByPath[location.pathname] ?? "Solar Sweeper";
  }, [location.pathname]);

  return (
    <div className="min-h-screen lg:flex">
      <AppSidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="min-w-0 flex-1">
        <TopNavbar title={title} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="px-4 py-6 lg:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
