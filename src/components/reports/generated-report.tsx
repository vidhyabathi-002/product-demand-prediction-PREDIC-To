
'use client';
import type { PredictDemandFromCsvOutput } from "@/ai/flows/predict-demand-from-csv";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { BarChart, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Clock, Cpu, Award, Target } from "lucide-react";
import { PredictionChart } from "../external-data/prediction-chart";
import { Separator } from "../ui/separator";

interface GeneratedReportProps {
  data: PredictDemandFromCsvOutput;
}

export function GeneratedReport({ data }: GeneratedReportProps) {
    const reportDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  return (
    <Card className="p-4 sm:p-6 md:p-8 print:shadow-none print:border-none">
        <CardHeader className="border-b pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-4xl font-bold text-primary">Demand Forecast Report</CardTitle>
                <CardDescription>Generated on: {reportDate}</CardDescription>
              </div>
              {data.modelUsed && (
                <div className="text-right">
                    <p className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><Cpu className="h-4 w-4 text-primary" /> Model Used</p>
                    <p className="text-lg font-bold">{data.modelUsed}</p>
                </div>
              )}
            </div>
        </CardHeader>
        <CardContent className="space-y-8">
            <div className="prose prose-lg max-w-none dark:prose-invert">
                <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <BarChart className="h-6 w-6 text-primary" />
                    Executive Summary
                </h2>
                <p className="text-muted-foreground">{data.summary}</p>
            </div>

             <Separator />
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                   {data.salesTrend === 'Increasing' ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  <span className="text-sm font-semibold">Sales Trend</span>
                </div>
                <p className="text-2xl font-bold mt-1">{data.salesTrend}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold">Peak Demand</span>
                  </div>
                <p className="text-2xl font-bold mt-1">{data.peakDemandPeriod}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm font-semibold">Total Predicted Units</span>
                </div>
                <p className="text-2xl font-bold mt-1">{data.predictedUnits.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    <span className="text-sm font-semibold">Confidence</span>
                  </div>
                <p className="text-2xl font-bold mt-1">{data.confidence}</p>
              </div>
               <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span className="text-sm font-semibold">Accuracy</span>
                  </div>
                <p className="text-2xl font-bold mt-1">{(data.accuracy * 100).toFixed(0)}%</p>
              </div>
               <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-5 w-5 text-purple-500" />
                    <span className="text-sm font-semibold">F1-Score</span>
                  </div>
                <p className="text-2xl font-bold mt-1">{data.f1Score.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
                <h2 className="text-2xl font-semibold mb-4">Forecast Visualization</h2>
                <div className="border rounded-lg">
                     {data.chartData && <PredictionChart data={data.chartData} />}
                </div>
            </div>
        </CardContent>
    </Card>
  )
}
