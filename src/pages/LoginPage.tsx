import { Lock, Mail, ShieldCheck, SunMedium } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

interface LocationState {
  from?: string;
}

export function LoginPage() {
  const [email, setEmail] = useState("admin@solarsweeper.com");
  const [password, setPassword] = useState("admin123");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const { isAuthenticated, login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const ok = login(email, password, remember);
    if (!ok) {
      setError("Use admin@solarsweeper.com with password admin123 for the demo.");
      return;
    }

    addToast("Login successful", "Welcome to Solar Sweeper operations.", "success");
    navigate(state?.from ?? "/dashboard", { replace: true });
  }

  return (
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="relative hidden overflow-hidden bg-navy-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 opacity-20">
          <div className="grid h-full grid-cols-8 gap-3 p-10">
            {Array.from({ length: 64 }, (_, index) => (
              <div key={index} className="rounded border border-blue-300/30 bg-blue-400/10" />
            ))}
          </div>
        </div>
        <div className="relative">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
            <SunMedium className="h-5 w-5 text-amber-300" />
            Solar Energy / Industrial IoT SaaS Dashboard
          </div>
          <h1 className="mt-8 max-w-2xl text-5xl font-bold leading-tight">Solar Sweeper</h1>
          <p className="mt-4 max-w-xl text-xl text-blue-100">
            Autonomous Solar Panel Monitoring & Cleaning Platform
          </p>
          <div className="mt-10 grid max-w-2xl grid-cols-3 gap-4">
            <DemoMetric label="Sites" value="24" />
            <DemoMetric label="Power" value="2.84 MW" />
            <DemoMetric label="Loss" value="12.6%" />
          </div>
        </div>
        <div className="relative rounded-lg border border-white/10 bg-white/10 p-5 text-sm leading-6 text-blue-100">
          Solar / Edge Devices -&gt; Mosquitto MQTT Broker -&gt; FastAPI MQTT Subscriber -&gt; PostgreSQL -&gt; REST + WebSocket -&gt; React Dashboard
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-card">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-blue-600 p-3 text-white">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Operator Login</h2>
              <p className="text-sm text-slate-500">Access the Solar Sweeper control dashboard</p>
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Email</span>
              <span className="mt-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Mail className="h-4 w-4 text-slate-400" />
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  type="email"
                  className="ml-2 w-full bg-transparent text-sm outline-none"
                  autoComplete="email"
                />
              </span>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">Password</span>
              <span className="mt-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <Lock className="h-4 w-4 text-slate-400" />
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  className="ml-2 w-full bg-transparent text-sm outline-none"
                  autoComplete="current-password"
                />
              </span>
            </label>
            <div className="flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => addToast("Password reset", "A demo reset link would be sent by the backend.", "info")}
                className="font-semibold text-blue-700 hover:text-blue-800"
              >
                Forgot password?
              </button>
            </div>
            {error ? <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">{error}</p> : null}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700"
            >
              Login
            </button>
          </form>
          <div className="mt-5 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
            Demo credentials: <span className="font-semibold">admin@solarsweeper.com</span> /{" "}
            <span className="font-semibold">admin123</span>
          </div>
        </div>
      </section>
    </main>
  );
}

function DemoMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/10 p-4">
      <p className="text-sm text-blue-100">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}
