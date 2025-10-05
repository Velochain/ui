import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, TrendingUp, ArrowUpRight } from "lucide-react";
import rewardsPattern from "@/assets/rewards-pattern.jpg";

const EarningsCard = ({ rewards }: { rewards?: string }) => {
  return (
    <Card className="p-8 relative overflow-hidden border-border">
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url(${rewardsPattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-5 w-5 text-primary" />
          <span className="text-sm text-muted-foreground">Total Earnings</span>
        </div>

        <div className="mb-6">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {rewards} B3TR
          </h2>
          {/* <div className="flex items-center gap-2 mt-2 text-sm">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-green-500 font-medium">+12.5%</span>
            <span className="text-muted-foreground">from last month</span>
          </div> */}
        </div>

        <Button variant="default" className="w-full" size="lg">
          Withdraw Funds
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default EarningsCard;
