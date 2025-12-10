import { useState } from 'react';
import { Bell, AlertTriangle, Shield, Server, Clock, Check, Settings, X, Volume2, VolumeX } from 'lucide-react';
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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';
import { FingerprintAuthModal } from '@/components/FingerprintAuthModal';

const typeStyles = {
  critical: { icon: AlertTriangle, color: 'text-destructive', bg: 'bg-destructive/10' },
  warning: { icon: Shield, color: 'text-warning', bg: 'bg-warning/10' },
  info: { icon: Server, color: 'text-primary', bg: 'bg-primary/10' },
  success: { icon: Check, color: 'text-success', bg: 'bg-success/10' },
};

export function NotificationBell() {
  const [showSettings, setShowSettings] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingNotification, setPendingNotification] = useState<Notification | null>(null);
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    preferences,
    markAsRead, 
    markAllAsRead,
    clearAll,
    updatePreferences 
  } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    if (notification.requiredRole) {
      setPendingNotification(notification);
      setShowAuthModal(true);
    } else {
      markAsRead(notification.id);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    if (pendingNotification) {
      markAsRead(pendingNotification.id);
      // Navigate to the appropriate dashboard based on required role
      if (pendingNotification.requiredRole === 'Offensive Tester') {
        navigate('/offensive-tester');
      } else if (pendingNotification.requiredRole === 'IRC Leader') {
        navigate('/irc-leader');
      }
      setPendingNotification(null);
    }
  };

  const handleBellClick = () => {
    // Navigate to the first critical alert's page
    const criticalAlert = notifications.find(n => n.type === 'critical');
    if (criticalAlert?.requiredRole === 'Offensive Tester') {
      navigate('/offensive-tester');
    } else if (criticalAlert?.requiredRole === 'IRC Leader') {
      navigate('/irc-leader');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative h-9 w-9" onClick={handleBellClick}>
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] font-bold animate-pulse"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[380px] bg-popover border-border">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-7 w-7"
              onClick={() => setShowSettings(!showSettings)}
              title="Notification settings"
            >
              <Settings className={cn("h-4 w-4", showSettings && "text-primary")} />
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {showSettings ? (
          /* Preferences Panel */
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm">Notification Preferences</h4>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => setShowSettings(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-destructive/10">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                  </div>
                  <Label className="text-sm">Critical Alerts</Label>
                </div>
                <Switch 
                  checked={preferences.critical}
                  onCheckedChange={(checked) => updatePreferences({ critical: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-warning/10">
                    <Shield className="h-3 w-3 text-warning" />
                  </div>
                  <Label className="text-sm">Warnings</Label>
                </div>
                <Switch 
                  checked={preferences.warning}
                  onCheckedChange={(checked) => updatePreferences({ warning: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-primary/10">
                    <Server className="h-3 w-3 text-primary" />
                  </div>
                  <Label className="text-sm">Info Updates</Label>
                </div>
                <Switch 
                  checked={preferences.info}
                  onCheckedChange={(checked) => updatePreferences({ info: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded bg-success/10">
                    <Check className="h-3 w-3 text-success" />
                  </div>
                  <Label className="text-sm">Success Notifications</Label>
                </div>
                <Switch 
                  checked={preferences.success}
                  onCheckedChange={(checked) => updatePreferences({ success: checked })}
                />
              </div>

              <DropdownMenuSeparator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {preferences.soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-muted-foreground" />
                  )}
                  <Label className="text-sm">Sound Alerts</Label>
                </div>
                <Switch 
                  checked={preferences.soundEnabled}
                  onCheckedChange={(checked) => updatePreferences({ soundEnabled: checked })}
                />
              </div>

              <div className="pt-2">
                <Label className="text-xs text-muted-foreground">
                  Polling Interval: {preferences.pollingInterval}s
                </Label>
                <div className="flex gap-2 mt-2">
                  {[15, 30, 60].map((interval) => (
                    <Button
                      key={interval}
                      variant={preferences.pollingInterval === interval ? "default" : "outline"}
                      size="sm"
                      className="flex-1 h-7 text-xs"
                      onClick={() => updatePreferences({ pollingInterval: interval })}
                    >
                      {interval}s
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Notifications List */
          <>
            <ScrollArea className="h-[320px]">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => {
                  const { icon: Icon, color, bg } = typeStyles[notification.type];
                  return (
                    <DropdownMenuItem
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
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
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 animate-pulse" />
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
                })
              )}
            </ScrollArea>
            <DropdownMenuSeparator />
            <div className="p-2 flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs"
                onClick={() => setShowSettings(true)}
              >
                Settings
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 text-xs text-muted-foreground"
                onClick={clearAll}
              >
                Clear all
              </Button>
            </div>
          </>
        )}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <FingerprintAuthModal
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          setPendingNotification(null);
        }}
        onSuccess={handleAuthSuccess}
        requiredRole={pendingNotification?.requiredRole}
      />
    </>
  );
}