
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode, useCallback } from 'react';

// Define the shape of your settings
interface AppSettings {
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  defaultLandingPage: string;
  theme: string;
  language: string;
  dateFormat: string;
  currency: string;
  auditLogsEnabled: boolean;
  systemAlertsEnabled: boolean;
}

// Define the context type
interface SettingsContextType {
  settings: AppSettings;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void;
  loading: boolean;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Define default settings
const defaultSettings: AppSettings = {
  notificationsEnabled: true,
  twoFactorEnabled: false,
  defaultLandingPage: 'dashboard',
  theme: 'system',
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  currency: 'INR',
  auditLogsEnabled: true,
  systemAlertsEnabled: true,
};

// Create the provider component
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  // Load settings from session storage on initial render
  useEffect(() => {
    try {
      const storedSettings = sessionStorage.getItem('appSettings');
      if (storedSettings) {
        setSettings(JSON.parse(storedSettings));
      }
    } catch (error) {
      console.error("Failed to parse settings from session storage", error);
    }
    setLoading(false);
  }, []);

  // Save settings to session storage whenever they change
  useEffect(() => {
    if (!loading) {
      try {
        sessionStorage.setItem('appSettings', JSON.stringify(settings));
      } catch (error) {
        console.error("Failed to save settings to session storage", error);
      }
    }
  }, [settings, loading]);

  // Function to update a specific setting
  const setSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  }, []);

  const value = { settings, setSetting, loading };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Create a custom hook for using the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
