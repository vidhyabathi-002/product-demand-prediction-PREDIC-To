
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import type { PreprocessingData } from '../preprocessing/preprocessing-client';
import { SplitSquareHorizontal, Database, Hash, CheckCircle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

const StatCard = ({ title, value, icon: Icon, colorClass }: { title: string, value: number | string, icon: React.ElementType, colorClass?: string }) => (
    <Card className="p-4">
        <div className="flex items-center gap-3">
            <Icon className={`w-6 h-6 ${colorClass || 'text-primary'}`} />
            <div>
                <p className="text-muted-foreground text-sm">{title}</p>
                <p className="text-2xl font-bold">{value.toLocaleString()}</p>
            </div>
        </div>
    </Card>
);


export default function TrainTestClient() {
    const [preprocessedData, setPreprocessedData] = useState<PreprocessingData | null>(null);
    const [targetColumn, setTargetColumn] = useState('');
    const [testSize, setTestSize] = useState(20);
    const [isSplit, setIsSplit] = useState(false);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    
    useEffect(() => {
        const storedData = sessionStorage.getItem('preprocessedData');
        if (storedData) {
            try {
                const parsedData = JSON.parse(storedData);
                setPreprocessedData(parsedData);
            } catch (e) {
                console.error("Failed to parse preprocessed data", e);
                toast({
                    variant: 'destructive',
                    title: 'Data Error',
                    description: 'Could not load preprocessed data. Please go back to the preprocessing page.',
                });
            }
        }
    }, [toast]);
    
    const handleSplit = async () => {
        if (!targetColumn) {
            toast({
                variant: 'warning',
                title: 'Target Column Required',
                description: 'Please select a target column to predict.'
            });
            return;
        }

        setLoading(true);
        await new Promise(res => setTimeout(res, 1500)); // Simulate split process
        
        const splitConfig = {
            targetColumn,
            testSize,
            randomState: 42,
        };
        sessionStorage.setItem('splitConfig', JSON.stringify(splitConfig));
        
        setIsSplit(true);
        setLoading(false);
        toast({
            variant: 'success',
            title: 'Dataset Split Successful',
            description: 'You can now proceed to forecasting.'
        });
    }
    
    const trainingSize = preprocessedData ? preprocessedData.stats.rows - Math.floor(preprocessedData.stats.rows * (testSize/100)) : 0;
    const testingSize = preprocessedData ? Math.floor(preprocessedData.stats.rows * (testSize/100)) : 0;

    return (
        <div className="space-y-6">
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle className="h-4 w-4 !text-green-600" />
                <AlertTitle className="font-semibold">Data preprocessed successfully!</AlertTitle>
                <AlertDescription>
                    Your dataset is cleaned and ready for the train/test split.
                </AlertDescription>
            </Alert>
            <div className="space-y-1">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <SplitSquareHorizontal className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Train/Test Data Split</h1>
                        <p className="text-muted-foreground">
                        Split your preprocessed data into training and testing sets for model validation.
                        </p>
                    </div>
                </div>
            </div>

            {preprocessedData && (
                <>
                <Card>
                    <CardHeader>
                        <CardTitle>Dataset Information: {preprocessedData.fileName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <StatCard title="Total Samples" value={preprocessedData.stats.rows} icon={Database} />
                            <StatCard title="Features" value={preprocessedData.stats.columns - 1} icon={Hash} />
                            <StatCard title="Numeric Columns" value={5} icon={Hash} colorClass="text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                 <Card>
                    <CardHeader>
                        <CardTitle>Available Columns</CardTitle>
                    </CardHeader>
                     <CardContent className="flex flex-wrap gap-2">
                         {preprocessedData.columns.map(col => (
                           <Badge key={col.name} variant="secondary">{col.name}</Badge>
                         ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Split Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <Label htmlFor="target-column">Target Column (Prediction Variable)</Label>
                                <Select onValueChange={setTargetColumn} value={targetColumn} disabled={isSplit}>
                                  <SelectTrigger id="target-column">
                                    <SelectValue placeholder="Select target column..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {preprocessedData.columns.map((col) => (
                                      <SelectItem key={col.name} value={col.name}>
                                        {col.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Random State</Label>
                                <Input defaultValue="42" disabled />
                                <p className="text-xs text-muted-foreground">Set seed for reproducible results (default: 42).</p>
                            </div>
                        </div>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label htmlFor="test-size">Test Set Size</Label>
                                <Badge variant="outline" className="font-mono">{testSize}%</Badge>
                            </div>
                            <Slider
                                id="test-size"
                                min={10}
                                max={50}
                                step={5}
                                value={[testSize]}
                                onValueChange={([value]) => setTestSize(value)}
                                disabled={isSplit}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Split Preview</Label>
                            <div className="w-full bg-muted rounded-full h-6 flex overflow-hidden">
                               <div style={{ width: `${100-testSize}%`}} className="bg-primary flex items-center justify-center text-xs font-medium text-primary-foreground transition-all duration-300">
                                   Training Set ({trainingSize})
                               </div>
                               <div style={{ width: `${testSize}%`}} className="bg-blue-300 flex items-center justify-center text-xs font-medium text-blue-800 transition-all duration-300">
                                   Test Set ({testingSize})
                               </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSplit} disabled={loading || isSplit}>
                            {loading ? 'Splitting...' : 'Split Dataset'}
                        </Button>
                    </CardFooter>
                </Card>
                </>
            )}

            {isSplit && (
                 <Card>
                    <CardHeader>
                        <CardTitle>Ready for Forecasting</CardTitle>
                        <CardDescription>
                            Your data has been successfully split. You can now move on to the forecasting stage to train a model.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/external-data')}>
                            Proceed to Forecast
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
