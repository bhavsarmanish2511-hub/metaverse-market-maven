import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { 
  Database, 
  Server, 
  Shield, 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Download,
  Settings,
  Clock,
  HardDrive,
  Network,
  FileText,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const logSources = [
  { 
    id: 1, 
    name: "Firewall-01", 
    type: "Network Firewall", 
    status: "healthy", 
    eventsPerSec: 1247, 
    format: "Syslog",
    lastSeen: "2 min ago"
  },
  { 
    id: 2, 
    name: "Windows-Servers", 
    type: "Windows Event Logs", 
    status: "healthy", 
    eventsPerSec: 892, 
    format: "Windows Event",
    lastSeen: "1 min ago"
  },
  { 
    id: 3, 
    name: "Linux-Endpoints", 
    type: "Linux Servers", 
    status: "warning", 
    eventsPerSec: 456, 
    format: "Syslog",
    lastSeen: "15 min ago"
  },
  { 
    id: 4, 
    name: "AWS-CloudTrail", 
    type: "Cloud Platform", 
    status: "healthy", 
    eventsPerSec: 2341, 
    format: "JSON",
    lastSeen: "30 sec ago"
  },
  { 
    id: 5, 
    name: "Database-Cluster", 
    type: "Database Logs", 
    status: "healthy", 
    eventsPerSec: 678, 
    format: "JSON",
    lastSeen: "1 min ago"
  },
  { 
    id: 6, 
    name: "EDR-Agent", 
    type: "Endpoint Security", 
    status: "error", 
    eventsPerSec: 0, 
    format: "JSON",
    lastSeen: "2 hours ago"
  },
  { 
    id: 7, 
    name: "IDS-Snort", 
    type: "IDS/IPS", 
    status: "healthy", 
    eventsPerSec: 1823, 
    format: "Unified2",
    lastSeen: "45 sec ago"
  },
  { 
    id: 8, 
    name: "Web-Application", 
    type: "Application Logs", 
    status: "healthy", 
    eventsPerSec: 3421, 
    format: "JSON",
    lastSeen: "10 sec ago"
  },
];

const ingestionData = [
  { time: "00:00", events: 12400, volume: 45 },
  { time: "04:00", events: 8900, volume: 32 },
  { time: "08:00", events: 15600, volume: 58 },
  { time: "12:00", events: 18200, volume: 67 },
  { time: "16:00", events: 21400, volume: 79 },
  { time: "20:00", events: 16800, volume: 62 },
];

const recentLogs = [
  { 
    id: 1, 
    timestamp: "2024-01-25 14:23:45", 
    source: "Firewall-01", 
    severity: "High", 
    event: "Suspicious outbound connection blocked",
    ip: "192.168.1.45"
  },
  { 
    id: 2, 
    timestamp: "2024-01-25 14:23:12", 
    source: "Windows-Servers", 
    severity: "Medium", 
    event: "Failed login attempt detected",
    ip: "10.0.2.88"
  },
  { 
    id: 3, 
    timestamp: "2024-01-25 14:22:58", 
    source: "AWS-CloudTrail", 
    severity: "Low", 
    event: "User IAM role changed",
    ip: "172.16.0.12"
  },
  { 
    id: 4, 
    timestamp: "2024-01-25 14:22:34", 
    source: "IDS-Snort", 
    severity: "Critical", 
    event: "Potential SQL injection attempt",
    ip: "203.0.113.42"
  },
  { 
    id: 5, 
    timestamp: "2024-01-25 14:21:56", 
    source: "Web-Application", 
    severity: "Low", 
    event: "API rate limit exceeded",
    ip: "198.51.100.23"
  },
];

const complianceReports = [
  { name: "PCI DSS", status: "Compliant", lastAudit: "2024-01-15", nextAudit: "2024-04-15" },
  { name: "HIPAA", status: "Compliant", lastAudit: "2024-01-10", nextAudit: "2024-04-10" },
  { name: "GDPR", status: "Action Required", lastAudit: "2024-01-20", nextAudit: "2024-04-20" },
  { name: "SOC 2", status: "Compliant", lastAudit: "2024-01-05", nextAudit: "2024-04-05" },
];

export default function LogCollection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <XCircle className="h-4 w-4 text-error" />;
      default:
        return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      healthy: "default",
      warning: "secondary",
      error: "destructive",
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

  const filteredSources = logSources.filter(source => {
    const matchesSearch = source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         source.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || source.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalEvents = logSources.reduce((sum, source) => sum + source.eventsPerSec, 0);
  const healthySources = logSources.filter(s => s.status === "healthy").length;
  const errorSources = logSources.filter(s => s.status === "error").length;

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-soc">Logs Monitoring</h1>
          <p className="text-muted-foreground mt-1">
            Centralized log management and security monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Sources</CardTitle>
            <Database className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{logSources.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {healthySources} healthy, {errorSources} errors
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Events/Second</CardTitle>
            <Activity className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents.toLocaleString()}</div>
            <p className="text-xs text-success mt-1">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
            <HardDrive className="h-4 w-4 text-soc" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">342 GB</div>
            <p className="text-xs text-muted-foreground mt-1">Today's ingestion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Parse Success</CardTitle>
            <CheckCircle className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.7%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <Progress value={98.7} className="mt-2" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="sources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sources">Log Sources</TabsTrigger>
          <TabsTrigger value="ingestion">Data Ingestion</TabsTrigger>
          <TabsTrigger value="search">Search & Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        {/* Log Sources Tab */}
        <TabsContent value="sources" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Log Source Management</CardTitle>
              <CardDescription>Monitor and configure all connected log sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search log sources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source List */}
              <div className="space-y-2">
                {filteredSources.map((source) => (
                  <Card key={source.id} className="hover:bg-soc-muted/10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(source.status)}
                            <Server className="h-5 w-5 text-soc" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">{source.name}</h4>
                              {getStatusBadge(source.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {source.type}
                              </span>
                              <span className="flex items-center gap-1">
                                <FileText className="h-3 w-3" />
                                {source.format}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {source.lastSeen}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-sm font-medium">{source.eventsPerSec.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">events/sec</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">Active</span>
                            <Switch checked={source.status !== "error"} />
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Data Ingestion Tab */}
        <TabsContent value="ingestion" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Ingestion Volume (Events)</CardTitle>
                <CardDescription>Events per second over 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ingestionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="events" 
                      stroke="hsl(var(--soc))" 
                      fill="hsl(var(--soc-muted))" 
                      name="Events"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Volume (GB)</CardTitle>
                <CardDescription>Storage consumption over 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ingestionData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Bar dataKey="volume" fill="hsl(var(--soc))" name="GB" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Health Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle>Data Quality & Health</CardTitle>
              <CardDescription>Real-time monitoring of log processing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Parsing Success</span>
                    <span className="font-medium text-success">98.7%</span>
                  </div>
                  <Progress value={98.7} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Normalization Rate</span>
                    <span className="font-medium text-success">95.2%</span>
                  </div>
                  <Progress value={95.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Enrichment Rate</span>
                    <span className="font-medium text-info">89.8%</span>
                  </div>
                  <Progress value={89.8} className="h-2" />
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4 text-soc" />
                  Network Transport Status
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">TCP Connections</span>
                    <Badge>Active: 847</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Average Latency</span>
                    <Badge variant="secondary">24ms</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Search & Analysis Tab */}
        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Log Search & Real-time Monitoring</CardTitle>
              <CardDescription>Search and filter security events in real-time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input placeholder="Search logs by keyword, IP, user ID, or event type..." className="flex-1" />
                <Button className="bg-soc hover:bg-soc/90">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>

              {/* Recent Logs Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 font-semibold text-sm flex gap-4">
                  <div className="w-40">Timestamp</div>
                  <div className="w-40">Source</div>
                  <div className="w-24">Severity</div>
                  <div className="flex-1">Event</div>
                  <div className="w-32">IP Address</div>
                </div>
                <div className="divide-y">
                  {recentLogs.map((log) => (
                    <div key={log.id} className="px-4 py-3 flex gap-4 items-center hover:bg-soc-muted/10 transition-colors cursor-pointer">
                      <div className="w-40 text-sm text-muted-foreground">{log.timestamp}</div>
                      <div className="w-40 text-sm font-medium">{log.source}</div>
                      <div className="w-24">
                        <Badge variant={log.severity === "Critical" || log.severity === "High" ? "destructive" : "secondary"}>
                          {log.severity}
                        </Badge>
                      </div>
                      <div className="flex-1 text-sm">{log.event}</div>
                      <div className="w-32 text-sm font-mono text-muted-foreground">{log.ip}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Retention Policies</CardTitle>
                <CardDescription>Log retention and archival configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Security Logs</div>
                      <div className="text-sm text-muted-foreground">90 days active, 7 years archived</div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Application Logs</div>
                      <div className="text-sm text-muted-foreground">30 days active, 1 year archived</div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <div>
                      <div className="font-medium">Audit Logs</div>
                      <div className="text-sm text-muted-foreground">365 days active, 10 years archived</div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Access Controls</CardTitle>
                <CardDescription>User permissions and audit trail</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">SOC Analysts</span>
                    <Badge variant="secondary">Read Access</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Security Engineers</span>
                    <Badge>Full Access</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Compliance Officers</span>
                    <Badge variant="secondary">Audit Access</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">External Auditors</span>
                    <Badge variant="outline">Limited Access</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
              <CardDescription>Audit readiness and regulatory compliance status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {complianceReports.map((report, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg ${report.status === "Compliant" ? "bg-success/10" : "bg-warning/10"}`}>
                        <FileText className={`h-5 w-5 ${report.status === "Compliant" ? "text-success" : "text-warning"}`} />
                      </div>
                      <div>
                        <div className="font-semibold">{report.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Last audit: {report.lastAudit} • Next: {report.nextAudit}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={report.status === "Compliant" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Report
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
