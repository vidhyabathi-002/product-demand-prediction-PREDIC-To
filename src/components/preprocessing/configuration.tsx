
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
export interface PreprocessingConfig {
    missingValueStrategy: MissingValueStrategy;
    scaleData: boolean;
    featureEngineering: boolean;
}

interface ConfigurationProps {
    onStart: (config: PreprocessingConfig) => void;
    isLoading: boolean;
}

export function Configuration({ onStart, isLoading }: ConfigurationProps) {
  const [config, setConfig] = useState<PreprocessingConfig>({
    missingValueStrategy: 'drop',
    scaleData: false,
    featureEngineering: false
  });

  const handleStrategyChange = (value: string) => {
    setConfig(prev => ({ ...prev, missingValueStrategy: value as MissingValueStrategy }));
  };

  const handleSwitchChange = (key: 'scaleData' | 'featureEngineering', value: boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

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
          <RadioGroup value={config.missingValueStrategy} onValueChange={handleStrategyChange}>
            <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="drop" id="drop" />
              <Label htmlFor="drop" className="font-normal cursor-pointer flex-1">Drop rows with missing values</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="mean" id="mean" />
              <Label htmlFor="mean" className="font-normal cursor-pointer flex-1">Fill with mean/mode</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="median" id="median" />
              <Label htmlFor="median" className="font-normal cursor-pointer flex-1">Fill with median/mode</Label>
            </div>
             <div className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50">
              <RadioGroupItem value="interpolate" id="interpolate" />
              <Label htmlFor="interpolate" className="font-normal cursor-pointer flex-1">Interpolate</Label>
            </div>
          </RadioGroup>
        </div>
        <Separator />
         <div className="space-y-4">
          <h3 className="font-semibold text-base">Advanced Preprocessing</h3>
          <p className="text-sm text-muted-foreground">Apply transformations to improve model performance.</p>
           <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <Label htmlFor="scale-data" className="font-normal">
                    Scale Data (e.g., Normalization)
                    <p className="text-xs text-muted-foreground">Ensure all features are on a comparable scale.</p>
                </Label>
                <Switch 
                  id="scale-data" 
                  checked={config.scaleData}
                  onCheckedChange={(checked) => handleSwitchChange('scaleData', checked)}
                />
            </div>
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                <Label htmlFor="feature-engineering" className="font-normal">
                    Feature Engineering
                    <p className="text-xs text-muted-foreground">Create new features from existing data (e.g., time-based).</p>
                </Label>
                <Switch 
                  id="feature-engineering"
                  checked={config.featureEngineering}
                  onCheckedChange={(checked) => handleSwitchChange('featureEngineering', checked)}
                />
            </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={() => onStart(config)} disabled={isLoading}>
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
