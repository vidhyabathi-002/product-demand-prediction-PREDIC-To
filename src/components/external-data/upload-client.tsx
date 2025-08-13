'use client';

import { useState, useEffect } from 'react';
import { BarChart, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, FileText, Cpu, TestTube2, Target, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { predictDemandFromCsv, type PredictDemandFromCsvOutput, type ModelType } from '@/ai/flows/predict-demand-from-csv';
import { Skeleton } from '../ui/skeleton';
import { PredictionChart } from './prediction-chart';
import { ConfusionMatrix } from '@/components/external-data/confusion-matrix';
import { ROCCurve } from '@/components/external-data/roc-curve';
import { FeatureHeatmap } from '@/components/external-data/feature-heatmap';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';
import { useNotification } from '@/context/notification-context';
import { useActivityLog } from '@/context/activity-log-context';
import { useUser } from '@/context/user-context';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const models: { id: ModelType; label: string; description: string }[] = [
    { id: 'ARIMA', label: 'ARIMA', description: 'Good for stable trends and seasonality.' },
    { id: 'Prophet', label: 'Prophet', description: 'Handles holidays and strong seasonal patterns well.' },
    { id: 'LSTM', label: 'LSTM', description: 'A neural network that captures complex, non-linear trends.' },
    { id: 'Random Forest', label: 'Random Forest', description: 'Ensemble model, robust to outliers and noise.' },
    { id: 'XGBoost', label: 'XGBoost', description: 'Advanced ensemble model known for high accuracy.' },
];

const performanceMetricsConfig = {
    accuracy: { label: 'Accuracy', description: "Percentage of correct predictions. Higher is better.", interpretation: (val: number) => val > 0.9 ? 'Good' : val > 0.8 ? 'Average' : 'Needs Improvement' },
    f1Score: { label: 'F1 Score', description: "A balance between precision and recall. Higher is better (closer to 1).", interpretation: (val: number) => val > 0.9 ? 'Good' : val > 0.8 ? 'Average' : 'Needs Improvement' },
    mae: { label: 'MAE', description: "Mean Absolute Error. The average absolute difference between predicted and actual values. Lower is better.", interpretation: (val: number) => val < 50 ? 'Good' : val < 100 ? 'Average' : 'Needs Improvement' },
    rmse: { label: 'RMSE', description: "Root Mean Squared Error. Similar to MAE but punishes larger errors more severely. Lower is better.", interpretation: (val: number) => val < 60 ? 'Good' : val < 120 ? 'Average' : 'Needs Improvement' },
    rSquared: { label: 'R² Score', description: "Proportion of the variance in the dependent variable that is predictable. Higher is better (closer to 1).", interpretation: (val: number) => val > 0.85 ? 'Good' : val > 0.7 ? 'Average' : 'Needs Improvement' },
};

type PerformanceMetricKey = keyof typeof performanceMetricsConfig;


export default function UploadClient() {
  const [csvString, setCsvString] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictDemandFromCsvOutput | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('ARIMA');
  const { toast } = useToast();
  const router = useRouter();
  const { addNotification } = useNotification();
  const { addLog } = useActivityLog();
  const { user } = useUser();

  useEffect(() => {
    const storedData = sessionStorage.getItem('preprocessedData');
    if (storedData) {
        try {
            const parsedData = JSON.parse(storedData);
            setCsvString(parsedData.csvData);
        } catch (e) {
            console.error("Failed to parse preprocessed data", e);
            toast({
                variant: 'destructive',
                title: 'Data Error',
                description: 'Could not load preprocessed data. Please go back and upload a file.',
            });
        }
    }
  }, [toast]);

  const handlePredict = async () => {
    if (!csvString) {
      toast({
        variant: 'warning',
        title: 'No Data',
        description: 'Please go to the preprocessing page to upload data first.',
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

  const PerformanceMetricCard = ({ metricKey, value }: { metricKey: PerformanceMetricKey, value: number }) => {
    const config = performanceMetricsConfig[metricKey];
    if (!config) return null;

    const formattedValue = metricKey === 'accuracy' || metricKey === 'rSquared' ? `${(value * 100).toFixed(0)}%` : metricKey === 'f1Score' ? value.toFixed(2) : value;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <CardTitle className="text-sm font-medium cursor-help">{config.label}</CardTitle>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{config.description}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formattedValue}</div>
                <p className="text-xs text-muted-foreground">{config.interpretation(value)}</p>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-6">
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Forecasting</h1>
        <p className="text-muted-foreground">
          Select a model to generate a demand forecast from your preprocessed data.
        </p>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Configure Prediction</CardTitle>
            <CardDescription>
              Select a model to forecast demand using your prepared data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="space-y-2">
                <Label>Select ML Model</Label>
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
            <Button onClick={handlePredict} disabled={!csvString || loading} className="w-full">
              {loading ? 'Analyzing...' : 'Predict Demand'}
            </Button>
          </CardContent>
        </Card>

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
                            Select a model and click predict to see your demand prediction here.
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
                  {/* Placeholder for new visualization components */}
                  <div className="lg:col-span-2">
                    {prediction.confusionMatrixData && <ConfusionMatrix data={prediction.confusionMatrixData} />}
                  </div>
                  <div className="lg:col-span-2">
                    {prediction.rocCurveData && <ROCCurve data={prediction.rocCurveData} />}
                  </div>
                  <div className="lg:col-span-2">
                    {prediction.featureImportance && <FeatureHeatmap data={prediction.featureImportance} />}
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

                    <div className="grid grid-cols-1 gap-6">
                        <Card>
                             <CardHeader>
                                <CardTitle>Model Performance on Uploaded Data</CardTitle>
                                <CardDescription>Key metrics evaluating the performance of the {prediction.modelUsed} model.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                                <PerformanceMetricCard metricKey="accuracy" value={prediction.accuracy} />
                                <PerformanceMetricCard metricKey="f1Score" value={prediction.f1Score} />
                                <PerformanceMetricCard metricKey="mae" value={prediction.mae} />
                                <PerformanceMetricCard metricKey="rmse" value={prediction.rmse} />
                                <PerformanceMetricCard metricKey="rSquared" value={prediction.rSquared} />
                            </CardContent>
                        </Card>
                    </div>

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
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
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