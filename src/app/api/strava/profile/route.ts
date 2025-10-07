import { refreshAccessToken } from "@/lib/apiUtils";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // const token = request.cookies.get("strava_token")?.value;
  const { searchParams } = new URL(request.url);
  const user = await User.findOne({
    address: searchParams.get("address"),
  }).populate("activities");

  if (!user) {
    return NextResponse.json(
      { error: "Not authenticated with Strava" },
      { status: 401 }
    );
  }

  if (user.expiresAt <= new Date()) {
    await refreshAccessToken(user);
  }
  console.log("lastSyncedAt", user.lastSyncedAt);

  try {
    const _activities = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${1}&after=${new Date(
        user.lastSyncedAt
      ).getTime()}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );
    const response = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    });

    const athlete = await response.json();
    const activities = await _activities.json();
    console.log("activities", user.activities);
    console.log({ ...athlete, activitiesToSync: activities.length });
    return NextResponse.json({
      ...user.toObject(),
      activitiesToSync: activities.length,
    });
  } catch (error) {
    console.error("Error fetching athlete:", error);
    return NextResponse.json(
      { error: "Failed to fetch athlete data" },
      { status: 500 }
    );
  }
}
