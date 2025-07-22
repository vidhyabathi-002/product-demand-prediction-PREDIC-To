
"use client";

import { useState, useEffect, type ReactNode } from "react";
import { DemandChart, type ChartData } from "./demand-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TrendingUp, Users, Target } from "lucide-react";
import { KpiCard } from "./kpi-card";
import { SimulationPanel, type SimulationParams } from "./simulation-panel";

const initialMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

// Custom Icon for INR
const RupeeSign = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
        <path d="M6 3h12" />
        <path d="M6 8h12" />
        <path d="m19 13-10 8" />
        <path d="M6 13h4" />
        <path d="M6 17h4" />
    </svg>
);


export default function DashboardClient({ children }: { children: ReactNode }) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [simulationParams, setSimulationParams] = useState<SimulationParams>({
    marketingSpend: 500,
    price: 39999,
    competitorActivity: 20,
  });

  useEffect(() => {
    // This is just a mock data generation function for the simulation
    const data: ChartData[] = initialMonths.map((month) => ({
      month,
      projected: Math.round(150 + Math.random() * 100 + (simulationParams.marketingSpend / 10) * 2 - (simulationParams.price/1000) + (100-simulationParams.competitorActivity) * 0.5),
      actual: Math.round(140 + Math.random() * 120 + (simulationParams.marketingSpend / 10) * 1.8 - (simulationParams.price/1000) + (100-simulationParams.competitorActivity) * 0.45),
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
        <KpiCard title="Projected Revenue" value="₹9.9Cr" icon={RupeeSign} description="+20.1% from last month" />
        <KpiCard title="Avg. Customer Value" value="₹1,95,000" icon={Users} description="+12.5% from last month" />
        <KpiCard title="Market Share" value="25%" icon={Target} description="+2% from last quarter" />
        <KpiCard title="Total Sales" value="5,432" icon={TrendingUp} description="+8.2% from last month" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <div className="flex items-start gap-4">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <CardTitle>Sales Performance</CardTitle>
                            <CardDescription>
                                This chart tracks simulated sales against projections, updated in real-time based on the Demand Simulation panel.
                            </CardDescription>
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
        {children}
      </div>
    </div>
  );
}
