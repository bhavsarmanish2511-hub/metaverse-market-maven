import { useState, useEffect, useCallback } from 'react';

export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
  timestamp: Date;
}

export interface NotificationPreferences {
  critical: boolean;
  warning: boolean;
  info: boolean;
  success: boolean;
  soundEnabled: boolean;
  pollingInterval: number; // in seconds
}

const defaultPreferences: NotificationPreferences = {
  critical: true,
  warning: true,
  info: true,
  success: true,
  soundEnabled: true,
  pollingInterval: 30,
};

// Simulated real-time alerts that will be "fetched"
const simulatedAlerts: Omit<Notification, 'id' | 'time' | 'read' | 'timestamp'>[] = [
  { type: 'critical', title: 'Ransomware Detected', message: 'Suspicious encryption activity on endpoint-078' },
  { type: 'warning', title: 'Brute Force Attempt', message: 'Multiple failed SSH attempts from 10.0.5.231' },
  { type: 'info', title: 'Patch Available', message: 'Critical security patch ready for deployment' },
  { type: 'critical', title: 'Data Exfiltration Alert', message: 'Large outbound transfer detected to unknown IP' },
  { type: 'warning', title: 'Certificate Expiring', message: 'SSL certificate for api.internal expires in 7 days' },
  { type: 'success', title: 'Threat Contained', message: 'Malicious process quarantined on server-042' },
  { type: 'info', title: 'Firewall Updated', message: 'New rules deployed across perimeter devices' },
  { type: 'critical', title: 'Zero-Day Exploit', message: 'New CVE detected affecting production systems' },
];

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: '1', type: 'critical', title: 'Critical Alert', message: 'DDoS attack detected on edge servers', time: '2 min ago', read: false, timestamp: new Date(Date.now() - 120000) },
    { id: '2', type: 'warning', title: 'Security Warning', message: 'Multiple failed login attempts from IP 192.168.1.45', time: '15 min ago', read: false, timestamp: new Date(Date.now() - 900000) },
    { id: '3', type: 'info', title: 'System Update', message: 'Firewall rules updated successfully', time: '1 hour ago', read: false, timestamp: new Date(Date.now() - 3600000) },
    { id: '4', type: 'success', title: 'Threat Neutralized', message: 'Malware quarantined on endpoint-042', time: '2 hours ago', read: true, timestamp: new Date(Date.now() - 7200000) },
    { id: '5', type: 'warning', title: 'Anomaly Detected', message: 'Unusual outbound traffic from Finance dept', time: '3 hours ago', read: true, timestamp: new Date(Date.now() - 10800000) },
  ]);

  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('notificationPreferences');
    return saved ? JSON.parse(saved) : defaultPreferences;
  });

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Polling for new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate fetching new notification (30% chance each poll)
      if (Math.random() < 0.3) {
        const randomAlert = simulatedAlerts[Math.floor(Math.random() * simulatedAlerts.length)];
        
        // Check if this type is enabled in preferences
        if (!preferences[randomAlert.type]) return;

        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          ...randomAlert,
          time: 'Just now',
          read: false,
          timestamp: new Date(),
        };

        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
      }

      // Update time labels
      setNotifications(prev => prev.map(n => ({
        ...n,
        time: formatTimeAgo(n.timestamp),
      })));
    }, preferences.pollingInterval * 1000);

    return () => clearInterval(interval);
  }, [preferences]);

  const unreadCount = notifications.filter(n => !n.read && preferences[n.type]).length;

  const filteredNotifications = notifications.filter(n => preferences[n.type]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  return {
    notifications: filteredNotifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    clearAll,
    updatePreferences,
  };
}