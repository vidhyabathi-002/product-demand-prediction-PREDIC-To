
import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { PromoCard } from "@/components/dashboard/promo-card";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ModelPerformanceSection } from "@/components/dashboard/model-performance-section";

export const metadata: Metadata = {
  title: "Dashboard",
};

function PromoCardSkeleton() {
  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
            <div className="p-4 space-y-2 border rounded-lg">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full mt-2" />
            </div>
        </div>
    </div>
  )
}

function ModelPerformanceSkeleton() {
    return (
        <div className="space-y-6">
            <div className="p-4 space-y-2 border rounded-lg">
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-80 w-full" />
            </div>
        </div>
    )
}

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <DashboardClient>
            <div className="grid grid-cols-1 gap-6">
                <Suspense fallback={<PromoCardSkeleton />}>
                    <PromoCard />
                </Suspense>
                <Suspense fallback={<ModelPerformanceSkeleton />}>
                    <ModelPerformanceSection />
                </Suspense>
            </div>
          </DashboardClient>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
