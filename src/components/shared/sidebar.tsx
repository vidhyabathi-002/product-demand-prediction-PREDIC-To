"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChartHorizontal, Settings, PieChart, FileText, Home, LogOut, UploadCloud } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/external-data", label: "External Data", icon: UploadCloud },
    { href: "/analytics", label: "Analytics", icon: PieChart },
    { href: "/reports", label: "Reports", icon: FileText },
  ];

  const bottomMenuItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/login", label: "Login Page", icon: LogOut },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BarChartHorizontal className="w-8 h-8 text-primary" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} variant="default" size="default" className="justify-start data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
                <Link href={item.href}>
                  <item.icon className="w-5 h-5" />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {item.label}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarSeparator className="mb-4" />
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
             <SidebarMenuItem key={item.href}>
             <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} variant="default" size="default" className="justify-start data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground">
               <Link href={item.href}>
                 <item.icon className="w-5 h-5" />
                 <span className="group-data-[collapsible=icon]:hidden">
                   {item.label}
                 </span>
               </Link>
             </SidebarMenuButton>
           </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
