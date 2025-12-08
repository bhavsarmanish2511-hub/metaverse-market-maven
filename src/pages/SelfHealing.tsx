import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Settings,
  Brain,
  Play,
  Pause,
  TrendingUp,
  Shield,
  Network,
  GitBranch,
  History,
  Eye,
  Workflow
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";

// Mock data for active healing actions
const activeHealingActions = [
  {
    id: 1,
    timestamp: "2024-01-20 14:45:00",
    issue: "High CPU Usage Detected",
    device: "Core-SW-01",
    severity: "high",
    action: "Restarting non-critical services",
    status: "executing",
    progress: 65,
    estimatedCompletion: "30 seconds",
    confidence: 94
  },
  {
    id: 2,
    timestamp: "2024-01-20 14:42:00",
    issue: "Link Congestion",
    device: "Edge-RTR-02",
    severity: "medium",
    action: "Rerouting traffic via backup path",
    status: "completed",
    progress: 100,
    estimatedCompletion: "Completed",
    confidence: 89
  },
  {
    id: 3,
    timestamp: "2024-01-20 14:40:00",
    issue: "Memory Leak Detected",
    device: "Dist-SW-03",
    severity: "high",
    action: "Isolating affected process",
    status: "pending_approval",
    progress: 0,
    estimatedCompletion: "Awaiting approval",
    confidence: 78
  },
];

// Mock data for healing workflows
const healingWorkflows = [
  {
    id: 1,
    name: "High CPU Remediation",
    description: "Auto-restart non-critical services when CPU > 90%",
    trigger: "CPU usage > 90% for 10 minutes",
    actions: ["Identify non-critical processes", "Gracefully restart services", "Verify CPU reduction", "Log action"],
    enabled: true,
    executions: 45,
    successRate: 94,
    avgTime: "2.3 min"
  },
  {
    id: 2,
    name: "Traffic Rerouting",
    description: "Automatically reroute traffic around congested links",
    trigger: "Link utilization > 85% for 5 minutes",
    actions: ["Identify alternate paths", "Calculate OSPF costs", "Update routing", "Monitor new path"],
    enabled: true,
    executions: 28,
    successRate: 91,
    avgTime: "45 sec"
  },
  {
    id: 3,
    name: "Security Threat Isolation",
    description: "Isolate compromised network segments automatically",
    trigger: "Security threat detected with confidence > 80%",
    actions: ["Identify affected segment", "Apply ACLs", "Notify security team", "Create incident ticket"],
    enabled: true,
    executions: 12,
    successRate: 100,
    avgTime: "1.2 min"
  },
  {
    id: 4,
    name: "Interface Flap Recovery",
    description: "Restore flapping interfaces automatically",
    trigger: "Interface state changes > 5 times in 2 minutes",
    actions: ["Disable interface", "Wait 30 seconds", "Clear error counters", "Re-enable interface"],
    enabled: true,
    executions: 67,
    successRate: 87,
    avgTime: "1.5 min"
  },
  {
    id: 5,
    name: "Bandwidth Adjustment",
    description: "Dynamically adjust bandwidth allocation",
    trigger: "Application latency > threshold for 3 minutes",
    actions: ["Identify traffic class", "Calculate required bandwidth", "Update QoS policies", "Verify latency improvement"],
    enabled: false,
    executions: 0,
    successRate: 0,
    avgTime: "N/A"
  },
];

// Mock data for healing history
const healingHistory = [
  {
    id: 1,
    timestamp: "2024-01-20 13:30:00",
    issue: "Interface Down",
    device: "Access-SW-10",
    workflow: "Interface Flap Recovery",
    result: "success",
    duration: "1.2 min",
    humanIntervention: false
  },
  {
    id: 2,
    timestamp: "2024-01-20 12:15:00",
    issue: "DDoS Attack",
    device: "FW-01",
    workflow: "Security Threat Isolation",
    result: "success",
    duration: "1.5 min",
    humanIntervention: false
  },
  {
    id: 3,
    timestamp: "2024-01-20 11:00:00",
    issue: "Memory Exhaustion",
    device: "Core-SW-01",
    workflow: "High CPU Remediation",
    result: "partial",
    duration: "3.2 min",
    humanIntervention: true
  },
  {
    id: 4,
    timestamp: "2024-01-20 10:45:00",
    issue: "BGP Session Down",
    device: "Edge-RTR-02",
    workflow: "Traffic Rerouting",
    result: "success",
    duration: "52 sec",
    humanIntervention: false
  },
];

// Mock data for learning metrics
const learningMetrics = [
  { month: "Jul", autonomy: 65, success: 82 },
  { month: "Aug", autonomy: 71, success: 85 },
  { month: "Sep", autonomy: 76, success: 88 },
  { month: "Oct", autonomy: 82, success: 91 },
  { month: "Nov", autonomy: 87, success: 93 },
  { month: "Dec", autonomy: 92, success: 95 },
];

const SelfHealing = () => {
  const [darkNocMode, setDarkNocMode] = useState(false);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{severity}</Badge>;
      case "high":
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">{severity}</Badge>;
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
      case "executing":
        return <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
          <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
          {status}
        </Badge>;
      case "completed":
      case "success":
        return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">{status}</Badge>;
      case "pending_approval":
        return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">pending approval</Badge>;
      case "partial":
        return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">{status}</Badge>;
      case "failed":
        return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Self-Healing Network</h1>
          <p className="text-muted-foreground">
            Autonomous issue detection, remediation, and continuous learning
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Dark NOC Mode</span>
            <Switch checked={darkNocMode} onCheckedChange={setDarkNocMode} />
          </div>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Autonomy Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3" /> +5% vs last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Healings</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">
              1 executing, 2 pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95%</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.8 min</div>
            <p className="text-xs text-muted-foreground">
              35% faster than manual
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">
            <Activity className="h-4 w-4 mr-2" />
            Active Healings
          </TabsTrigger>
          <TabsTrigger value="workflows">
            <Workflow className="h-4 w-4 mr-2" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="learning">
            <Brain className="h-4 w-4 mr-2" />
            AI Learning
          </TabsTrigger>
        </TabsList>

        {/* Active Healings Tab */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Healing Actions</CardTitle>
                  <CardDescription>Real-time autonomous remediation in progress</CardDescription>
                </div>
                <Badge variant="outline" className="text-sm">
                  <Activity className="h-3 w-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeHealingActions.map((action) => (
                  <Card key={action.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Zap className="h-5 w-5 text-yellow-500" />
                            <div>
                              <CardTitle className="text-base">{action.issue}</CardTitle>
                              <CardDescription>{action.device} • {action.timestamp}</CardDescription>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {getSeverityBadge(action.severity)}
                          {getStatusBadge(action.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Action Details */}
                      <div>
                        <div className="text-sm font-medium mb-2">Remediation Action:</div>
                        <div className="text-sm text-muted-foreground">{action.action}</div>
                      </div>

                      {/* Progress */}
                      {action.status === "executing" && (
                        <div>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span>Progress</span>
                            <span className="font-semibold">{action.progress}%</span>
                          </div>
                          <Progress value={action.progress} className="h-2" />
                        </div>
                      )}

                      {/* Metrics */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground mb-1">AI Confidence</div>
                          <div className="font-semibold flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            {action.confidence}%
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">Completion</div>
                          <div className="font-semibold">{action.estimatedCompletion}</div>
                        </div>
                        <div className="flex gap-2">
                          {action.status === "pending_approval" && (
                            <>
                              <Button size="sm" variant="outline">
                                <Eye className="h-3 w-3 mr-2" />
                                Review
                              </Button>
                              <Button size="sm">
                                <Play className="h-3 w-3 mr-2" />
                                Approve
                              </Button>
                            </>
                          )}
                          {action.status === "executing" && (
                            <Button size="sm" variant="outline">
                              <Pause className="h-3 w-3 mr-2" />
                              Pause
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {activeHealingActions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No active healing actions</p>
                    <p className="text-sm">Network operating normally</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Automated Healing Workflows</CardTitle>
                  <CardDescription>Pre-configured remediation playbooks</CardDescription>
                </div>
                <Button>
                  <GitBranch className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {healingWorkflows.map((workflow) => (
                    <Card key={workflow.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-base">{workflow.name}</CardTitle>
                              <Switch checked={workflow.enabled} />
                            </div>
                            <CardDescription>{workflow.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Trigger */}
                        <div>
                          <div className="text-sm font-medium mb-2">Trigger Condition:</div>
                          <Badge variant="outline" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {workflow.trigger}
                          </Badge>
                        </div>

                        {/* Actions */}
                        <div>
                          <div className="text-sm font-medium mb-2">Remediation Steps:</div>
                          <div className="space-y-1">
                            {workflow.actions.map((action, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-xs">
                                  {idx + 1}
                                </div>
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Executions</div>
                            <div className="text-lg font-bold">{workflow.executions}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
                            <div className="text-lg font-bold text-green-500">{workflow.successRate}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">Avg Time</div>
                            <div className="text-lg font-bold">{workflow.avgTime}</div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm">
                            <Settings className="h-3 w-3 mr-2" />
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            <Play className="h-3 w-3 mr-2" />
                            Test
                          </Button>
                          <Button variant="outline" size="sm">
                            <History className="h-3 w-3 mr-2" />
                            View Logs
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Healing Action History</CardTitle>
              <CardDescription>Complete audit trail of all autonomous remediations</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Workflow</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Human Intervention</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {healingHistory.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell className="text-sm">{entry.timestamp}</TableCell>
                        <TableCell className="font-medium">{entry.issue}</TableCell>
                        <TableCell>{entry.device}</TableCell>
                        <TableCell className="text-sm">{entry.workflow}</TableCell>
                        <TableCell>{entry.duration}</TableCell>
                        <TableCell>{getStatusBadge(entry.result)}</TableCell>
                        <TableCell>
                          {entry.humanIntervention ? (
                            <Badge variant="outline" className="text-xs">Yes</Badge>
                          ) : (
                            <Badge className="bg-green-500/10 text-green-500 text-xs">Autonomous</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Learning Tab */}
        <TabsContent value="learning" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Learning Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Continuous Learning Progress</CardTitle>
                <CardDescription>AI improvement over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {learningMetrics.map((metric) => (
                    <div key={metric.month} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{metric.month}</span>
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            Autonomy: <span className="font-semibold text-foreground">{metric.autonomy}%</span>
                          </span>
                          <span className="text-muted-foreground">
                            Success: <span className="font-semibold text-foreground">{metric.success}%</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Progress value={metric.autonomy} className="h-2" />
                        </div>
                        <div className="flex-1">
                          <Progress value={metric.success} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 border rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="font-semibold">+27% autonomy increase</span>
                    <span className="text-muted-foreground">in 6 months</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Learning Insights */}
            <Card>
              <CardHeader>
                <CardTitle>AI Learning Insights</CardTitle>
                <CardDescription>System intelligence improvements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">New Pattern Detected</div>
                      <div className="text-sm text-muted-foreground">
                        System identified correlation between CPU spikes and memory fragmentation
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">2 days ago</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">Workflow Optimized</div>
                      <div className="text-sm text-muted-foreground">
                        Traffic Rerouting workflow now 23% faster based on historical data
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">5 days ago</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">Prediction Accuracy Improved</div>
                      <div className="text-sm text-muted-foreground">
                        Anomaly detection confidence increased from 78% to 91%
                      </div>
                      <Badge variant="outline" className="text-xs mt-2">1 week ago</Badge>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Brain className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-semibold text-sm mb-1">New Workflow Suggested</div>
                      <div className="text-sm text-muted-foreground">
                        AI recommends creating automated response for BGP flapping scenarios
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Button size="sm" variant="outline">Review</Button>
                        <Button size="sm">Create</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dark NOC Progress */}
          <Card>
            <CardHeader>
              <CardTitle>Dark NOC Readiness</CardTitle>
              <CardDescription>Progress toward fully autonomous network operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Autonomy</span>
                    <span className="text-2xl font-bold text-blue-500">92%</span>
                  </div>
                  <Progress value={92} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    92% of incidents resolved without human intervention
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Auto-Detection</div>
                    <div className="text-2xl font-bold">98%</div>
                    <Progress value={98} className="h-1 mt-2" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Auto-Remediation</div>
                    <div className="text-2xl font-bold">87%</div>
                    <Progress value={87} className="h-1 mt-2" />
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Trust Score</div>
                    <div className="text-2xl font-bold">94%</div>
                    <Progress value={94} className="h-1 mt-2" />
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

export default SelfHealing;
