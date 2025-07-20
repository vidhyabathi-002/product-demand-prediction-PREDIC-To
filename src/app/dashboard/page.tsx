import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardClient from "@/components/dashboard/dashboard-client";
import { PromoCard } from "@/components/dashboard/promo-card";
import { SocialSentimentCard } from "@/components/dashboard/social-sentiment-card";

export default function DashboardPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
          <DashboardClient>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PromoCard />
              <SocialSentimentCard />
            </div>
          </DashboardClient>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
