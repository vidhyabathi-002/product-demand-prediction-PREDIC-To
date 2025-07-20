
"use client";

import { usePathname, useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useUser, type UserRole } from "@/context/user-context";

const roleAvatars: Record<UserRole, string> = {
  'Product Manager': 'https://i.pravatar.cc/150?u=product-manager',
  'Marketing Team': 'https://i.pravatar.cc/150?u=marketing-team',
  'Data Scientist': 'https://i.pravatar.cc/150?u=data-scientist',
  'Administrator': 'https://i.pravatar.cc/150?u=administrator',
};

export function AppHeader() {
  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  }

  const avatarUrl = user ? roleAvatars[user.role] : 'https://i.pravatar.cc/150';
  
  return (
    <header className="flex h-16 items-center justify-between border-b bg-transparent px-4 sm:px-6 lg:px-8 sticky top-0 z-10 no-print">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden" />
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={avatarUrl} alt="@user" />
                <AvatarFallback>{user?.name?.[0] ?? 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
