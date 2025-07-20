
"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export type ChartData = {
  month: string;
  projected: number;
  actual: number;
};

const chartConfig = {
  projected: {
    label: "Projected Sales",
    color: "hsl(var(--chart-1))",
  },
  actual: {
    label: "Actual Sales",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function DemandChart({ data }: { data: ChartData[] }) {
  return (
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
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${Number(value)}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dot" />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="projected" fill="var(--color-projected)" radius={4} />
          <Bar dataKey="actual" fill="var(--color-actual)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
