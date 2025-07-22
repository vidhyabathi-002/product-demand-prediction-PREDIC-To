
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';

export interface Notification {
  id: number;
  title: string;
  message: string;
  read: boolean;
  href?: string;
}

type NewNotification = Omit<Notification, 'id' | 'read'>;

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: NewNotification) => void;
  markAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedNotifications = sessionStorage.getItem('notifications');
      if (storedNotifications) {
        setNotifications(JSON.parse(storedNotifications));
      }
    } catch (error) {
      console.error("Failed to parse notifications from session storage", error);
      sessionStorage.removeItem('notifications');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        sessionStorage.setItem('notifications', JSON.stringify(notifications));
      } catch (error) {
        console.error("Failed to save notifications to session storage", error);
      }
    }
  }, [notifications, isInitialized]);

  const addNotification = useCallback((newNotification: NewNotification) => {
    const notification: Notification = {
      id: Date.now(),
      read: false,
      ...newNotification,
    };
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10
  }, []);

  const markAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, addNotification, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}
