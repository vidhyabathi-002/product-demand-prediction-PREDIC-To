
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from 'lucide-react';

export type MissingValueStrategy = 'drop' | 'mean' | 'median' | 'interpolate';

interface ConfigurationProps {
    onStart: (strategy: MissingValueStrategy) => void;
    isLoading: boolean;
}

export function Configuration({ onStart, isLoading }: ConfigurationProps) {
  const [missingValueStrategy, setMissingValueStrategy] = useState<MissingValueStrategy>('drop');
  const [scaleData, setScaleData] = useState(false);
  const [featureEngineering, setFeatureEngineering] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preprocessing Configuration</CardTitle>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-semibold">Handle Missing Values</h3>
          <RadioGroup value={missingValueStrategy} onValueChange={(val) => setMissingValueStrategy(val as MissingValueStrategy)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drop" id="drop" />
              <Label htmlFor="drop">Drop rows with missing values</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="mean" id="mean" disabled/>
              <Label htmlFor="mean" className="text-muted-foreground">Fill with mean/mode (coming soon)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="median" id="median" disabled/>
              <Label htmlFor="median" className="text-muted-foreground">Fill with median/mode (coming soon)</Label>
            </div>
             <div className="flex items-center space-x-2">
              <RadioGroupItem value="interpolate" id="interpolate" disabled/>
              <Label htmlFor="interpolate" className="text-muted-foreground">Interpolate (coming soon)</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold">Advanced Preprocessing</h3>
          <div className="flex items-center space-x-2">
            <Checkbox id="scale" checked={scaleData} onCheckedChange={(checked) => setScaleData(!!checked)} disabled />
            <Label htmlFor="scale" className="text-muted-foreground">Scale Data (coming soon)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="feature" checked={featureEngineering} onCheckedChange={(checked) => setFeatureEngineering(!!checked)} disabled />
            <Label htmlFor="feature" className="text-muted-foreground">Feature Engineering (coming soon)</Label>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={() => onStart(missingValueStrategy)} disabled={isLoading}>
          {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
              <Play className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Processing...' : 'Start Forecasting'}
        </Button>
      </CardFooter>
    </Card>
  );
}
