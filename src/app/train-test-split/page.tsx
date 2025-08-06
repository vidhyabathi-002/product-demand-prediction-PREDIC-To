
import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import TrainTestClient from "@/components/train-test-split/train-test-client";
import { Status } from "@/components/train-test-split/status";
import { SplitGuidelines } from "@/components/train-test-split/split-guidelines";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Train/Test Split",
};

export default function TrainTestSplitPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <TrainTestClient />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Status />
                    <SplitGuidelines />
                </div>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
