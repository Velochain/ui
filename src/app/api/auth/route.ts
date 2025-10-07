import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  const redirectUri = `${protocol}://${host}/api/auth`;

  console.log(redirectUri);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  console.log(code, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET);

  if (error) {
    return NextResponse.json(
      { error: "Strava authorization failed" },
      { status: 400 }
    );
  }

  if (!code) {
    // Redirect to Strava authorization
    const authUrl = new URL("https://www.strava.com/oauth/authorize");
    authUrl.searchParams.set("client_id", STRAVA_CLIENT_ID!);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "read,activity:read_all");
    authUrl.searchParams.set("state", "strava_auth");

    return NextResponse.redirect(authUrl.toString());
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`,
      {
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
      }
    );

    const tokenData = await tokenResponse.json();

    console.log(tokenData, code);

    if (!tokenResponse.ok) {
      throw new Error(tokenData.message || "Failed to get access token");
    }

    // Store token in a secure way (in production, use a database or secure session)
    const response = NextResponse.redirect(new URL("/", request.url));
    response.cookies.set("strava_token", tokenData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
    });
    response.cookies.set("strava_refresh_token", tokenData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    //set expire for token
    response.cookies.set("strava_token_expires_at", tokenData.expires_at, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: tokenData.expires_in,
    });

    return response;
  } catch (error) {
    console.error("Strava auth error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
