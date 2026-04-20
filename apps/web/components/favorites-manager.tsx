import { removeFavorite, signOut } from "../lib/actions";
import type { FavoriteCityView } from "@weather/shared";

type Props = {
  cities: FavoriteCityView[];
  email: string | undefined;
};

export function FavoritesManager({ cities, email }: Props) {
  return (
    <section className="rounded-[28px] bg-white/70 p-6 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-storm/60">Session</p>
          <h2 className="mt-2 text-2xl font-semibold">{email ?? "Signed in"}</h2>
        </div>

        <form action={signOut}>
          <button className="rounded-2xl border border-storm/15 px-4 py-3 text-sm font-semibold text-storm" type="submit">
            Sign out
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {cities.map((city) => (
          <div
            className="flex flex-col gap-3 rounded-3xl border border-storm/10 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
            key={city.id}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {city.name}, {city.country}
              </h3>
              <p className="text-sm text-storm/70">{city.admin1 ?? city.timezone}</p>
            </div>

            <form action={removeFavorite}>
              <input name="city_id" type="hidden" value={city.id} />
              <button className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200" type="submit">
                Remove
              </button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
