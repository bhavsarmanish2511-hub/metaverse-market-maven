import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Shield,
  Server,
  Settings,
  Plus,
  Download,
  Play,
  Pause,
  Edit,
  Trash2,
  Network,
  Database,
  Cloud,
  Lock,
  GitBranch,
  Brain,
  Target,
  FileText,
  Clock,
  Users,
  TrendingUp,
  XCircle,
  AlertCircle,
  Zap,
  Search,
  BarChart3,
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const dataSources = [
  {
    id: 1,
    name: "Firewall-Palo Alto",
    type: "Firewall",
    status: "connected",
    hostname: "fw01.company.com",
    port: 514,
    protocol: "TCP",
    format: "CEF",
    eventsPerDay: 2450000,
    lastEvent: "30 sec ago",
  },
  {
    id: 2,
    name: "EDR-CrowdStrike",
    type: "Endpoint Security",
    status: "connected",
    hostname: "api.crowdstrike.com",
    port: 443,
    protocol: "HTTPS",
    format: "JSON",
    eventsPerDay: 1820000,
    lastEvent: "1 min ago",
  },
  {
    id: 3,
    name: "AWS-CloudTrail",
    type: "Cloud Platform",
    status: "connected",
    hostname: "cloudtrail.amazonaws.com",
    port: 443,
    protocol: "HTTPS",
    format: "JSON",
    eventsPerDay: 3200000,
    lastEvent: "15 sec ago",
  },
  {
    id: 4,
    name: "AD-Domain Controller",
    type: "Identity System",
    status: "warning",
    hostname: "dc01.company.local",
    port: 389,
    protocol: "LDAP",
    format: "Windows Event",
    eventsPerDay: 890000,
    lastEvent: "5 min ago",
  },
  {
    id: 5,
    name: "WAF-CloudFlare",
    type: "Web Application Firewall",
    status: "error",
    hostname: "api.cloudflare.com",
    port: 443,
    protocol: "HTTPS",
    format: "JSON",
    eventsPerDay: 0,
    lastEvent: "2 hours ago",
  },
];

const correlationRules = [
  {
    id: 1,
    name: "Multiple Failed Logins -> Brute Force",
    severity: "High",
    status: "active",
    triggers: 145,
    falsePositives: 12,
    mitre: "T1110",
  },
  {
    id: 2,
    name: "Privilege Escalation Pattern",
    severity: "Critical",
    status: "active",
    triggers: 23,
    falsePositives: 2,
    mitre: "T1068",
  },
  {
    id: 3,
    name: "Data Exfiltration Detection",
    severity: "Critical",
    status: "active",
    triggers: 8,
    falsePositives: 1,
    mitre: "T1041",
  },
  {
    id: 4,
    name: "Lateral Movement",
    severity: "High",
    status: "paused",
    triggers: 67,
    falsePositives: 34,
    mitre: "T1021",
  },
];

const activeAlerts = [
  {
    id: 1,
    title: "Suspected Ransomware Activity",
    severity: "Critical",
    riskScore: 95,
    source: "EDR-CrowdStrike",
    timestamp: "2024-01-25 14:45:32",
    mitre: "T1486",
    status: "investigating",
    affectedAssets: 3,
  },
  {
    id: 2,
    title: "Unusual Database Query Pattern",
    severity: "High",
    riskScore: 78,
    source: "Database Monitor",
    timestamp: "2024-01-25 14:42:18",
    mitre: "T1190",
    status: "new",
    affectedAssets: 1,
  },
  {
    id: 3,
    title: "Unauthorized API Access Attempt",
    severity: "Medium",
    riskScore: 62,
    source: "AWS-CloudTrail",
    timestamp: "2024-01-25 14:38:55",
    mitre: "T1078",
    status: "resolved",
    affectedAssets: 1,
  },
];

const threatIntelFeeds = [
  { name: "AlienVault OTX", status: "active", lastUpdate: "5 min ago", indicators: 245000 },
  { name: "Abuse.ch", status: "active", lastUpdate: "10 min ago", indicators: 89000 },
  { name: "Emerging Threats", status: "active", lastUpdate: "2 min ago", indicators: 156000 },
  { name: "MISP Community", status: "error", lastUpdate: "2 hours ago", indicators: 0 },
];

const performanceMetrics = [
  { time: "00:00", mttr: 45, mttd: 12, alerts: 234 },
  { time: "04:00", mttr: 38, mttd: 10, alerts: 189 },
  { time: "08:00", mttr: 52, mttd: 15, alerts: 312 },
  { time: "12:00", mttr: 48, mttd: 13, alerts: 278 },
  { time: "16:00", mttr: 41, mttd: 11, alerts: 245 },
  { time: "20:00", mttr: 35, mttd: 9, alerts: 198 },
];

const alertDistribution = [
  { name: "Critical", value: 15, color: "hsl(var(--error))" },
  { name: "High", value: 45, color: "hsl(var(--warning))" },
  { name: "Medium", value: 120, color: "hsl(var(--info))" },
  { name: "Low", value: 95, color: "hsl(var(--success))" },
];

const complianceStandards = [
  { name: "PCI DSS", status: "Compliant", coverage: 98, lastAudit: "2024-01-15" },
  { name: "HIPAA", status: "Compliant", coverage: 95, lastAudit: "2024-01-10" },
  { name: "GDPR", status: "Action Required", coverage: 87, lastAudit: "2024-01-20" },
  { name: "SOC 2", status: "Compliant", coverage: 99, lastAudit: "2024-01-05" },
];

export default function SiemIntegration() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
      case "disconnected":
        return <XCircle className="h-4 w-4 text-error" />;
      case "paused":
        return <Pause className="h-4 w-4 text-muted-foreground" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      connected: "default",
      active: "default",
      warning: "secondary",
      error: "destructive",
      paused: "outline",
    };
    return (
      <Badge variant={variants[status] || "outline"} className="capitalize">
        {status}
      </Badge>
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "text-error";
      case "High":
        return "text-warning";
      case "Medium":
        return "text-info";
      default:
        return "text-muted-foreground";
    }
  };

  const totalEvents = dataSources.reduce((sum, source) => sum + source.eventsPerDay, 0);
  const connectedSources = dataSources.filter(s => s.status === "connected").length;
  const activeRules = correlationRules.filter(r => r.status === "active").length;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-soc">SIEM</h1>
          <p className="text-muted-foreground mt-1">
            Security Information and Event Management Platform
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download Agent
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Connected Sources</CardTitle>
            <Network className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{connectedSources}/{dataSources.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalEvents.toLocaleString()} events/day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Rules</CardTitle>
            <GitBranch className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeRules}</div>
            <p className="text-xs text-success mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              94% accuracy rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeAlerts.filter(a => a.status !== "resolved").length}</div>
            <p className="text-xs text-muted-foreground mt-1">2 critical, 1 high severity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">MTTR</CardTitle>
            <Clock className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42 min</div>
            <p className="text-xs text-success mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              15% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="connections" className="space-y-4">
        <TabsList>
          <TabsTrigger value="connections">Connection Management</TabsTrigger>
          <TabsTrigger value="processing">Data Processing</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring & Response</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Connection Management Tab */}
        <TabsContent value="connections" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Data Source Configuration</CardTitle>
                  <CardDescription>Manage connections to security data sources</CardDescription>
                </div>
                <Dialog open={isAddSourceOpen} onOpenChange={setIsAddSourceOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-soc hover:bg-soc/90">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Data Source
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Data Source</DialogTitle>
                      <DialogDescription>Configure a new data source for SIEM integration</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Source Name</Label>
                          <Input placeholder="e.g., Firewall-01" />
                        </div>
                        <div className="space-y-2">
                          <Label>Source Type</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="firewall">Firewall</SelectItem>
                              <SelectItem value="edr">Endpoint Security</SelectItem>
                              <SelectItem value="cloud">Cloud Platform</SelectItem>
                              <SelectItem value="identity">Identity System</SelectItem>
                              <SelectItem value="waf">Web Application Firewall</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Hostname/IP</Label>
                          <Input placeholder="e.g., fw01.company.com" />
                        </div>
                        <div className="space-y-2">
                          <Label>Port</Label>
                          <Input type="number" placeholder="e.g., 514" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Protocol</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select protocol" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tcp">TCP</SelectItem>
                              <SelectItem value="udp">UDP</SelectItem>
                              <SelectItem value="https">HTTPS</SelectItem>
                              <SelectItem value="ldap">LDAP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Log Format</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cef">CEF</SelectItem>
                              <SelectItem value="json">JSON</SelectItem>
                              <SelectItem value="leef">LEEF</SelectItem>
                              <SelectItem value="syslog">Syslog</SelectItem>
                              <SelectItem value="windows">Windows Event</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Authentication</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="api_key">API Key</SelectItem>
                            <SelectItem value="token">Bearer Token</SelectItem>
                            <SelectItem value="credentials">Username/Password</SelectItem>
                            <SelectItem value="certificate">Certificate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>API Key / Credentials</Label>
                        <Input type="password" placeholder="Enter authentication details" />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddSourceOpen(false)}>
                        Cancel
                      </Button>
                      <Button className="bg-soc hover:bg-soc/90" onClick={() => setIsAddSourceOpen(false)}>
                        Add Source
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {dataSources.map((source) => (
                <Card key={source.id} className="hover:bg-soc-muted/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(source.status)}
                          {source.type.includes("Cloud") ? (
                            <Cloud className="h-5 w-5 text-soc" />
                          ) : source.type.includes("Identity") ? (
                            <Lock className="h-5 w-5 text-soc" />
                          ) : (
                            <Server className="h-5 w-5 text-soc" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{source.name}</h4>
                            {getStatusBadge(source.status)}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                            <span>{source.type}</span>
                            <span className="font-mono">{source.hostname}</span>
                            <span>{source.protocol}:{source.port}</span>
                            <span>{source.format}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {(source.eventsPerDay / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-muted-foreground">events/day</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Agent Management */}
          <Card>
            <CardHeader>
              <CardTitle>Log Agent Management</CardTitle>
              <CardDescription>Deploy and manage log collection agents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Download className="h-8 w-8 text-soc mb-3" />
                  <h4 className="font-semibold mb-1">Windows Agent</h4>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    For Windows Servers & Endpoints
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Download className="h-8 w-8 text-soc mb-3" />
                  <h4 className="font-semibold mb-1">Linux Agent</h4>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    For Linux/Unix Systems
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <Download className="h-8 w-8 text-soc mb-3" />
                  <h4 className="font-semibold mb-1">Container Agent</h4>
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    For Docker/Kubernetes
                  </p>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Processing Tab */}
        <TabsContent value="processing" className="space-y-4">
          {/* Correlation Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Event Correlation Rules</CardTitle>
                  <CardDescription>Define rules to detect complex attack patterns</CardDescription>
                </div>
                <Button className="bg-soc hover:bg-soc/90">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {correlationRules.map((rule) => (
                <Card key={rule.id} className="hover:bg-soc-muted/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(rule.status)}
                          <GitBranch className="h-5 w-5 text-soc" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{rule.name}</h4>
                            <Badge variant={rule.severity === "Critical" ? "destructive" : "secondary"}>
                              {rule.severity}
                            </Badge>
                            {getStatusBadge(rule.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              MITRE: {rule.mitre}
                            </span>
                            <span>Triggers: {rule.triggers}</span>
                            <span>False Positives: {rule.falsePositives}</span>
                            <span>Accuracy: {((1 - rule.falsePositives / rule.triggers) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          {rule.status === "active" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Threat Intelligence Feeds */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Threat Intelligence Feeds</CardTitle>
                <CardDescription>External threat intelligence sources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {threatIntelFeeds.map((feed, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(feed.status)}
                      <div>
                        <div className="font-medium">{feed.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {feed.indicators.toLocaleString()} indicators • Updated {feed.lastUpdate}
                        </div>
                      </div>
                    </div>
                    <Switch checked={feed.status === "active"} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Processing Status</CardTitle>
                <CardDescription>Normalization and enrichment metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Data Normalization</span>
                    <span className="font-medium text-success">96.5%</span>
                  </div>
                  <Progress value={96.5} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Threat Enrichment</span>
                    <span className="font-medium text-success">91.2%</span>
                  </div>
                  <Progress value={91.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">UEBA Baseline</span>
                    <span className="font-medium text-info">87.8%</span>
                  </div>
                  <Progress value={87.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Correlation Processing</span>
                    <span className="font-medium text-success">94.3%</span>
                  </div>
                  <Progress value={94.3} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* UEBA Settings */}
          <Card>
            <CardHeader>
              <CardTitle>User and Entity Behavior Analytics (UEBA)</CardTitle>
              <CardDescription>Behavioral analysis and anomaly detection settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-soc" />
                      <span className="text-sm font-medium">Enable UEBA Analysis</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-soc" />
                      <span className="text-sm font-medium">User Baseline Learning</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-soc" />
                      <span className="text-sm font-medium">Peer Group Analysis</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Baseline Period</div>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="60">60 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="p-3 rounded-lg border">
                    <div className="text-sm font-medium mb-2">Anomaly Sensitivity</div>
                    <Select defaultValue="medium">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (fewer alerts)</SelectItem>
                        <SelectItem value="medium">Medium (balanced)</SelectItem>
                        <SelectItem value="high">High (more sensitive)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monitoring & Response Tab */}
        <TabsContent value="monitoring" className="space-y-4">
          {/* Performance Dashboard */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Detection & Response Metrics</CardTitle>
                <CardDescription>Mean time to detect and resolve (minutes)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="mttd"
                      stroke="hsl(var(--info))"
                      name="MTTD"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="mttr"
                      stroke="hsl(var(--warning))"
                      name="MTTR"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alert Distribution by Severity</CardTitle>
                <CardDescription>Last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={alertDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {alertDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Alert Console */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Alert Management Console</CardTitle>
                  <CardDescription>Triage and respond to security alerts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAlerts.map((alert) => (
                <Card key={alert.id} className="hover:bg-soc-muted/10 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{alert.title}</h4>
                          <Badge variant={alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "secondary" : "outline"}>
                            {alert.severity}
                          </Badge>
                          <Badge variant="outline">Risk: {alert.riskScore}</Badge>
                          {alert.status === "investigating" ? (
                            <Badge className="bg-info">Investigating</Badge>
                          ) : alert.status === "resolved" ? (
                            <Badge className="bg-success">Resolved</Badge>
                          ) : (
                            <Badge variant="destructive">New</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <Server className="h-3 w-3" />
                            {alert.source}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            MITRE: {alert.mitre}
                          </span>
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {alert.affectedAssets} asset(s)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" className="bg-soc hover:bg-soc/90">
                            <Zap className="h-4 w-4 mr-2" />
                            Auto-Respond
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-2" />
                            Create Ticket
                          </Button>
                          <Button size="sm" variant="outline">
                            <Search className="h-4 w-4 mr-2" />
                            Investigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* XDR Integration */}
          <Card>
            <CardHeader>
              <CardTitle>Automated Response Actions</CardTitle>
              <CardDescription>XDR integration and response playbooks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-5 w-5 text-warning" />
                    <h4 className="font-semibold">Isolate Endpoint</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Automatically quarantine compromised endpoints from the network
                  </p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="h-5 w-5 text-error" />
                    <h4 className="font-semibold">Block IP Address</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add malicious IPs to firewall blocklist automatically
                  </p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <Lock className="h-5 w-5 text-info" />
                    <h4 className="font-semibold">Force Password Reset</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Require password change for compromised user accounts
                  </p>
                </div>
                <div className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="h-5 w-5 text-success" />
                    <h4 className="font-semibold">Create Incident Ticket</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Auto-create tickets in Jira/ServiceNow for investigation
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status Dashboard</CardTitle>
              <CardDescription>Regulatory compliance monitoring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {complianceStandards.map((standard, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg ${standard.status === "Compliant" ? "bg-success/10" : "bg-warning/10"}`}>
                      <FileText className={`h-5 w-5 ${standard.status === "Compliant" ? "text-success" : "text-warning"}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{standard.name}</h4>
                        <Badge variant={standard.status === "Compliant" ? "default" : "secondary"}>
                          {standard.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Coverage: {standard.coverage}%</span>
                          <span className="text-muted-foreground">Last audit: {standard.lastAudit}</span>
                        </div>
                        <Progress value={standard.coverage} className="h-2" />
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="ml-4">
                    <Download className="h-4 w-4 mr-2" />
                    Report
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Retention Policies */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Log Retention Policies</CardTitle>
                <CardDescription>Data retention and archival settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Hot Storage (Active)</div>
                    <div className="text-sm text-muted-foreground">90 days retention</div>
                  </div>
                  <Badge>342 GB</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Warm Storage (Archive)</div>
                    <div className="text-sm text-muted-foreground">1-7 years retention</div>
                  </div>
                  <Badge variant="secondary">2.4 TB</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <div className="font-medium">Cold Storage (Compliance)</div>
                    <div className="text-sm text-muted-foreground">7+ years retention</div>
                  </div>
                  <Badge variant="outline">8.9 TB</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Audit Trail & RBAC</CardTitle>
                <CardDescription>System activity and access control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Recent Admin Actions</span>
                    <Badge>248</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Last 24 hours • View full audit log
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm">SOC Analysts</span>
                    <Badge variant="secondary">Read/Alert</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm">Security Engineers</span>
                    <Badge>Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded border">
                    <span className="text-sm">Compliance Officers</span>
                    <Badge variant="outline">Audit Only</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
