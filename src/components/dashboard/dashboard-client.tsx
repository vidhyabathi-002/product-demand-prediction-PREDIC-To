"use client";

import { useState, useEffect } from "react";
import { DemandChart, type ChartData } from "./demand-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function DashboardClient() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const chartData: ChartData[] = months.map((month) => ({
      month,
      projected: Math.round(1500 + Math.random() * 1000),
      actual: Math.round(1400 + Math.random() * 1200),
    }));
    setData(chartData);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your demand forecast overview.</p>
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 bg-primary/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Sales Performance</CardTitle>
              <CardDescription>Track real-time sales against projections.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DemandChart data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
