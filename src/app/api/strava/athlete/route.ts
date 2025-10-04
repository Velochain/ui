import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("strava_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Not authenticated with Strava" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch athlete data");
    }

    const athlete = await response.json();
    return NextResponse.json(athlete);
  } catch (error) {
    console.error("Error fetching athlete:", error);
    return NextResponse.json(
      { error: "Failed to fetch athlete data" },
      { status: 500 }
    );
  }
}
