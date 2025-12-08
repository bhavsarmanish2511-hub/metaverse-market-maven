import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuantumStatusIndicator } from "@/components/QuantumStatusIndicator";
import { FingerprintAuthModal } from "@/components/FingerprintAuthModal";
import { Outlet, useNavigate } from "react-router-dom";
import { Fingerprint, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIRCLeader } from "@/contexts/IRCLeaderContext";
import { useToast } from "@/hooks/use-toast";
import { RoleSwitcher } from "@/components/header/RoleSwitcher";
import { NotificationBell } from "@/components/header/NotificationBell";
import { useRole } from "@/contexts/RoleContext";

export function AppLayout() {
  const { isIRCLeaderMode, setIRCLeaderMode } = useIRCLeader();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pendingRole, setCurrentRole, isVerified, setIsVerified, roleName } = useRole();

  const handleVerifySuccess = () => {
    setIsVerified(true);
    setCurrentRole(pendingRole);
    toast({
      title: "Identity Verified",
      description: `Biometric authentication successful. Access granted as ${
        pendingRole === 'rcc_head' ? 'Resilient Command Centre Head' :
        pendingRole === 'analyst' ? 'Integrated Operations Analyst' :
        pendingRole === 'irc_leader' ? 'IRC Leader' :
        'Offensive Tester'
      }.`,
    });
    
    // Navigate to role-specific dashboard
    switch (pendingRole) {
      case 'rcc_head':
        navigate('/admin');
        break;
      case 'analyst':
        navigate('/analyst');
        break;
      case 'irc_leader':
        navigate('/irc-leader');
        break;
      case 'offensive_tester':
        navigate('/offensive/attack-surface');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = () => {
    setIRCLeaderMode(false);
    setIsVerified(false);
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col w-full">
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <QuantumStatusIndicator />
              
              {/* Role Switcher aligned with Verify ID */}
              <RoleSwitcher />
              
              {/* Verify ID Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('fingerprint-auth-trigger')?.click()}
                className={`gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 ${
                  isVerified ? 'border-success/50 bg-success/10 text-success' : ''
                }`}
              >
                <Fingerprint className="h-4 w-4" />
                <span className="hidden sm:inline">{isVerified ? 'Verified' : 'Verify ID'}</span>
              </Button>

              <ThemeToggle />

              {/* User Profile - Show when verified */}
              {isVerified && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 gap-3 pl-2 pr-3 hover:bg-muted/50">
                      <Avatar className="h-8 w-8 border-2 border-primary/50">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=SecureUser" alt="User" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">SU</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-sm font-medium">Verified User</span>
                        <span className="text-xs text-primary font-semibold">{roleName}</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-popover border-border">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=SecureUser" alt="User" />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">SU</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Verified User</span>
                        <span className="text-xs text-primary">{roleName}</span>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2">
                      <User className="h-4 w-4" />
                      View Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="gap-2 text-destructive focus:text-destructive">
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </header>
          <main className="flex-1 overflow-auto custom-scrollbar">
            <Outlet />
          </main>
        </div>
      </div>

      <FingerprintAuthModal 
        open={false} 
        onClose={() => {}}
        onSuccess={handleVerifySuccess}
        roleName={roleName}
        triggerId="fingerprint-auth-trigger"
      />
    </SidebarProvider>
  );
}
