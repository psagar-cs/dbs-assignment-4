export type City = {
  id: string;
  name: string;
  country: string;
  admin1: string | null;
  latitude: number;
  longitude: number;
  timezone: string;
};

export type WeatherCurrent = {
  city_id: string;
  temperature: number | null;
  apparent_temperature: number | null;
  wind_speed: number | null;
  precipitation: number | null;
  weather_code: number | null;
  observed_at: string | null;
  last_polled_at: string | null;
  fetch_status: "ok" | "error";
  error_message: string | null;
};

export type FavoriteCityView = City & {
  weather_current: WeatherCurrent | null;
};

export type OpenMeteoGeocodeResult = {
  id?: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone: string;
};

const WEATHER_CODE_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow",
  73: "Moderate snow",
  75: "Heavy snow",
  80: "Rain showers",
  81: "Heavy rain showers",
  82: "Violent rain showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Severe thunderstorm with hail"
};

export function getWeatherCodeLabel(code: number | null | undefined): string {
  if (code == null) {
    return "Unknown";
  }

  return WEATHER_CODE_LABELS[code] ?? "Unknown";
}

export function getWeatherEmoji(code: number | null | undefined): string {
  if (code == null) {
    return "??";
  }

  if (code === 0) return "☀️";
  if ([1, 2].includes(code)) return "⛅";
  if (code === 3) return "☁️";
  if ([45, 48].includes(code)) return "🌫️";
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";

  return "🌤️";
}
