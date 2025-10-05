import { Card } from "@/components/ui/card";
import { Activity, Wallet, Trophy, Zap } from "lucide-react";

const features = [
  {
    icon: Activity,
    title: "Track Every Ride",
    description: "Automatically sync your cycling activities from Strava and watch your earnings grow with every pedal.",
  },
  {
    icon: Wallet,
    title: "Instant Rewards",
    description: "Earn tokens for every kilometer cycled. Redeem for gear, subscriptions, or cash out anytime.",
  },
  {
    icon: Trophy,
    title: "Compete & Win",
    description: "Join challenges, compete with friends, and earn bonus rewards for hitting milestones.",
  },
  {
    icon: Zap,
    title: "Powered by Strava",
    description: "Seamlessly integrated with Strava's trusted tracking technology for accurate activity recording.",
  },
];

const Features = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, transparent, and rewarding. Start earning from your cycling activities today.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-[var(--shadow-card)] transition-all hover:-translate-y-1 bg-card border-border"
            >
              <div className="mb-4 inline-flex p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
