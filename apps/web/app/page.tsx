import Link from "next/link";
import { getPublicEnv } from "../lib/env";

export default function HomePage() {
  const env = getPublicEnv();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
      <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
        <section>
          <p className="text-sm uppercase tracking-[0.22em] text-storm/60">Realtime weather monitor</p>
          <h1 className="mt-4 max-w-3xl text-6xl font-semibold leading-[1.05] text-ink">
            Track your cities in one bright, live dashboard.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-storm/75">
            Supabase Auth secures each account, Open-Meteo powers the forecast data, and a Railway worker keeps
            conditions fresh every 30 seconds.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link className="rounded-2xl bg-storm px-6 py-3 text-sm font-semibold text-white" href="/auth/sign-up">
              Create account
            </Link>
            <Link className="rounded-2xl border border-storm/15 bg-white/70 px-6 py-3 text-sm font-semibold text-storm" href="/auth/login">
              Sign in
            </Link>
          </div>
        </section>

        <section className="rounded-[36px] bg-white/75 p-8 shadow-panel backdrop-blur">
          <div className="grid gap-4">
            <div className="rounded-3xl bg-mist p-5">
              <p className="text-sm uppercase tracking-[0.18em] text-storm/55">Architecture</p>
              <p className="mt-3 text-lg font-semibold">Open-Meteo → Railway Worker → Supabase → Realtime → Browser</p>
            </div>
            <div className="rounded-3xl bg-white p-5 ring-1 ring-storm/10">
              <p className="text-sm uppercase tracking-[0.18em] text-storm/55">Status</p>
              <p className="mt-3 text-lg font-semibold">
                {env.configured ? "Supabase environment variables detected." : "Add Supabase keys to start auth and data flows."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
