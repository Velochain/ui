import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Activity from "@/models/Activity";
import Reward from "@/models/Reward";
import jwt from "jsonwebtoken";

// Get user activities
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const activities = await Activity.find({ userId: decoded.userId })
      .sort({ startDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Activity.countDocuments({ userId: decoded.userId });

    return NextResponse.json({
      success: true,
      activities,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

// Sync activities from Strava
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.userId);

    if (!user || !user.accessToken) {
      return NextResponse.json(
        { error: "Strava not connected" },
        { status: 400 }
      );
    }

    // Get activities from Strava
    const activitiesResponse = await fetch(
      "https://www.strava.com/api/v3/athlete/activities?per_page=200",
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      }
    );

    if (!activitiesResponse.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Strava activities" },
        { status: 400 }
      );
    }

    const stravaActivities = await activitiesResponse.json();

    // Filter cycling activities and sync to database
    const cyclingActivities = stravaActivities.filter(
      (activity: any) => activity.sport_type === "Ride"
    );

    let syncedCount = 0;
    let skippedCount = 0;

    for (const activity of cyclingActivities) {
      try {
        // Check if activity already exists
        const existingActivity = await Activity.findOne({
          stravaId: activity.id.toString(),
        });

        if (existingActivity) {
          skippedCount++;
          continue;
        }

        // Calculate earned rewards (0.3 tokens per km)
        const earned = Math.round(activity.distance * 0.3 * 100) / 100;

        const newActivity = new Activity({
          userId: user._id,
          stravaId: activity.id.toString(),
          name: activity.name,
          distance: activity.distance,
          duration: activity.moving_time,
          elevation: activity.total_elevation_gain || 0,
          earned,
          startDate: new Date(activity.start_date),
        });

        await newActivity.save();

        // Create reward entry
        const newReward = new Reward({
          userId: user._id,
          amount: earned,
          type: "cycling",
          activityId: activity.id.toString(),
        });

        await newReward.save();

        syncedCount++;
      } catch (error) {
        console.error(`Error syncing activity ${activity.id}:`, error);
        skippedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} activities, skipped ${skippedCount} existing activities`,
      synced: syncedCount,
      skipped: skippedCount,
    });
  } catch (error) {
    console.error("Sync activities error:", error);
    return NextResponse.json(
      { error: "Failed to sync activities" },
      { status: 500 }
    );
  }
}
