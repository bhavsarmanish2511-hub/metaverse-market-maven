import { Shield, Activity, Target, ChevronDown, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useRole, UserRole } from '@/contexts/RoleContext';

interface RoleOption {
  id: UserRole;
  name: string;
  description: string;
  icon: 'Shield' | 'Activity' | 'Target' | 'Crown';
}

const roleOptions: RoleOption[] = [
  { id: 'rcc_head', name: 'Resilient Command Centre Head', description: 'Global admin access', icon: 'Crown' },
  { id: 'analyst', name: 'Integrated Operations Analyst', description: 'SOC/NOC unified view', icon: 'Activity' },
  { id: 'irc_leader', name: 'IRC Leader', description: 'Incident command authority', icon: 'Shield' },
  { id: 'offensive_tester', name: 'Offensive Tester', description: 'Red team operations', icon: 'Target' },
];

const iconMap = {
  Shield: Shield,
  Activity: Activity,
  Target: Target,
  Crown: Crown,
};

interface RoleSwitcherProps {
  onRoleChange?: (role: UserRole) => void;
}

export function RoleSwitcher({ onRoleChange }: RoleSwitcherProps) {
  const { pendingRole, setPendingRole, isVerified, currentRole, setIsVerified } = useRole();

  // Show the verified role if verified, otherwise show pending selection
  const displayRole = isVerified ? currentRole : pendingRole;
  const selectedRoleData = roleOptions.find(r => r.id === displayRole);
  const SelectedIcon = iconMap[selectedRoleData?.icon || 'Crown'];

  const handleRoleSelect = (role: UserRole) => {
    // Always set the new role as pending and trigger the verification flow.
    setIsVerified(false);
    setPendingRole(role);
    onRoleChange?.(role);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "gap-2 min-w-[180px] justify-between border-primary/30 hover:border-primary",
            isVerified && "border-success/50 bg-success/5"
          )}
        >
          <div className="flex items-center gap-2">
            <SelectedIcon className={cn("h-4 w-4", isVerified ? "text-success" : "text-primary")} />
            <span className="hidden md:inline text-sm truncate max-w-[140px]">{selectedRoleData?.name}</span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] bg-popover border-border z-50">
        {roleOptions.map((role, index) => {
          const Icon = iconMap[role.icon];
          const isRCCHead = role.id === 'rcc_head';
          const isSelected = displayRole === role.id;
          return (
            <div key={role.id}>
              <DropdownMenuItem
                onClick={() => handleRoleSelect(role.id)}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  isSelected && "bg-primary/10",
                  isRCCHead && "border-l-2 border-warning"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className={cn("h-4 w-4", isRCCHead ? "text-warning" : "text-primary")} />
                  <span className="font-medium">{role.name}</span>
                  {isSelected && isVerified && (
                    <span className="ml-auto text-xs text-success font-medium">Active</span>
                  )}
                </div>
                <span className="text-xs text-muted-foreground pl-6">{role.description}</span>
              </DropdownMenuItem>
              {index === 0 && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
