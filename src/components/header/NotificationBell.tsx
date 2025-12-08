import { useState } from 'react';
import { Bell, AlertTriangle, Shield, Server, Clock, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'critical', title: 'Critical Alert', message: 'DDoS attack detected on edge servers', time: '2 min ago', read: false },
  { id: '2', type: 'warning', title: 'Security Warning', message: 'Multiple failed login attempts from IP 192.168.1.45', time: '15 min ago', read: false },
  { id: '3', type: 'info', title: 'System Update', message: 'Firewall rules updated successfully', time: '1 hour ago', read: false },
  { id: '4', type: 'success', title: 'Threat Neutralized', message: 'Malware quarantined on endpoint-042', time: '2 hours ago', read: true },
  { id: '5', type: 'warning', title: 'Anomaly Detected', message: 'Unusual outbound traffic from Finance dept', time: '3 hours ago', read: true },
];

const typeStyles = {
  critical: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  warning: { icon: Shield, color: 'text-warning', bg: 'bg-warning/10' },
  info: { icon: Server, color: 'text-primary', bg: 'bg-primary/10' },
  success: { icon: Check, color: 'text-success', bg: 'bg-success/10' },
};

export function NotificationBell() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[360px] bg-popover border-border">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <span className="font-semibold">Notifications</span>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </div>
        <ScrollArea className="h-[320px]">
          {notifications.map((notification) => {
            const { icon: Icon, color, bg } = typeStyles[notification.type];
            return (
              <DropdownMenuItem
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={cn(
                  "flex items-start gap-3 p-3 cursor-pointer focus:bg-muted/50",
                  !notification.read && "bg-muted/30"
                )}
              >
                <div className={cn("p-2 rounded-full mt-0.5", bg)}>
                  <Icon className={cn("h-4 w-4", color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={cn("font-medium text-sm", !notification.read && "text-foreground")}>
                      {notification.title}
                    </span>
                    {!notification.read && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{notification.message}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {notification.time}
                  </div>
                </div>
              </DropdownMenuItem>
            );
          })}
        </ScrollArea>
        <DropdownMenuSeparator />
        <div className="p-2">
          <Button variant="ghost" size="sm" className="w-full text-xs">
            View all notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
