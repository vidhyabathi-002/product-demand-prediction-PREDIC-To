
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, PieChart, FileText, Home, LogOut, UploadCloud } from "lucide-react";
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
import { useUser } from "@/context/user-context";
import { useIsMobile } from "@/hooks/use-mobile";

const navConfig = {
  "Product Manager": ["/dashboard", "/analytics"],
  "Marketing Team": ["/dashboard", "/analytics", "/reports"],
  "Data Scientist": ["/dashboard", "/external-data", "/reports", "/analytics"],
  "Administrator": ["/dashboard", "/external-data", "/reports", "/analytics"],
};

const allMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/external-data", label: "External Data", icon: UploadCloud },
    { href: "/reports", label: "Reports", icon: FileText },
    { href: "/analytics", label: "Analytics", icon: PieChart },
];

const AppLogo = () => (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M22.5 12.5C24.5 14.5 24.5 17.5 22.5 19.5L16 26L9.5 19.5C7.5 17.5 7.5 14.5 9.5 12.5C11.5 10.5 14.5 10.5 16.5 12.5L16 13L15.5 12.5C17.5 10.5 20.5 10.5 22.5 12.5Z"
        stroke="hsl(var(--primary-foreground))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
);

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading } = useUser();
  const isMobile = useIsMobile();

  if (loading && !isMobile) {
    return (
       <Sidebar>
          <SidebarHeader className="p-4 no-print">
            <Link href="/dashboard" className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold tracking-tight text-primary">predicTo</h1>
            </Link>
          </SidebarHeader>
          <SidebarContent className="p-4 no-print">
          </SidebarContent>
       </Sidebar>
    )
  }

  const allowedRoutes = user?.role ? navConfig[user.role] : [];
  const menuItems = allMenuItems.filter(item => allowedRoutes.includes(item.href));


  const bottomMenuItems = [
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/login", label: "Login Page", icon: LogOut },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="p-4 no-print">
        <Link href="/dashboard" className="flex items-center gap-2">
           <AppLogo />
          <h1 className="text-2xl font-semibold tracking-tight text-primary">predicTo</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-4 no-print">
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
      <SidebarFooter className="p-4 no-print">
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
