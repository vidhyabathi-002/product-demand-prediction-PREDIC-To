
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Play, Loader2, TestTube2, Hash } from 'lucide-react';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import type { PreprocessingData } from './preprocessing-client';

export type MissingValueStrategy = 'drop' | 'mean' | 'median' | 'interpolate';
export type OutlierStrategy = 'none' | 'remove' | 'cap';
export type EncodingStrategy = 'none' | 'label' | 'one-hot';
export type SplitMethod = 'random' | 'stratified' | 'time-based';

export interface PreprocessingConfig {
    missingValueStrategy: MissingValueStrategy;
    outlierStrategy: OutlierStrategy;
    scaleData: boolean;
    featureEngineering: boolean;
    encodingStrategy: EncodingStrategy;
    removeDuplicates: boolean;
    
    // Split config
    targetColumn: string;
    testSize: number;
    splitMethod: SplitMethod;
    randomState: number;
}

interface ConfigurationProps {
    onStart: (config: PreprocessingConfig) => void;
    isLoading: boolean;
    preprocessedData: PreprocessingData | null;
}

export function Configuration({ onStart, isLoading, preprocessedData }: ConfigurationProps) {
  const [config, setConfig] = useState<PreprocessingConfig>({
    missingValueStrategy: 'drop',
    outlierStrategy: 'none',
    scaleData: false,
    featureEngineering: false,
    encodingStrategy: 'none',
    removeDuplicates: true,
    
    // Split config
    targetColumn: '',
    testSize: 20,
    splitMethod: 'random',
    randomState: 42,
  });

  const handleValueChange = (key: keyof PreprocessingConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const trainingSize = preprocessedData ? preprocessedData.stats.rows - Math.floor(preprocessedData.stats.rows * (config.testSize/100)) : 0;
  const testingSize = preprocessedData ? Math.floor(preprocessedData.stats.rows * (config.testSize/100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configure Pipeline</CardTitle>
        <CardDescription>Select methods to clean, prepare, and split your dataset.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Preprocessing Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">1. Data Preprocessing</h3>
            <div className="space-y-2">
                <Label>Handle Missing Values</Label>
                <RadioGroup value={config.missingValueStrategy} onValueChange={(v) => handleValueChange('missingValueStrategy', v)} className="flex flex-wrap gap-x-4 gap-y-2">
                    <div className="flex items-center space-x-2"><RadioGroupItem value="drop" id="drop" /><Label htmlFor="drop" className="font-normal">Drop Rows</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="mean" id="mean" /><Label htmlFor="mean" className="font-normal">Fill with Mean</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="median" id="median" /><Label htmlFor="median" className="font-normal">Fill with Median</Label></div>
                    <div className="flex items-center space-x-2"><RadioGroupItem value="interpolate" id="interpolate" /><Label htmlFor="interpolate" className="font-normal">Interpolate</Label></div>
                </RadioGroup>
            </div>
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
                <div className="flex items-center space-x-2"><Switch id="feature-engineering" checked={config.featureEngineering} onCheckedChange={(c) => handleValueChange('featureEngineering', c)} /><Label htmlFor="feature-engineering">Feature Engineering</Label></div>
            </div>
        </div>

        <Separator />
        
        {/* Train/Test Split Section */}
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary">2. Train/Test Split</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="target-column">Target Column (Prediction Variable)</Label>
                        <Select onValueChange={(v) => handleValueChange('targetColumn', v)} value={config.targetColumn}>
                          <SelectTrigger id="target-column"><SelectValue placeholder="Select target..." /></SelectTrigger>
                          <SelectContent>
                            {preprocessedData?.columns.map((col) => (
                              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Random State (for reproducibility)</Label>
                        <Input value={config.randomState} type="number" onChange={(e) => handleValueChange('randomState', parseInt(e.target.value, 10) || 0)} />
                    </div>
                </div>
                 <div className="space-y-6">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="test-size">Test Set Size</Label>
                            <Badge variant="outline" className="font-mono">{config.testSize}%</Badge>
                        </div>
                        <Slider id="test-size" min={10} max={50} step={5} value={[config.testSize]} onValueChange={([v]) => handleValueChange('testSize', v)} />
                    </div>
                    <div className="space-y-4 rounded-lg border p-4">
                        <Label className="text-base font-semibold">Split Preview</Label>
                        <div className="space-y-2"><p className="text-sm">Training Set</p><div className="w-full bg-muted rounded-full h-6 flex items-center pr-2" ><div style={{ width: `${100-config.testSize}%`}} className="bg-primary flex h-full items-center justify-end rounded-full text-xs font-medium text-primary-foreground transition-all duration-300 pr-2">{trainingSize} samples</div></div></div>
                        <div className="space-y-2"><p className="text-sm">Testing Set</p><div className="w-full bg-muted rounded-full h-6 flex items-center pr-2"><div style={{ width: `${config.testSize}%`}} className="bg-blue-300 flex h-full items-center justify-end rounded-full text-xs font-medium text-blue-800 transition-all duration-300 pr-2">{testingSize} samples</div></div></div>
                    </div>
                 </div>
            </div>
        </div>

      </CardContent>
      <CardFooter className="border-t pt-6">
        <Button onClick={() => onStart(config)} disabled={isLoading || !config.targetColumn}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Play className="mr-2 h-4 w-4" />}
          {isLoading ? 'Processing...' : 'Process and Split Data'}
        </Button>
      </CardFooter>
    </Card>
  );
}
