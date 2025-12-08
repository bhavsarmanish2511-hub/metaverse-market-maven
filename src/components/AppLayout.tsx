import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuantumStatusIndicator } from "@/components/QuantumStatusIndicator";
import { FingerprintAuthModal } from "@/components/FingerprintAuthModal";
import { Outlet } from "react-router-dom";
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

export function AppLayout() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const { isIRCLeaderMode, setIRCLeaderMode } = useIRCLeader();
  const { toast } = useToast();

  const handleVerifySuccess = () => {
    setIsVerified(true);
    toast({
      title: "Identity Verified",
      description: "Biometric authentication successful. Access granted.",
    });
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
              <RoleSwitcher />
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <QuantumStatusIndicator />
              
              {/* Verify ID Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className={`gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 ${
                  isVerified ? 'border-success/50 bg-success/10 text-success' : ''
                }`}
              >
                <Fingerprint className="h-4 w-4" />
                <span className="hidden sm:inline">{isVerified ? 'Verified' : 'Verify ID'}</span>
              </Button>

              <ThemeToggle />

              {/* User Profile */}
              {isIRCLeaderMode && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 gap-3 pl-2 pr-3 hover:bg-muted/50">
                      <Avatar className="h-8 w-8 border-2 border-primary/50">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=BenHughes" alt="Ben Hughes" />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">BH</AvatarFallback>
                      </Avatar>
                      <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-sm font-medium">Ben Hughes</span>
                        <span className="text-xs text-primary font-semibold">IRC Leader</span>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="flex items-center gap-3 p-3">
                      <Avatar className="h-10 w-10 border-2 border-primary/50">
                        <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=BenHughes" alt="Ben Hughes" />
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">BH</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold">Ben Hughes</span>
                        <span className="text-xs text-primary">IRC Leader</span>
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
        open={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleVerifySuccess}
        roleName="SecureNet User"
      />
    </SidebarProvider>
  );
}
