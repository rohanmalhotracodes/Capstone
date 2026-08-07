import { Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "./components/ToastContainer";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { ProtectedRoute } from "./layouts/ProtectedRoute";
import { AlertsPage } from "./pages/AlertsPage";
import { CleaningPage } from "./pages/CleaningPage";
import { DevicesPage } from "./pages/DevicesPage";
import { EmergencyStopPage } from "./pages/EmergencyStopPage";
import { LoginPage } from "./pages/LoginPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { SiteDetailPage } from "./pages/SiteDetailPage";
import { SitesPage } from "./pages/SitesPage";
import { TelemetryPage } from "./pages/TelemetryPage";
import { WeatherPage } from "./pages/WeatherPage";

export function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<OverviewPage />} />
            <Route path="/telemetry" element={<TelemetryPage />} />
            <Route path="/sites" element={<SitesPage />} />
            <Route path="/sites/:siteId" element={<SiteDetailPage />} />
            <Route path="/devices" element={<DevicesPage />} />
            <Route path="/cleaning" element={<CleaningPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/emergency-stop" element={<EmergencyStopPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
