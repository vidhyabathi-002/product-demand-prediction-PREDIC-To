// src/components/external-data/prediction-chart.tsx
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, ReferenceLine } from "recharts";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import type { PredictDemandFromCsvOutput } from "@/ai/flows/predict-demand-from-csv";

type ChartData = PredictDemandFromCsvOutput['chartData'];

const chartConfig = {
  historical: {
    label: "Historical",
    color: "hsl(var(--muted-foreground))",
  },
  predicted: {
    label: "Predicted",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

// Custom tooltip component to show trend information
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const historical = payload.find((p: any) => p.dataKey === 'historical')?.value || 0;
    const predicted = payload.find((p: any) => p.dataKey === 'predicted')?.value || 0;
    
    // Calculate percentage change from previous period if possible
    const currentValue = predicted > 0 ? predicted : historical;
    
    return (
      <div className="bg-background border rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {historical > 0 && (
          <p className="text-sm text-muted-foreground">
            Historical: {historical.toLocaleString()} units
          </p>
        )}
        {predicted > 0 && (
          <p className="text-sm text-primary">
            Predicted: {predicted.toLocaleString()} units
          </p>
        )}
      </div>
    );
  }
  return null;
};

export function PredictionChart({ data }: { data: ChartData }) {
  // Calculate trend metrics
  const historicalData = data.filter(d => d.historical > 0);
  const predictedData = data.filter(d => d.predicted > 0);
  
  const lastHistorical = historicalData[historicalData.length - 1]?.historical || 0;
  const firstPredicted = predictedData[0]?.predicted || 0;
  const lastPredicted = predictedData[predictedData.length - 1]?.predicted || 0;
  
  // Calculate percentage change from last historical to predictions
  const overallChange = lastHistorical > 0 ? ((lastPredicted - lastHistorical) / lastHistorical) * 100 : 0;
  const predictionGrowth = firstPredicted > 0 ? ((lastPredicted - firstPredicted) / firstPredicted) * 100 : 0;
  
  const isIncreasing = overallChange > 0;
  const avgHistorical = historicalData.length > 0 ? 
    historicalData.reduce((sum, d) => sum + d.historical, 0) / historicalData.length : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Demand Forecast</span>
          <div className="flex items-center gap-2 text-sm">
            {isIncreasing ? (
              <div className="flex items-center gap-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span>+{Math.abs(overallChange).toFixed(1)}%</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-red-600">
                <TrendingDown className="h-4 w-4" />
                <span>-{Math.abs(overallChange).toFixed(1)}%</span>
              </div>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Historical and predicted sales with trend analysis. 
          {predictionGrowth !== 0 && (
            <span className="ml-2">
              Prediction period shows 
              <span className={`font-medium ${predictionGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {predictionGrowth > 0 ? '+' : ''}{predictionGrowth.toFixed(1)}% growth
              </span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Trend Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                {isIncreasing ? (
                  <ArrowUp className="h-4 w-4 text-green-600" />
                ) : (
                  <ArrowDown className="h-4 w-4 text-red-600" />
                )}
                <span className="text-sm font-medium">Overall Trend</span>
              </div>
              <p className={`text-lg font-bold ${isIncreasing ? 'text-green-600' : 'text-red-600'}`}>
                {isIncreasing ? '+' : ''}{overallChange.toFixed(1)}%
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Avg Historical</span>
              </div>
              <p className="text-lg font-bold">
                {Math.round(avgHistorical).toLocaleString()}
              </p>
            </div>
            
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-primary">Peak Prediction</span>
              </div>
              <p className="text-lg font-bold text-primary">
                {Math.max(...predictedData.map(d => d.predicted)).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-80 w-full">
            <ChartContainer config={chartConfig} className="w-full h-full">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                accessibilityLayer
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `${Number(value) / 1000}k`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<CustomTooltip />}
                />
                {/* Reference line for average historical */}
                {avgHistorical > 0 && (
                  <ReferenceLine 
                    y={avgHistorical} 
                    stroke="hsl(var(--muted-foreground))" 
                    strokeDasharray="5 5" 
                    strokeOpacity={0.6}
                  />
                )}
                <defs>
                  <linearGradient id="fillHistorical" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-historical)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-historical)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                  <linearGradient id="fillPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-predicted)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-predicted)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="historical"
                  type="natural"
                  fill="url(#fillHistorical)"
                  fillOpacity={0.4}
                  stroke="var(--color-historical)"
                  stackId="a"
                />
                <Area
                  dataKey="predicted"
                  type="natural"
                  fill="url(#fillPredicted)"
                  fillOpacity={0.4}
                  stroke="var(--color-predicted)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
