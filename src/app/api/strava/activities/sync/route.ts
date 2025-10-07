import { analyzeActivity } from "@/lib/ai";
import { fetchUserActivities } from "@/lib/apiUtils";
import User from "@/models/User";
import Activity from "@/models/Activity";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { address } = await request.json();
    console.log("address", address);
    const user = await User.findOne({ address: address });
    console.log("user", user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const activities = await fetchUserActivities(user);
    const scores = await analyzeActivity(activities);

    // Create Activity documents and collect their IDs
    const activityIds = [];
    for (let i = 0; i < activities.length; i++) {
      const activity = activities[i];
      const score = scores[i];

      // Check if activity already exists
      const existingActivity = await Activity.findOne({
        stravaId: activity.id.toString(),
      });

      if (!existingActivity) {
        // Create new activity
        const newActivity = new Activity({
          userId: user._id,
          stravaId: activity.id.toString(),
          name: activity.name,
          distance: activity.distance,
          duration: activity.elapsed_time,
          elevation: activity.elev_high || activity.elev_low,
          startDate: new Date(activity.start_date),
          endDate: activity.end_date ? new Date(activity.end_date) : undefined,
          earned: (score.score * 1) / 100,
          claimed: false,
          score: score.score,
        });

        await newActivity.save();
        activityIds.push(newActivity._id);
      } else {
        // Update existing activity with new score
        existingActivity.earned = (score.score * 1) / 100;
        existingActivity.score = score.score;
        await existingActivity.save();
        activityIds.push(existingActivity._id);
      }
    }

    // Update user's activities array with ObjectIds
    user.activities = activityIds;
    user.lastSyncedAt = new Date();
    await user.save();
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error syncing activities:", JSON.stringify(error));
    return NextResponse.json(
      { error: "Failed to sync activities" },
      { status: 500 }
    );
  }
}

// {
//     resource_state: 2,
//     athlete: { id: 105731260, resource_state: 1 },
//     name: 'Test Walk',
//     distance: 24.9,
//     moving_time: 26,
//     elapsed_time: 26,
//     total_elevation_gain: 0,
//     type: 'Walk',
//     sport_type: 'Walk',
//     id: 16044101182,
//     start_date: '2025-10-05T16:31:51Z',
//     start_date_local: '2025-10-05T17:31:51Z',
//     timezone: '(GMT+01:00) Africa/Lagos',
//     utc_offset: 3600,
//     location_city: null,
//     location_state: null,
//     location_country: null,
//     achievement_count: 0,
//     kudos_count: 0,
//     comment_count: 0,
//     athlete_count: 1,
//     photo_count: 0,
//     map: {
//       id: 'a16044101182',
//       summary_polyline: 'iaqo@adxTVDOK',
//       resource_state: 2
//     },
//     trainer: false,
//     commute: false,
//     manual: false,
//     private: false,
//     visibility: 'everyone',
//     flagged: false,
//     gear_id: null,
//     start_latlng: [ 7.956851, 3.569454 ],
//     end_latlng: [ 7.956811, 3.569487 ],
//     average_speed: 0.958,
//     max_speed: 1.56,
//     has_heartrate: false,
//     heartrate_opt_out: false,
//     display_hide_heartrate_option: false,
//     elev_high: 295.4,
//     elev_low: 295.4,
//     upload_id: 17126457382,
//     upload_id_str: '17126457382',
//     external_id: '13b7422d-268c-41c2-9b48-a28e664b2337-activity.fit',
//     from_accepted_tag: false,
//     pr_count: 0,
//     total_photo_count: 0,
//     has_kudoed: false
//   }
