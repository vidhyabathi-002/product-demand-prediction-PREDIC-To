
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';

export type MissingValueStrategy = 'drop' | 'mean' | 'median' | 'interpolate';

interface ConfigurationProps {
    onStart: (strategy: MissingValueStrategy) => void;
    isLoading: boolean;
}

export function Configuration({ onStart, isLoading }: ConfigurationProps) {
  const [missingValueStrategy, setMissingValueStrategy] = useState<MissingValueStrategy>('drop');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preprocessing Configuration</CardTitle>
        <CardDescription>Select methods to clean and enhance your dataset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-base">Handle Missing Values</h3>
          <p className="text-sm text-muted-foreground">Choose a strategy to deal with empty cells in your data.</p>
          <RadioGroup value={missingValueStrategy} onValueChange={(val) => setMissingValueStrategy(val as MissingValueStrategy)}>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="drop" id="drop" />
              <Label htmlFor="drop" className="font-normal cursor-pointer flex-1">Drop rows with missing values</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-not-allowed">
              <RadioGroupItem value="mean" id="mean" disabled />
              <Label htmlFor="mean" className="font-normal text-muted-foreground/80 cursor-not-allowed flex-1">Fill with mean/mode (Coming Soon)</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-not-allowed">
              <RadioGroupItem value="median" id="median" disabled />
              <Label htmlFor="median" className="font-normal text-muted-foreground/80 cursor-not-allowed flex-1">Fill with median/mode (Coming Soon)</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 cursor-not-allowed">
              <RadioGroupItem value="interpolate" id="interpolate" disabled />
              <Label htmlFor="interpolate" className="font-normal text-muted-foreground/80 cursor-not-allowed flex-1">Interpolate (Coming Soon)</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
         <div className="space-y-4">
          <h3 className="font-semibold text-base">Advanced Preprocessing</h3>
          <p className="text-sm text-muted-foreground">Apply transformations to improve model performance.</p>
           <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-not-allowed">
                <Label htmlFor="scale-data" className="font-normal text-muted-foreground/80 cursor-not-allowed">
                    Scale Data (e.g., Normalization)
                    <p className="text-xs text-muted-foreground/60">Ensure all features are on a comparable scale.</p>
                </Label>
                <Switch id="scale-data" disabled />
            </div>
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 cursor-not-allowed">
                <Label htmlFor="feature-engineering" className="font-normal text-muted-foreground/80 cursor-not-allowed">
                    Feature Engineering
                    <p className="text-xs text-muted-foreground/60">Create new features from existing data (e.g., time-based).</p>
                </Label>
                <Switch id="feature-engineering" disabled />
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
          {isLoading ? 'Processing...' : 'Start Preprocessing'}
        </Button>
      </CardFooter>
    </Card>
  );
}
