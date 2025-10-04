"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface Athlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  summit: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  weight: number;
  profile_medium: string;
  profile: string;
  friend: null;
  follower: null;
}

interface Activity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  trainer: boolean;
  commute: boolean;
  manual: boolean;
  private: boolean;
  visibility: string;
  flagged: boolean;
  gear_id: string;
  start_latlng: [number, number];
  end_latlng: [number, number];
  average_speed: number;
  max_speed: number;
  has_heartrate: boolean;
  heartrate_opt_out: boolean;
  display_hide_heartrate_option: boolean;
  elev_high: number;
  elev_low: number;
  upload_id: number;
  upload_id_str: string;
  external_id: string;
  from_accepted_tag: boolean;
  pr_count: number;
  utc_offset: number;
  has_kudoed: boolean;
}

interface Stats {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  recent_ride_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  recent_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  recent_swim_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  ytd_ride_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  ytd_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  ytd_swim_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_ride_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_swim_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
}

export default function StravaIntegration() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated with Strava
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/strava/athlete");
        setIsAuthenticated(response.ok);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Fetch athlete data
  const { data: athlete, isLoading: athleteLoading } = useQuery({
    queryKey: ["strava-athlete"],
    queryFn: async () => {
      const response = await fetch("/api/strava/athlete");
      if (!response.ok) throw new Error("Failed to fetch athlete");
      return response.json() as Promise<Athlete>;
    },
    enabled: isAuthenticated,
  });

  // Fetch activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["strava-activities"],
    queryFn: async () => {
      const response = await fetch("/api/strava/activities?per_page=5");
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json() as Promise<Activity[]>;
    },
    enabled: isAuthenticated,
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["strava-stats", athlete?.id],
    queryFn: async () => {
      const response = await fetch(
        `/api/strava/stats?athlete_id=${athlete?.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch stats");
      return response.json() as Promise<Stats>;
    },
    enabled: isAuthenticated && !!athlete?.id,
  });

  const handleStravaAuth = () => {
    window.location.href = "/api/auth";
  };

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(2) + " km";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Connect with Strava
        </h2>
        <p className="text-gray-600 mb-4">
          Connect your Strava account to view your fitness data and activities.
        </p>
        <button
          onClick={handleStravaAuth}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Connect Strava
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Athlete Info */}
      {athlete && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-4">
            {athlete.profile_medium && (
              <img
                src={athlete.profile_medium}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {athlete.firstname} {athlete.lastname}
              </h2>
              <p className="text-gray-600">@{athlete.username}</p>
              <p className="text-sm text-gray-500">
                {athlete.city}, {athlete.state}, {athlete.country}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.all_ride_totals.count}
              </p>
              <p className="text-gray-600">Total Rides</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatDistance(stats.all_ride_totals.distance)}
              </p>
              <p className="text-gray-600">Total Distance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {formatTime(stats.all_ride_totals.moving_time)}
              </p>
              <p className="text-gray-600">Total Time</p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {activities && activities.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Recent Activities
          </h3>
          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border-b border-gray-200 pb-3 last:border-b-0"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {activity.name}
                    </h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {activity.type}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{formatDistance(activity.distance)}</p>
                    <p>{formatTime(activity.moving_time)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading States */}
      {(athleteLoading || activitiesLoading || statsLoading) && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="mt-2 text-gray-600">Loading Strava data...</p>
        </div>
      )}
    </div>
  );
}
