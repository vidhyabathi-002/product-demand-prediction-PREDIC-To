
'use client';

import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/context/user-context';
import { ActivityLogProvider } from '@/context/activity-log-context';
import { NotificationProvider } from '@/context/notification-context';
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            <ActivityLogProvider>
                <NotificationProvider>
                    {children}
                    <Toaster />
                </NotificationProvider>
            </ActivityLogProvider>
        </UserProvider>
    )
}
