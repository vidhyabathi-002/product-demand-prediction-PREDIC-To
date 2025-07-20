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
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export type ChartData = {
  month: string;
  sales: number;
  forecast: number;
};

const chartConfig = {
  sales: {
    label: "Sales",
    color: "hsl(var(--chart-1))",
  },
  forecast: {
    label: "Forecast",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DemandChart({ data }: { data: ChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales & Demand Forecast</CardTitle>
        <CardDescription>
          Historical sales and predicted demand based on simulation.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                <linearGradient id="fillSales" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-sales)"
                    stopOpacity={0}
                  />
                </linearGradient>
                <linearGradient id="fillForecast" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-forecast)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-forecast)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="sales"
                type="natural"
                fill="url(#fillSales)"
                fillOpacity={0.4}
                stroke="var(--color-sales)"
                stackId="a"
              />
              <Area
                dataKey="forecast"
                type="natural"
                fill="url(#fillForecast)"
                fillOpacity={0.4}
                stroke="var(--color-forecast)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
