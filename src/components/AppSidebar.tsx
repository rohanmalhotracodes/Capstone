import {
  BarChart3,
  Bell,
  Bot,
  CloudSun,
  Gauge,
  LayoutDashboard,
  LogOut,
  Map,
  MonitorSmartphone,
  Settings,
  ShieldAlert,
  X
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
  { label: "Live Telemetry", path: "/telemetry", icon: Gauge },
  { label: "Solar Sites", path: "/sites", icon: Map },
  { label: "Devices", path: "/devices", icon: MonitorSmartphone },
  { label: "Cleaning Operations", path: "/cleaning", icon: Bot },
  { label: "Alerts", path: "/alerts", icon: Bell },
  { label: "Weather", path: "/weather", icon: CloudSun },
  { label: "Reports", path: "/reports", icon: BarChart3 },
  { label: "Emergency Stop", path: "/emergency-stop", icon: ShieldAlert },
  { label: "Settings", path: "/settings", icon: Settings }
];

interface AppSidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function AppSidebar({ mobileOpen, onCloseMobile }: AppSidebarProps) {
  const { user, logout } = useAuth();

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onCloseMobile}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 transform flex-col bg-navy-900 text-white shadow-2xl transition-transform lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
          <div>
            <p className="text-lg font-bold">Solar Sweeper</p>
            <p className="text-xs text-blue-100">Autonomous Solar Panel Monitoring & Cleaning Platform</p>
          </div>
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onCloseMobile}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                    isActive ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
              AS
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold">{user?.name ?? "Demo Operator"}</p>
              <p className="truncate text-xs text-slate-300">{user?.role ?? "Operations Lead"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
