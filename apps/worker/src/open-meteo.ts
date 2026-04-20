export type CurrentWeatherPayload = {
  temperature: number | null;
  apparent_temperature: number | null;
  wind_speed: number | null;
  precipitation: number | null;
  weather_code: number | null;
  observed_at: string | null;
};

type OpenMeteoCurrentResponse = {
  current?: {
    time?: string;
    temperature_2m?: number;
    apparent_temperature?: number;
    wind_speed_10m?: number;
    precipitation?: number;
    weather_code?: number;
  };
};

export async function fetchCurrentWeather(baseUrl: string, latitude: number, longitude: number): Promise<CurrentWeatherPayload> {
  const url = new URL("/v1/forecast", baseUrl);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    ["temperature_2m", "apparent_temperature", "wind_speed_10m", "precipitation", "weather_code"].join(",")
  );
  url.searchParams.set("timezone", "auto");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with ${response.status}`);
  }

  const data = (await response.json()) as OpenMeteoCurrentResponse;
  const current = data.current ?? {};

  return {
    temperature: current.temperature_2m ?? null,
    apparent_temperature: current.apparent_temperature ?? null,
    wind_speed: current.wind_speed_10m ?? null,
    precipitation: current.precipitation ?? null,
    weather_code: current.weather_code ?? null,
    observed_at: current.time ?? null
  };
}
