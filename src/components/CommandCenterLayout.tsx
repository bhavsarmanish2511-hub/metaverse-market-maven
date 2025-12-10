import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { QuantumStatusIndicator } from "@/components/QuantumStatusIndicator";
import { BiometricAuthModal } from "@/components/BiometricAuthModal";
import { Fingerprint } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { RoleSwitcher } from "@/components/header/RoleSwitcher";
import { NotificationBell } from "@/components/header/NotificationBell";
import { HoverNavigation } from "@/components/HoverNavigation";
import { useRole } from "@/contexts/RoleContext";
import { useNavigate, Link } from "react-router-dom";
import { User, Shield, Power } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export function CommandCenterLayout() {
  const { signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pendingRole, setCurrentRole, isVerified, setIsVerified, roleName, setShowLoginAlerts } = useRole();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingRoleForAuth, setPendingRoleForAuth] = useState(pendingRole);

  const getRoleName = (role: string) => {
    switch (role) {
      case 'rcc_head': return 'Resilient Command Centre Head';
      case 'analyst': return 'Integrated Operations Analyst';
      case 'irc_leader': return 'IRC Leader';
      case 'offensive_tester': return 'Offensive Tester';
      default: return 'User';
    }
  };

  const handleRoleChange = (newRole: typeof pendingRole) => {
    setPendingRoleForAuth(newRole);
    setShowAuthModal(true);
    toast({
      title: "Role Change Required",
      description: `Please verify your identity for ${getRoleName(newRole)} role.`,
    });
  };

  const handleVerifySuccess = () => {
    setShowAuthModal(false);
    setIsVerified(true);
    setCurrentRole(pendingRoleForAuth);
    setPendingRoleForAuth(null); // Reset pending role after success
    toast({
      title: "Identity Verified",
      description: `Biometric authentication successful. Access granted as ${getRoleName(pendingRoleForAuth)}.`,
    });

    // Navigate to role-specific dashboard
    switch (pendingRoleForAuth) {
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

  return (
    <div className="min-h-screen flex flex-col w-full bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between h-14 md:h-16 px-4 md:px-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-sm md:text-lg">SecureNet</h2>
              <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">Powered by HELIOS</p>
            </div>
        </Link>
        <div className="flex items-center gap-2 md:gap-3">
          <NotificationBell />
          <div className="hidden sm:block">
            <QuantumStatusIndicator />
          </div>

          {/* Role Switcher */}
          <RoleSwitcher onRoleChange={handleRoleChange} />

          {/* Verify ID Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPendingRoleForAuth(pendingRole);
              setShowAuthModal(true);
            }}
            className={`gap-1.5 md:gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 text-xs md:text-sm ${
              isVerified ? 'border-success/50 bg-success/10 text-success' : ''
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="hidden sm:inline">{isVerified ? 'Verified' : 'Verify ID'}</span>
          </Button>

          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            onClick={signOut}
            className="h-8 w-8 text-error/70 hover:text-error hover:bg-error/10 rounded-full transition-all duration-300 hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
            title="Logout"
          >
            <Power className="h-4 w-4" />
          </Button>
          {/* User Profile - Show when verified */}
          {isVerified && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 md:h-10 gap-2 md:gap-3 pl-1.5 md:pl-2 pr-2 md:pr-3 hover:bg-muted/50">
                  <Avatar className="h-7 w-7 md:h-8 md:w-8 border-2 border-primary/50">
                    <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=BenHughes" alt="Ben Hughes" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">BH</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-left">
                    <span className="text-sm font-medium">Ben Hughes</span>
                    <span className="text-xs text-primary font-semibold">{roleName}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-popover border-border z-50">
                <div className="flex items-center gap-3 p-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/50">
                    <AvatarImage src="https://api.dicebear.com/7.x/personas/svg?seed=BenHughes" alt="Ben Hughes" />
                    <AvatarFallback className="bg-primary/20 text-primary font-bold">BH</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Ben Hughes</span>
                    <span className="text-xs text-primary">{roleName}</span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User className="h-4 w-4" />
                  View Profile
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {/* Hover Navigation */}
      <HoverNavigation />

      {/* Main Content - Full width */}
      <main className="flex-1 overflow-auto custom-scrollbar">
        <Outlet />
      </main>

      {/* Biometric Auth Modal with carousel */}
      <BiometricAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleVerifySuccess}
        roleName={getRoleName(pendingRoleForAuth)}
      />
    </div>
  );
}
