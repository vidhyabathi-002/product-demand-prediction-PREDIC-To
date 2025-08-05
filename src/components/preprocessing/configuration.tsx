
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from 'lucide-react';

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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold">Handle Missing Values</h3>
          <RadioGroup value={missingValueStrategy} onValueChange={(val) => setMissingValueStrategy(val as MissingValueStrategy)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="drop" id="drop" />
              <Label htmlFor="drop">Drop rows with missing values</Label>
            </div>
          </RadioGroup>
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
