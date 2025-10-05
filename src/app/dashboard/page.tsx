"use client";

import ActivityCard from "@/components/ActivityCard";
import EarningsCard from "@/components/EarningsCard";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bike, Target, Flame, Wallet as WalletIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useThor, useWallet, WalletButton } from "@vechain/dapp-kit-react";
import { cycle2earnAbi } from "@/lib/abis/cycle2earn";
import { useQuery } from "@tanstack/react-query";
import { Activity } from "../components/StravaIntegration";

const Dashboard = () => {
  // const { isConnected, connectWallet } = useWallet();
  // const { user } = useAuth();
  const [isStravaConnected, setIsStravaConnected] = useState(false);
  // const [activities, setActivities] = useState(mockActivities);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const { contracts } = useThor();

  const cycleToEarnContract = contracts.load(
    "0x90ae6877c3fd0124f10a4e41042a97a61e25b765",
    cycle2earnAbi
  );

  const { account } = useWallet();

  const getRewards = async () => {
    const response = await cycleToEarnContract.read.getUserRewards(account);
    return response;
  };

  const { data: rewards } = useQuery({
    queryKey: ["rewards"],
    queryFn: getRewards,
    enabled: !!account,
  });

  console.log("rewards", rewards);

  useEffect(() => {
    const checkStravaConnection = async () => {
      if (account) {
        const stravaId = await cycleToEarnContract.read.getUserStravaId(
          account
        );
        console.log("stravaId", stravaId[0]);
        setIsStravaConnected(stravaId[0] !== "");
        if (stravaId[0] !== "") {
          const linkAccount = async () => {
            try {
              const response = await fetch("/api/link", {
                method: "POST",
                body: JSON.stringify({
                  address: account,
                  stravaId: stravaId[0],
                }),
              });
              return response.json();
            } catch (error) {
              console.error("Error linking account:", error);
            }
          };
          linkAccount();
        }
      }
    };

    checkStravaConnection();
  }, [account]);

  const handleStravaConnect = () => {
    window.location.href = "/api/auth";
  };

  const handleSelectAll = () => {
    const unclaimedIds = activities
      ?.filter((activity) => !activity?.claimed)
      .map((activity) => String(activity.id));
    setSelectedActivities(unclaimedIds || []);
  };

  const handleActivityToggle = (id: string) => {
    setSelectedActivities((prev) =>
      prev.includes(id)
        ? prev.filter((activityId) => activityId !== id)
        : [...prev, id]
    );
  };

  const handleClaimSelected = async () => {
    // setActivities((prev) =>
    //   prev.map((activity) =>
    //     selectedActivities.includes(activity.id)
    //       ? { ...activity, claimed: true }
    //       : activity
    //   )
    // );
    const response = await fetch("/api/strava/activities/claim", {
      method: "POST",
      body: JSON.stringify({
        address: account,
        id: selectedActivities[0],
      }),
    });
    if (!response.ok) throw new Error("Failed to claim activities");
    return response.json();
    setSelectedActivities([]);
  };

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["strava-activities"],
    queryFn: async () => {
      const response = await fetch(
        `/api/strava/activities?per_page=5&address=${account}`
      );
      if (!response.ok) throw new Error("Failed to fetch activities");
      return response.json() as Promise<Activity[]>;
    },
    enabled: !!account,
  });

  console.log(activities);

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
        {/* <div className="grid md:grid-cols-3 gap-6 mb-8">
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
        </div> */}

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
              {activities?.map((activity) => (
                <ActivityCard
                  key={activity.id}
                  {...activity}
                  selected={selectedActivities.includes(String(activity.id))}
                  onToggle={() => handleActivityToggle(String(activity.id))}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Earnings</h2>
            <EarningsCard
              rewards={
                typeof rewards?.[0] === "object"
                  ? rewards?.[0]?.[0]?.toString()
                  : "0"
              }
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
