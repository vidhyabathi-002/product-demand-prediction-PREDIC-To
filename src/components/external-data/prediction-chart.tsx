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
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import type { PredictDemandFromCsvOutput } from "@/ai/flows/predict-demand-from-csv";

type ChartData = PredictDemandFromCsvOutput['forecastData'];

const chartConfig = {
  units: {
    label: "Predicted Units",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PredictionChart({ data }: { data: ChartData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>6-Month Demand Forecast</CardTitle>
        <CardDescription>
          Predicted units to be sold per month based on your data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <BarChart
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
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="units" fill="var(--color-units)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
