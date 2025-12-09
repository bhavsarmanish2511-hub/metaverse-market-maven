import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCard } from "@/components/widgets/AlertCard";
import { StatusCard } from "@/components/widgets/StatusCard";
import { MetricsChart } from "@/components/widgets/MetricsChart";
import { DeepfakeAnalysis } from "@/components/deepfake/DeepfakeAnalysis";
import { CriticalAlertModal } from "@/components/CriticalAlertModal";
import { IRCAuthModal } from "@/components/IRCAuthModal";
import { AgenticMesh } from "@/components/agentic-mesh/AgenticMesh";
import { Alert, SystemHealth, generateAlerts, generateSystemHealth } from "@/lib/mockData";
import { Shield, Network, Activity, Bell, Zap, LayoutDashboard, ScanFace, Volume2, VolumeX, Cpu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreatMap } from "@/components/widgets/ThreatMap";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIRCLeader } from "@/contexts/IRCLeaderContext";
import { useRole } from "@/contexts/RoleContext";

const IRC_CRITICAL_ALERT = {
  id: 'irc-critical-001',
  title: 'Cloud provider outage impacting core services',
  description: 'AWS US-East-1 experiencing severe degradation. Payment processing APIs returning 503 errors. Customer transactions failing at 847/minute.',
  type: 'critical' as const,
  category: 'SOC' as const,
  status: 'active' as const,
  timestamp: new Date(),
  requiresIRCLeader: true,
};

export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [showIRCAuthModal, setShowIRCAuthModal] = useState(false);
  const [criticalAlertAdded, setCriticalAlertAdded] = useState(false);
  const [quickStats, setQuickStats] = useState({
    threatsBlocked: 1247,
    networkUptime: 99.97,
    avgResponseTime: 1.2,
  });
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setIRCLeaderMode } = useIRCLeader();
  const { setCurrentRole, setIsVerified } = useRole();

  // Function to generate dynamic system health data
  const generateDynamicSystemHealth = (): SystemHealth[] => {
    const categories: SystemHealth['category'][] = ['Network Performance', 'Security Posture', 'System Availability', 'Threat Detection'];
    return categories.map(category => {
      const value = Math.floor(Math.random() * 11) + 90; // Random value between 90 and 100
      let status: 'ok' | 'warning' | 'error' = 'ok';
      if (value < 95) {
        status = 'warning';
      }
      if (value < 92) {
        status = 'error';
      }
      const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
      const trend = trends[Math.floor(Math.random() * trends.length)];

      return {
        category,
        value,
        status,
        description: `${value}% operational efficiency`,
        trend,
      };
    });
  };

  useEffect(() => {
    // Initial data load
    const initialAlerts = generateAlerts().filter(a => !a.requiresIRCLeader);
    setAlerts(initialAlerts);
    setSystemHealth(generateSystemHealth());

    // Show critical alert after 5 seconds
    const alertTimer = setTimeout(() => {
      setShowCriticalAlert(true);
    }, 5000);

    // Data refresh interval
    const dataRefreshInterval = setInterval(() => {
      setSystemHealth(generateDynamicSystemHealth());
      setQuickStats(prevStats => ({
        threatsBlocked: prevStats.threatsBlocked + Math.floor(Math.random() * 5) + 1,
        networkUptime: Math.max(99.90, Math.min(99.99, prevStats.networkUptime + (Math.random() - 0.45) * 0.01)),
        avgResponseTime: Math.max(0.8, Math.min(1.5, prevStats.avgResponseTime + (Math.random() - 0.5) * 0.1)),
      }));
    }, 3500); // Refresh data every 3.5 seconds

    return () => {
      clearTimeout(alertTimer);
      clearInterval(dataRefreshInterval);
    };
  }, []);

  const handleCriticalAlertDismiss = () => {
    setShowCriticalAlert(false);
    
    // Add the critical alert to the alerts list
    if (!criticalAlertAdded) {
      const newCriticalAlert: Alert = {
        ...IRC_CRITICAL_ALERT,
        timestamp: new Date(),
      };
      
      // Add to beginning of alerts (highest priority)
      setAlerts(prev => [newCriticalAlert, ...prev]);
      setCriticalAlertAdded(true);
      
      toast({
        title: "Alert Acknowleged",
        description: "Login to view the Critical alert.",
        duration: 5000,
      });
    }
  };

  const handleIRCAlertClick = () => {
    setShowIRCAuthModal(true);
  };

  const handleRoleSwitch = (newRole: string) => {
    // Set the new role, but do not verify it yet.
    // The router will redirect to the verification page.
    setCurrentRole(newRole);
    setIsVerified(false);
    // The IRCLeaderContext is specific to that role, so we handle it here.
    if (newRole === 'irc_leader') {
      setIRCLeaderMode(true, 'Commander');
    }
  };

  const handleIRCAuthSuccess = () => {
    setShowIRCAuthModal(false);
    setIRCLeaderMode(true, 'Commander');
    // Update the role context to IRC Leader
    setCurrentRole('irc_leader');
    setIsVerified(true);
    navigate('/irc-leader');
    handleRoleSwitch('irc_leader');
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">SecureNet Command Center</h1>
            <p className="text-muted-foreground">
              A Unified Operations Dashboard
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="h-8 w-8"
              title={soundEnabled ? "Mute alerts" : "Enable alert sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-primary" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
            <Badge variant="outline" className="bg-soc/10 text-soc border-soc/20">
              <Shield className="h-3 w-3 mr-1" />
              Security Active
            </Badge>
            <Badge variant="outline" className="bg-noc/10 text-noc border-noc/20">
              <Network className="h-3 w-3 mr-1" />
              Networks Active
            </Badge>
            <button 
              onClick={() => {
                const alertsSection = document.getElementById('active-alerts-section');
                alertsSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="cursor-pointer"
            >
              <Badge variant="outline" className={`bg-error/10 text-error border-error/20 hover:bg-error/20 transition-all ${activeAlerts > 0 ? 'animate-pulse' : ''}`}>
                <Bell className={`h-3 w-3 mr-1 ${activeAlerts > 0 ? 'animate-bounce' : ''}`} />
                {activeAlerts} Active Alerts
              </Badge>
            </button>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab - Agentic Mesh */}
          <TabsContent value="overview" className="mt-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Agentic Mesh Architecture</h2>
                  <p className="text-muted-foreground text-sm">
                    Interactive visualization of SecureNet's AI-native agent ecosystem
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    21 Agents Online
                  </Badge>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                    Zero-Trust Active
                  </Badge>
                </div>
              </div>
              <AgenticMesh />
              <div className="mt-6 space-y-6">
                {/* System Health Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {systemHealth.map((health) => (
                    <StatusCard key={health.category} health={health} />
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <MetricsChart
                    title="Network Traffic (24h)"
                    type="area"
                    color="hsl(var(--noc))"
                  />
                  <MetricsChart
                    title="Security Events (24h)"
                    type="line"
                    color="hsl(var(--soc))"
                  />
                </div>

                {/* Threat Map */}
                <ThreatMap />

                {/* Active Alerts */}
                <div id="active-alerts-section">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Active Alerts</h2>
                    {criticalAlerts > 0 && (
                      <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                        {criticalAlerts} Critical
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {alerts.map((alert) => (
                      <AlertCard
                        key={alert.id}
                        alert={alert}
                        onClick={alert.requiresIRCLeader ? handleIRCAlertClick : undefined}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-soc/10">
                        <Shield className="h-6 w-6 text-soc" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Threats Blocked</p>
                        <p className="text-2xl font-bold">{quickStats.threatsBlocked.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-noc/10">
                        <Network className="h-6 w-6 text-noc" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Network Uptime</p>
                        <p className="text-2xl font-bold">{quickStats.networkUptime.toFixed(2)}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-smooth">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Avg Response Time</p>
                        <p className="text-2xl font-bold">{quickStats.avgResponseTime.toFixed(1)}s</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Critical Alert Modal (center of screen) */}
      <CriticalAlertModal
        open={showCriticalAlert}
        onClose={handleCriticalAlertDismiss}
        alertTitle={IRC_CRITICAL_ALERT.title}
        alertDescription={IRC_CRITICAL_ALERT.description}
      />

      {/* IRC Leader Auth Modal */}
      <IRCAuthModal
        open={showIRCAuthModal}
        onClose={() => setShowIRCAuthModal(false)}
        onSuccess={handleIRCAuthSuccess}
      />
    </div>
  );
}
