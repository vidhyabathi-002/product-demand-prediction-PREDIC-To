
'use client';

import { useState } from 'react';
import { Upload, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { summarizeMarketAnalysis, type SummarizeMarketAnalysisOutput } from '@/ai/flows/summarize-market-analysis';
import { Skeleton } from '../ui/skeleton';

export default function ReportClient() {
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SummarizeMarketAnalysisOutput | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
        if (selectedFile.type === 'application/pdf' || selectedFile.type === 'text/plain') {
            setFile(selectedFile);
            setFileName(selectedFile.name);
            setAnalysis(null);
        } else {
            toast({
                variant: 'destructive',
                title: 'Invalid File Type',
                description: 'Please upload a PDF or TXT file.',
            });
        }
    }
  };

  const handleAnalysis = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No File Selected',
        description: 'Please select a file to analyze.',
      });
      return;
    }

    setLoading(true);
    setAnalysis(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        if (dataUri) {
          try {
            const result = await summarizeMarketAnalysis({ documentDataUri: dataUri });
            setAnalysis(result);
          } catch (error) {
            console.error('Analysis failed:', error);
            toast({
              variant: 'destructive',
              title: 'Analysis Failed',
              description: 'Could not get an analysis from the AI model.',
            });
          } finally {
            setLoading(false);
          }
        }
      };
      reader.readAsDataURL(file);
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
       <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate AI-powered analysis from your documents.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Analyze Document</CardTitle>
          <CardDescription>
            Upload a document (PDF or TXT) to get a summary of key trends and insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-grow w-full">
            <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <Input id="file-upload" type="file" accept=".pdf,.txt" onChange={handleFileChange} className="hidden" />
            <Button asChild variant="outline">
              <label htmlFor="file-upload" className="cursor-pointer w-full sm:w-auto flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span>{fileName || 'Choose a file...'}</span>
              </label>
            </Button>
          </div>
          <Button onClick={handleAnalysis} disabled={!file || loading} className="w-full sm:w-auto">
            {loading ? 'Analyzing...' : 'Generate Report'}
          </Button>
        </CardContent>
      </Card>

      {loading && <AnalysisSkeleton />}

      {analysis && (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bot className="h-6 w-6 text-primary" />
                    AI-Generated Report
                </CardTitle>
                <CardDescription>Summary of the key findings from your document.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-wrap">
                  {analysis.summary}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function AnalysisSkeleton() {
  return (
    <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-48" />
            </CardTitle>
            <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
        </CardContent>
    </Card>
  );
}
