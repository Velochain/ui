import { cycle2earnContract, thor } from "@/lib/thor";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { address, id } = await request.json();
  const user = await User.findOne({ address });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  cycle2earnContract.transact.addRewardAlt(user?.address, BigInt(10));
  user?.claimedIds.push(id);
  await user?.save();
  return NextResponse.json({ message: "Activity claimed" });
}
