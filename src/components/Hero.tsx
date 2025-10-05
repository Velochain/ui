import { Button } from "@/components/ui/button";
import { Bike, TrendingUp, Award } from "lucide-react";
import heroImage from "@/assets/hero-cycling.jpg";
import logo from "@/assets/velocha-logo.png";

const Hero = () => {
  return (
    <div className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/95 to-background/80" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl">
          {/* <div className="mb-6">
            <img src={logo.src} alt="VeloChain" className="h-40" />
          </div> */}

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Ride More,
            <br />
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Earn More
            </span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-2xl">
            Connect your Strava account and turn every kilometer into rewards.
            The more you cycle, the more you earn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="hero" size="lg" className="text-lg">
              Connect Strava
            </Button>
            <Button variant="outline" size="lg" className="text-lg">
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Bike className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">2.5K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Cyclists</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold">450K</span>
              </div>
              <p className="text-sm text-muted-foreground">KMs Tracked</p>
            </div>
            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold">$125K</span>
              </div>
              <p className="text-sm text-muted-foreground">Earned Total</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
