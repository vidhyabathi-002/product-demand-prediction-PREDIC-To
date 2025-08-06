
// src/context/user-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useSettings } from './settings-context';

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
  "Product Manager": ["/dashboard", "/analytics", "/reports", "/settings", "/profile", "/preprocessing", "/train-test-split", "/external-data"],
  "Marketing Team": ["/dashboard", "/analytics", "/settings", "/profile"],
  "Data Scientist": ["/dashboard", "/analytics", "/preprocessing", "/train-test-split", "/external-data", "/reports", "/settings", "/profile"],
  "Administrator": ["/dashboard", "/admin", "/preprocessing", "/train-test-split", "/external-data", "/reports", "/analytics", "/settings", "/profile"],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { settings } = useSettings();
  
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
      const landingPage = settings.defaultLandingPage === 'forecast' ? '/external-data' : `/${settings.defaultLandingPage}`;
      
      if (pathIsPublic) {
         router.push(landingPage);
      } else if (!isAllowed) {
         router.push(allowedRoutes[0] || '/dashboard');
      }
    }
  }, [user, loading, pathname, router, isClient, settings.defaultLandingPage]);


  const contextValue = useMemo(() => ({ user, setUser, loading }), [user, loading]);

  // Only render children when the client check is complete and auth status is resolved.
  if (!isClient || loading) {
    return null;
  }
  
  const publicPaths = ['/login'];
  const pathIsPublic = publicPaths.includes(pathname);

  // If we're on a public path, or we have a user, render the children.
  if (pathIsPublic || user) {
    return (
      <UserContext.Provider value={contextValue}>
        {children}
      </UserContext.Provider>
    );
  }

  // Otherwise, we are redirecting, so don't render anything.
  return null;
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
