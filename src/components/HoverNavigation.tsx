import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight,
  LayoutDashboard,
  Shield,
  Network,
  AlertTriangle,
  Target,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/contexts/RoleContext';

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
  roles: string[];
}

const navItems: NavItem[] = [
  { 
    label: 'Command Center', 
    icon: <LayoutDashboard className="h-4 w-4" />, 
    path: '/',
    roles: ['analyst', 'irc_leader', 'offensive_tester', 'rcc_head']
  },
  { 
    label: 'SOC Overview', 
    icon: <Shield className="h-4 w-4" />, 
    path: '/soc',
    roles: ['analyst', 'irc_leader', 'rcc_head']
  },
  { 
    label: 'NOC Overview', 
    icon: <Network className="h-4 w-4" />, 
    path: '/noc',
    roles: ['analyst', 'rcc_head']
  },
  { 
    label: 'IRC Leader', 
    icon: <AlertTriangle className="h-4 w-4" />, 
    path: '/irc-leader',
    roles: ['irc_leader', 'rcc_head']
  },
  { 
    label: 'Red Team', 
    icon: <Target className="h-4 w-4" />, 
    path: '/offensive/attack-surface',
    roles: ['offensive_tester', 'rcc_head']
  },
  { 
    label: 'Admin Console', 
    icon: <Settings className="h-4 w-4" />, 
    path: '/admin',
    roles: ['rcc_head']
  },
];

export function HoverNavigation() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentRole } = useRole();

  const filteredItems = navItems.filter(item => item.roles.includes(currentRole));

  return (
    <div 
      className="fixed left-0 top-1/2 -translate-y-1/2 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      {/* Hover trigger area */}
      <div 
        className={cn(
          "transition-all duration-300 ease-out bg-background/80 backdrop-blur-sm border border-border rounded-r-lg shadow-lg",
          isExpanded ? "w-48 opacity-100" : "w-8 opacity-30 hover:opacity-70"
        )}
      >
        {!isExpanded ? (
          <div className="py-4 flex items-center justify-center">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        ) : (
          <div className="py-2">
            <div className="px-3 py-2 border-b border-border">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Quick Nav
              </span>
            </div>
            <nav className="py-1">
              {filteredItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}