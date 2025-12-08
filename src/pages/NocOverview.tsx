import { Network, Activity, AlertTriangle, Settings, Wrench, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const nocModules = [
  {
    title: "Network Performance",
    icon: Activity,
    description: "Real-time monitoring of network bandwidth and latency",
    status: "Active",
    metrics: "1.2 Gbps throughput",
  },
  {
    title: "Fault Management",
    icon: AlertTriangle,
    description: "Automated detection and alerting of network issues",
    status: "Active",
    metrics: "2 active faults",
  },
  {
    title: "Configuration Management",
    icon: Settings,
    description: "Centralized network device configuration and versioning",
    status: "Active",
    metrics: "247 devices managed",
  },
  {
    title: "Traffic Analysis",
    icon: Activity,
    description: "Deep packet inspection and flow analysis",
    status: "Active",
    metrics: "5.2M flows/min",
  },
  {
    title: "Predictive Maintenance",
    icon: Wrench,
    description: "AI-driven predictive failure analysis and maintenance",
    status: "Active",
    metrics: "12 predictions made",
  },
  {
    title: "Self-Healing Framework",
    icon: Shield,
    description: "Autonomous network recovery and optimization",
    status: "Active",
    metrics: "34 auto-fixes today",
  },
];

export default function NocOverview() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-noc/10">
                <Network className="h-6 w-6 text-noc" />
              </div>
              <h1 className="text-3xl font-bold text-gradient-noc">Network Operations Center</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered network monitoring and optimization
            </p>
          </div>
          <Badge variant="outline" className="bg-noc/10 text-noc border-noc/20 w-fit">
            All Systems Operational
          </Badge>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-noc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Network Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-noc">99.97%</p>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>
          <Card className="border-noc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Bandwidth Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-noc">67%</p>
              <p className="text-xs text-muted-foreground mt-1">1.2 Gbps / 1.8 Gbps</p>
            </CardContent>
          </Card>
          <Card className="border-noc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Latency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-noc">12ms</p>
              <p className="text-xs text-muted-foreground mt-1">Across all links</p>
            </CardContent>
          </Card>
          <Card className="border-noc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Packet Loss
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-noc">0.03%</p>
              <p className="text-xs text-muted-foreground mt-1">Well within SLA</p>
            </CardContent>
          </Card>
        </div>

        {/* NOC Modules */}
        <div>
          <h2 className="text-2xl font-bold mb-4">NOC Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nocModules.map((module) => (
              <Card 
                key={module.title}
                className="hover:shadow-lg transition-smooth hover:border-noc/50 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-noc/10">
                      <module.icon className="h-5 w-5 text-noc" />
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      {module.status}
                    </Badge>
                  </div>
                  <CardTitle className="mt-4">{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{module.metrics}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Network Health */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Network Health</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Infrastructure Status</CardTitle>
                <CardDescription>Core network components health</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Core Routers', status: 'Healthy', value: '100%' },
                  { name: 'Edge Switches', status: 'Healthy', value: '98%' },
                  { name: 'Firewalls', status: 'Healthy', value: '100%' },
                  { name: 'Load Balancers', status: 'Warning', value: '85%' },
                  { name: 'DNS Servers', status: 'Healthy', value: '100%' },
                  { name: 'VPN Gateways', status: 'Healthy', value: '99%' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-sm font-medium">{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{item.value}</span>
                      <Badge 
                        variant="outline" 
                        className={
                          item.status === 'Healthy' 
                            ? 'bg-success/10 text-success border-success/20'
                            : 'bg-warning/10 text-warning border-warning/20'
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Self-Healing Actions</CardTitle>
                <CardDescription>Autonomous recovery actions taken today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { action: 'Auto-rerouted traffic', time: '2 hours ago', impact: 'Prevented outage' },
                  { action: 'Load balanced connections', time: '4 hours ago', impact: 'Improved performance' },
                  { action: 'Restarted failing service', time: '6 hours ago', impact: 'Restored availability' },
                  { action: 'Updated routing tables', time: '8 hours ago', impact: 'Optimized paths' },
                  { action: 'Cleared cache overflow', time: '10 hours ago', impact: 'Freed resources' },
                ].map((item, index) => (
                  <div key={index} className="p-3 rounded-md bg-noc/5 border border-noc/20">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-sm font-medium">{item.action}</span>
                      <span className="text-xs text-muted-foreground">{item.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{item.impact}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
