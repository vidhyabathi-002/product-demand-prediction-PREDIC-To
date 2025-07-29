
// src/context/user-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type UserRole = 'Product Manager' | 'Marketing Team' | 'Data Scientist' | 'Administrator';

export interface User {
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const navConfig = {
  "Product Manager": ["/dashboard", "/analytics", "/reports", "/settings", "/profile"],
  "Marketing Team": ["/dashboard", "/analytics", "/settings", "/profile"],
  "Data Scientist": ["/dashboard", "/analytics", "/external-data", "/reports", "/settings", "/profile"],
  "Administrator": ["/dashboard", "/admin", "/external-data", "/reports", "/analytics", "/settings", "/profile"],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  useEffect(() => {
    setIsClient(true);
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUserState(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from session storage", error);
      sessionStorage.removeItem('user');
    }
    setLoading(false);
  }, []);

  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      try {
        sessionStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
         console.error("Failed to save user to session storage", error);
      }
    } else {
      sessionStorage.removeItem('user');
    }
  };
  
  useEffect(() => {
    if (loading || !isClient) return;

    const publicPaths = ['/login'];
    const pathIsPublic = publicPaths.includes(pathname);
    
    if (!user && !pathIsPublic) {
      router.push('/login');
    } else if (user) {
      const allowedRoutes = navConfig[user.role] || [];
      const isAllowed = allowedRoutes.some(route => pathname.startsWith(route));
      
      if (pathIsPublic) {
         router.push('/dashboard');
      } else if (!isAllowed) {
         router.push(allowedRoutes[0] || '/dashboard');
      }
    }
  }, [user, loading, pathname, router, isClient]);


  const contextValue = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  if (loading) {
    return null; // Or a loading spinner component
  }

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
