import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear the Strava tokens from cookies
    const response = NextResponse.json({ success: true });

    // Remove the Strava token cookies
    response.cookies.set("strava_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
    });

    response.cookies.set("strava_refresh_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Error unlinking Strava:", error);
    return NextResponse.json(
      { error: "Failed to unlink Strava account" },
      { status: 500 }
    );
  }
}
