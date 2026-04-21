"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "./supabase-server";

export async function addFavorite(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const cityPayload = {
    name: String(formData.get("name")),
    country: String(formData.get("country")),
    admin1: String(formData.get("admin1") || "") || null,
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    timezone: String(formData.get("timezone"))
  };

  const { data: existingCity, error: existingCityError } = await supabase
    .from("cities")
    .select("id")
    .eq("name", cityPayload.name)
    .eq("country", cityPayload.country)
    .eq("latitude", cityPayload.latitude)
    .eq("longitude", cityPayload.longitude)
    .maybeSingle();

  if (existingCityError) {
    throw new Error(`Failed to look up city: ${existingCityError.message}`);
  }

  let cityId = existingCity?.id;

  if (!cityId) {
    const { data: insertedCity, error: insertCityError } = await supabase
      .from("cities")
      .insert(cityPayload)
      .select("id")
      .single();

    if (insertCityError) {
      throw new Error(`Failed to create city: ${insertCityError.message}`);
    }

    cityId = insertedCity.id;
  }

  const { error: favoriteError } = await supabase.from("user_favorites").upsert({
    user_id: user.id,
    city_id: cityId
  });

  if (favoriteError) {
    throw new Error(`Failed to save favorite: ${favoriteError.message}`);
  }

  revalidatePath("/dashboard");
}

export async function removeFavorite(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated.");
  }

  const cityId = String(formData.get("city_id"));

  const { error } = await supabase
    .from("user_favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("city_id", cityId);

  if (error) {
    throw new Error(`Failed to remove favorite: ${error.message}`);
  }

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
