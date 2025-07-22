// src/context/activity-log-context.tsx
'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export interface LogEntry {
  id: number;
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

type NewLogEntry = Omit<LogEntry, 'id' | 'timestamp'>;

interface ActivityLogContextType {
  logs: LogEntry[];
  addLog: (entry: NewLogEntry) => void;
}

const ActivityLogContext = createContext<ActivityLogContextType | undefined>(undefined);

export function ActivityLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedLogs = sessionStorage.getItem('activityLogs');
      if (storedLogs) {
        setLogs(JSON.parse(storedLogs));
      }
    } catch (error) {
      console.error("Failed to parse logs from session storage", error);
      sessionStorage.removeItem('activityLogs');
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        sessionStorage.setItem('activityLogs', JSON.stringify(logs));
      } catch (error) {
        console.error("Failed to save logs to session storage", error);
      }
    }
  }, [logs, isInitialized]);

  const addLog = (entry: NewLogEntry) => {
    const newLog: LogEntry = {
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...entry,
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
}

export function useActivityLog() {
  const context = useContext(ActivityLogContext);
  if (context === undefined) {
    throw new Error('useActivityLog must be used within an ActivityLogProvider');
  }
  return context;
}
