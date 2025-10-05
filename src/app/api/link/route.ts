import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { address, stravaId } = await request.json();

    //get strava tokens
    const token = request.cookies.get("strava_token")?.value;
    const refreshToken = request.cookies.get("strava_refresh_token")?.value;
    const expiresAt = request.cookies.get("strava_token_expires_at")?.value;

    //   if (!token || !refreshToken || !expiresAt) {
    //     return NextResponse.json(
    //       { error: "Strava tokens not found" },
    //       { status: 401 }
    //     );
    //   }

    //   const response = await fetch("https://www.strava.com/api/v3/athlete", {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   });

    //   if (!response.ok) {
    //     return NextResponse.json(
    //       { error: "Failed to fetch athlete data" },
    //       { status: 500 }
    //     );
    //   }

    //   const athlete = await response.json();

    const _user = await User.findOne({ address });
    if (_user) {
      return NextResponse.json({ message: "User already linked" });
    }

    const user = new User({
      address,
      stravaId,
      accessToken: token || "",
      refreshToken: refreshToken || "",
      expiresAt: new Date(Number(expiresAt) * 1000 || 0),
    });

    await user.save();
    return NextResponse.json({ message: "User linked" });
  } catch (error) {
    console.error("Link user error:", error);
    return NextResponse.json({ error: "Failed to link user" }, { status: 500 });
  }
}
