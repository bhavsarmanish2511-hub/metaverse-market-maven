import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  Users, 
  Globe, 
  Shield,
  Network,
  Database,
  BarChart3,
  Clock,
  Wifi,
  Download,
  Upload,
  Search,
  Filter
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

// Mock data for top talkers
const topTalkers = [
  { 
    id: 1, 
    host: "DB-Server-01", 
    ip: "10.0.1.50", 
    bandwidth: 850, 
    bandwidth_unit: "Mbps",
    percentage: 42.5,
    protocol: "TCP",
    traffic_type: "Database Replication"
  },
  { 
    id: 2, 
    host: "Video-Stream-GW", 
    ip: "10.0.2.100", 
    bandwidth: 720, 
    bandwidth_unit: "Mbps",
    percentage: 36.0,
    protocol: "UDP",
    traffic_type: "Video Streaming"
  },
  { 
    id: 3, 
    host: "Backup-Server", 
    ip: "10.0.1.75", 
    bandwidth: 180, 
    bandwidth_unit: "Mbps",
    percentage: 9.0,
    protocol: "TCP",
    traffic_type: "Backup Operations"
  },
  { 
    id: 4, 
    host: "Web-Frontend-01", 
    ip: "10.0.3.10", 
    bandwidth: 120, 
    bandwidth_unit: "Mbps",
    percentage: 6.0,
    protocol: "HTTPS",
    traffic_type: "Web Traffic"
  },
  { 
    id: 5, 
    host: "Email-Server", 
    ip: "10.0.1.25", 
    bandwidth: 80, 
    bandwidth_unit: "Mbps",
    percentage: 4.0,
    protocol: "SMTP/IMAP",
    traffic_type: "Email"
  },
];

// Mock data for protocol distribution
const protocolDistribution = [
  { protocol: "HTTP/HTTPS", percentage: 45, bandwidth: "900 Mbps", color: "bg-blue-500" },
  { protocol: "TCP", percentage: 25, bandwidth: "500 Mbps", color: "bg-green-500" },
  { protocol: "UDP", percentage: 15, bandwidth: "300 Mbps", color: "bg-purple-500" },
  { protocol: "ICMP", percentage: 5, bandwidth: "100 Mbps", color: "bg-yellow-500" },
  { protocol: "Other", percentage: 10, bandwidth: "200 Mbps", color: "bg-gray-500" },
];

// Mock data for traffic flows
const trafficFlows = [
  {
    id: 1,
    source: "10.0.1.50",
    destination: "10.0.1.51",
    protocol: "TCP",
    port: "3306",
    bytes: "15.2 GB",
    packets: "10.5M",
    duration: "4h 23m",
    status: "active"
  },
  {
    id: 2,
    source: "10.0.2.100",
    destination: "192.168.50.0/24",
    protocol: "UDP",
    port: "1935",
    bytes: "48.7 GB",
    packets: "35.2M",
    duration: "6h 15m",
    status: "active"
  },
  {
    id: 3,
    source: "10.0.3.10",
    destination: "0.0.0.0/0",
    protocol: "HTTPS",
    port: "443",
    bytes: "8.3 GB",
    packets: "5.8M",
    duration: "8h 00m",
    status: "active"
  },
];

// Mock data for security alerts
const securityAlerts = [
  {
    id: 1,
    timestamp: "2024-01-20 14:45:00",
    severity: "high",
    type: "DDoS Attack",
    source: "Multiple External IPs",
    destination: "10.0.3.10",
    description: "Abnormal traffic spike detected - 50,000 req/min",
    status: "investigating"
  },
  {
    id: 2,
    timestamp: "2024-01-20 13:30:00",
    severity: "medium",
    type: "Port Scan",
    source: "185.220.101.45",
    destination: "10.0.1.0/24",
    description: "Sequential port scanning detected on internal network",
    status: "blocked"
  },
  {
    id: 3,
    timestamp: "2024-01-20 12:15:00",
    severity: "low",
    type: "Unusual Traffic Pattern",
    source: "10.0.2.87",
    destination: "external",
    description: "Host communicating with unusual number of destinations",
    status: "monitoring"
  },
];

// Mock data for application performance
const applicationMetrics = [
  { 
    app: "Database Cluster", 
    latency: "2.3 ms", 
    throughput: "850 Mbps", 
    errors: 0, 
    availability: 99.99,
    status: "healthy"
  },
  { 
    app: "Web Services", 
    latency: "45 ms", 
    throughput: "320 Mbps", 
    errors: 12, 
    availability: 99.95,
    status: "healthy"
  },
  { 
    app: "Video Platform", 
    latency: "120 ms", 
    throughput: "720 Mbps", 
    errors: 3, 
    availability: 99.98,
    status: "healthy"
  },
  { 
    app: "Email System", 
    latency: "180 ms", 
    throughput: "80 Mbps", 
    errors: 45, 
    availability: 98.5,
    status: "degraded"
  },
];

const TrafficAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
      case "critical":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{severity}</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{severity}</Badge>;
      case "low":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">{severity}</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "healthy":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{status}</Badge>;
      case "degraded":
      case "investigating":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">{status}</Badge>;
      case "blocked":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{status}</Badge>;
      case "monitoring":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Traffic Analysis</h1>
        <p className="text-muted-foreground">
          Real-time network traffic monitoring, flow analysis, and security threat detection
        </p>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bandwidth</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.0 Gbps</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={66.7} className="h-1" />
              <span className="text-xs text-muted-foreground">67% utilized</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Flows</CardTitle>
            <Network className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,547</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3" /> +12% vs last hour
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Latency</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 ms</div>
            <p className="text-xs text-muted-foreground">
              Within normal range
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 high, 1 medium, 1 low
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="flows">
            <Network className="h-4 w-4 mr-2" />
            Flow Data
          </TabsTrigger>
          <TabsTrigger value="applications">
            <Database className="h-4 w-4 mr-2" />
            Applications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Talkers */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Top Talkers</CardTitle>
                    <CardDescription>Highest bandwidth consumers</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {topTalkers.map((talker) => (
                      <div key={talker.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="font-medium">{talker.host}</div>
                            <div className="text-sm text-muted-foreground">{talker.ip}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{talker.bandwidth} {talker.bandwidth_unit}</div>
                            <div className="text-sm text-muted-foreground">{talker.percentage}%</div>
                          </div>
                        </div>
                        <Progress value={talker.percentage} className="h-2" />
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">{talker.protocol}</Badge>
                          <Badge variant="outline" className="text-xs">{talker.traffic_type}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Protocol Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Protocol Distribution</CardTitle>
                <CardDescription>Traffic breakdown by protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Visual bar chart */}
                  <div className="flex h-8 rounded-md overflow-hidden">
                    {protocolDistribution.map((proto, idx) => (
                      <div
                        key={idx}
                        className={`${proto.color}`}
                        style={{ width: `${proto.percentage}%` }}
                        title={`${proto.protocol}: ${proto.percentage}%`}
                      />
                    ))}
                  </div>

                  {/* Legend and details */}
                  <div className="space-y-3">
                    {protocolDistribution.map((proto, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded ${proto.color}`} />
                          <span className="font-medium">{proto.protocol}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{proto.bandwidth}</div>
                          <div className="text-sm text-muted-foreground">{proto.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary stats */}
                  <div className="pt-4 border-t">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Total Protocols</div>
                        <div className="text-xl font-bold">5</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Total Traffic</div>
                        <div className="text-xl font-bold">2.0 Gbps</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bandwidth Trends Chart Placeholder */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Bandwidth Utilization Trends</CardTitle>
                  <CardDescription>Real-time and historical bandwidth usage</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">1H</Button>
                  <Button variant="outline" size="sm">24H</Button>
                  <Button variant="outline" size="sm">7D</Button>
                  <Button variant="outline" size="sm">30D</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Real-time bandwidth chart would be displayed here</p>
                  <p className="text-sm">Integration with time-series monitoring data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Flow Data Tab */}
        <TabsContent value="flows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>NetFlow / IPFIX Analysis</CardTitle>
                  <CardDescription>Active network conversations and flow metadata</CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search flows..."
                      className="pl-8 w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Source IP</TableHead>
                      <TableHead>Destination IP</TableHead>
                      <TableHead>Protocol</TableHead>
                      <TableHead>Port</TableHead>
                      <TableHead>Bytes</TableHead>
                      <TableHead>Packets</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trafficFlows.map((flow) => (
                      <TableRow key={flow.id}>
                        <TableCell className="font-mono text-sm">{flow.source}</TableCell>
                        <TableCell className="font-mono text-sm">{flow.destination}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{flow.protocol}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-sm">{flow.port}</TableCell>
                        <TableCell>{flow.bytes}</TableCell>
                        <TableCell>{flow.packets}</TableCell>
                        <TableCell>{flow.duration}</TableCell>
                        <TableCell>{getStatusBadge(flow.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Traffic Flow Diagram Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Traffic Flow Visualization (Sankey Diagram)</CardTitle>
              <CardDescription>Visual representation of data flows between network segments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center text-muted-foreground">
                  <Network className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Interactive Sankey diagram would be displayed here</p>
                  <p className="text-sm">Showing traffic paths between sources and destinations</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="applications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Application Performance Monitoring</CardTitle>
              <CardDescription>Track latency, throughput, and availability by application</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {applicationMetrics.map((app, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Database className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <CardTitle className="text-base">{app.app}</CardTitle>
                          </div>
                        </div>
                        {getStatusBadge(app.status)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Latency</div>
                          <div className="text-xl font-bold">{app.latency}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Throughput</div>
                          <div className="text-xl font-bold">{app.throughput}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Errors</div>
                          <div className="text-xl font-bold">{app.errors}</div>
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Availability</div>
                          <div className="text-xl font-bold">{app.availability}%</div>
                        </div>
                      </div>
                      <Progress value={app.availability} className="mt-4" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Security Threat Detection</CardTitle>
                  <CardDescription>Anomaly detection, DDoS alerts, and suspicious traffic patterns</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Export to SIEM
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {securityAlerts.map((alert) => (
                    <Card key={alert.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              <CardTitle className="text-base">{alert.type}</CardTitle>
                              {getSeverityBadge(alert.severity)}
                            </div>
                            <CardDescription>{alert.description}</CardDescription>
                          </div>
                          {getStatusBadge(alert.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Timestamp</div>
                            <div className="font-mono">{alert.timestamp}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Source</div>
                            <div className="font-mono">{alert.source}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Destination</div>
                            <div className="font-mono">{alert.destination}</div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Investigate</Button>
                            <Button variant="outline" size="sm">Block</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Integration Points */}
          <Card>
            <CardHeader>
              <CardTitle>Security Integration</CardTitle>
              <CardDescription>Connected security tools and systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Shield className="h-8 w-8 text-blue-500" />
                      <div>
                        <div className="font-semibold">SIEM</div>
                        <div className="text-sm text-muted-foreground">Connected</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-8 w-8 text-orange-500" />
                      <div>
                        <div className="font-semibold">IDS/IPS</div>
                        <div className="text-sm text-muted-foreground">Active</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Network className="h-8 w-8 text-green-500" />
                      <div>
                        <div className="font-semibold">XDR Platform</div>
                        <div className="text-sm text-muted-foreground">Automated</div>
                      </div>
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
};

export default TrafficAnalysis;
