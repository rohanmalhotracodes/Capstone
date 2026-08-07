import { Bell, Menu, Search, UserCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSolarData } from "../hooks/useSolarData";
import { LiveIndicator } from "./LiveIndicator";

interface TopNavbarProps {
  title: string;
  onOpenSidebar: () => void;
}

export function TopNavbar({ title, onOpenSidebar }: TopNavbarProps) {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { alerts } = useSolarData();
  const activeAlerts = alerts.filter((alert) => alert.status !== "Resolved").length;

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur lg:px-6">
      <button
        type="button"
        aria-label="Open sidebar"
        onClick={onOpenSidebar}
        className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-lg font-bold text-slate-950">{title}</h1>
      </div>
      <div className="hidden min-w-64 max-w-md flex-1 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search sites, devices, alerts"
          className="ml-2 w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />
      </div>
      <LiveIndicator live label="System Healthy" />
      <button
        type="button"
        aria-label="Open alerts"
        onClick={() => navigate("/alerts")}
        className="relative rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
      >
        <Bell className="h-5 w-5" />
        {activeAlerts > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs font-bold text-white">
            {activeAlerts}
          </span>
        ) : null}
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2 py-2 text-slate-700 hover:bg-slate-50"
        >
          <UserCircle className="h-5 w-5" />
          <span className="hidden text-sm font-semibold xl:inline">{user?.name ?? "Operator"}</span>
        </button>
        {menuOpen ? (
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-slate-200 bg-white p-2 shadow-card">
            <div className="px-3 py-2">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
