'use client';

import { Toaster } from "@/components/ui/toaster"
import { UserProvider } from '@/context/user-context';
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
    return (
        <UserProvider>
            {children}
            <Toaster />
        </UserProvider>
    )
}
