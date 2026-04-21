"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "./env";

export function createSupabaseBrowserClient() {
  const env = getPublicEnv();

  if (!env.url || !env.publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createBrowserClient(env.url, env.publishableKey);
}
