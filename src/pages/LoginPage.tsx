import { Lock, Mail, ShieldCheck, SunMedium } from "lucide-react";
import { FormEvent, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import solarFieldImage from "../assets/solar-field-login.jpg";
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
    <main className="grid min-h-screen bg-slate-100 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <img
          src={solarFieldImage}
          alt="Solar panel array in a green field"
          className="h-full min-h-screen w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/35 via-transparent to-transparent" />
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">
          <div className="mb-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
              <SunMedium className="h-7 w-7" />
            </div>
            <h1 className="mt-4 text-3xl font-bold text-slate-950">Solar Sweeper</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Autonomous Solar Panel Monitoring & Cleaning Platform
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/70">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-3 text-blue-700">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Operator Login</h2>
                <p className="text-sm text-slate-500">Access the control dashboard</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Email</span>
                <span className="mt-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                  <Mail className="h-4 w-4 flex-none text-slate-400" />
                  <input
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    type="email"
                    className="ml-2 w-full min-w-0 bg-transparent text-sm outline-none"
                    autoComplete="email"
                  />
                </span>
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">Password</span>
                <span className="mt-2 flex items-center rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
                  <Lock className="h-4 w-4 flex-none text-slate-400" />
                  <input
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    type="password"
                    className="ml-2 w-full min-w-0 bg-transparent text-sm outline-none"
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
                className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
              >
                Login
              </button>
            </form>
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm leading-6 text-slate-600">
              Demo credentials: <span className="font-semibold">admin@solarsweeper.com</span> /{" "}
              <span className="font-semibold">admin123</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
