
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export type SimulationParams = {
  marketingSpend: number;
  price: number;
  competitorActivity: number;
};

type SimulationPanelProps = {
  params: SimulationParams;
  onParamsChange: (params: SimulationParams) => void;
};

export function SimulationPanel({ params, onParamsChange }: SimulationPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Demand Simulation</CardTitle>
        <CardDescription>
          Adjust market factors to see their impact on demand in real-time.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-4">
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="marketing-spend">Marketing Spend</Label>
            <span className="w-20 text-right font-mono text-sm text-muted-foreground">
              ₹{params.marketingSpend}k
            </span>
          </div>
          <Slider
            id="marketing-spend"
            min={10}
            max={1000}
            step={10}
            value={[params.marketingSpend]}
            onValueChange={([value]) =>
              onParamsChange({ ...params, marketingSpend: value })
            }
          />
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="price">Product Price</Label>
            <span className="w-20 text-right font-mono text-sm text-muted-foreground">
              ₹{params.price.toLocaleString('en-IN')}
            </span>
          </div>
          <Slider
            id="price"
            min={19999}
            max={99999}
            step={1000}
            value={[params.price]}
            onValueChange={([value]) => onParamsChange({ ...params, price: value })}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="competitor-activity">Competitor Activity</Label>
            <span className="w-20 text-right font-mono text-sm text-muted-foreground">
              {params.competitorActivity}%
            </span>
          </div>
          <Slider
            id="competitor-activity"
            min={0}
            max={100}
            step={5}
            value={[params.competitorActivity]}
            onValueChange={([value]) =>
              onParamsChange({ ...params, competitorActivity: value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
