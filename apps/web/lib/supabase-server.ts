import { cookies } from "next/headers";
import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { getPublicEnv } from "./env";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const env = getPublicEnv();

  if (!env.url || !env.anonKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      }
    }
  });
}
