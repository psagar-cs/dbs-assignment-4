import type { OpenMeteoGeocodeResult } from "@weather/shared";

type OpenMeteoResponse = {
  results?: Array<{
    id?: number;
    name: string;
    country: string;
    admin1?: string;
    latitude: number;
    longitude: number;
    timezone: string;
  }>;
};

export async function searchCities(query: string): Promise<OpenMeteoGeocodeResult[]> {
  const trimmed = query.trim();

  if (trimmed.length < 2) {
    return [];
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", trimmed);
  url.searchParams.set("count", "5");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString(), {
    next: { revalidate: 0 }
  });

  if (!response.ok) {
    throw new Error("Failed to geocode city.");
  }

  const data = (await response.json()) as OpenMeteoResponse;

  return (data.results ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    country: item.country,
    admin1: item.admin1,
    latitude: item.latitude,
    longitude: item.longitude,
    timezone: item.timezone
  }));
}
