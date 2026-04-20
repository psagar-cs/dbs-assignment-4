import Link from "next/link";
import { AuthForm } from "../../../components/auth-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-6 py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <section>
          <p className="text-sm uppercase tracking-[0.22em] text-storm/60">Create account</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight">Build a dashboard that follows your cities.</h1>
          <p className="mt-5 max-w-md text-lg leading-8 text-storm/75">
            Save favorites, keep the latest conditions in view, and let Supabase Realtime handle live refreshes.
          </p>
          <Link className="mt-8 inline-block text-sm font-semibold text-storm underline" href="/auth/login">
            Already have an account? Sign in.
          </Link>
        </section>

        <AuthForm mode="sign-up" />
      </div>
    </main>
  );
}
