import { NextRequest, NextResponse } from "next/server";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from "@/lib/config";

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.json(
      { error: "Strava authorization failed" },
      { status: 400 }
    );
  }

  if (!code) {
    return NextResponse.json(
      { error: "Strava authorization failed" },
      { status: 400 }
    );
  }

  const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: STRAVA_CLIENT_ID,
      client_secret: STRAVA_CLIENT_SECRET,
      code,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log(tokenData);

  return NextResponse.json(tokenData);
}
