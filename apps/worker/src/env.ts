import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

export const env = {
  supabaseUrl: required("SUPABASE_URL"),
  supabaseSecretKey: required("SUPABASE_SECRET_KEY"),
  openMeteoBaseUrl: process.env.OPEN_METEO_BASE_URL ?? "https://api.open-meteo.com",
  pollIntervalMs: Number(process.env.POLL_INTERVAL_MS ?? "30000")
};
