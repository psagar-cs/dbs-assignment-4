import { env } from "./env.js";
import { supabase } from "./supabase.js";
import { fetchCurrentWeather } from "./open-meteo.js";

type CityRow = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

async function getActiveCities(): Promise<CityRow[]> {
  const { data, error } = await supabase
    .from("cities")
    .select(
      `
        id,
        name,
        latitude,
        longitude,
        user_favorites!inner ( city_id )
      `
    );

  if (error) {
    throw error;
  }

  const seen = new Set<string>();

  return (data ?? []).filter((city) => {
    if (seen.has(city.id)) {
      return false;
    }

    seen.add(city.id);
    return true;
  }) as CityRow[];
}

async function markFailure(cityId: string, message: string) {
  const now = new Date().toISOString();

  await supabase.from("weather_current").upsert({
    city_id: cityId,
    last_polled_at: now,
    fetch_status: "error",
    error_message: message
  });
}

async function syncCity(city: CityRow) {
  const now = new Date().toISOString();

  try {
    const weather = await fetchCurrentWeather(env.openMeteoBaseUrl, city.latitude, city.longitude);

    const { error } = await supabase.from("weather_current").upsert({
      city_id: city.id,
      temperature: weather.temperature,
      apparent_temperature: weather.apparent_temperature,
      wind_speed: weather.wind_speed,
      precipitation: weather.precipitation,
      weather_code: weather.weather_code,
      observed_at: weather.observed_at,
      last_polled_at: now,
      fetch_status: "ok",
      error_message: null
    });

    if (error) {
      throw error;
    }

    console.log(`[worker] synced ${city.name} at ${now}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown fetch failure";
    console.error(`[worker] failed ${city.name}: ${message}`);
    await markFailure(city.id, message);
  }
}

async function cycle() {
  const cities = await getActiveCities();

  if (cities.length === 0) {
    console.log("[worker] no active favorite cities yet");
    return;
  }

  for (const city of cities) {
    await syncCity(city);
  }
}

async function main() {
  console.log(`[worker] starting poll loop with interval ${env.pollIntervalMs}ms`);

  while (true) {
    try {
      await cycle();
    } catch (error) {
      console.error("[worker] cycle failed", error);
    }

    await new Promise((resolve) => setTimeout(resolve, env.pollIntervalMs));
  }
}

main().catch((error) => {
  console.error("[worker] fatal startup error", error);
  process.exit(1);
});
