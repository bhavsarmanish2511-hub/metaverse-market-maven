import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, XCircle, Clock, Search, Filter, Play, Pause, Bell, BellOff, ArrowUp, Activity, Zap, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Alarm {
  id: string;
  timestamp: string;
  device: string;
  severity: "critical" | "major" | "minor" | "warning";
  category: string;
  description: string;
  status: "active" | "acknowledged" | "suppressed" | "resolved";
  rootCause?: string;
  relatedAlarms?: number;
  acknowledgedBy?: string;
}

const mockAlarms: Alarm[] = [
  {
    id: "ALM-001",
    timestamp: "2025-11-27 14:32:15",
    device: "Core-Router-01",
    severity: "critical",
    category: "Interface Down",
    description: "Port Gi0/1 operationally down",
    status: "active",
    rootCause: "Fiber link failure detected",
    relatedAlarms: 12
  },
  {
    id: "ALM-002",
    timestamp: "2025-11-27 14:28:03",
    device: "Core-Switch-03",
    severity: "major",
    category: "High CPU Usage",
    description: "CPU utilization exceeded 90% threshold",
    status: "acknowledged",
    acknowledgedBy: "John Doe"
  },
  {
    id: "ALM-003",
    timestamp: "2025-11-27 14:15:22",
    device: "Edge-Router-05",
    severity: "minor",
    category: "BGP Session",
    description: "BGP peer 192.168.1.1 session flapping",
    status: "active"
  },
  {
    id: "ALM-004",
    timestamp: "2025-11-27 13:45:11",
    device: "Firewall-02",
    severity: "warning",
    category: "Memory Threshold",
    description: "Memory usage at 75%",
    status: "suppressed"
  },
  {
    id: "ALM-005",
    timestamp: "2025-11-27 13:30:45",
    device: "DNS-Server-01",
    severity: "critical",
    category: "Service Down",
    description: "DNS service not responding",
    status: "active",
    rootCause: "Service process crashed",
    relatedAlarms: 5
  },
  {
    id: "ALM-006",
    timestamp: "2025-11-27 12:55:33",
    device: "Load-Balancer-01",
    severity: "major",
    category: "Health Check Failed",
    description: "Backend server pool health check failure",
    status: "active"
  },
  {
    id: "ALM-007",
    timestamp: "2025-11-27 12:20:18",
    device: "Access-Switch-12",
    severity: "minor",
    category: "Port Security",
    description: "Port security violation on Fa0/24",
    status: "acknowledged",
    acknowledgedBy: "Jane Smith"
  },
  {
    id: "ALM-008",
    timestamp: "2025-11-27 11:45:00",
    device: "VPN-Gateway-01",
    severity: "warning",
    category: "Tunnel Status",
    description: "IPSec tunnel packet loss detected",
    status: "resolved"
  }
];

const diagnosticTools = [
  { name: "Ping Test", icon: Activity, description: "Test network connectivity" },
  { name: "Traceroute", icon: Activity, description: "Trace network path" },
  { name: "MIB Browser", icon: FileText, description: "Browse SNMP MIBs" },
  { name: "Port Diagnostics", icon: Activity, description: "Check interface status" }
];

export default function FaultManagement() {
  const [alarms, setAlarms] = useState<Alarm[]>(mockAlarms);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      critical: { variant: "destructive", className: "bg-destructive text-destructive-foreground" },
      major: { variant: "default", className: "bg-orange-500 text-white hover:bg-orange-600" },
      minor: { variant: "secondary", className: "bg-yellow-500 text-white hover:bg-yellow-600" },
      warning: { variant: "outline", className: "bg-blue-500 text-white hover:bg-blue-600" }
    };
    const config = variants[severity] || variants.warning;
    return <Badge variant={config.variant} className={config.className}>{severity.toUpperCase()}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { icon: any, className: string }> = {
      active: { icon: AlertTriangle, className: "bg-red-500/10 text-red-500 border-red-500/20" },
      acknowledged: { icon: CheckCircle2, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
      suppressed: { icon: BellOff, className: "bg-gray-500/10 text-gray-500 border-gray-500/20" },
      resolved: { icon: CheckCircle2, className: "bg-green-500/10 text-green-500 border-green-500/20" }
    };
    const config = variants[status] || variants.active;
    const Icon = config.icon;
    return (
      <Badge variant="outline" className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {status}
      </Badge>
    );
  };

  const handleAcknowledge = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, status: "acknowledged" as const, acknowledgedBy: "Current User" }
        : alarm
    ));
    toast({
      title: "Alarm Acknowledged",
      description: `Alarm ${alarmId} has been acknowledged.`
    });
  };

  const handleSuppress = (alarmId: string) => {
    setAlarms(prev => prev.map(alarm => 
      alarm.id === alarmId 
        ? { ...alarm, status: "suppressed" as const }
        : alarm
    ));
    toast({
      title: "Alarm Suppressed",
      description: `Alarm ${alarmId} has been suppressed.`
    });
  };

  const handleEscalate = (alarmId: string) => {
    toast({
      title: "Alarm Escalated",
      description: `Alarm ${alarmId} has been escalated to senior engineer and ITSM ticket created.`
    });
  };

  const handleAutoRemediate = (alarmId: string) => {
    toast({
      title: "Auto-Remediation Started",
      description: `Automated recovery script initiated for alarm ${alarmId}.`
    });
  };

  const filteredAlarms = alarms.filter(alarm => {
    const matchesSearch = alarm.device.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alarm.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         alarm.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "all" || alarm.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || alarm.status === statusFilter;
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const alarmStats = {
    total: alarms.length,
    critical: alarms.filter(a => a.severity === "critical").length,
    active: alarms.filter(a => a.status === "active").length,
    acknowledged: alarms.filter(a => a.status === "acknowledged").length
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Fault Management</h2>
          <p className="text-muted-foreground">Network alarm monitoring and resolution</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            <Activity className="h-3 w-3 mr-1" />
            Real-Time Monitoring
          </Badge>
          <Badge variant="outline">Last Update: Just now</Badge>
        </div>
      </div>

      {/* Alarm Statistics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Alarms</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alarmStats.total}</div>
            <p className="text-xs text-muted-foreground">Active monitoring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Alarms</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{alarmStats.critical}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Alarms</CardTitle>
            <XCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{alarmStats.active}</div>
            <p className="text-xs text-muted-foreground">Not yet acknowledged</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{alarmStats.acknowledged}</div>
            <p className="text-xs text-muted-foreground">Being investigated</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="alarms" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alarms">Active Alarms</TabsTrigger>
          <TabsTrigger value="correlation">Event Correlation</TabsTrigger>
          <TabsTrigger value="diagnostics">Diagnostics Tools</TabsTrigger>
          <TabsTrigger value="history">Historical Logs</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
        </TabsList>

        {/* Active Alarms Tab */}
        <TabsContent value="alarms" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <CardTitle>Alarm Browser</CardTitle>
                  <CardDescription>Real-time network fault monitoring and management</CardDescription>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alarms..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="suppressed">Suppressed</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Alarm ID</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlarms.map((alarm) => (
                      <TableRow key={alarm.id}>
                        <TableCell className="font-medium">{alarm.id}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alarm.timestamp}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{alarm.device}</TableCell>
                        <TableCell>{getSeverityBadge(alarm.severity)}</TableCell>
                        <TableCell>{alarm.category}</TableCell>
                        <TableCell>
                          {alarm.description}
                          {alarm.rootCause && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Root Cause: {alarm.rootCause}
                            </p>
                          )}
                          {alarm.relatedAlarms && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {alarm.relatedAlarms} related alarms
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(alarm.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {alarm.status === "active" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAcknowledge(alarm.id)}
                                  title="Acknowledge"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleSuppress(alarm.id)}
                                  title="Suppress"
                                >
                                  <BellOff className="h-3 w-3" />
                                </Button>
                              </>
                            )}
                            {(alarm.severity === "critical" || alarm.severity === "major") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEscalate(alarm.id)}
                                title="Escalate"
                              >
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Event Correlation Tab */}
        <TabsContent value="correlation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Root Cause Analysis (RCA)</CardTitle>
              <CardDescription>Correlated events and identified root causes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alarms.filter(a => a.rootCause).map((alarm) => (
                  <Card key={alarm.id} className="border-l-4 border-l-destructive">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{alarm.device} - {alarm.category}</CardTitle>
                          <CardDescription>{alarm.description}</CardDescription>
                        </div>
                        {getSeverityBadge(alarm.severity)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-destructive" />
                          <span className="font-medium">Root Cause:</span>
                          <span>{alarm.rootCause}</span>
                        </div>
                        {alarm.relatedAlarms && (
                          <div className="flex items-center gap-2">
                            <Activity className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              This issue has caused {alarm.relatedAlarms} related downstream alarms
                            </span>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => handleAutoRemediate(alarm.id)}>
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Remediate
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleEscalate(alarm.id)}>
                            Create Ticket
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

        {/* Diagnostics Tools Tab */}
        <TabsContent value="diagnostics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {diagnosticTools.map((tool) => (
              <Card key={tool.name}>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <tool.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{tool.name}</CardTitle>
                  </div>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Input placeholder="Enter target device or IP..." />
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Run Diagnostic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Historical Logs Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alarm History & Journal</CardTitle>
              <CardDescription>Historical alarm data for analysis and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">MTTR (Mean Time To Resolve)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">24.5 min</div>
                      <p className="text-xs text-green-500">-15% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">MTBF (Mean Time Between Failures)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">168 hrs</div>
                      <p className="text-xs text-green-500">+8% from last month</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Alarms This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">47</div>
                      <p className="text-xs text-muted-foreground">12 critical, 35 other</p>
                    </CardContent>
                  </Card>
                </div>
                <div className="rounded-md border p-4">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Detailed historical logs and analytics would be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Automation Tab */}
        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automated Actions & Scripts</CardTitle>
              <CardDescription>Configure automated responses to common fault scenarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">Interface Down Auto-Recovery</CardTitle>
                        <CardDescription>Automatically restart interface on link down</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-3 w-3 mr-1" />
                        Disable
                      </Button>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">High CPU Alert Response</CardTitle>
                        <CardDescription>Kill non-critical processes when CPU exceeds 95%</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Enabled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Pause className="h-3 w-3 mr-1" />
                        Disable
                      </Button>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">Service Recovery Script</CardTitle>
                        <CardDescription>Restart critical services on failure detection</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-gray-500/10 text-gray-500 border-gray-500/20">
                        <Pause className="h-3 w-3 mr-1" />
                        Disabled
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Enable
                      </Button>
                      <Button size="sm" variant="outline">Configure</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
