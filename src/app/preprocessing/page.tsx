
import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import PreprocessingClient from "@/components/preprocessing/preprocessing-client";
import { Status } from "@/components/preprocessing/status";
import { Tips } from "@/components/preprocessing/tips";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Preparation",
};

export default function PreprocessingPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <PreprocessingClient />
                </div>
                <div className="lg:col-span-1 space-y-6">
                    <Status />
                    <Tips />
                </div>
            </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
