import { useState } from 'react';
import { Shield, Activity, Target, LogIn, ChevronDown, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { roleOptions, UserRole } from '@/lib/ircAlertData';
import { cn } from '@/lib/utils';

interface RoleSelectorProps {
  selectedRole: UserRole;
  loggedInRole: UserRole;
  onRoleSelect: (role: UserRole) => void;
  onLogin: () => void;
  onLogout: () => void;
}

const iconMap = {
  Shield: Shield,
  Activity: Activity,
  Target: Target,
};

export function RoleSelector({ selectedRole, loggedInRole, onRoleSelect, onLogin, onLogout }: RoleSelectorProps) {
  const selectedRoleData = roleOptions.find(r => r.id === selectedRole);
  const loggedInRoleData = roleOptions.find(r => r.id === loggedInRole);

  if (loggedInRole) {
    const Icon = iconMap[loggedInRoleData?.icon as keyof typeof iconMap] || Shield;
    return (
      <Button
        onClick={onLogout}
        variant="outline"
        className="gap-2 border-error/30 bg-error/10 hover:bg-error/20 text-error"
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{loggedInRoleData?.name}</span>
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2 min-w-[180px] justify-between">
            {selectedRoleData ? (
              <>
                {(() => {
                  const Icon = iconMap[selectedRoleData.icon as keyof typeof iconMap];
                  return <Icon className="h-4 w-4" />;
                })()}
                <span className="hidden sm:inline">{selectedRoleData.name}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Select Role</span>
            )}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          {roleOptions.map((role) => {
            const Icon = iconMap[role.icon as keyof typeof iconMap];
            return (
              <DropdownMenuItem
                key={role.id}
                onClick={() => onRoleSelect(role.id)}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  selectedRole === role.id && "bg-primary/10"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className="h-4 w-4 text-primary" />
                  <span className="font-medium">{role.name}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-6">{role.description}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        onClick={onLogin}
        disabled={!selectedRole}
        className="gap-2 bg-primary hover:bg-primary/90"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Button>
    </div>
  );
}
