
// src/context/user-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export type UserRole = 'Product Manager' | 'Marketing Team' | 'Data Scientist' | 'Administrator';

interface User {
  name: string;
  role: UserRole;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const navConfig = {
  "Product Manager": ["/dashboard", "/analytics"],
  "Marketing Team": ["/dashboard", "/analytics", "/reports"],
  "Data Scientist": ["/dashboard", "/external-data", "/reports", "/analytics"],
  "Administrator": ["/dashboard", "/admin", "/external-data", "/reports", "/analytics"],
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
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
      sessionStorage.setItem('user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('user');
    }
  };

  useEffect(() => {
    if (loading) return;

    const publicPaths = ['/login'];
    const pathIsPublic = publicPaths.includes(pathname);

    if (!user && !pathIsPublic) {
      router.push('/login');
    } else if (user) {
      if (pathIsPublic) {
        router.push('/dashboard');
      } else {
        const allowedRoutes = navConfig[user.role];
        const currentRoute = '/' + pathname.split('/')[1]; // get base route
        if (!allowedRoutes.includes(currentRoute)) {
            router.push(allowedRoutes[0] || '/dashboard');
        }
      }
    }
  }, [user, loading, pathname, router]);


  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
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
