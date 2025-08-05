
import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import UploadClient from "@/components/external-data/upload-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forecasting",
};

export default function ExternalDataPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
            <UploadClient />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
