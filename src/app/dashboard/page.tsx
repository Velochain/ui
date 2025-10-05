"use client";

import ActivityCard from "@/components/ActivityCard";
import EarningsCard from "@/components/EarningsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, Target, Flame, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { useWallet, WalletButton } from "@vechain/dapp-kit-react";

const mockActivities = [
  {
    id: "1",
    title: "Morning Mountain Ride",
    distance: 42.5,
    duration: "2h 15m",
    elevation: 856,
    earned: 12.75,
    date: "Today at 7:30 AM",
    claimed: false,
  },
  {
    id: "2",
    title: "Evening City Loop",
    distance: 18.2,
    duration: "1h 05m",
    elevation: 145,
    earned: 5.46,
    date: "Yesterday at 6:00 PM",
    claimed: true,
  },
  {
    id: "3",
    title: "Weekend Long Ride",
    distance: 87.3,
    duration: "4h 32m",
    elevation: 1432,
    earned: 26.19,
    date: "2 days ago",
    claimed: false,
  },
];

const Dashboard = () => {
  // const { isConnected, connectWallet } = useWallet();
  // const { user } = useAuth();
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  const [activities, setActivities] = useState(mockActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const { account } = useWallet();
  //   useEffect(() => {
  //     const checkStravaConnection = async () => {
  //       if (user) {
  //         const { data } = await supabase
  //           .from("profiles")
  //           .select("strava_athlete_id")
  //           .eq("id", user.id)
  //           .single();

  //         setIsStravaConnected(!!data?.strava_athlete_id);
  //       }
  //     };

  //     checkStravaConnection();
  //   }, [user]);

  const handleStravaConnect = () => {
    const clientId = "139598";
    const redirectUri = `${window.location.origin}/link-account`;
    const scope = "activity:read_all";
    window.location.href = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
  };

  const handleSelectAll = () => {
    const unclaimedIds = activities
      .filter((activity) => !activity.claimed)
      .map((activity) => activity.id);
    setSelectedActivities(unclaimedIds);
  };

  const handleActivityToggle = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((activityId) => activityId !== id)
        : [...prev, id]
    );
  };

  const handleClaimSelected = () => {
    setActivities((prev) =>
      prev.map((activity) =>
        selectedActivities.includes(activity.id)
          ? { ...activity, claimed: true }
          : activity
      )
    );
    setSelectedActivities([]);
  };

  // Show connect wallet prompt if not connected
  if (!account) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-12 border-border">
              <WalletIcon className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
              <p className="text-muted-foreground mb-8">
                To start tracking your cycling activities and earning rewards,
                please connect your wallet first.
              </p>
              <WalletButton />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show connect Strava prompt if wallet connected but Strava not connected
  if (!isStravaConnected) {
    return (
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-12 border-border">
              <Bike className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Connect Strava</h1>
              <p className="text-muted-foreground mb-8">
                Link your Strava account to start syncing your cycling
                activities and earning rewards.
              </p>
              <Button size="lg" onClick={handleStravaConnect}>
                Connect Strava
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // Show full dashboard
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your rides and earnings
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <Bike className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">
                Total Distance
              </span>
            </div>
            <p className="text-3xl font-bold">148 km</p>
            <p className="text-sm text-muted-foreground mt-1">This week</p>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <Flame className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Active Days</span>
            </div>
            <p className="text-3xl font-bold">5/7</p>
            <p className="text-sm text-muted-foreground mt-1">Keep it up!</p>
          </Card>

          <Card className="p-6 border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">Weekly Goal</span>
            </div>
            <p className="text-3xl font-bold">74%</p>
            <p className="text-sm text-muted-foreground mt-1">148/200 km</p>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Activities</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSelectAll}>
                  Select All Unclaimed
                </Button>
                {selectedActivities.length > 0 && (
                  <Button size="sm" onClick={handleClaimSelected}>
                    Claim Selected ({selectedActivities.length})
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-4">
              {activities.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  {...activity}
                  selected={selectedActivities.includes(activity.id)}
                  onToggle={() => handleActivityToggle(activity.id)}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Earnings</h2>
            <EarningsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
