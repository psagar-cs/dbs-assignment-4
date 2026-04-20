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

  const { data: city, error: cityError } = await supabase
    .from("cities")
    .upsert(cityPayload, {
      onConflict: "name,country,latitude,longitude"
    })
    .select("id")
    .single();

  if (cityError) {
    throw cityError;
  }

  const { error: favoriteError } = await supabase.from("user_favorites").upsert({
    user_id: user.id,
    city_id: city.id
  });

  if (favoriteError) {
    throw favoriteError;
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
    throw error;
  }

  revalidatePath("/dashboard");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
