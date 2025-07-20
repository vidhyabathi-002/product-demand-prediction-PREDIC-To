"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, DollarSign, Target } from "lucide-react";
import { KpiCard } from "./kpi-card";
import { DemandChart, type ChartData } from "./demand-chart";
import {
  SimulationPanel,
  type SimulationParams,
} from "./simulation-panel";

const initialParams: SimulationParams = {
  marketingSpend: 500,
  price: 499,
  competitorActivity: 20,
};

const months = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function DashboardClient() {
  const [params, setParams] = useState<SimulationParams>(initialParams);
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    const historicalData: ChartData[] = months.slice(0, 6).map((month, index) => ({
        month,
        sales: 20000 + Math.random() * 15000 + index * 2000,
        forecast: 0,
      }));

    const updateForecast = (baseData: ChartData[], currentParams: SimulationParams): ChartData[] => {
      const salesData = baseData.map(d => ({ ...d, forecast: 0 }));
      const forecast: ChartData[] = [];
      let lastSale = salesData[salesData.length - 1].sales;

      for (let i = 0; i < 6; i++) {
        const marketingEffect = currentParams.marketingSpend / 1000;
        const priceEffect = (750 - currentParams.price) / 500;
        const competitorEffect = 1 - currentParams.competitorActivity / 100;

        let growthFactor = 1.05 + marketingEffect * 0.1 * priceEffect * competitorEffect;
        let noise = (Math.random() - 0.5) * 5000;
        let nextForecast = lastSale * growthFactor + noise;
        if (nextForecast < 0) nextForecast = 0;

        forecast.push({
          month: months[salesData.length + i],
          sales: 0,
          forecast: Math.round(nextForecast),
        });
        lastSale = nextForecast;
      }

      const fullData = salesData.map(d => ({ ...d, sales: Math.round(d.sales) }));
      forecast.forEach((f, i) => {
        if (i === 0) {
          fullData[fullData.length - 1].forecast = fullData[fullData.length - 1].sales;
        }
        fullData.push(f);
      });

      return fullData;
    };

    setData(updateForecast(historicalData, params));
  }, [params]);

  const kpiData = useMemo(() => {
    const { totalSales, totalForecast } = data.reduce(
      (acc, item) => {
        acc.totalSales += item.sales;
        acc.totalForecast += item.forecast > item.sales ? (item.forecast - item.sales) : 0;
        return acc;
      },
      { totalSales: 0, totalForecast: 0 }
    );
    
    const salesDataPoints = data.filter(d => d.sales > 0);
    const firstMonthSales = salesDataPoints[0]?.sales || 0;
    const lastMonthSales = salesDataPoints[salesDataPoints.length - 1]?.sales || 0;
    const salesGrowth = firstMonthSales > 0 ? ((lastMonthSales - firstMonthSales) / firstMonthSales) * 100 : 0;

    const sixMonthForecast = data.filter(d => d.forecast > 0 && d.sales === 0).reduce((sum, item) => sum + item.forecast, 0);

    return {
      totalSales,
      sixMonthForecast,
      salesGrowth,
    };
  }, [data]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <KpiCard
          title="Total Sales (6 mo)"
          value={`$${(kpiData.totalSales / 1000).toFixed(1)}k`}
          icon={DollarSign}
          description={`${kpiData.salesGrowth > 0 ? '+' : ''}${kpiData.salesGrowth.toFixed(1)}% historical growth`}
        />
        <KpiCard
          title="Demand Forecast (next 6 mo)"
          value={`$${(kpiData.sixMonthForecast / 1000).toFixed(1)}k`}
          icon={TrendingUp}
          description="Based on simulation"
        />
        <KpiCard
          title="Market Opportunity"
          value="High"
          icon={Target}
          description="Based on current trends"
        />
      </div>
      <DemandChart data={data} />
      <SimulationPanel params={params} onParamsChange={setParams} />
    </div>
  );
}
