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
import { useToast } from '@/hooks/use-toast';

interface RoleOption {
  id: UserRole;
  name: string;
  description: string;
  icon: 'Shield' | 'Activity' | 'Target' | 'Crown';
}
//new comment added
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

export function RoleSwitcher() {
  const { currentRole, setCurrentRole, roleName } = useRole();
  const { toast } = useToast();
  const selectedRoleData = roleOptions.find(r => r.id === currentRole);
  const SelectedIcon = iconMap[selectedRoleData?.icon || 'Activity'];

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    const newRoleName = roleOptions.find(r => r.id === role)?.name;
    toast({
      title: "Role Switched",
      description: `Now operating as ${newRoleName}`,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 min-w-[140px] justify-between border-primary/30 hover:border-primary">
          <div className="flex items-center gap-2">
            <SelectedIcon className="h-4 w-4 text-primary" />
            <span className="hidden md:inline text-sm">{selectedRoleData?.name}</span>
          </div>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px] bg-popover border-border">
        {roleOptions.map((role, index) => {
          const Icon = iconMap[role.icon];
          const isRCCHead = role.id === 'rcc_head';
          return (
            <>
              <DropdownMenuItem
                key={role.id}
                onClick={() => handleRoleChange(role.id)}
                className={cn(
                  "flex flex-col items-start gap-1 p-3 cursor-pointer",
                  currentRole === role.id && "bg-primary/10",
                  isRCCHead && "border-l-2 border-warning"
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <Icon className={cn("h-4 w-4", isRCCHead ? "text-warning" : "text-primary")} />
                  <span className="font-medium">{role.name}</span>
                </div>
                <span className="text-xs text-muted-foreground pl-6">{role.description}</span>
              </DropdownMenuItem>
              {index === 0 && <DropdownMenuSeparator />}
            </>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
