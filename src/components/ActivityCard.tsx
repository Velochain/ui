import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Bike, Clock, Mountain, Coins, Check } from "lucide-react";

interface ActivityCardProps {
  id: string;
  title: string;
  distance: number;
  duration: string;
  elevation: number;
  earned: number;
  date: string;
  claimed?: boolean;
  selected?: boolean;
  onToggle?: () => void;
}

const ActivityCard = ({
  id,
  title,
  distance,
  duration,
  elevation,
  earned,
  date,
  claimed = false,
  selected = false,
  onToggle,
}: ActivityCardProps) => {
  return (
    <Card className={`p-6 hover:shadow-[var(--shadow-card)] transition-all bg-card border-border ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={claimed || selected}
            disabled={claimed}
            onCheckedChange={onToggle}
            className={claimed ? "opacity-50" : ""}
          />
          <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10">
            <Bike className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {title}
              {claimed && <Check className="h-4 w-4 text-primary" />}
            </h3>
            <p className="text-sm text-muted-foreground">{date}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 text-sm mb-4">
        <div>
          <p className="text-muted-foreground mb-1">Distance</p>
          <p className="font-semibold text-lg">{distance} km</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Time
          </p>
          <p className="font-semibold text-lg">{duration}</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 flex items-center gap-1">
            <Mountain className="h-3 w-3" />
            Elevation
          </p>
          <p className="font-semibold text-lg">{elevation}m</p>
        </div>
        <div>
          <p className="text-muted-foreground mb-1 flex items-center gap-1">
            <Coins className="h-3 w-3" />
            Earned
          </p>
          <p className="font-semibold text-lg text-primary">${earned}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {claimed ? "Already claimed" : "Select to claim reward"}
        </span>
        {claimed && (
          <div className="flex items-center gap-1 text-primary">
            <Check className="h-4 w-4" />
            <span className="text-sm font-semibold">${earned}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
