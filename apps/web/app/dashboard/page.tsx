import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "../../lib/supabase-server";
import { DashboardShell } from "../../components/dashboard-shell";
import { CitySearch } from "../../components/city-search";
import { FavoritesManager } from "../../components/favorites-manager";
import type { FavoriteCityView } from "@weather/shared";

type DashboardPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("user_favorites")
    .select(
      `
        city_id,
        cities (
          id,
          name,
          country,
          admin1,
          latitude,
          longitude,
          timezone,
          weather_current (*)
        )
      `
    )
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  const cities: FavoriteCityView[] = (data ?? [])
    .map((row) => row.cities)
    .filter(Boolean)
    .map((city: any) => ({
      id: city.id,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
      latitude: city.latitude,
      longitude: city.longitude,
      timezone: city.timezone,
      weather_current: Array.isArray(city.weather_current) ? city.weather_current[0] ?? null : city.weather_current ?? null
    }));

  const params = await searchParams;

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <DashboardShell initialCities={cities} />
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <CitySearch query={params.q} />
        <FavoritesManager cities={cities} email={user.email} />
      </div>
    </main>
  );
}
