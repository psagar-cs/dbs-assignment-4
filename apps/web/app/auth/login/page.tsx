import Link from "next/link";
import { AuthForm } from "../../../components/auth-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <section>
          <p className="text-sm uppercase tracking-[0.22em] text-storm/60">Sign in</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Pick up where your forecast left off.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-storm/75">
            Your dashboard updates in realtime once the worker starts streaming fresh weather into Supabase.
          </p>
          <Link className="mt-8 inline-block text-sm font-semibold text-storm underline" href="/auth/sign-up">
            Need an account? Create one here.
          </Link>
        </section>

        <AuthForm mode="login" />
      </div>
    </main>
  );
}
