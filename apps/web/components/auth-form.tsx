"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "../lib/supabase-browser";

type Props = {
  mode: "login" | "sign-up";
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);

    try {
      const email = String(formData.get("email"));
      const password = String(formData.get("password"));
      const supabase = createSupabaseBrowserClient();

      const response =
        mode === "login"
          ? await supabase.auth.signInWithPassword({ email, password })
          : await supabase.auth.signUp({ email, password });

      if (response.error) {
        throw response.error;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-[28px] bg-white/80 p-8 shadow-panel backdrop-blur"
    >
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-storm/60">
          {mode === "login" ? "Welcome back" : "Create account"}
        </p>
        <h1 className="mt-2 text-4xl font-semibold">
          {mode === "login" ? "Sign in to your forecast" : "Build your weather board"}
        </h1>
      </div>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">Email</span>
        <input
          className="w-full rounded-2xl border border-storm/10 bg-white px-4 py-3 outline-none transition focus:border-teal"
          name="email"
          type="email"
          required
        />
      </label>

      <label className="block">
        <span className="mb-2 block text-sm font-medium">Password</span>
        <input
          className="w-full rounded-2xl border border-storm/10 bg-white px-4 py-3 outline-none transition focus:border-teal"
          name="password"
          type="password"
          minLength={6}
          required
        />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        className="w-full rounded-2xl bg-storm px-4 py-3 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
        disabled={pending}
        type="submit"
      >
        {pending ? "Working..." : mode === "login" ? "Sign in" : "Create account"}
      </button>
    </form>
  );
}
