import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("strava_token")?.value;
  const { searchParams } = new URL(request.url);
  const athleteId = searchParams.get("athlete_id");

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated with Strava" },
      { status: 401 }
    );
  }

  if (!athleteId) {
    return NextResponse.json(
      { error: "Athlete ID is required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch athlete stats");
    }

    const stats = await response.json();
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch athlete stats" },
      { status: 500 }
    );
  }
}
