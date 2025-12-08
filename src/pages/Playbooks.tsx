import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play,
  Pause,
  CheckCircle2,
  AlertCircle,
  Clock,
  GitBranch,
  Zap,
  TrendingUp,
  FileText,
  Plus,
  Settings,
  Eye,
  Edit,
  Copy,
  Trash2,
  Activity,
  ShieldAlert,
  Database,
  Mail,
  Users,
  Server
} from "lucide-react";

interface Playbook {
  id: string;
  name: string;
  description: string;
  category: string;
  triggers: number;
  actions: number;
  avgRunTime: string;
  successRate: number;
  lastRun: string;
  status: "active" | "draft" | "disabled";
  executions: number;
}

interface ExecutionStep {
  id: string;
  name: string;
  status: "completed" | "running" | "pending" | "failed" | "manual_required";
  timestamp?: string;
  duration?: string;
  details?: string;
  manualAction?: string;
}

interface ActiveExecution {
  id: string;
  playbookName: string;
  alertId: string;
  startedAt: string;
  currentStep: number;
  totalSteps: number;
  status: "running" | "paused" | "completed" | "failed";
  steps: ExecutionStep[];
}

const mockPlaybooks: Playbook[] = [
  {
    id: "pb-001",
    name: "Phishing Email Response",
    description: "Automated workflow for analyzing and responding to reported phishing emails",
    category: "Email Security",
    triggers: 3,
    actions: 12,
    avgRunTime: "2m 34s",
    successRate: 94,
    lastRun: "10 minutes ago",
    status: "active",
    executions: 847
  },
  {
    id: "pb-002",
    name: "Malware Containment",
    description: "Isolate infected endpoints and initiate remediation procedures",
    category: "Endpoint Security",
    triggers: 2,
    actions: 8,
    avgRunTime: "1m 12s",
    successRate: 98,
    lastRun: "2 hours ago",
    status: "active",
    executions: 423
  },
  {
    id: "pb-003",
    name: "VirusTotal Enrichment",
    description: "Automatically enrich IOCs with threat intelligence from VirusTotal",
    category: "Threat Intelligence",
    triggers: 5,
    actions: 6,
    avgRunTime: "45s",
    successRate: 99,
    lastRun: "5 minutes ago",
    status: "active",
    executions: 2341
  },
  {
    id: "pb-004",
    name: "Suspicious Login Investigation",
    description: "Investigate and respond to anomalous authentication attempts",
    category: "Identity & Access",
    triggers: 4,
    actions: 10,
    avgRunTime: "3m 20s",
    successRate: 91,
    lastRun: "1 hour ago",
    status: "active",
    executions: 654
  },
  {
    id: "pb-005",
    name: "DDoS Mitigation",
    description: "Automated response to distributed denial of service attacks",
    category: "Network Security",
    triggers: 2,
    actions: 7,
    avgRunTime: "30s",
    successRate: 96,
    lastRun: "3 days ago",
    status: "active",
    executions: 89
  },
  {
    id: "pb-006",
    name: "Data Exfiltration Alert",
    description: "Detect and respond to unauthorized data transfers",
    category: "Data Loss Prevention",
    triggers: 3,
    actions: 9,
    avgRunTime: "2m 10s",
    successRate: 89,
    lastRun: "Never",
    status: "draft",
    executions: 0
  }
];

const mockActiveExecutions: ActiveExecution[] = [
  {
    id: "exec-001",
    playbookName: "Phishing Email Response",
    alertId: "ALT-2024-0428",
    startedAt: "2024-01-27 14:32:10",
    currentStep: 4,
    totalSteps: 12,
    status: "paused",
    steps: [
      {
        id: "step-1",
        name: "Extract Email Headers",
        status: "completed",
        timestamp: "14:32:11",
        duration: "2s",
        details: "Successfully extracted sender, recipient, and routing information"
      },
      {
        id: "step-2",
        name: "Analyze URLs",
        status: "completed",
        timestamp: "14:32:13",
        duration: "5s",
        details: "Found 2 suspicious URLs. Threat score: 85/100"
      },
      {
        id: "step-3",
        name: "Check Sender Reputation",
        status: "completed",
        timestamp: "14:32:18",
        duration: "3s",
        details: "Sender domain flagged in 4 threat feeds"
      },
      {
        id: "step-4",
        name: "Manual Review Required",
        status: "manual_required",
        timestamp: "14:32:21",
        manualAction: "Analyst decision required: Block sender domain organization-wide?"
      },
      {
        id: "step-5",
        name: "Update Email Filter",
        status: "pending"
      },
      {
        id: "step-6",
        name: "Notify Affected Users",
        status: "pending"
      },
      {
        id: "step-7",
        name: "Create Incident Ticket",
        status: "pending"
      }
    ]
  },
  {
    id: "exec-002",
    playbookName: "Malware Containment",
    alertId: "ALT-2024-0429",
    startedAt: "2024-01-27 14:28:45",
    currentStep: 8,
    totalSteps: 8,
    status: "running",
    steps: [
      {
        id: "step-1",
        name: "Identify Infected Endpoint",
        status: "completed",
        timestamp: "14:28:46",
        duration: "1s"
      },
      {
        id: "step-2",
        name: "Isolate from Network",
        status: "completed",
        timestamp: "14:28:47",
        duration: "3s"
      },
      {
        id: "step-3",
        name: "Kill Malicious Process",
        status: "completed",
        timestamp: "14:28:50",
        duration: "2s"
      },
      {
        id: "step-4",
        name: "Collect Forensic Data",
        status: "completed",
        timestamp: "14:28:52",
        duration: "15s"
      },
      {
        id: "step-5",
        name: "Run Antivirus Scan",
        status: "running",
        timestamp: "14:29:07",
        details: "Scanning... 67% complete"
      }
    ]
  }
];

export default function Playbooks() {
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<ActiveExecution | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "draft": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "disabled": return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      case "completed": return "text-green-500";
      case "running": return "text-blue-500";
      case "pending": return "text-gray-400";
      case "failed": return "text-red-500";
      case "manual_required": return "text-yellow-500";
      default: return "";
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "running": return <Activity className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "pending": return <Clock className="h-5 w-5 text-gray-400" />;
      case "failed": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "manual_required": return <ShieldAlert className="h-5 w-5 text-yellow-500" />;
      default: return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">XDR Playbooks</h1>
        <p className="text-muted-foreground mt-2">
          Automated incident response workflows and orchestration
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Playbooks</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">6 running executions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">+2.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,354</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">328h</div>
            <p className="text-xs text-muted-foreground">Automated this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="repository" className="space-y-4">
        <TabsList>
          <TabsTrigger value="repository">
            <FileText className="h-4 w-4 mr-2" />
            Playbook Repository
          </TabsTrigger>
          <TabsTrigger value="executions">
            <Activity className="h-4 w-4 mr-2" />
            Active Executions
          </TabsTrigger>
        </TabsList>

        {/* Playbook Repository Tab */}
        <TabsContent value="repository" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Playbook Library</h2>
              <p className="text-sm text-muted-foreground">
                Create, manage, and test automated response workflows
              </p>
            </div>
            <Button className="bg-soc hover:bg-soc/90" onClick={() => window.location.href = "/soc/playbooks/designer"}>
              <Plus className="h-4 w-4 mr-2" />
              New Playbook
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockPlaybooks.map((playbook) => (
              <Card key={playbook.id} className="hover:border-soc/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg">{playbook.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {playbook.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(playbook.status)}>
                      {playbook.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{playbook.category}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground mb-1">Triggers</div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="h-3 w-3" />
                        <span className="font-medium">{playbook.triggers}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Actions</div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3" />
                        <span className="font-medium">{playbook.actions}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium">{playbook.successRate}%</span>
                    </div>
                    <Progress value={playbook.successRate} className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground">Avg Runtime:</span>{" "}
                      <span className="font-medium">{playbook.avgRunTime}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Executions:</span>{" "}
                      <span className="font-medium">{playbook.executions}</span>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Last run: {playbook.lastRun}
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline" className="hover:bg-soc/10 hover:text-soc">
                      <Play className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Active Executions Tab */}
        <TabsContent value="executions" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Running Playbooks</h2>
            <p className="text-sm text-muted-foreground">
              Monitor and manage active playbook executions
            </p>
          </div>

          <div className="grid gap-4">
            {mockActiveExecutions.map((execution) => (
              <Card key={execution.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {execution.playbookName}
                        {execution.status === "running" && (
                          <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                        )}
                        {execution.status === "paused" && (
                          <Pause className="h-4 w-4 text-yellow-500" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        Alert ID: {execution.alertId} • Started: {execution.startedAt}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {execution.status === "paused" && (
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Resume
                        </Button>
                      )}
                      {execution.status === "running" && (
                        <Button size="sm" variant="outline">
                          <Pause className="h-3 w-3 mr-1" />
                          Pause
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">
                        Step {execution.currentStep} of {execution.totalSteps}
                      </span>
                    </div>
                    <Progress 
                      value={(execution.currentStep / execution.totalSteps) * 100} 
                      className="h-2"
                    />
                  </div>

                  <ScrollArea className="h-64 rounded-md border p-4">
                    <div className="space-y-4">
                      {execution.steps.map((step, index) => (
                        <div key={step.id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="mt-1">{getStepIcon(step.status)}</div>
                            {index < execution.steps.length - 1 && (
                              <div className="w-px h-12 bg-border my-1" />
                            )}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="flex items-center justify-between">
                              <h4 className={`font-medium ${getStatusColor(step.status)}`}>
                                {step.name}
                              </h4>
                              {step.duration && (
                                <span className="text-xs text-muted-foreground">
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            {step.timestamp && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {step.timestamp}
                              </div>
                            )}
                            {step.details && (
                              <div className="text-sm mt-2 p-2 bg-secondary/50 rounded">
                                {step.details}
                              </div>
                            )}
                            {step.manualAction && (
                              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                <div className="flex items-start gap-2">
                                  <ShieldAlert className="h-4 w-4 text-yellow-500 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="text-sm font-medium text-yellow-500 mb-2">
                                      Manual Action Required
                                    </div>
                                    <div className="text-sm mb-3">{step.manualAction}</div>
                                    <div className="flex gap-2">
                                      <Button size="sm" className="bg-soc hover:bg-soc/90">
                                        Approve & Block Domain
                                      </Button>
                                      <Button size="sm" variant="outline">
                                        Skip This Step
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
