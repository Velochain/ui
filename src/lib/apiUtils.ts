import { IUser } from "@/models/User";
import { STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET } from "./config";

export const refreshAccessToken = async (user: IUser) => {
  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${STRAVA_CLIENT_ID}&client_secret=${STRAVA_CLIENT_SECRET}&refresh_token=${user.refreshToken}&grant_type=refresh_token`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  console.log("data", data);

  user.accessToken = data.access_token;
  user.expiresAt = new Date(data.expires_at);
  await user.save();
  return data;
};

export const fetchUserActivities = async (user: IUser) => {
  if (user.expiresAt < new Date()) {
    await refreshAccessToken(user);
  }
  const response = await fetch(
    `https://www.strava.com/api/v3/athlete/activities?page=${1}&after=${
      user.lastSyncedAt
    }`,
    {
      headers: {
        Authorization: `Bearer ${user.accessToken}`,
      },
    }
  );
  return response.json();
};
