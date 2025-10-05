"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useThor, useWallet } from "@vechain/dapp-kit-react";
import { cycle2earnAbi } from "@/lib/abis/cycle2earn";
import { useMutation } from "@tanstack/react-query";

const LinkAccount = () => {
  const searchParams = useSearchParams();
  const { account, signer } = useWallet();
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );
  const [stravaProfile, setStravaProfile] = useState<Record<
    string,
    string | number
  > | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const { contracts } = useThor();

  const cycleToEarnContract = contracts.load(
    "0x90ae6877c3fd0124f10a4e41042a97a61e25b765",
    cycle2earnAbi,
    signer
  );

  const connectAccount = async () => {
    const tx = await cycleToEarnContract.transact.connectStrava(
      String(stravaProfile!.id)
    );
    await tx.wait();
  };

  const linkAccount = async () => {
    try {
      const response = await fetch("/api/link", {
        method: "POST",
        body: JSON.stringify({ address: account, stravaId: stravaProfile!.id }),
      });
      return response.json();
    } catch (error) {
      console.error("Error linking account:", error);
    }
  };

  const { mutate: connectAccountMutation } = useMutation({
    mutationFn: connectAccount,
    onSuccess: async () => {
      await linkAccount();
      // router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Error connecting account:", error);
    },
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated with Strava
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/strava/athlete");
        setIsAuthenticated(response.ok);
        const data = await response.json();
        setStravaProfile(data);
      } catch {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);
  useEffect(() => {
    const handleStravaCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        setStatus("error");
        setMessage("Strava authorization was denied");
        return;
      }

      if (!isAuthenticated) {
        setStatus("error");
        setMessage("No authorization code received");
        return;
      }

      if (!account) {
        setStatus("error");
        setMessage("No wallet connected. Please connect your wallet first.");
        return;
      }

      try {
        // Exchange code for tokens (this should be done via edge function in production)
        // For now, we'll store the code and handle it later
        // const { data: { user } } = await supabase.auth.getUser();

        if (!account) {
          setStatus("error");
          setMessage("Please sign in to link your account");
          return;
        }

        // Update profile with Strava connection
        // In production, you'd call an edge function here to exchange the code
        setStatus("success");
        setMessage("Successfully linked Strava account to your wallet!");

        // setTimeout(() => {
        //   router.push("/dashboard");
        // }, 2000);
      } catch (err) {
        console.error("Error linking accounts:", err);
        setStatus("error");
        setMessage("Failed to link accounts. Please try again.");
      }
    };

    handleStravaCallback();
  }, [searchParams, account, router, isAuthenticated]);

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-md mx-auto">
          <Card className="p-8 border-border">
            <div className="flex flex-col items-center text-center">
              {status === "loading" && (
                <>
                  <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Linking Accounts</h2>
                  <p className="text-muted-foreground">
                    Please wait while we connect your Strava account to your
                    wallet...
                  </p>
                </>
              )}

              {status === "success" && (
                <>
                  <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Success!</h2>
                  <p className="text-muted-foreground mb-4">{message}</p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to dashboard...
                  </p>
                  <Button
                    className="mt-5"
                    onClick={() => connectAccountMutation()}
                  >
                    Link Accounts
                  </Button>
                </>
              )}

              {status === "error" && (
                <>
                  <XCircle className="h-12 w-12 text-destructive mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Error</h2>
                  <p className="text-muted-foreground mb-6">{message}</p>
                  <Button onClick={() => router.push("/dashboard")}>
                    Back to Dashboard
                  </Button>
                </>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default LinkAccount;
