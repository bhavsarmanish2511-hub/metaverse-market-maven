import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Server, Wifi, AlertTriangle, TrendingUp, TrendingDown, HardDrive, Cpu, Network, Clock, Download, Upload } from "lucide-react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// Mock data for network performance
const networkThroughput = [
  { time: "00:00", inbound: 245, outbound: 189 },
  { time: "04:00", inbound: 198, outbound: 145 },
  { time: "08:00", inbound: 412, outbound: 356 },
  { time: "12:00", inbound: 567, outbound: 489 },
  { time: "16:00", inbound: 623, outbound: 534 },
  { time: "20:00", inbound: 478, outbound: 398 },
];

const latencyData = [
  { time: "00:00", latency: 12, jitter: 2 },
  { time: "04:00", latency: 15, jitter: 3 },
  { time: "08:00", latency: 23, jitter: 5 },
  { time: "12:00", latency: 28, jitter: 7 },
  { time: "16:00", latency: 19, jitter: 4 },
  { time: "20:00", latency: 14, jitter: 2 },
];

const deviceMetrics = [
  { name: "Core-Router-01", type: "Router", status: "healthy", cpu: 34, memory: 56, uptime: "99.98%", latency: 12 },
  { name: "Edge-Switch-03", type: "Switch", status: "healthy", cpu: 23, memory: 42, uptime: "99.95%", latency: 8 },
  { name: "Firewall-Main", type: "Firewall", status: "warning", cpu: 78, memory: 82, uptime: "99.92%", latency: 15 },
  { name: "Load-Balancer-01", type: "Load Balancer", status: "healthy", cpu: 45, memory: 61, uptime: "99.99%", latency: 10 },
  { name: "Core-Switch-02", type: "Switch", status: "critical", cpu: 91, memory: 88, uptime: "98.45%", latency: 45 },
  { name: "VPN-Gateway-01", type: "Gateway", status: "healthy", cpu: 38, memory: 52, uptime: "99.94%", latency: 18 },
];

const topBandwidthConsumers = [
  { application: "Video Conferencing", bandwidth: 234, protocol: "UDP", percentage: 28 },
  { application: "Cloud Backup", bandwidth: 198, protocol: "TCP", percentage: 24 },
  { application: "Web Traffic", bandwidth: 167, protocol: "HTTPS", percentage: 20 },
  { application: "Database Sync", bandwidth: 123, protocol: "TCP", percentage: 15 },
  { application: "Email Services", bandwidth: 89, protocol: "SMTP", percentage: 11 },
  { application: "Other", bandwidth: 19, protocol: "Mixed", percentage: 2 },
];

const activeAlerts = [
  { id: 1, severity: "critical", device: "Core-Switch-02", metric: "CPU Utilization", value: "91%", threshold: "85%", time: "2 minutes ago" },
  { id: 2, severity: "warning", device: "Firewall-Main", metric: "Memory Usage", value: "82%", threshold: "80%", time: "15 minutes ago" },
  { id: 3, severity: "warning", device: "Core-Router-01", metric: "Packet Loss", value: "3.2%", threshold: "2%", time: "28 minutes ago" },
  { id: 4, severity: "info", device: "Edge-Switch-03", metric: "Interface Errors", value: "127 errors/sec", threshold: "100 errors/sec", time: "1 hour ago" },
];

const PerformanceMonitoring = () => {
  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      healthy: "default",
      warning: "secondary",
      critical: "destructive",
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  const getSeverityBadge = (severity: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      critical: "destructive",
      warning: "secondary",
      info: "outline",
    };
    return <Badge variant={variants[severity] || "outline"}>{severity}</Badge>;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitoring</h1>
          <p className="text-muted-foreground">Real-time network infrastructure health and performance tracking</p>
        </div>
        <Badge className="text-sm px-3 py-1">
          <Activity className="h-4 w-4 mr-2" />
          Live Monitoring
        </Badge>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              Network Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-success">99.97%</div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              Avg Bandwidth Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">548 Mbps</div>
            <p className="text-xs text-muted-foreground mt-1">72% of capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-accent" />
              Avg Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">18.5 ms</div>
            <p className="text-xs text-muted-foreground mt-1">Within threshold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-warning">4</div>
            <p className="text-xs text-muted-foreground mt-1">2 critical, 2 warnings</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Device Monitoring</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Analysis</TabsTrigger>
          <TabsTrigger value="alerts">Alerts & Thresholds</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Network Throughput Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Network className="h-4 w-4" />
                  Network Throughput (Mbps)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={networkThroughput}>
                    <defs>
                      <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Area type="monotone" dataKey="inbound" stroke="hsl(var(--primary))" fill="url(#inbound)" name="Inbound" />
                    <Area type="monotone" dataKey="outbound" stroke="hsl(var(--accent))" fill="url(#outbound)" name="Outbound" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Latency & Jitter Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Latency & Jitter (ms)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={latencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="latency" stroke="hsl(var(--primary))" strokeWidth={2} name="Latency" dot={false} />
                    <Line type="monotone" dataKey="jitter" stroke="hsl(var(--warning))" strokeWidth={2} name="Jitter" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Top Bandwidth Consumers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="h-4 w-4" />
                Top Bandwidth Consumers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={topBandwidthConsumers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="application" stroke="hsl(var(--muted-foreground))" fontSize={12} angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} label={{ value: 'Mbps', angle: -90, position: 'insideLeft' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '6px',
                    }}
                  />
                  <Bar dataKey="bandwidth" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Device Monitoring Tab */}
        <TabsContent value="devices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Network Device Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {deviceMetrics.map((device, index) => (
                  <div key={index} className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-primary" />
                        <div>
                          <h3 className="font-semibold">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">{device.type}</p>
                        </div>
                      </div>
                      {getStatusBadge(device.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">CPU</p>
                          <p className="font-semibold">{device.cpu}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Memory</p>
                          <p className="font-semibold">{device.memory}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Uptime</p>
                          <p className="font-semibold">{device.uptime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Latency</p>
                          <p className="font-semibold">{device.latency}ms</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Traffic Analysis Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Traffic by Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topBandwidthConsumers.map((app, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{app.application}</span>
                        <span className="text-muted-foreground">{app.bandwidth} Mbps ({app.percentage}%)</span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${app.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Protocol Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topBandwidthConsumers.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Network className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{app.protocol}</p>
                          <p className="text-sm text-muted-foreground">{app.application}</p>
                        </div>
                      </div>
                      <Badge>{app.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Alerts & Thresholds Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Performance Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeAlerts.map((alert) => (
                  <div key={alert.id} className="border border-border rounded-lg p-4 hover:bg-accent/5 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getSeverityBadge(alert.severity)}
                        <span className="font-semibold">{alert.device}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{alert.time}</span>
                    </div>
                    <p className="text-sm mb-2">{alert.metric}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Current: </span>
                        <span className="font-semibold text-warning">{alert.value}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Threshold: </span>
                        <span className="font-semibold">{alert.threshold}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Threshold Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Configured Thresholds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">CPU Utilization</p>
                    <p className="text-sm text-muted-foreground">Critical when exceeds threshold</p>
                  </div>
                  <Badge variant="outline">85%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Memory Usage</p>
                    <p className="text-sm text-muted-foreground">Warning when exceeds threshold</p>
                  </div>
                  <Badge variant="outline">80%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Packet Loss</p>
                    <p className="text-sm text-muted-foreground">Critical when exceeds threshold</p>
                  </div>
                  <Badge variant="outline">2%</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium">Interface Errors</p>
                    <p className="text-sm text-muted-foreground">Warning when exceeds threshold</p>
                  </div>
                  <Badge variant="outline">100 errors/sec</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceMonitoring;
