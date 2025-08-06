
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight, Columns3 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActivityLog } from '@/context/activity-log-context';
import { useUser } from '@/context/user-context';
import type { PreprocessingData } from '../preprocessing/preprocessing-client';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Badge } from '../ui/badge';
import { DataOverview } from '../preprocessing/data-overview';

export default function TrainTestClient() {
  const [data, setData] = useState<PreprocessingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSplit, setIsSplit] = useState(false);
  
  const [targetColumn, setTargetColumn] = useState('');
  const [testSize, setTestSize] = useState(20);
  const [randomState, setRandomState] = useState(42);
  
  const [trainingSize, setTrainingSize] = useState(0);
  const [testingSize, setTestingSize] = useState(0);
  
  const { toast } = useToast();
  const router = useRouter();
  const { addLog } = useActivityLog();
  const { user } = useUser();

  useEffect(() => {
    const storedData = sessionStorage.getItem('preprocessedData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            setData(parsedData);
            setTargetColumn(sessionStorage.getItem('primaryKey') || '');
        } catch (e) {
            console.error("Failed to parse preprocessed data", e);
            toast({
                variant: 'destructive',
                title: 'Data Error',
                description: 'Could not load preprocessed data. Please go back to Data Preparation.',
            });
        }
    }
    setLoading(false);
  }, [toast]);
  
  useEffect(() => {
      if (data) {
          const totalRows = data.stats.rows;
          const testCount = Math.floor(totalRows * (testSize / 100));
          const trainCount = totalRows - testCount;
          setTestingSize(testCount);
          setTrainingSize(trainCount);
      }
  }, [data, testSize]);

  const handleSplit = () => {
    if (!data) {
        toast({ variant: 'destructive', title: 'No data available' });
        return;
    }
    if (!targetColumn) {
        toast({ variant: 'warning', title: 'Target Column Required', description: 'Please select the column you want to predict.' });
        return;
    }

    setLoading(true);

    setTimeout(() => {
        setIsSplit(true);
        if(user) {
            addLog({
                user: user.name,
                action: 'Train/Test Split',
                details: `Split data with ${testSize}% test size. Target: ${targetColumn}.`
            })
        }
        toast({
            variant: 'info',
            title: 'Data Split Successful',
            description: 'Your dataset has been split into training and testing sets.'
        });
        setLoading(false);
    }, 1000);
  };

  if (loading) {
      return <div>Loading data...</div>;
  }
  
  if (!data) {
      return (
          <Card>
              <CardHeader>
                  <CardTitle>No Data Found</CardTitle>
                  <CardDescription>Please go back to the Data Preparation page and upload a dataset first.</CardDescription>
              </CardHeader>
              <CardContent>
                  <Button onClick={() => router.push('/preprocessing')}>Go to Data Preparation</Button>
              </CardContent>
          </Card>
      );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Columns3 className="w-6 h-6 text-primary" />
            </div>
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Train/Test Split</h1>
                <p className="text-muted-foreground">
                Divide your preprocessed data into training and testing sets for model validation.
                </p>
            </div>
        </div>
      </div>

      <DataOverview stats={data.stats} />
      
      <Card>
          <CardHeader>
              <CardTitle>Split Configuration</CardTitle>
              <CardDescription>Define how your dataset will be divided.</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="target-column">Target Column (Prediction Variable)</Label>
                        <Select onValueChange={setTargetColumn} value={targetColumn}>
                          <SelectTrigger id="target-column"><SelectValue placeholder="Select target..." /></SelectTrigger>
                          <SelectContent>
                            {data.columns.map((col) => (
                              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Random State (for reproducibility)</Label>
                        <Input value={randomState} type="number" onChange={(e) => setRandomState(parseInt(e.target.value, 10) || 0)} />
                    </div>
                </div>
                 <div className="space-y-6">
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <Label htmlFor="test-size">Test Set Size</Label>
                            <Badge variant="outline" className="font-mono">{testSize}%</Badge>
                        </div>
                        <Slider id="test-size" min={10} max={50} step={5} value={[testSize]} onValueChange={([v]) => setTestSize(v)} />
                    </div>
                    <div className="space-y-4 rounded-lg border p-4">
                        <Label className="text-base font-semibold">Split Preview</Label>
                        <div className="space-y-2"><p className="text-sm">Training Set</p><div className="w-full bg-muted rounded-full h-6 flex items-center pr-2" ><div style={{ width: `${100-testSize}%`}} className="bg-primary flex h-full items-center justify-end rounded-full text-xs font-medium text-primary-foreground transition-all duration-300 pr-2">{trainingSize.toLocaleString()} samples</div></div></div>
                        <div className="space-y-2"><p className="text-sm">Testing Set</p><div className="w-full bg-muted rounded-full h-6 flex items-center pr-2"><div style={{ width: `${testSize}%`}} className="bg-blue-300 flex h-full items-center justify-end rounded-full text-xs font-medium text-blue-800 transition-all duration-300 pr-2">{testingSize.toLocaleString()} samples</div></div></div>
                    </div>
                 </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
              <Button onClick={handleSplit} disabled={loading || isSplit}>
                  {isSplit ? 'Data Split' : 'Split Data'}
              </Button>
          </CardFooter>
      </Card>

      {isSplit && (
          <Card>
              <CardHeader>
                  <CardTitle>Ready for Next Step</CardTitle>
                  <CardDescription>
                      Your data is split and ready for forecasting.
                  </CardDescription>
              </CardHeader>
              <CardFooter>
                  <Button onClick={() => router.push('/external-data')}>
                      Proceed to Forecasting
                      <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
              </CardFooter>
          </Card>
      )}

    </div>
  );
}
