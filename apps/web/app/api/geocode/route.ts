import { NextResponse } from "next/server";
import { searchCities } from "../../../lib/geocode";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  try {
    const results = await searchCities(query);
    return NextResponse.json({ results });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to geocode city." },
      { status: 500 }
    );
  }
}
