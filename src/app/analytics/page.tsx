import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import AnalyticsClient from "@/components/analytics/analytics-client";
import { SocialSentimentCard } from "@/components/analytics/social-sentiment-card";

export default function AnalyticsPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8">
            <AnalyticsClient>
                <SocialSentimentCard />
            </AnalyticsClient>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
