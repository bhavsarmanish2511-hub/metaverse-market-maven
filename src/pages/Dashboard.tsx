import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AlertCard } from "@/components/widgets/AlertCard";
import { StatusCard } from "@/components/widgets/StatusCard";
import { MetricsChart } from "@/components/widgets/MetricsChart";
import { DeepfakeAnalysis } from "@/components/deepfake/DeepfakeAnalysis";
import { CriticalAlertModal } from "@/components/CriticalAlertModal";
import { BiometricAuthModal } from "@/components/BiometricAuthModal";
import { AgenticMesh } from "@/components/agentic-mesh/AgenticMesh";
import { Alert, SystemHealth, generateAlerts, generateSystemHealth } from "@/lib/mockData";
import { UserRole } from "@/contexts/RoleContext";
import { Shield, Network, Activity, Bell, Zap, LayoutDashboard, ScanFace, Volume2, VolumeX, Cpu, ShieldCheck, KeyRound, BrainCircuit, Wifi, Server, Router, Gauge, HeartPulse, Siren, AlertTriangle, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThreatMap } from "@/components/widgets/ThreatMap";
import { LatencyMap } from "@/components/widgets/LatencyMap";
import { Button } from "@/components/ui/button";
import { IndicatorCard } from "@/components/widgets/IndicatorCard";
import { SecurityIncidentSummary } from "@/components/widgets/SecurityIncidentSummary";
import { ThreatIntelligenceDetection } from "@/components/widgets/ThreatIntelligenceDetection";
import { LLMBehaviorAnomalies } from "@/components/widgets/LLMBehaviorAnomalies";
import { DeepfakeContentIntegrity } from "@/components/widgets/DeepfakeContentIntegrity";
import { DeceptionDecoyActivity } from "@/components/widgets/DeceptionDecoyActivity";
import { NetworkHealthOverview } from "@/components/widgets/NetworkHealthOverview";
import { ServiceApplicationHealth } from "@/components/widgets/ServiceApplicationHealth";
import { InfrastructureDeviceMonitoring } from "@/components/widgets/InfrastructureDeviceMonitoring";
import { TopologySnapshot } from "@/components/widgets/TopologySnapshot";
import { IncidentPrediction } from "@/components/widgets/IncidentPrediction";
import { NetworkForecasting } from "@/components/widgets/NetworkForecasting";
import { UserEntityBehaviorPredictions } from "@/components/widgets/UserEntityBehaviorPredictions";
import { PolicyViolationsSummary } from "@/components/widgets/PolicyViolationsSummary";
import { ZeroTrustPosture } from "@/components/widgets/ZeroTrustPosture";
import { IdentityAccessAnomalies } from "@/components/widgets/IdentityAccessAnomalies";
import { PendingAudits } from "@/components/widgets/PendingAudits";
import { BusinessImpact } from "@/components/widgets/BusinessImpact";
import { TimeToRespond } from "@/components/widgets/TimeToRespond";
import { CostAvoidance } from "@/components/widgets/CostAvoidance";
import { ComplianceHealthIndex } from "@/components/widgets/ComplianceHealthIndex";
import { UpcomingSLAs } from "@/components/widgets/UpcomingSLAs";
import { EscalationSuggestions } from "@/components/widgets/EscalationSuggestions";
import { OnCallRoster } from "@/components/widgets/OnCallRoster";
import { AIPrioritizedRisks } from "@/components/widgets/AIPrioritizedRisks";
import { HeliosAssistantPanel } from "@/components/widgets/HeliosAssistantPanel";
import { UnifiedOperationsStatusMap } from "@/components/widgets/UnifiedOperationsStatusMap";
import { LiveAttackChainTimeline } from "@/components/widgets/LiveAttackChainTimeline";
import { useToast } from "@/hooks/use-toast";
import { useRole } from "@/contexts/RoleContext";

// Role-specific critical alerts
const ROLE_ALERTS: Record<UserRole, { title: string; description: string; category: 'SOC' | 'NOC' }> = {
  irc_leader: {
    title: 'Cloud provider outage impacting core services',
    description: 'AWS US-East-1 experiencing severe degradation. Payment processing APIs returning 503 errors. Customer transactions failing at 847/minute. IRC Leader authorization required for failover.',
    category: 'NOC',
  },
  analyst: {
    title: 'Legacy server zero-day exploit during peak transactions',
    description: 'SIEM detected unusual API calls and authentication failures on legacy server hosting sensitive customer data. Threat Intelligence Platform correlated exploit chatter from global feeds. Immediate SOAR workflow approval required.',
    category: 'SOC',
  },
  offensive_tester: {
    title: 'AI model poisoning attempt via compromised API',
    description: 'Adversarial attack detected targeting ML inference pipeline. Malicious payloads injected through external API endpoint. Model integrity at risk - immediate security assessment required.',
    category: 'SOC',
  },
  rcc_head: {
    title: 'Multi-vector coordinated attack in progress',
    description: 'HELIOS detected synchronized attack across network, application, and data layers. All defense protocols activated. Command Center oversight required for strategic response coordination.',
    category: 'SOC',
  },
};

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  irc_leader: 'IRC Leader',
  analyst: 'Integrated Operations Analyst',
  offensive_tester: 'Offensive Tester',
  rcc_head: 'RCC Head',
};

const getRoleName = (role: UserRole | null) => {
  return role ? ROLE_DISPLAY_NAMES[role] : 'User';
};
export default function Dashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([]);
  const [showCriticalAlert, setShowCriticalAlert] = useState(false);
  const [currentAlertIndex, setCurrentAlertIndex] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole | null>(null);
  const [roleAlertsAdded, setRoleAlertsAdded] = useState<UserRole[]>([]);
  const [quickStats, setQuickStats] = useState({
    threatsBlocked: 1247,
    networkUptime: 99.97,
    avgResponseTime: 1.2,
  });
  const [quantumStats, setQuantumStats] = useState({
    pqcCompliance: 98.7,
    qkdStatus: 'Nominal',
    quantumThreats: 3,
    keyRotationHours: 12,
  });
  const [networkStats, setNetworkStats] = useState({
    bandwidth: 78.2,
    latency: 45,
    packetLoss: 0.02,
    devices: ['Online', 'Online', 'Warning', 'Online']
  });
  const [heliosRecommendations, setHeliosRecommendations] = useState(7);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentRole, setCurrentRole, setIsVerified, showLoginAlerts, setShowLoginAlerts } = useRole();

  // All roles to show alerts for (in order)
  const alertRoles: UserRole[] = ['irc_leader', 'analyst', 'offensive_tester'];

  // Function to generate dynamic system health data
  const generateDynamicSystemHealth = (): SystemHealth[] => {
    const categories: SystemHealth['category'][] = ['Network Performance', 'Security Posture', 'System Availability', 'Threat Detection'];
    return categories.map(category => {
      const value = Math.floor(Math.random() * 11) + 90;
      let status: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (value < 95) {
        status = 'warning';
      }
      if (value < 92) {
        status = 'critical';
      }
      const trends: ('up' | 'down' | 'stable')[] = ['up', 'down', 'stable'];
      const trend = trends[Math.floor(Math.random() * trends.length)];

      return {
        category,
        value,
        status,
        trend,
      };
    });
  };

  useEffect(() => {
    // Initial data load, runs only once on component mount
    setAlerts(generateAlerts().filter(a => !a.requiresIRCLeader));
    setSystemHealth(generateSystemHealth());
  }, []);

  useEffect(() => {
    let alertTimer: NodeJS.Timeout;

    // Only show sequential alerts if coming from Login page via "Initiate Scan"
    if (showLoginAlerts) {
      // Show first alert after 5 seconds
      const alertTimer = setTimeout(() => {
        setCurrentAlertIndex(0);
        setShowCriticalAlert(true);
      }, 5000);

      return () => clearTimeout(alertTimer); // Cleanup the alert timer
    }

    // Data refresh interval
    const dataRefreshInterval = setInterval(() => {
      setSystemHealth(generateDynamicSystemHealth());
      setQuickStats(prevStats => ({
        threatsBlocked: prevStats.threatsBlocked + Math.floor(Math.random() * 5) + 1,
        networkUptime: Math.max(99.90, Math.min(99.99, prevStats.networkUptime + (Math.random() - 0.45) * 0.01)),
        avgResponseTime: Math.max(0.8, Math.min(1.5, prevStats.avgResponseTime + (Math.random() - 0.5) * 0.1)),
      }));
      setQuantumStats(prevStats => ({
        ...prevStats,
        pqcCompliance: Math.max(98.0, Math.min(99.9, prevStats.pqcCompliance + (Math.random() - 0.48) * 0.1)),
        quantumThreats: Math.random() > 0.95 ? prevStats.quantumThreats + 1 : prevStats.quantumThreats,
        qkdStatus: Math.random() > 0.98 ? 'Syncing...' : 'Nominal',
      }));
      setNetworkStats(prevStats => ({
        ...prevStats,
        bandwidth: Math.max(60, Math.min(95, prevStats.bandwidth + (Math.random() - 0.5) * 5)),
        latency: Math.max(30, Math.min(80, prevStats.latency + (Math.random() - 0.5) * 3)),
        packetLoss: Math.max(0.01, Math.min(0.1, prevStats.packetLoss + (Math.random() - 0.5) * 0.01)),
        devices: prevStats.devices.map(() => Math.random() > 0.95 ? 'Warning' : 'Online')
      }));
      setHeliosRecommendations(prev => Math.random() > 0.8 ? prev + 1 : prev);
    }, 3500);

    return () => {
      clearInterval(dataRefreshInterval);
    }; // Cleanup the data refresh interval
  }, [showLoginAlerts]);

  const handleCriticalAlertDismiss = (acknowledged: boolean) => {
    setShowCriticalAlert(false);

    const currentAlertRole = alertRoles[currentAlertIndex];
    const alertData = ROLE_ALERTS[currentAlertRole];

    // Add the dismissed alert to the alerts list if not already added
    if (!roleAlertsAdded.includes(currentAlertRole)) {
      const newAlert: Alert = {
        id: `role-alert-${currentAlertRole}-${Date.now()}`,
        title: alertData.title,
        description: alertData.description,
        type: 'critical',
        category: alertData.category,
        status: 'active',
        timestamp: new Date(),
        targetRole: currentAlertRole as 'irc_leader' | 'analyst' | 'offensive_tester',
      };

      // Add the current role to the list of processed roles *before* updating alerts
      setRoleAlertsAdded(prev => [...prev, currentAlertRole]);

      setAlerts(prev => {
        // Update previous role alerts to lower priority when adding new one
        const updatedPrev = prev.map(a => {
          // Demote any previous role-based alert that isn't the one we're adding now.
          if (a.targetRole && a.targetRole !== currentAlertRole && a.status === 'active') {
            return { ...a, type: 'warning' as const, status: 'investigating' as const };
          }
          return a;
        });
        return [newAlert, ...updatedPrev];
      });
    }

    if (acknowledged) {
      // If acknowledged, stop the sequence immediately.
      setShowLoginAlerts(false);
      toast({
        title: "Critical Alert Acknowledged",
        description: `The alert for ${ROLE_ALERTS[currentAlertRole].title} has been acknowledged.`,
        duration: 3000,
      });
    } else {
      // If cancelled or closed, show the next alert after 5 seconds if there are more.
      const nextIndex = currentAlertIndex + 1;
      if (nextIndex < alertRoles.length && showLoginAlerts) {
        setTimeout(() => {
          setCurrentAlertIndex(nextIndex);
          setShowCriticalAlert(true);
        }, 5000);
      } else if (nextIndex >= alertRoles.length) {
        // This was the last alert, so stop the sequence.
        setShowLoginAlerts(false);
      }
    }
  };

  const handleAlertClick = (alert: Alert) => {
    if (alert.targetRole) {
      setAuthModalRole(alert.targetRole as UserRole);
      setShowAuthModal(true);
    }
  };

  const handleRoleSwitch = (newRole: UserRole) => {
    setCurrentRole(newRole);
    setIsVerified(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    
    if (!authModalRole) return;
    
    // Set the role and verify
    setCurrentRole(authModalRole);
    setIsVerified(true);
    
    // Navigate to appropriate dashboard
    switch (authModalRole) {
      case 'irc_leader':
        navigate('/irc-leader');
        break;
      case 'analyst':
        navigate('/analyst');
        break;
      case 'offensive_tester':
        navigate('/offensive-tester');
        break;
    }
    
    setAuthModalRole(null);
  };

  const criticalAlerts = alerts.filter(a => a.type === 'critical').length;
  const activeAlerts = alerts.filter(a => a.status === 'active').length;

  // Derived state for Unified Operations tab
  const securityPosture = systemHealth.find(h => h.category === 'Security Posture')?.value || 0;
  const networkHealth = systemHealth.find(h => h.category === 'Network Performance')?.value || 0;
  const networkFaults = networkStats.devices.filter(d => d === 'Warning').length;

  const incidentCounts = alerts.reduce((acc, alert) => {
    if (alert.type === 'critical') acc.critical++;
    else if (alert.type === 'warning') acc.high++;
    else acc.medium++; // Assuming 'info' maps to medium
    return acc;
  }, { critical: 0, high: 0, medium: 0, low: 0 });

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-success';
    if (score >= 90) return 'text-warning';
    return 'text-error';
  };

  const securityScoreColor = getScoreColor(securityPosture);
  const networkScoreColor = getScoreColor(networkHealth);


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
          <div className="flex flex-wrap items-center justify-end gap-2">
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
            <div className="h-6 w-px bg-border mx-2"></div> {/* Vertical Separator */}
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
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="networks" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Networks
            </TabsTrigger>
            <TabsTrigger value="operations" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Unified Operations Status
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

              {/* Active Alerts - Placed directly below mesh diagram */}
              <div id="active-alerts-section" className="mt-6">
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
                      onClick={alert.targetRole ? () => handleAlertClick(alert) : undefined}
                    />
                  ))}
                </div>
              </div>

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

          {/* Security Tab */}
          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              {/* This section was empty, so we are adding the Quantum Security content here */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">Quantum Security Posture</h2>
                    <p className="text-muted-foreground text-sm">
                      Monitoring and managing quantum-resistant cryptographic infrastructure.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      PQC Shield Active
                    </Badge>
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                      QKD Sync Stable
                    </Badge>
                  </div>
                </div>

                {/* Quantum Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <ShieldCheck className="h-5 w-5 text-success" />
                      <h3 className="font-semibold">PQC Compliance</h3>
                    </div>
                    <p className="text-3xl font-bold">{quantumStats.pqcCompliance.toFixed(1)}%</p>
                    <p className="text-xs text-muted-foreground">Post-Quantum Cryptography</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <KeyRound className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold">QKD Status</h3>
                    </div>
                    <p className="text-3xl font-bold">{quantumStats.qkdStatus}</p>
                    <p className="text-xs text-muted-foreground">All nodes synchronized</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <BrainCircuit className="h-5 w-5 text-soc" />
                      <h3 className="font-semibold">Quantum Threats Today</h3>
                    </div>
                    <p className="text-3xl font-bold">{quantumStats.quantumThreats}</p>
                    <p className="text-xs text-muted-foreground">Anomalies detected</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border bg-card">
                    <div className="flex items-center gap-3 mb-2">
                      <Activity className="h-5 w-5 text-noc" />
                      <h3 className="font-semibold">Next Key Rotation</h3>
                    </div>
                    <p className="text-3xl font-bold">{quantumStats.keyRotationHours}h</p>
                    <p className="text-xs text-muted-foreground">Next cycle scheduled</p>
                  </div>
                </div>

                <MetricsChart
                  title="Quantum Threat Analytics"
                  type="bar"
                  color="hsl(var(--primary))"
                />
              </div>
            </div>
          </TabsContent>

          {/* Networks Tab */}
          <TabsContent value="networks" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Network Operations Center</h2>
                  <p className="text-muted-foreground text-sm">
                    Real-time monitoring of global network infrastructure and performance.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-noc/10 text-noc border-noc/30">
                    All Systems Operational
                  </Badge>
                </div>
              </div>

              {/* Network Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Wifi className="h-5 w-5 text-noc" />
                    <h3 className="font-semibold">Bandwidth</h3>
                  </div>
                  <p className="text-3xl font-bold">{networkStats.bandwidth.toFixed(1)} Gbps</p>
                  <p className="text-xs text-muted-foreground">Total throughput</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Avg. Latency</h3>
                  </div>
                  <p className="text-3xl font-bold">{networkStats.latency.toFixed(0)} ms</p>
                  <p className="text-xs text-muted-foreground">Across all nodes</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">Packet Loss</h3>
                  </div>
                  <p className="text-3xl font-bold">{networkStats.packetLoss.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">Last 15 minutes</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-success" />
                    <h3 className="font-semibold">Network Uptime</h3>
                  </div>
                  <p className="text-3xl font-bold">{quickStats.networkUptime.toFixed(2)}%</p>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </div>
              </div>
              <LatencyMap />
            </div>
          </TabsContent>

          {/* Unified Operations Status Tab */}
          <TabsContent value="operations" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">Unified Operations Status</h2>
                  <p className="text-muted-foreground text-sm">
                    A consolidated view of all operational metrics and system health.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                <IndicatorCard
                  title="Security Posture"
                  value={`${securityPosture.toFixed(1)}%`}
                  description="Overall security score"
                  icon={<Gauge className={`h-5 w-5 ${securityScoreColor}`} />}
                  valueClassName={securityScoreColor}
                />
                <IndicatorCard
                  title="Network Health"
                  value={`${networkHealth.toFixed(1)}%`}
                  description="Global infrastructure status"
                  icon={<HeartPulse className={`h-5 w-5 ${networkScoreColor}`} />}
                  valueClassName={networkScoreColor}
                />
                <IndicatorCard
                  title="Active Incidents"
                  value={incidentCounts.critical + incidentCounts.high}
                  description="Critical & High priority"
                  icon={<Siren className="h-5 w-5 text-muted-foreground" />}
                >
                  <div className="flex items-baseline gap-3">
                    <div className="text-2xl font-bold">{incidentCounts.critical + incidentCounts.high + incidentCounts.medium + incidentCounts.low}</div>
                    <div className="flex gap-2 text-xs">
                      <span className="text-error">{incidentCounts.critical}C</span>
                      <span className="text-warning">{incidentCounts.high}H</span>
                      <span className="text-primary">{incidentCounts.medium}M</span>
                    </div>
                  </div>
                </IndicatorCard>
                <IndicatorCard
                  title="Network Faults"
                  value={networkFaults}
                  description="Service degradations"
                  icon={<AlertTriangle className="h-5 w-5 text-muted-foreground" />}
                  valueClassName={networkFaults > 0 ? 'text-warning' : ''}
                />
                <IndicatorCard
                  title="HELIOS Insights"
                  value={heliosRecommendations}
                  description="AI recommendations pending"
                  icon={<Lightbulb className="h-5 w-5 text-muted-foreground" />}
                  valueClassName={heliosRecommendations > 0 ? 'text-primary' : ''}
                />
              </div>

              {/* Real-Time Situational Awareness Widgets */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pt-6">
                <UnifiedOperationsStatusMap />
                <LiveAttackChainTimeline />
              </div>

              {/* SOC Essentials Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">SOC Essentials Panel</h2>
                <p className="text-muted-foreground text-sm">Summarized view of key security posture indicators.</p>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <SecurityIncidentSummary />
                  <ThreatIntelligenceDetection />
                  <LLMBehaviorAnomalies />
                  <DeepfakeContentIntegrity />
                  <DeceptionDecoyActivity />
                </div>
              </div>

              {/* NOC Essentials Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">NOC Essentials Panel</h2>
                <p className="text-muted-foreground text-sm">Summarized view of network reliability and service operations.</p>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <NetworkHealthOverview />
                  <ServiceApplicationHealth />
                  <InfrastructureDeviceMonitoring />
                  <TopologySnapshot />
                </div>
              </div>

              {/* AI-Powered Predictive Analytics Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">AI-Powered Predictive Analytics</h2>
                <p className="text-muted-foreground text-sm">Forward-looking insights from the HELIOS AI engine.</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <IncidentPrediction />
                  <NetworkForecasting />
                  <UserEntityBehaviorPredictions />
                </div>
              </div>

              {/* Compliance & Governance Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">Compliance & Governance Panel</h2>
                <p className="text-muted-foreground text-sm">Oversight of policy, compliance, and governance posture.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <PolicyViolationsSummary />
                  <ZeroTrustPosture />
                  <IdentityAccessAnomalies />
                  <PendingAudits />
                </div>
              </div>

              {/* Executive Insights Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">Executive Insights (CIO/CTO/CSO View)</h2>
                <p className="text-muted-foreground text-sm">High-level business and operational intelligence.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <BusinessImpact />
                  <TimeToRespond />
                  <CostAvoidance />
                  <ComplianceHealthIndex />
                  <HeliosAssistantPanel />
                </div>
              </div>

              {/* Notification & Escalation Center Panel */}
              <div className="space-y-6 pt-6">
                <h2 className="text-2xl font-bold">Notification & Escalation Center</h2>
                <p className="text-muted-foreground text-sm">Manage alerts, escalations, and on-call personnel.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <UpcomingSLAs />
                  <EscalationSuggestions />
                  <OnCallRoster />
                  <AIPrioritizedRisks />
                </div>
              </div>

            </div>
          </TabsContent>

        </Tabs>
      </div>

      {/* Critical Alert Modal (center of screen) */}
      <CriticalAlertModal
        open={showCriticalAlert}
        onClose={(acknowledged: boolean) => handleCriticalAlertDismiss(acknowledged)}
        alertTitle={ROLE_ALERTS[alertRoles[currentAlertIndex]]?.title || ''}
        alertDescription={ROLE_ALERTS[alertRoles[currentAlertIndex]]?.description || ''}
        roleLabel={alertRoles[currentAlertIndex] === 'irc_leader' ? 'IRC Leader' : alertRoles[currentAlertIndex] === 'analyst' ? 'Integrated Ops Analyst' : 'Offensive Tester'}
      />

      {/* Role-specific Auth Modal */}
      <BiometricAuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        roleName={getRoleName(authModalRole)}
      />
    </div>
  );
}
