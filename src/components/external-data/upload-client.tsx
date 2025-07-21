
'use client';

import { useState } from 'react';
import { Upload, BarChart, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, FileText, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { predictDemandFromCsv, type PredictDemandFromCsvOutput } from '@/ai/flows/predict-demand-from-csv';
import { Skeleton } from '../ui/skeleton';
import { PredictionChart } from './prediction-chart';
import { useRouter } from 'next/navigation';

export default function UploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictDemandFromCsvOutput | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'text/csv') {
        setFile(selectedFile);
        setFileName(selectedFile.name);
        setPrediction(null);
        sessionStorage.removeItem('predictionReport');
      } else {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a CSV file.',
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a CSV file to upload.',
      });
      return;
    }

    setLoading(true);
    setPrediction(null);
    sessionStorage.removeItem('predictionReport');

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csvData = e.target?.result as string;
        if (csvData) {
          try {
            const result = await predictDemandFromCsv({ csvData });
            setPrediction(result);
            sessionStorage.setItem('predictionReport', JSON.stringify(result));
          } catch (error) {
            console.error('Prediction failed:', error);
            toast({
              variant: 'destructive',
              title: 'Prediction Failed',
              description: 'Could not get a prediction from the local model.',
            });
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsText(file);
    } catch (error) {
      console.error('File reading failed:', error);
      toast({
        variant: 'destructive',
        title: 'File Read Error',
        description: 'There was an issue reading your file.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload External Data</CardTitle>
          <CardDescription>
            Upload a CSV file with historical sales data to predict future demand.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-grow w-full">
            <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <Input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="hidden" />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer w-full sm:w-auto flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{fileName || 'Choose a CSV file...'}</span>
              </label>
            </Button>
          </div>
          <Button onClick={handleUpload} disabled={!file || loading} className="w-full sm:w-auto">
            {loading ? 'Analyzing...' : 'Predict Demand'}
          </Button>
        </CardContent>
      </Card>

      {loading && <PredictionSkeleton />}

      {prediction && (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
             {prediction.chartData && <PredictionChart data={prediction.chartData} />}
          </div>
          <div className="lg:col-span-1 flex flex-col gap-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
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
                    <span className="text-sm">Peak Demand Period</span>
                  </div>
                <p className="text-2xl font-bold">{prediction.peakDemandPeriod}</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Total Predicted Units</span>
                </div>
                <p className="text-2xl font-bold">{prediction.predictedUnits.toLocaleString()}</p>
              </Card>
              <Card className="p-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="text-sm">Confidence Level</span>
                  </div>
                <p className="text-2xl font-bold">{prediction.confidence}</p>
              </Card>
              {prediction.modelUsed && (
                <Card className="p-4 sm:col-span-2 lg:col-span-1">
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
  );
}

function PredictionSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-80 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-1 flex flex-col gap-6">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
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
    </div>
  );
}
