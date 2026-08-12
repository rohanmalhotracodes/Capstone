import { Bell, Cloud, Database, Save, ServerCog, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { FormEvent, useState } from "react";
import type { ReactNode } from "react";
import { PageHeader } from "../components/PageHeader";
import { useSolarData } from "../hooks/useSolarData";
import type { DashboardSettings } from "../types/settings";

export function SettingsPage() {
  const { settings, updateSettings } = useSolarData();
  const [draft, setDraft] = useState<DashboardSettings>(settings);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateSettings(draft);
  }

  function updateNotification(key: keyof DashboardSettings["notifications"], value: boolean) {
    setDraft((current) => ({
      ...current,
      notifications: {
        ...current.notifications,
        [key]: value
      }
    }));
  }

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Dashboard preferences, telemetry connection values, weather source, and notification options."
      />
      <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-2">
        <SettingsSection icon={SlidersHorizontal} title="General">
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Dashboard Refresh Interval">
              <input
                type="number"
                min={1}
                value={draft.refreshIntervalSec}
                onChange={(event) => setDraft({ ...draft, refreshIntervalSec: Number(event.target.value) })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Units">
              <select
                value={draft.units}
                onChange={(event) => setDraft({ ...draft, units: event.target.value as DashboardSettings["units"] })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              >
                <option>Metric</option>
                <option>Imperial</option>
              </select>
            </Field>
            <Field label="Timezone">
              <input
                value={draft.timezone}
                onChange={(event) => setDraft({ ...draft, timezone: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
          </div>
        </SettingsSection>

        <SettingsSection icon={ServerCog} title="MQTT Configuration">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Broker Host">
              <input
                value={draft.mqttBrokerHost}
                onChange={(event) => setDraft({ ...draft, mqttBrokerHost: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Broker Port">
              <input
                type="number"
                value={draft.mqttBrokerPort}
                onChange={(event) => setDraft({ ...draft, mqttBrokerPort: Number(event.target.value) })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Telemetry Topic">
              <input
                value={draft.telemetryTopic}
                onChange={(event) => setDraft({ ...draft, telemetryTopic: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Command Topic">
              <input
                value={draft.commandTopic}
                onChange={(event) => setDraft({ ...draft, commandTopic: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
          </div>
          <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-slate-600">
            Telemetry is simulated in this demo. These values are placeholders for the production data pipeline.
          </p>
        </SettingsSection>

        <SettingsSection icon={Database} title="API Configuration">
          <div className="grid gap-4">
            <Field label="API Base URL">
              <input
                value={draft.apiBaseUrl}
                onChange={(event) => setDraft({ ...draft, apiBaseUrl: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Telemetry Stream URL">
              <input
                value={draft.websocketUrl}
                onChange={(event) => setDraft({ ...draft, websocketUrl: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
            <Field label="Weather API">
              <input
                value={draft.weatherProvider}
                onChange={(event) => setDraft({ ...draft, weatherProvider: event.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none"
              />
            </Field>
          </div>
        </SettingsSection>

        <SettingsSection icon={Bell} title="Notifications">
          <div className="space-y-3">
            <Checkbox
              label="Power loss alerts"
              checked={draft.notifications.powerLoss}
              onChange={(value) => updateNotification("powerLoss", value)}
            />
            <Checkbox
              label="Device offline alerts"
              checked={draft.notifications.deviceOffline}
              onChange={(value) => updateNotification("deviceOffline", value)}
            />
            <Checkbox
              label="Cleaning alerts"
              checked={draft.notifications.cleaning}
              onChange={(value) => updateNotification("cleaning", value)}
            />
            <Checkbox
              label="Emergency events"
              checked={draft.notifications.emergency}
              onChange={(value) => updateNotification("emergency", value)}
            />
          </div>
          <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
            <div className="flex items-start gap-3">
              <Cloud className="h-5 w-5 text-blue-700" />
              <p className="text-sm leading-6 text-blue-800">
                Environment values can be moved into .env when the backend is connected: VITE_API_BASE_URL, VITE_WS_URL, and VITE_WEATHER_API_KEY.
              </p>
            </div>
          </div>
        </SettingsSection>

        <div className="xl:col-span-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

function SettingsSection({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-card">
      <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-950">
        <Icon className="h-5 w-5 text-blue-600" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-slate-700">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-700">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600"
      />
    </label>
  );
}
