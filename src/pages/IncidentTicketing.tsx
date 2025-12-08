import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, CheckCircle2, Clock, User, Shield, Search, Plus, Filter, TrendingUp, TrendingDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Incident {
  id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "P1" | "P2" | "P3" | "P4";
  severity: "critical" | "high" | "medium" | "low";
  assignee: string;
  reporter: string;
  createdAt: string;
  updatedAt: string;
  affectedAssets: string[];
  iocs: { type: string; value: string }[];
  attackVector?: string;
  source?: string;
  timeline: { timestamp: string; action: string; user: string }[];
  mttd?: number; // Mean Time to Detect (minutes)
  mttr?: number; // Mean Time to Respond (minutes)
}

const mockIncidents: Incident[] = [
  {
    id: "INC-2024-001",
    title: "Ransomware Attack Detected on File Server",
    description: "Multiple file encryption attempts detected on primary file server. WannaCry variant identified through behavioral analysis.",
    status: "in-progress",
    priority: "P1",
    severity: "critical",
    assignee: "Sarah Chen",
    reporter: "SIEM Auto-Detection",
    createdAt: "2024-01-15T08:30:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    affectedAssets: ["FILE-SRV-01", "USER-WS-045", "USER-WS-112"],
    iocs: [
      { type: "File Hash", value: "db349b97c37d22f5ea1d1841e3c89eb4" },
      { type: "IP Address", value: "185.220.101.34" },
      { type: "Domain", value: "malicious-c2.tor.onion" }
    ],
    attackVector: "Phishing Email Attachment",
    source: "External - APT28",
    mttd: 12,
    mttr: 45,
    timeline: [
      { timestamp: "2024-01-15T08:30:00Z", action: "Incident created automatically by SIEM", user: "System" },
      { timestamp: "2024-01-15T08:35:00Z", action: "Assigned to Sarah Chen", user: "John Smith (SOC Manager)" },
      { timestamp: "2024-01-15T08:42:00Z", action: "FILE-SRV-01 isolated from network", user: "Sarah Chen" },
      { timestamp: "2024-01-15T09:15:00Z", action: "Forensic analysis in progress", user: "Sarah Chen" }
    ]
  },
  {
    id: "INC-2024-002",
    title: "Unauthorized Access Attempt to Admin Portal",
    description: "Multiple failed login attempts detected from unusual geographic location, followed by successful authentication using compromised credentials.",
    status: "resolved",
    priority: "P2",
    severity: "high",
    assignee: "Mike Rodriguez",
    reporter: "Authentication System",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    affectedAssets: ["ADMIN-PORTAL", "USER-admin@company.com"],
    iocs: [
      { type: "IP Address", value: "45.142.212.61" },
      { type: "User Agent", value: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36" }
    ],
    attackVector: "Credential Stuffing",
    source: "External - Unknown",
    mttd: 8,
    mttr: 125,
    timeline: [
      { timestamp: "2024-01-14T14:20:00Z", action: "Incident created - Suspicious login activity", user: "System" },
      { timestamp: "2024-01-14T14:25:00Z", action: "Assigned to Mike Rodriguez", user: "John Smith (SOC Manager)" },
      { timestamp: "2024-01-14T15:10:00Z", action: "User account temporarily disabled", user: "Mike Rodriguez" },
      { timestamp: "2024-01-14T16:30:00Z", action: "Password reset enforced", user: "Mike Rodriguez" },
      { timestamp: "2024-01-15T10:30:00Z", action: "Incident resolved - User verified and account restored", user: "Mike Rodriguez" }
    ]
  },
  {
    id: "INC-2024-003",
    title: "Data Exfiltration Attempt via DNS Tunneling",
    description: "Unusual DNS query patterns detected indicating potential data exfiltration through DNS tunneling technique.",
    status: "open",
    priority: "P2",
    severity: "high",
    assignee: "Emily Watson",
    reporter: "Network Monitoring System",
    createdAt: "2024-01-15T11:45:00Z",
    updatedAt: "2024-01-15T11:45:00Z",
    affectedAssets: ["USER-WS-087", "DNS-SERVER-02"],
    iocs: [
      { type: "Domain", value: "data-exfil.suspicious-domain.com" },
      { type: "IP Address", value: "203.0.113.45" }
    ],
    attackVector: "DNS Tunneling",
    source: "Internal System Compromise",
    timeline: [
      { timestamp: "2024-01-15T11:45:00Z", action: "Incident created - Anomalous DNS activity", user: "System" },
      { timestamp: "2024-01-15T11:50:00Z", action: "Assigned to Emily Watson", user: "John Smith (SOC Manager)" }
    ]
  },
  {
    id: "INC-2024-004",
    title: "Malware Installation on Endpoint",
    description: "EDR solution detected and blocked trojan installation attempt on user workstation.",
    status: "closed",
    priority: "P3",
    severity: "medium",
    assignee: "David Kim",
    reporter: "EDR System",
    createdAt: "2024-01-13T09:15:00Z",
    updatedAt: "2024-01-13T16:20:00Z",
    affectedAssets: ["USER-WS-132"],
    iocs: [
      { type: "File Hash", value: "5f4dcc3b5aa765d61d8327deb882cf99" },
      { type: "File Name", value: "invoice_2024.pdf.exe" }
    ],
    attackVector: "Phishing Email",
    source: "External",
    mttd: 5,
    mttr: 60,
    timeline: [
      { timestamp: "2024-01-13T09:15:00Z", action: "Incident created - Malware detected", user: "System" },
      { timestamp: "2024-01-13T09:20:00Z", action: "Assigned to David Kim", user: "John Smith (SOC Manager)" },
      { timestamp: "2024-01-13T10:30:00Z", action: "Workstation scanned and cleaned", user: "David Kim" },
      { timestamp: "2024-01-13T11:00:00Z", action: "User security awareness training scheduled", user: "David Kim" },
      { timestamp: "2024-01-13T16:20:00Z", action: "Incident closed - No residual threats", user: "David Kim" }
    ]
  },
  {
    id: "INC-2024-005",
    title: "DDoS Attack on Web Application",
    description: "Distributed Denial of Service attack detected targeting customer-facing web application.",
    status: "resolved",
    priority: "P1",
    severity: "critical",
    assignee: "Sarah Chen",
    reporter: "WAF System",
    createdAt: "2024-01-12T20:05:00Z",
    updatedAt: "2024-01-12T22:45:00Z",
    affectedAssets: ["WEB-APP-01", "LOAD-BALANCER-01"],
    iocs: [
      { type: "IP Range", value: "192.0.2.0/24" },
      { type: "Attack Pattern", value: "HTTP Flood" }
    ],
    attackVector: "DDoS - HTTP Flood",
    source: "Botnet",
    mttd: 3,
    mttr: 160,
    timeline: [
      { timestamp: "2024-01-12T20:05:00Z", action: "Incident created - DDoS attack detected", user: "System" },
      { timestamp: "2024-01-12T20:08:00Z", action: "Assigned to Sarah Chen", user: "John Smith (SOC Manager)" },
      { timestamp: "2024-01-12T20:15:00Z", action: "WAF rules updated to block attack traffic", user: "Sarah Chen" },
      { timestamp: "2024-01-12T20:45:00Z", action: "CDN provider engaged for additional mitigation", user: "Sarah Chen" },
      { timestamp: "2024-01-12T22:45:00Z", action: "Incident resolved - Normal traffic restored", user: "Sarah Chen" }
    ]
  }
];

const IncidentTicketing = () => {
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const statusColors = {
    open: "bg-red-500/10 text-red-500 border-red-500/20",
    "in-progress": "bg-blue-500/10 text-blue-500 border-blue-500/20",
    resolved: "bg-green-500/10 text-green-500 border-green-500/20",
    closed: "bg-gray-500/10 text-gray-500 border-gray-500/20"
  };

  const priorityColors = {
    P1: "bg-red-500/10 text-red-500 border-red-500/20",
    P2: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    P3: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    P4: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };

  const severityColors = {
    critical: "bg-red-500/10 text-red-500 border-red-500/20",
    high: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    low: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         incident.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || incident.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle className="h-4 w-4" />;
      case "in-progress": return <Clock className="h-4 w-4" />;
      case "resolved": return <CheckCircle2 className="h-4 w-4" />;
      case "closed": return <CheckCircle2 className="h-4 w-4" />;
      default: return null;
    }
  };

  const calculateMetrics = () => {
    const openIncidents = incidents.filter(i => i.status === "open" || i.status === "in-progress").length;
    const resolvedToday = incidents.filter(i => 
      i.status === "resolved" && 
      new Date(i.updatedAt).toDateString() === new Date().toDateString()
    ).length;
    
    const incidentsWithMTTD = incidents.filter(i => i.mttd);
    const avgMTTD = incidentsWithMTTD.length > 0
      ? Math.round(incidentsWithMTTD.reduce((sum, i) => sum + (i.mttd || 0), 0) / incidentsWithMTTD.length)
      : 0;
    
    const incidentsWithMTTR = incidents.filter(i => i.mttr);
    const avgMTTR = incidentsWithMTTR.length > 0
      ? Math.round(incidentsWithMTTR.reduce((sum, i) => sum + (i.mttr || 0), 0) / incidentsWithMTTR.length)
      : 0;

    return { openIncidents, resolvedToday, avgMTTD, avgMTTR };
  };

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Incident Ticketing</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track security incidents through their lifecycle
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Incident
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Incident</DialogTitle>
              <DialogDescription>
                Document a new security incident for investigation and tracking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Incident Title</Label>
                <Input id="title" placeholder="Brief description of the incident" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed description including attack vector, source, and IOCs"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P1">P1 - Critical</SelectItem>
                      <SelectItem value="P2">P2 - High</SelectItem>
                      <SelectItem value="P3">P3 - Medium</SelectItem>
                      <SelectItem value="P4">P4 - Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="severity">Severity</Label>
                  <Select>
                    <SelectTrigger id="severity">
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignee">Assign To</Label>
                <Select>
                  <SelectTrigger id="assignee">
                    <SelectValue placeholder="Select analyst" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sarah">Sarah Chen</SelectItem>
                    <SelectItem value="mike">Mike Rodriguez</SelectItem>
                    <SelectItem value="emily">Emily Watson</SelectItem>
                    <SelectItem value="david">David Kim</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assets">Affected Assets</Label>
                <Input id="assets" placeholder="Comma-separated list of affected systems" />
              </div>
              <Button className="w-full">Create Incident</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.openIncidents}</div>
            <p className="text-xs text-muted-foreground">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved Today</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.resolvedToday}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +15% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg MTTD</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgMTTD}m</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -8% improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg MTTR</CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgMTTR}m</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              -12% improvement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="incidents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="incidents">All Incidents</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="incidents" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Incident Management</CardTitle>
              <CardDescription>Filter and manage security incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="P1">P1 - Critical</SelectItem>
                    <SelectItem value="P2">P2 - High</SelectItem>
                    <SelectItem value="P3">P3 - Medium</SelectItem>
                    <SelectItem value="P4">P4 - Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Incidents List */}
          <div className="space-y-4">
            {filteredIncidents.map((incident) => (
              <Card key={incident.id} className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{incident.id}</CardTitle>
                        <Badge className={priorityColors[incident.priority]}>
                          {incident.priority}
                        </Badge>
                        <Badge className={severityColors[incident.severity]}>
                          {incident.severity}
                        </Badge>
                      </div>
                      <CardDescription className="text-base font-medium text-foreground">
                        {incident.title}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[incident.status]} variant="outline">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(incident.status)}
                        {incident.status.replace("-", " ").toUpperCase()}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{incident.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Assignee</p>
                        <p className="text-sm font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {incident.assignee}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="text-sm font-medium">
                          {new Date(incident.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Affected Assets</p>
                        <p className="text-sm font-medium">{incident.affectedAssets.length} systems</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">IOCs</p>
                        <p className="text-sm font-medium">{incident.iocs.length} indicators</p>
                      </div>
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedIncident(incident)}
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <div className="flex items-center justify-between">
                            <DialogTitle>{incident.id}: {incident.title}</DialogTitle>
                            <div className="flex gap-2">
                              <Badge className={priorityColors[incident.priority]}>
                                {incident.priority}
                              </Badge>
                              <Badge className={statusColors[incident.status]} variant="outline">
                                {incident.status.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                        </DialogHeader>
                        
                        <div className="space-y-6 py-4">
                          {/* Overview */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Overview</h3>
                            <p className="text-sm text-muted-foreground">{incident.description}</p>
                          </div>

                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Status</Label>
                              <Select defaultValue={incident.status}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="open">Open</SelectItem>
                                  <SelectItem value="in-progress">In Progress</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Assignee</Label>
                              <Input value={incident.assignee} readOnly />
                            </div>
                            <div>
                              <Label>Attack Vector</Label>
                              <Input value={incident.attackVector || "Unknown"} readOnly />
                            </div>
                            <div>
                              <Label>Source</Label>
                              <Input value={incident.source || "Unknown"} readOnly />
                            </div>
                          </div>

                          {/* Affected Assets */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Affected Assets</h3>
                            <div className="flex flex-wrap gap-2">
                              {incident.affectedAssets.map((asset, idx) => (
                                <Badge key={idx} variant="secondary">{asset}</Badge>
                              ))}
                            </div>
                          </div>

                          {/* IOCs */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Indicators of Compromise</h3>
                            <div className="space-y-2">
                              {incident.iocs.map((ioc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-accent/50 rounded">
                                  <div>
                                    <p className="text-sm font-medium">{ioc.type}</p>
                                    <p className="text-xs text-muted-foreground font-mono">{ioc.value}</p>
                                  </div>
                                  <Button variant="outline" size="sm">Copy</Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Timeline */}
                          <div>
                            <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
                            <div className="space-y-3">
                              {incident.timeline.map((entry, idx) => (
                                <div key={idx} className="flex gap-3">
                                  <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    {idx < incident.timeline.length - 1 && (
                                      <div className="w-px h-full bg-border mt-1" />
                                    )}
                                  </div>
                                  <div className="flex-1 pb-4">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium">{entry.action}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {new Date(entry.timestamp).toLocaleString()}
                                      </p>
                                    </div>
                                    <p className="text-xs text-muted-foreground">by {entry.user}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Add Comment */}
                          <div>
                            <Label>Add Comment</Label>
                            <Textarea placeholder="Document investigation findings, actions taken, or coordination notes..." rows={3} className="mt-2" />
                            <Button className="mt-2">Post Comment</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Incidents by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    incidents.reduce((acc, inc) => {
                      acc[inc.status] = (acc[inc.status] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <Badge className={statusColors[status as keyof typeof statusColors]} variant="outline">
                        {status.replace("-", " ").toUpperCase()}
                      </Badge>
                      <span className="text-2xl font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Incidents by Priority</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(
                    incidents.reduce((acc, inc) => {
                      acc[inc.priority] = (acc[inc.priority] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <Badge className={priorityColors[priority as keyof typeof priorityColors]}>
                        {priority}
                      </Badge>
                      <span className="text-2xl font-bold">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Team efficiency and response time tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Incidents</p>
                    <p className="text-3xl font-bold">{incidents.length}</p>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Resolved</p>
                    <p className="text-3xl font-bold text-green-500">
                      {incidents.filter(i => i.status === "resolved" || i.status === "closed").length}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg MTTD</p>
                    <p className="text-3xl font-bold text-blue-500">{metrics.avgMTTD}m</p>
                  </div>
                  <div className="text-center p-4 bg-accent/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">Avg MTTR</p>
                    <p className="text-3xl font-bold text-purple-500">{metrics.avgMTTR}m</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IncidentTicketing;