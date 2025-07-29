
'use client';

import { useState, useEffect } from 'react';
import { Upload, BarChart, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, FileText, Cpu, TestTube2, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { predictDemandFromCsv, type PredictDemandFromCsvOutput, type ModelType } from '@/ai/flows/predict-demand-from-csv';
import { Skeleton } from '../ui/skeleton';
import { PredictionChart } from './prediction-chart';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useNotification } from '@/context/notification-context';
import { useActivityLog } from '@/context/activity-log-context';
import { useUser } from '@/context/user-context';
import { getModelPerformance, type ModelPerformance } from '@/ai/flows/get-model-performance';
import { ModelPerformanceChart } from './model-performance-chart';

const models: { id: ModelType; label: string; description: string }[] = [
    { id: 'ARIMA', label: 'ARIMA', description: 'Good for stable trends and seasonality.' },
    { id: 'Prophet', label: 'Prophet', description: 'Handles holidays and strong seasonal patterns well.' },
    { id: 'LSTM', label: 'LSTM', description: 'A neural network that captures complex, non-linear trends.' },
    { id: 'Random Forest', label: 'Random Forest', description: 'Ensemble model, robust to outliers and noise.' },
    { id: 'XGBoost', label: 'XGBoost', description: 'Advanced ensemble model known for high accuracy.' },
];

export default function UploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [csvString, setCsvString] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictDemandFromCsvOutput | null>(null);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance[]>([]);
  const [performanceLoading, setPerformanceLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState<ModelType>('ARIMA');
  const { toast } = useToast();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { addLog } = useActivityLog();
  const { user } = useUser();


  useEffect(() => {
    const fetchPerformance = async () => {
        setPerformanceLoading(true);
        try {
            const performanceResult = await getModelPerformance();
            setModelPerformance(performanceResult);
        } catch (error) {
            console.error('Failed to fetch model performance:', error);
            toast({
                variant: 'destructive',
                title: 'Load Failed',
                description: 'Could not load model performance data.',
            });
        } finally {
            setPerformanceLoading(false);
        }
    };

    fetchPerformance();
  }, [toast]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setPrediction(null);
        
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            setCsvString(text);
        };
        reader.readAsText(selectedFile);
        sessionStorage.removeItem('predictionReport');
        toast({
            variant: 'success',
            title: 'File Uploaded',
            description: 'Sales data uploaded successfully!'
        });

      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
      }
    }
  };

  const loadSampleData = async () => {
    try {
        const response = await fetch('/sample-sales-data.csv');
        const text = await response.text();
        setCsvString(text);
        setFile(new File([text], "sample-sales-data.csv", { type: "text/csv" }));
        setFileName("sample-sales-data.csv");
        setPrediction(null);
        sessionStorage.removeItem('predictionReport');
         toast({
          title: 'Sample Data Loaded',
          description: 'The sample sales data has been loaded. You can now predict demand.',
        });
    } catch (error) {
         toast({
          variant: 'destructive',
          title: 'Failed to Load Sample',
          description: 'Could not load the sample dataset.',
        });
    }
  }

  const handleUpload = async () => {
    if (!csvString) {
      toast({
        variant: 'warning',
        title: 'No Data',
        description: 'Please select a CSV file or load the sample data.',
      });
      return;
    }

    setLoading(true);
    setPrediction(null);
    sessionStorage.removeItem('predictionReport');

    try {
        const predictionResult = await predictDemandFromCsv({ csvData: csvString, model: selectedModel });
        
        setPrediction(predictionResult);
        
        sessionStorage.setItem('predictionReport', JSON.stringify(predictionResult));
        addNotification({
            title: 'Report Generated',
            message: 'Your demand forecast report is now available.',
            href: '/reports',
        });
        if (user) {
            addLog({
                user: user.name,
                action: 'Generate Report',
                details: `Generated demand forecast using ${selectedModel} model.`
            })
        }
        toast({
            variant: 'info',
            title: 'Forecast Complete',
            description: 'Demand forecast has been generated.'
        });

        if (predictionResult.salesTrend === 'Decreasing') {
            toast({
                variant: 'warning',
                title: 'Demand Drop Warning',
                description: 'Predicted demand is falling. Consider adjusting price or marketing spend.'
            });
        }

        const avgHistorical = predictionResult.chartData.filter(d => d.historical > 0).reduce((acc, d) => acc + d.historical, 0) / (predictionResult.chartData.filter(d => d.historical > 0).length || 1);
        const peakPrediction = Math.max(...predictionResult.chartData.map(d => d.predicted));

        if (peakPrediction > avgHistorical * 2) { // Example threshold for a spike
             toast({
                variant: 'info',
                title: 'High Demand Spike',
                description: 'High demand forecasted! You might want to increase stock.'
            });
        }


    } catch (error) {
        console.error('Prediction failed:', error);
        toast({
        variant: 'destructive',
        title: 'Prediction Failed',
        description: (error as Error).message || 'Could not get a prediction from the model.',
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configure Prediction</CardTitle>
            <CardDescription>
              Upload data and select a model to forecast demand.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                <Label>1. Upload Sales Data</Label>
                <div className="flex gap-2">
                    <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
                    <Button asChild variant="outline" className="w-full">
                        <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        <span>{fileName || 'Choose CSV...'}</span>
                        </label>
                    </Button>
                    <Button onClick={loadSampleData} variant="secondary" title="Load Sample Data">
                        <TestTube2 className="h-4 w-4" />
                    </Button>
                </div>
                </div>
                 <div className="space-y-2">
                    <Label>2. Select ML Model</Label>
                    <RadioGroup value={selectedModel} onValueChange={(value: string) => setSelectedModel(value as ModelType)} className="flex flex-wrap gap-4">
                        {models.map(model => (
                            <div key={model.id}>
                                <RadioGroupItem value={model.id} id={model.id} className="peer sr-only" />
                                <Label
                                htmlFor={model.id}
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                                >
                                {model.label}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
            <Button onClick={handleUpload} disabled={!csvString || loading} className="w-full">
              {loading ? 'Analyzing...' : 'Predict Demand'}
            </Button>
          </CardContent>
        </Card>

        {performanceLoading && (
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-3/4" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-80 w-full" />
                </CardContent>
            </Card>
        )}
        {!performanceLoading && modelPerformance.length > 0 && (
            <ModelPerformanceChart data={modelPerformance} />
        )}

        <div className='space-y-6'>
            {loading && <PredictionSkeleton />}

            {!loading && !prediction && (
                <Card className="flex flex-col items-center justify-center h-full min-h-[400px] border-dashed">
                    <div className="text-center p-8">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                            <BarChart className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="text-xl font-semibold">Ready to Forecast</h3>
                        <p className="text-muted-foreground mt-2">
                            Upload your data or load the sample to see your demand prediction here.
                        </p>
                    </div>
                </Card>
            )}

            {prediction && (
                <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-3">
                     {prediction.chartData && <PredictionChart data={prediction.chartData} />}
                  </div>
                  <div className="lg:col-span-3 flex flex-col gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <BarChart className="h-5 w-5 text-primary" />
                          Prediction Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{prediction.summary}</p>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                       <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                           {prediction.salesTrend === 'Increasing' ? (
                              <TrendingUp className="h-5 w-5 text-green-500" />
                            ) : (
                              <TrendingDown className="h-5 w-5 text-red-500" />
                            )}
                          <span className="text-sm">Sales Trend</span>
                        </div>
                        <p className="text-2xl font-bold">{prediction.salesTrend}</p>
                      </Card>
                       <Card className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-5 w-5 text-primary" />
                            <span className="text-sm">Peak Demand</span>
                          </div>
                        <p className="text-2xl font-bold">{prediction.peakDemandPeriod}</p>
                      </Card>
                      <Card className="p-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <CheckCircle className="h-5 w-5 text-green-500" />
                          <span className="text-sm">Predicted Units</span>
                        </div>
                        <p className="text-2xl font-bold">{prediction.predictedUnits.toLocaleString()}</p>
                      </Card>
                      <Card className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <AlertTriangle className="h-5 w-5 text-amber-500" />
                            <span className="text-sm">Confidence</span>
                          </div>
                        <p className="text-2xl font-bold">{prediction.confidence}</p>
                      </Card>
                      <Card className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="h-5 w-5 text-blue-500" />
                            <span className="text-sm">Accuracy</span>
                          </div>
                        <p className="text-2xl font-bold">{(prediction.accuracy * 100).toFixed(0)}%</p>
                      </Card>
                      <Card className="p-4">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Award className="h-5 w-5 text-purple-500" />
                            <span className="text-sm">F1-Score</span>
                          </div>
                        <p className="text-2xl font-bold">{prediction.f1Score.toFixed(2)}</p>
                      </Card>
                      {prediction.modelUsed && (
                        <Card className="p-4 col-span-2">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Cpu className="h-5 w-5 text-primary" />
                              <span className="text-sm">Model Used</span>
                            </div>
                          <p className="text-2xl font-bold">{prediction.modelUsed}</p>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>View Full Report</CardTitle>
                        <CardDescription>A detailed report has been generated based on this analysis. You can view it on the Reports page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push('/reports')}>
                            <FileText className="mr-2 h-4 w-4"/>
                            View Report
                        </Button>
                    </CardContent>
                </Card>
                </>
            )}
        </div>
      </div>
    </div>
  );
}

function PredictionSkeleton() {
  return (
    <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-40" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
          <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
           <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
          <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
          <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
          <Card className="p-4 space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-8 w-16" />
          </Card>
        </div>
    </div>
  );
}
