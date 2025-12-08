import { Shield, Network, Home, Activity, AlertTriangle, Database, FileText, Book, Wrench, BarChart3, Settings, LogOut, Workflow, Zap, Radio, User, ScanFace, Target, Crosshair, Bug, KeyRound, Scan, Crown, Eye, Server } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useIRCLeader } from "@/contexts/IRCLeaderContext";
import { useRole } from "@/contexts/RoleContext";
import { Badge } from "@/components/ui/badge";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Integrated Analyst items - SOC/NOC unified view
const analystItems = [
  { title: "Unified Dashboard", url: "/analyst", icon: Eye },
  { title: "SOC Overview", url: "/soc-overview", icon: Shield },
  { title: "NOC Overview", url: "/noc-overview", icon: Network },
];

const socItems = [
  { title: "Logs", url: "/soc/logs", icon: Database },
  { title: "SIEM", url: "/soc/siem", icon: Activity },
  { title: "Threat Intelligence", url: "/soc/threats", icon: AlertTriangle },
  { title: "Incidents Tracking", url: "/soc/incidents", icon: FileText },
  { title: "XDR Playbooks", url: "/soc/playbooks", icon: Workflow },
  { title: "Reporting", url: "/soc/reports", icon: BarChart3 },
  { title: "Knowledge Base", url: "/soc/knowledge", icon: Book },
  { title: "Quantum Security", url: "/quantum", icon: Zap },
  { title: "Deepfake Analysis", url: "/deepfake", icon: ScanFace },
];

const nocItems = [
  { title: "Performance", url: "/noc/performance", icon: Activity },
  { title: "Faults", url: "/noc/faults", icon: AlertTriangle },
  { title: "Configurations", url: "/noc/config", icon: Settings },
  { title: "Network Topology", url: "/network-topology", icon: Radio },
  { title: "Traffic Analysis", url: "/noc/traffic", icon: BarChart3 },
  { title: "Predictive Maintenance", url: "/noc/maintenance", icon: Wrench },
  { title: "Self-Healing", url: "/noc/healing", icon: Shield },
];

const offensiveItems = [
  { title: "Attack Surface", url: "/offensive/attack-surface", icon: Target },
  { title: "Vulnerability Scanner", url: "/offensive/vuln-scanner", icon: Scan },
  { title: "Penetration Testing", url: "/offensive/pentest", icon: Crosshair },
  { title: "Exploit Framework", url: "/offensive/exploits", icon: Bug },
  { title: "Credential Testing", url: "/offensive/credentials", icon: KeyRound },
];

const ircItems = [
  { title: "Command Center", url: "/irc-leader", icon: Shield },
  { title: "Active Incidents", url: "/soc/incidents", icon: AlertTriangle },
  { title: "War Room", url: "/irc-leader", icon: Target },
];

const adminItems = [
  { title: "Admin Console", url: "/admin", icon: Crown },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { signOut, user } = useAuth();
  const { isIRCLeaderMode, ircLeaderName, setIRCLeaderMode } = useIRCLeader();
  const { currentRole } = useRole();

  const isActive = (path: string) => currentPath === path;

  const handleExitIRCMode = () => {
    setIRCLeaderMode(false);
  };

  // Determine which sections to show based on role
  const showAnalystDashboard = currentRole === 'analyst' || currentRole === 'rcc_head';
  const showSOC = currentRole === 'analyst' || currentRole === 'irc_leader' || currentRole === 'rcc_head';
  const showNOC = currentRole === 'analyst' || currentRole === 'rcc_head';
  const showOffensive = currentRole === 'offensive_tester' || currentRole === 'rcc_head';
  const showIRC = currentRole === 'irc_leader' || currentRole === 'rcc_head';
  const showAdmin = currentRole === 'rcc_head';

  return (
    <Sidebar className="border-r border-border custom-scrollbar">
      <SidebarContent>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <h2 className="font-bold text-lg">SecureNet</h2>
                <p className="text-xs text-muted-foreground">Powered by HELIOS</p>
              </div>
            )}
          </div>
        </div>

        {/* IRC Leader Mode Indicator */}
        {isIRCLeaderMode && (
          <div className="p-4 border-b border-error/30 bg-error/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-error/20 flex items-center justify-center">
                <User className="h-4 w-4 text-error" />
              </div>
              {open && (
                <div className="flex-1">
                  <p className="text-sm font-semibold text-error">{ircLeaderName}</p>
                  <Badge className="bg-error text-error-foreground text-xs">IRC Leader</Badge>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild disabled={isIRCLeaderMode}>
                  <NavLink 
                    to="/" 
                    end 
                    className={`hover:bg-accent ${isIRCLeaderMode ? 'opacity-50 pointer-events-none' : ''}`} 
                    activeClassName="bg-accent text-accent-foreground font-medium"
                  >
                    <Home className="h-4 w-4" />
                    {open && <span>HOME</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Integrated Analyst Dashboard */}
        {showAnalystDashboard && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-primary">
              <Eye className="h-4 w-4" />
              {open && <span>Operations Center</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {analystItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild disabled={isIRCLeaderMode}>
                      <NavLink 
                        to={item.url}
                        className={`hover:bg-primary/10 hover:text-primary ${isIRCLeaderMode ? 'opacity-50 pointer-events-none' : ''}`}
                        activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Admin Section - RCC Head Only */}
        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-warning">
              <Crown className="h-4 w-4" />
              {open && <span>Administration</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="hover:bg-warning/10 hover:text-warning"
                        activeClassName="bg-warning/10 text-warning font-medium border-l-2 border-warning"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* IRC Leader Section */}
        {showIRC && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-error">
              <Shield className="h-4 w-4" />
              {open && <span>Incident Command</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {ircItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="hover:bg-error/10 hover:text-error"
                        activeClassName="bg-error/10 text-error font-medium border-l-2 border-error"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* SOC Components */}
        {showSOC && (
          <SidebarGroup>
            <SidebarGroupLabel className={`text-soc ${isIRCLeaderMode ? 'opacity-50' : ''}`}>
              <Shield className="h-4 w-4" />
              {open && <span>Security</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {socItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild disabled={isIRCLeaderMode}>
                      <NavLink 
                        to={item.url} 
                        className={`hover:bg-soc-muted hover:text-soc ${isIRCLeaderMode ? 'opacity-50 pointer-events-none' : ''} ${
                          (item.url === '/quantum') ? 'hover:bg-quantum-primary/10 hover:text-quantum-primary' : ''
                        }`}
                        activeClassName={`${
                          (item.url === '/quantum') ? 'bg-quantum-primary/10 text-quantum-primary font-medium border-l-2 border-quantum-primary' : 'bg-soc-muted text-soc font-medium'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* NOC Components */}
        {showNOC && (
          <SidebarGroup>
            <SidebarGroupLabel className={`text-noc ${isIRCLeaderMode ? 'opacity-50' : ''}`}>
              <Network className="h-4 w-4" />
              {open && <span>Networks</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nocItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild disabled={isIRCLeaderMode}>
                      <NavLink 
                        to={item.url}
                        className={`hover:bg-noc-muted hover:text-noc ${isIRCLeaderMode ? 'opacity-50 pointer-events-none' : ''} ${
                          (item.url === '/network-topology') ? 'hover:bg-quantum-primary/10 hover:text-quantum-primary' : ''
                        }`}
                        activeClassName={`${
                          (item.url === '/network-topology') ? 'bg-quantum-primary/10 text-quantum-primary font-medium border-l-2 border-quantum-primary' : 'bg-noc-muted text-noc font-medium'
                        }`}
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Offensive Testing Section */}
        {showOffensive && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-warning">
              <Target className="h-4 w-4" />
              {open && <span>Red Team</span>}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {offensiveItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className="hover:bg-warning/10 hover:text-warning"
                        activeClassName="bg-warning/10 text-warning font-medium border-l-2 border-warning"
                      >
                        <item.icon className="h-4 w-4" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* User Section */}
        <SidebarGroup className="mt-auto border-t border-border">
          <SidebarGroupContent className="p-2">
            <SidebarMenu>
              {/* Exit IRC Mode button */}
              {isIRCLeaderMode && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleExitIRCMode}
                    className="h-10 hover:bg-error/10 rounded-md transition-colors group mb-2"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <LogOut className="h-4 w-4 text-error" />
                      {open && (
                        <span className="text-sm font-medium text-error">Exit IRC Mode</span>
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              
              {user && (
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => signOut()} 
                    className="h-12 hover:bg-muted/50 rounded-md transition-colors group"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-primary text-sm font-medium">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      {open && (
                        <div className="flex flex-col items-start flex-1 min-w-0">
                          <span className="text-sm font-medium truncate w-full">{user.username}</span>
                          <span className="text-xs text-muted-foreground truncate w-full">{user.email}</span>
                        </div>
                      )}
                      {open && (
                        <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
                      )}
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
