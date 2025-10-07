import User, { IUser } from "@/models/User";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from "@/lib/config";
import { NextRequest, NextResponse } from "next/server";
import { refreshAccessToken } from "@/lib/apiUtils";

export async function GET(request: NextRequest) {
  // const token = request.cookies.get("strava_token")?.value;
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page") || "1";
  const perPage = searchParams.get("per_page") || "10";

  const user = await User.findOne({ address: searchParams.get("address") });
  const after = user.lastSyncedAt;

  if (user.expiresAt < new Date()) {
    await refreshAccessToken(user);
  }

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated with Strava" },
      { status: 401 }
    );
  }

  try {
    // const response = await fetch(
    //   `https://www.strava.com/api/v3/athlete/activities?page=${page}&after=${after}`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${user.accessToken}`,
    //     },
    //   }
    // );

    // console.log("response", response, user.accessToken);

    const activities = user.activities || [];
    console.log("activities", activities);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
