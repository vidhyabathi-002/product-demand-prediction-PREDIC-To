
"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ModelPerformance } from "@/ai/flows/get-model-performance";

const chartConfig = {
  accuracy: {
    label: "Accuracy",
    color: "hsl(var(--chart-1))",
  },
  f1Score: {
    label: "F1-Score",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function ModelPerformanceChart({ data }: { data: ModelPerformance[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Model Performance Comparison</CardTitle>
        <CardDescription>
          Comparing Accuracy and F1-Score across all models.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
            accessibilityLayer
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="model"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis
              tickFormatter={(value) => (value * 100).toFixed(0) + '%'}
              domain={[0.7, 1]}
              tickCount={4}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                 formatter={(value, name) => (
                    <div className="flex flex-col">
                      <span className="text-muted-foreground">{chartConfig[name as keyof typeof chartConfig].label}</span>
                      <span className="font-bold">{(typeof value === 'number' ? (value * 100).toFixed(0) + '%' : value)}</span>
                    </div>
                )}
              />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="accuracy" fill="var(--color-accuracy)" radius={4} />
            <Bar dataKey="f1Score" fill="var(--color-f1Score)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
