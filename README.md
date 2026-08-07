# Solar Sweeper

**Autonomous Solar Panel Monitoring & Cleaning Platform**

Solar Sweeper is a production-style frontend demo for a solar-panel monitoring and autonomous cleaning capstone project. It shows solar site telemetry, expected-vs-actual generation, power-loss and soiling indicators, robot cleaning operations, weather context, alerts, reports, settings, and emergency stop controls.

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Recharts
- Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Demo credentials:

- Email: `admin@solarsweeper.com`
- Password: `admin123`

## Available Pages

- `/dashboard` - KPI dashboard, power generation chart, soiling gauge, site status, activity feed, and system architecture
- `/telemetry` - live mock telemetry table, filters, pagination, CSV export, auto-refresh stream, and row detail charts
- `/sites` and `/sites/:id` - solar site cards and detailed site operations pages
- `/devices` - device inventory with detail drawer
- `/cleaning` - Solar Sweeper robot controls, progress, toasts, and cleaning history
- `/alerts` - searchable alert center with acknowledge, resolve, and detail actions
- `/weather` - WeatherAPI-ready mock conditions and seven-day forecast
- `/reports` - energy, loss, recovery, cleaning impact, and export controls
- `/emergency-stop` - confirmation-based emergency stop and resume flow
- `/settings` - general, MQTT, API, WebSocket, WeatherAPI, and notification settings

## Mock Data Architecture

Centralized demo data lives in:

```text
src/data/
  sites.ts
  telemetry.ts
  devices.ts
  alerts.ts
  robots.ts
  weather.ts
  generation.ts
  settings.ts
```

Shared TypeScript interfaces live in:

```text
src/types/
```

Power-loss values use:

```text
(Expected Power - Actual Power) / Expected Power * 100
```

with zero protection in `src/utils/calculations.ts`.

## Service Layer

The frontend uses mock promises with small delays through service modules in `src/services/`:

- `api.ts`
- `telemetryService.ts`
- `siteService.ts`
- `deviceService.ts`
- `alertService.ts`
- `weatherService.ts`
- `websocketService.ts`
- `robotService.ts`

These are shaped around future backend routes such as:

```text
GET /api/sites
GET /api/sites/:id
GET /api/telemetry
GET /api/devices
GET /api/alerts
POST /api/alerts/:id/acknowledge
POST /api/devices/:id/emergency-stop
POST /api/robots/:id/start-cleaning
GET /api/weather/:siteId
```

## Intended Backend Integration

The browser frontend should communicate with FastAPI through REST and WebSockets. It should not connect directly to MQTT.

```text
Solar / Edge Devices
        ↓
Mosquitto MQTT Broker
        ↓
FastAPI MQTT Subscriber
        ↓
Processing / Validation
        ↓
PostgreSQL
        ↓
FastAPI REST + WebSocket
        ↓
React Dashboard
```

To replace mocks:

- Swap `mockDelay` calls in `src/services/api.ts` with real `fetch` calls.
- Replace `MockTelemetryStream` in `src/services/websocketService.ts` with `new WebSocket(import.meta.env.VITE_WS_URL)`.
- Keep page components consuming the same typed service contracts.
- Move WeatherAPI calls into `weatherService.ts` and map provider responses into `WeatherSnapshot`.

## Environment Variables

Copy `.env.example` and fill values when a backend is available.

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws/telemetry
VITE_WEATHER_API_KEY=
```

## Capstone Demo Flow

The UI supports a complete frontend-only demonstration:

1. Login with demo credentials.
2. Inspect the overview dashboard and power-loss chart.
3. Watch live telemetry auto-refresh.
4. Open alerts for lower-than-expected power at Solar Site Gamma.
5. Start or resume Solar Sweeper cleaning from the Cleaning Operations page.
6. Observe progress, toast notifications, activity feed updates, and improved power-loss numbers after completion.
7. Trigger Emergency Stop for `Sweeper-01`, confirm the action, see the robot status change, and resume operation after confirmation.
