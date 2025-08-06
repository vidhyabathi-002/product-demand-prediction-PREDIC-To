
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings, PieChart, FileText, Home, LogOut, UploadCloud, Users, DatabaseZap, Columns3 } from "lucide-react";
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
  "Product Manager": ["/dashboard", "/analytics", "/reports", "/settings", "/profile", "/preprocessing", "/train-test-split", "/external-data"],
  "Marketing Team": ["/dashboard", "/analytics", "/settings", "/profile"],
  "Data Scientist": ["/dashboard", "/analytics", "/preprocessing", "/train-test-split", "/external-data", "/reports", "/settings", "/profile"],
  "Administrator": ["/dashboard", "/admin", "/preprocessing", "/train-test-split", "/external-data", "/reports", "/analytics", "/settings", "/profile"],
};

const allMenuItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin", label: "User Management", icon: Users },
    { href: "/preprocessing", label: "Data Preparation", icon: DatabaseZap },
    { href: "/train-test-split", label: "Train/Test Split", icon: Columns3 },
    { href: "/external-data", label: "Forecasting", icon: UploadCloud },
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
            d="M8 20L14 14L18 18L24 12"
            stroke="hsl(var(--primary-foreground))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <path
            d="M19 12H24V17"
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
