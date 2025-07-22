
import { AppSidebar } from "@/components/shared/sidebar";
import { AppHeader } from "@/components/shared/header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import UserManagementClient from "@/components/admin/user-management-client";
import type { Metadata } from "next";
import { ActivityLogClient } from "@/components/admin/activity-log-client";

export const metadata: Metadata = {
  title: "User Management",
};

export default function AdminPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          <UserManagementClient />
          <ActivityLogClient />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
