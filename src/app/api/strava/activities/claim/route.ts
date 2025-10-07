import { cycle2earnContract, thor } from "@/lib/thor";
import Activity from "@/models/Activity";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { address, ids } = await request.json();
  const user = await User.findOne({ address });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const activities = await Activity.find({ _id: { $in: ids } });
  activities.forEach((activity) => {
    activity.claimed = true;
    activity.save();
  });
  const totalEarned = activities.reduce(
    (acc, activity) => acc + activity.earned,
    0
  );
  if (totalEarned > 0) {
    cycle2earnContract.transact.addRewardAlt(
      user?.address,
      BigInt(totalEarned)
    );
  }
  user?.claimedIds.push(...ids);
  await user?.save();
  return NextResponse.json({ message: "Activity claimed" });
}
