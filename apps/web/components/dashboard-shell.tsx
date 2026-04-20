"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { FavoriteCityView, WeatherCurrent } from "@weather/shared";
import { getWeatherCodeLabel, getWeatherEmoji } from "@weather/shared";
import { createSupabaseBrowserClient } from "../lib/supabase-browser";

type Props = {
  initialCities: FavoriteCityView[];
};

function formatTimestamp(timestamp: string | null) {
  if (!timestamp) return "Awaiting first worker sync";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(timestamp));
}

function WeatherCard({ city, weather }: { city: FavoriteCityView; weather: WeatherCurrent | null }) {
  return (
    <article className="rounded-[32px] bg-white/80 p-6 shadow-panel backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-storm/55">Favorite city</p>
          <h3 className="mt-2 text-2xl font-semibold">
            {city.name}, {city.country}
          </h3>
          <p className="text-sm text-storm/70">{city.admin1 ?? city.timezone}</p>
        </div>
        <div className="text-4xl">{getWeatherEmoji(weather?.weather_code)}</div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Metric label="Temperature" value={weather?.temperature != null ? `${weather.temperature}°C` : "--"} />
        <Metric
          label="Feels like"
          value={weather?.apparent_temperature != null ? `${weather.apparent_temperature}°C` : "--"}
        />
        <Metric label="Wind" value={weather?.wind_speed != null ? `${weather.wind_speed} km/h` : "--"} />
        <Metric label="Precipitation" value={weather?.precipitation != null ? `${weather.precipitation} mm` : "--"} />
      </div>

      <div className="mt-6 rounded-2xl bg-mist px-4 py-3 text-sm text-storm">
        <p>{getWeatherCodeLabel(weather?.weather_code)}</p>
        <p className="mt-1 text-storm/70">Last updated {formatTimestamp(weather?.last_polled_at ?? null)}</p>
        {weather?.fetch_status === "error" && weather.error_message ? (
          <p className="mt-2 text-red-600">{weather.error_message}</p>
        ) : null}
      </div>
    </article>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-storm/10 bg-white px-4 py-3">
      <p className="text-xs uppercase tracking-[0.16em] text-storm/55">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
    </div>
  );
}

export function DashboardShell({ initialCities }: Props) {
  const [cities, setCities] = useState(initialCities);

  useEffect(() => {
    setCities(initialCities);
  }, [initialCities]);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const ids = initialCities.map((item) => item.id);

    if (ids.length === 0) {
      return undefined;
    }

    const channel = supabase
      .channel("weather-current")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "weather_current"
        },
        (payload) => {
          const next = payload.new as WeatherCurrent;

          setCities((current) =>
            current.map((city) =>
              city.id === next.city_id
                ? {
                    ...city,
                    weather_current: next
                  }
                : city
            )
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [initialCities]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-storm/55">Live dashboard</p>
          <h1 className="mt-2 text-5xl font-semibold leading-tight">Weather that keeps moving while you watch</h1>
        </div>
        <Link
          className="rounded-2xl border border-storm/15 bg-white/70 px-4 py-3 text-sm font-semibold text-storm shadow-panel"
          href="/auth/login"
        >
          Switch account
        </Link>
      </div>

      {cities.length === 0 ? (
        <div className="rounded-[28px] border border-dashed border-storm/20 bg-white/60 px-6 py-10 text-storm/70 shadow-panel">
          No favorites yet. Search for a city below to start your dashboard.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {cities.map((city) => (
            <WeatherCard city={city} key={city.id} weather={city.weather_current} />
          ))}
        </div>
      )}
    </div>
  );
}
