"use client";

import { useState, useEffect } from "react";
import { DemandChart, type ChartData } from "./demand-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, DollarSign, Users, Target } from "lucide-react";
import { KpiCard } from "./kpi-card";
import { PromoCard } from "./promo-card";
import { SimulationPanel, type SimulationParams } from "./simulation-panel";

const initialMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

export default function DashboardClient() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    marketingSpend: 500,
    price: 499,
    competitorActivity: 20,
  });

  useEffect(() => {
    const data: ChartData[] = initialMonths.map((month) => ({
      month,
      projected: Math.round(1500 + Math.random() * 1000 + simulationParams.marketingSpend * 2 - simulationParams.price + (100-simulationParams.competitorActivity) * 5),
      actual: Math.round(1400 + Math.random() * 1200 + simulationParams.marketingSpend * 1.8 - simulationParams.price + (100-simulationParams.competitorActivity) * 4.5),
    }));
    setChartData(data);
  }, [simulationParams]);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your demand forecast overview.</p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard title="Projected Revenue" value="$1.2M" icon={DollarSign} description="+20.1% from last month" />
        <KpiCard title="Avg. Customer Value" value="$2,350" icon={Users} description="+12.5% from last month" />
        <KpiCard title="Market Share" value="25%" icon={Target} description="+2% from last quarter" />
        <KpiCard title="Total Sales" value="5,432" icon={TrendingUp} description="+8.2% from last month" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                        <CardTitle>Sales Performance</CardTitle>
                        <CardDescription>Track real-time sales against projections.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                <DemandChart data={chartData} />
                </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-1">
            <SimulationPanel params={simulationParams} onParamsChange={setSimulationParams} />
        </div>
      </div>
       <div className="grid grid-cols-1 gap-6">
        <PromoCard />
      </div>
    </div>
  );
}
