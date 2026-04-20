import { searchCities } from "../lib/geocode";
import { addFavorite } from "../lib/actions";

type Props = {
  query?: string;
};

export async function CitySearch({ query }: Props) {
  const results = query ? await searchCities(query).catch(() => []) : [];

  return (
    <section className="rounded-[28px] bg-white/70 p-6 shadow-panel backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-storm/60">Add a city</p>
          <h2 className="mt-2 text-2xl font-semibold">Search Open-Meteo geocoding</h2>
        </div>

        <form className="flex w-full max-w-xl gap-3" method="get">
          <input
            className="flex-1 rounded-2xl border border-storm/10 bg-white px-4 py-3 outline-none focus:border-teal"
            defaultValue={query}
            name="q"
            placeholder="Search for Chicago, Tokyo, Nairobi..."
          />
          <button className="rounded-2xl bg-teal px-5 py-3 text-sm font-semibold text-white" type="submit">
            Search
          </button>
        </form>
      </div>

      <div className="mt-6 space-y-3">
        {query && results.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-storm/15 px-4 py-6 text-sm text-storm/70">
            No matching cities found yet.
          </p>
        ) : null}

        {results.map((city) => (
          <form
            action={addFavorite}
            className="flex flex-col gap-3 rounded-3xl border border-storm/10 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between"
            key={`${city.name}-${city.latitude}-${city.longitude}`}
          >
            <div>
              <h3 className="text-lg font-semibold">
                {city.name}, {city.country}
              </h3>
              <p className="text-sm text-storm/70">
                {city.admin1 ? `${city.admin1} · ` : ""}
                {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)} · {city.timezone}
              </p>
            </div>

            <div>
              <input name="name" type="hidden" value={city.name} />
              <input name="country" type="hidden" value={city.country} />
              <input name="admin1" type="hidden" value={city.admin1 ?? ""} />
              <input name="latitude" type="hidden" value={city.latitude} />
              <input name="longitude" type="hidden" value={city.longitude} />
              <input name="timezone" type="hidden" value={city.timezone} />
              <button className="rounded-2xl bg-storm px-4 py-2 text-sm font-semibold text-white" type="submit">
                Add favorite
              </button>
            </div>
          </form>
        ))}
      </div>
    </section>
  );
}
