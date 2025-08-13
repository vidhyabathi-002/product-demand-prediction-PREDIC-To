'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Loader2 } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export type MissingValueStrategy = 'drop' | 'mean' | 'median' | 'interpolate';
export type OutlierStrategy = 'none' | 'remove' | 'cap';
export type EncodingStrategy = 'none' | 'label' | 'one-hot';

export interface PreprocessingConfig {
    missingValueStrategy: MissingValueStrategy;
    outlierStrategy: OutlierStrategy;
    scaleData: boolean;
    encodingStrategy: EncodingStrategy;
    removeDuplicates: boolean;
}

interface ConfigurationProps {
    onStart: (config: PreprocessingConfig) => void;
    isLoading: boolean;
}

export function Configuration({ onStart, isLoading }: ConfigurationProps) {
  const [config, setConfig] = useState<PreprocessingConfig>({
    missingValueStrategy: 'drop',
    outlierStrategy: 'none',
    scaleData: false,
    encodingStrategy: 'none',
    removeDuplicates: true,
  });

  const handleValueChange = (key: keyof PreprocessingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Preprocessing</CardTitle>
        <CardDescription>Select methods to clean and prepare your dataset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Handle Missing Values</h3>
            <RadioGroup value={config.missingValueStrategy} onValueChange={(v) => handleValueChange('missingValueStrategy', v)} className="flex flex-wrap gap-x-4 gap-y-2">
                <div className="flex items-center space-x-2"><RadioGroupItem value="drop" id="drop" /><Label htmlFor="drop" className="font-normal">Drop Rows</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="mean" id="mean" /><Label htmlFor="mean" className="font-normal">Fill with Mean</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="median" id="median" /><Label htmlFor="median" className="font-normal">Fill with Median</Label></div>
                <div className="flex items-center space-x-2"><RadioGroupItem value="interpolate" id="interpolate" /><Label htmlFor="interpolate" className="font-normal">Interpolate</Label></div>
            </RadioGroup>
        </div>
        <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Advanced Preprocessing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Handle Outliers</Label>
                    <Select value={config.outlierStrategy} onValueChange={(v) => handleValueChange('outlierStrategy', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="remove">Remove Outliers (IQR)</SelectItem><SelectItem value="cap">Cap Outliers (IQR)</SelectItem></SelectContent></Select>
                </div>
                <div className="space-y-2">
                    <Label>Categorical Encoding</Label>
                    <Select value={config.encodingStrategy} onValueChange={(v) => handleValueChange('encodingStrategy', v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="label">Label Encoding</SelectItem><SelectItem value="one-hot">One-Hot Encoding</SelectItem></SelectContent></Select>
                </div>
            </div>
             <div className="flex flex-wrap gap-x-6 gap-y-4 pt-2">
                <div className="flex items-center space-x-2"><Switch id="remove-duplicates" checked={config.removeDuplicates} onCheckedChange={(c) => handleValueChange('removeDuplicates', c)} /><Label htmlFor="remove-duplicates">Remove Duplicates</Label></div>
                <div className="flex items-center space-x-2"><Switch id="scale-data" checked={config.scaleData} onCheckedChange={(c) => handleValueChange('scaleData', c)} /><Label htmlFor="scale-data">Scale Data (Normalize)</Label></div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={() => onStart(config)} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {isLoading ? 'Processing...' : 'Process Data'}
        </Button>
      </CardFooter>
    </Card>
  );
}