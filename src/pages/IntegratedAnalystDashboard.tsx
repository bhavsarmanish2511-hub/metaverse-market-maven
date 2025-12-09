import { useState } from "react";
import { Shield, Network, Activity, AlertTriangle, FileText, Eye, Settings, Clock, CheckCircle2, XCircle, Zap, TrendingUp, Users, Server, Database, Radio, Target, Bug, BarChart3, ArrowRight, Play, Pause, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

// Critical incident data based on the zero-day exploit scenario
const criticalIncident = {
  id: "INC-2024-ZERO-001",
  title: "Legacy Server Zero-Day Exploit - Peak Transaction Period",
  severity: "critical" as const,
  status: "active",
  phase: "decision" as const,
  businessContext: "Peak transaction period; legacy server hosts sensitive customer data.",
  phases: {
    situation: {
      title: "Situation Assessment",
      status: "completed" as const,
      details: {
        businessContext: "Peak transaction period; legacy server hosts sensitive customer data with 2.4M active users.",
        socRole: "SOC monitors logs via SIEM for anomalies, detecting unusual API calls and authentication failures.",
        nocRole: "NOC tracks network health via NMS, observing intermittent packet loss on the transit link.",
      }
    },
    detection: {
      title: "Detection & Correlation",
      status: "completed" as const,
      details: {
        siemFindings: "SIEM flagged unusual API calls and 847 authentication failures in 15 minutes.",
        tipCorrelation: "Threat Intelligence Platform correlates exploit chatter from global feeds - CVE-2024-ZERO-DAY.",
        nocObservation: "NMS detected intermittent packet loss (34%) on primary transit link to legacy infrastructure.",
        heliosAction: "HELIOS Anomaly Detection Agent correlated telemetry and threat intel in 2.3 seconds.",
      }
    },
    decision: {
      title: "Decision & Approval",
      status: "in-progress" as const,
      details: {
        analystTasks: [
          "Validate alert confidence score in SIEM (Current: 94.7%)",
          "Approve SOAR workflow for isolation and containment",
          "Request forensic snapshot before isolation",
        ],
        socFunctionality: "SOC uses SOAR for automated containment - awaiting analyst approval.",
        nocPreparation: "NOC has prepared rerouting policies via Network Configuration Manager.",
      }
    },
    action: {
      title: "Action & Containment",
      status: "pending" as const,
      details: {
        automatedActions: [
          "SOAR isolates legacy server and blocks hostile IP ranges",
          "NOC reroutes traffic dynamically to backup nodes",
          "Firewall rules updated to block C2 communication channels",
        ],
        humanActions: [
          "Analyst coordinates with engineering for patching",
          "Updates IRC Leader on containment status",
          "Initiates forensic evidence preservation",
        ],
      }
    },
    resolution: {
      title: "Resolution & RCA",
      status: "pending" as const,
      details: {
        expectedOutcome: "Attack neutralized before data exfiltration.",
        rcaGeneration: "HELIOS will generate RCA; analyst reviews and updates playbook.",
        nextSteps: "Legacy server scheduled for upgrade post-incident.",
      }
    }
  }
};

// SOC metrics
const socMetrics = {
  eventsAnalyzed: "2.4M",
  threatsBlocked: 1247,
  activeRules: 1892,
  detectionRate: "98.7%",
  mttr: "4.2 min"
};

// NOC metrics
const nocMetrics = {
  networkUptime: "99.97%",
  activeNodes: 847,
  bandwidthUtilization: "67%",
  latency: "23ms",
  packetsProcessed: "847B"
};

// Offensive tester reports
const offensiveReports = [
  {
    id: "OT-2024-001",
    title: "Legacy Server Vulnerability Assessment",
    tester: "Red Team Alpha",
    date: "2024-12-07",
    severity: "critical",
    findings: 3,
    status: "action-required",
    summary: "Zero-day vulnerability discovered in legacy payment processing server. Immediate patching recommended."
  },
  {
    id: "OT-2024-002",
    title: "API Gateway Penetration Test",
    tester: "External Auditor",
    date: "2024-12-06",
    severity: "medium",
    findings: 7,
    status: "reviewed",
    summary: "Rate limiting bypass discovered. CORS misconfiguration on 3 endpoints."
  },
  {
    id: "OT-2024-003",
    title: "Authentication Service Security Audit",
    tester: "Red Team Bravo",
    date: "2024-12-05",
    severity: "low",
    findings: 2,
    status: "resolved",
    summary: "Minor session handling improvements recommended. MFA implementation verified."
  }
];

// Agent updates
const agentUpdates = [
  {
    id: "AGT-001",
    agent: "HELIOS Anomaly Detection",
    type: "alert",
    message: "Correlated zero-day exploit signature with 94.7% confidence",
    timestamp: "2 min ago",
    priority: "critical"
  },
  {
    id: "AGT-002",
    agent: "Threat Intelligence Agent",
    type: "update",
    message: "New IOCs added from global threat feeds - 23 hostile IPs identified",
    timestamp: "5 min ago",
    priority: "high"
  },
  {
    id: "AGT-003",
    agent: "SOAR Orchestrator",
    type: "awaiting",
    message: "Containment workflow ready - awaiting analyst approval",
    timestamp: "3 min ago",
    priority: "critical"
  },
  {
    id: "AGT-004",
    agent: "Network Health Monitor",
    type: "warning",
    message: "Packet loss detected on transit link - rerouting policies prepared",
    timestamp: "8 min ago",
    priority: "medium"
  },
  {
    id: "AGT-005",
    agent: "Forensics Agent",
    type: "ready",
    message: "Snapshot capture ready for legacy server isolation",
    timestamp: "1 min ago",
    priority: "high"
  }
];

// Active incidents for management
const activeIncidents = [
  {
    id: "INC-2024-ZERO-001",
    title: "Legacy Server Zero-Day Exploit",
    severity: "critical",
    status: "active",
    assignee: "Analyst Team A",
    sla: "45 min remaining",
    progress: 45
  },
  {
    id: "INC-2024-002",
    title: "DDoS Attack on Auth Services",
    severity: "high",
    status: "investigating",
    assignee: "Analyst Team B",
    sla: "2 hr remaining",
    progress: 30
  },
  {
    id: "INC-2024-003",
    title: "Database Replication Lag",
    severity: "medium",
    status: "mitigating",
    assignee: "DBA Team",
    sla: "On track",
    progress: 75
  }
];

const phaseStatusColors = {
  completed: "bg-success/10 text-success border-success/30",
  "in-progress": "bg-warning/10 text-warning border-warning/30",
  pending: "bg-muted text-muted-foreground border-border"
};

const severityColors = {
  critical: "bg-error/10 text-error border-error/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-primary/10 text-primary border-primary/30",
  low: "bg-success/10 text-success border-success/30"
};

export default function IntegratedAnalystDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<string>("detection");
  const [soarApproved, setSoarApproved] = useState(false);

  const handleApproveSOAR = () => {
    setSoarApproved(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-soc/20 to-noc/20">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-soc to-noc bg-clip-text text-transparent">
                  Integrated Operations Dashboard
                </h1>
                <p className="text-muted-foreground">
                  SOC/NOC Unified View • Real-time Monitoring & Incident Management
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-soc/10 text-soc border-soc/20">
              <Shield className="h-3 w-3 mr-1" />
              SOC Active
            </Badge>
            <Badge variant="outline" className="bg-noc/10 text-noc border-noc/20">
              <Network className="h-3 w-3 mr-1" />
              NOC Active
            </Badge>
            <Badge variant="outline" className="bg-error/10 text-error border-error/20 animate-pulse">
              <AlertTriangle className="h-3 w-3 mr-1" />
              1 Critical Incident
            </Badge>
          </div>
        </div>

        {/* Critical Incident Banner */}
        <Card className="border-error/50 bg-gradient-to-r from-error/5 to-error/10">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-error/20 animate-pulse">
                  <AlertTriangle className="h-5 w-5 text-error" />
                </div>
                <div>
                  <CardTitle className="text-error">{criticalIncident.title}</CardTitle>
                  <CardDescription>{criticalIncident.businessContext}</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className={severityColors.critical}>
                {criticalIncident.id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Incident Phase Timeline */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {Object.entries(criticalIncident.phases).map(([key, phase], index) => (
                <div key={key} className="flex items-center">
                  <button
                    onClick={() => setSelectedPhase(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      selectedPhase === key
                        ? "border-primary bg-primary/10"
                        : phaseStatusColors[phase.status]
                    }`}
                  >
                    {phase.status === "completed" && <CheckCircle2 className="h-4 w-4 text-success" />}
                    {phase.status === "in-progress" && <RefreshCw className="h-4 w-4 text-warning animate-spin" />}
                    {phase.status === "pending" && <Clock className="h-4 w-4 text-muted-foreground" />}
                    <span className="text-sm font-medium whitespace-nowrap">{phase.title}</span>
                  </button>
                  {index < Object.keys(criticalIncident.phases).length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground mx-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="bg-muted/50 border border-border/50">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="incidents" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Manage Incidents
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-6 space-y-6">
            {/* SOC/NOC Unified Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SOC Metrics */}
              <Card className="border-soc/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-soc" />
                    <CardTitle className="text-soc">Security Operations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-soc/5 border border-soc/20">
                      <p className="text-xs text-muted-foreground">Events Analyzed</p>
                      <p className="text-2xl font-bold text-soc">{socMetrics.eventsAnalyzed}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-soc/5 border border-soc/20">
                      <p className="text-xs text-muted-foreground">Threats Blocked</p>
                      <p className="text-2xl font-bold text-soc">{socMetrics.threatsBlocked}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-soc/5 border border-soc/20">
                      <p className="text-xs text-muted-foreground">Detection Rate</p>
                      <p className="text-2xl font-bold text-soc">{socMetrics.detectionRate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-soc/5 border border-soc/20">
                      <p className="text-xs text-muted-foreground">MTTR</p>
                      <p className="text-2xl font-bold text-soc">{socMetrics.mttr}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NOC Metrics */}
              <Card className="border-noc/30">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Network className="h-5 w-5 text-noc" />
                    <CardTitle className="text-noc">Network Operations</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-noc/5 border border-noc/20">
                      <p className="text-xs text-muted-foreground">Network Uptime</p>
                      <p className="text-2xl font-bold text-noc">{nocMetrics.networkUptime}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-noc/5 border border-noc/20">
                      <p className="text-xs text-muted-foreground">Active Nodes</p>
                      <p className="text-2xl font-bold text-noc">{nocMetrics.activeNodes}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-noc/5 border border-noc/20">
                      <p className="text-xs text-muted-foreground">Bandwidth</p>
                      <p className="text-2xl font-bold text-noc">{nocMetrics.bandwidthUtilization}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-noc/5 border border-noc/20">
                      <p className="text-xs text-muted-foreground">Latency</p>
                      <p className="text-2xl font-bold text-noc">{nocMetrics.latency}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Incident Phase Details */}
            <Card>
              <CardHeader>
                <CardTitle>Current Phase: {criticalIncident.phases[selectedPhase as keyof typeof criticalIncident.phases]?.title}</CardTitle>
                <CardDescription>Detailed view of the selected incident phase</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedPhase === "situation" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Business Context</h4>
                      <p className="text-sm text-muted-foreground">{criticalIncident.phases.situation.details.businessContext}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-soc/5 border border-soc/20">
                        <h4 className="font-semibold text-soc mb-2">SOC Role</h4>
                        <p className="text-sm">{criticalIncident.phases.situation.details.socRole}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-noc/5 border border-noc/20">
                        <h4 className="font-semibold text-noc mb-2">NOC Role</h4>
                        <p className="text-sm">{criticalIncident.phases.situation.details.nocRole}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPhase === "detection" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-soc/5 border border-soc/20">
                        <h4 className="font-semibold text-soc mb-2 flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          SIEM Findings
                        </h4>
                        <p className="text-sm">{criticalIncident.phases.detection.details.siemFindings}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                        <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          TIP Correlation
                        </h4>
                        <p className="text-sm">{criticalIncident.phases.detection.details.tipCorrelation}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-noc/5 border border-noc/20">
                        <h4 className="font-semibold text-noc mb-2 flex items-center gap-2">
                          <Radio className="h-4 w-4" />
                          NOC Observation
                        </h4>
                        <p className="text-sm">{criticalIncident.phases.detection.details.nocObservation}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-semibold text-primary mb-2 flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          HELIOS Action
                        </h4>
                        <p className="text-sm">{criticalIncident.phases.detection.details.heliosAction}</p>
                      </div>
                    </div>
                  </div>
                )}
                {selectedPhase === "decision" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-warning/5 border border-warning/20">
                      <h4 className="font-semibold text-warning mb-3">Analyst Tasks - Awaiting Action</h4>
                      <div className="space-y-2">
                        {criticalIncident.phases.decision.details.analystTasks.map((task, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
                            <span className="text-sm">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-soc/5 border border-soc/20">
                        <h4 className="font-semibold text-soc mb-2">SOC Functionality</h4>
                        <p className="text-sm">{criticalIncident.phases.decision.details.socFunctionality}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-noc/5 border border-noc/20">
                        <h4 className="font-semibold text-noc mb-2">NOC Preparation</h4>
                        <p className="text-sm">{criticalIncident.phases.decision.details.nocPreparation}</p>
                      </div>
                    </div>
                    {!soarApproved ? (
                      <Button onClick={handleApproveSOAR} className="w-full bg-warning hover:bg-warning/90 text-warning-foreground">
                        <Play className="h-4 w-4 mr-2" />
                        Approve SOAR Containment Workflow
                      </Button>
                    ) : (
                      <div className="p-4 rounded-lg bg-success/10 border border-success/30 text-center">
                        <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                        <p className="text-success font-semibold">SOAR Workflow Approved - Containment Initiated</p>
                      </div>
                    )}
                  </div>
                )}
                {selectedPhase === "action" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-3 flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Automated Actions
                      </h4>
                      <div className="space-y-2">
                        {criticalIncident.phases.action.details.automatedActions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Human Actions
                      </h4>
                      <div className="space-y-2">
                        {criticalIncident.phases.action.details.humanActions.map((action, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span className="text-sm">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {selectedPhase === "resolution" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                      <h4 className="font-semibold text-success mb-2">Expected Outcome</h4>
                      <p className="text-sm">{criticalIncident.phases.resolution.details.expectedOutcome}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-primary mb-2">RCA Generation</h4>
                      <p className="text-sm">{criticalIncident.phases.resolution.details.rcaGeneration}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Next Steps</h4>
                      <p className="text-sm">{criticalIncident.phases.resolution.details.nextSteps}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Agent Updates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Agent Updates
                </CardTitle>
                <CardDescription>Real-time updates from HELIOS agents</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {agentUpdates.map((update) => (
                      <div
                        key={update.id}
                        className={`p-4 rounded-lg border ${
                          update.priority === "critical" ? "border-error/30 bg-error/5" :
                          update.priority === "high" ? "border-warning/30 bg-warning/5" :
                          "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className={
                              update.priority === "critical" ? severityColors.critical :
                              update.priority === "high" ? severityColors.high :
                              severityColors.medium
                            }>
                              {update.agent}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{update.timestamp}</span>
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">{update.type}</Badge>
                        </div>
                        <p className="text-sm mt-2">{update.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="mt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-error/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Critical Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-error">3</p>
                </CardContent>
              </Card>
              <Card className="border-warning/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">High Priority</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-warning">7</p>
                </CardContent>
              </Card>
              <Card className="border-primary/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">Medium/Low</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-primary">23</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Active Alerts</CardTitle>
                <CardDescription>Correlated alerts from SOC/NOC systems</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {agentUpdates.map((alert) => (
                      <div key={alert.id} className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className={
                            alert.priority === "critical" ? severityColors.critical :
                            alert.priority === "high" ? severityColors.high :
                            severityColors.medium
                          }>
                            {alert.priority.toUpperCase()}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{alert.timestamp}</span>
                        </div>
                        <p className="font-medium">{alert.agent}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Bug className="h-5 w-5 text-warning" />
                      Offensive Tester Reports
                    </CardTitle>
                    <CardDescription>Vulnerability assessments and penetration test results</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/30">
                    3 Reports Available
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {offensiveReports.map((report) => (
                    <div
                      key={report.id}
                      className={`p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer ${
                        report.status === "action-required" ? "border-error/30 bg-error/5" : "border-border"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className={severityColors[report.severity as keyof typeof severityColors]}>
                              {report.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{report.id}</span>
                          </div>
                          <h4 className="font-semibold">{report.title}</h4>
                        </div>
                        <Badge variant="outline" className={
                          report.status === "action-required" ? "bg-error/10 text-error" :
                          report.status === "reviewed" ? "bg-warning/10 text-warning" :
                          "bg-success/10 text-success"
                        }>
                          {report.status.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{report.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Tester: {report.tester}</span>
                        <span>Date: {report.date}</span>
                        <span>Findings: {report.findings}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  System Reports
                </CardTitle>
                <CardDescription>Automated system health and performance reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <h4 className="font-semibold">Daily Security Summary</h4>
                    <p className="text-sm text-muted-foreground">Last generated: Today 06:00</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <h4 className="font-semibold">Network Performance</h4>
                    <p className="text-sm text-muted-foreground">Last generated: Today 08:00</p>
                  </div>
                  <div className="p-4 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <h4 className="font-semibold">Compliance Status</h4>
                    <p className="text-sm text-muted-foreground">Last generated: Yesterday</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Incidents Tab */}
          <TabsContent value="incidents" className="mt-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Incident Management</h2>
                <p className="text-muted-foreground">Track and manage active incidents</p>
              </div>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Create Incident
              </Button>
            </div>

            <div className="space-y-4">
              {activeIncidents.map((incident) => (
                <Card key={incident.id} className={
                  incident.severity === "critical" ? "border-error/30" :
                  incident.severity === "high" ? "border-warning/30" :
                  "border-border"
                }>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className={severityColors[incident.severity as keyof typeof severityColors]}>
                            {incident.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{incident.id}</span>
                        </div>
                        <h3 className="font-semibold text-lg">{incident.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={
                          incident.status === "active" ? "bg-error/10 text-error" :
                          incident.status === "investigating" ? "bg-warning/10 text-warning" :
                          "bg-primary/10 text-primary"
                        }>
                          {incident.status}
                        </Badge>
                        <Button variant="outline" size="sm">View Details</Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Assignee</p>
                        <p className="font-medium">{incident.assignee}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">SLA Status</p>
                        <p className={`font-medium ${
                          incident.sla.includes("remaining") ? "text-warning" : "text-success"
                        }`}>{incident.sla}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Progress</p>
                        <div className="flex items-center gap-2">
                          <Progress value={incident.progress} className="h-2" />
                          <span className="text-sm font-medium">{incident.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
