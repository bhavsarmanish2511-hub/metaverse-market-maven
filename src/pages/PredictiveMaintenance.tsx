import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  TrendingUp, 
  Zap,
  Server,
  Cpu,
  HardDrive,
  Thermometer,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export default function PredictiveMaintenance() {
  const predictions = [
    {
      id: 1,
      device: "Core Switch SW-01",
      component: "Power Supply Unit",
      health: 45,
      prediction: "Failure predicted in 7 days",
      confidence: 92,
      severity: "high",
      metrics: { temp: 78, voltage: 11.2, runtime: 8760 }
    },
    {
      id: 2,
      device: "Router RTR-DC-01",
      component: "Cooling Fan",
      health: 68,
      prediction: "Degradation detected - 14 days",
      confidence: 85,
      severity: "medium",
      metrics: { temp: 65, rpm: 4200, runtime: 12500 }
    },
    {
      id: 3,
      device: "Firewall FW-EDGE-02",
      component: "Memory Module",
      health: 55,
      prediction: "Failure predicted in 10 days",
      confidence: 88,
      severity: "high",
      metrics: { errors: 45, utilization: 92, temp: 71 }
    },
    {
      id: 4,
      device: "UPS-MAIN-A",
      component: "Battery Bank",
      health: 72,
      prediction: "Capacity degradation - 21 days",
      confidence: 79,
      severity: "medium",
      metrics: { capacity: 72, cycles: 280, voltage: 47.8 }
    }
  ];

  const anomalies = [
    {
      device: "Core Switch SW-01",
      metric: "Temperature",
      baseline: "62°C",
      current: "78°C",
      deviation: "+25.8%",
      detected: "2 hours ago"
    },
    {
      device: "Router RTR-DC-01",
      metric: "Packet Error Rate",
      baseline: "0.02%",
      current: "0.18%",
      deviation: "+800%",
      detected: "45 minutes ago"
    },
    {
      device: "Firewall FW-EDGE-02",
      metric: "Memory Errors",
      baseline: "2/day",
      current: "45/day",
      deviation: "+2150%",
      detected: "1 hour ago"
    }
  ];

  const maintenanceSchedule = [
    {
      device: "Core Switch SW-01",
      action: "Replace Power Supply Unit",
      scheduled: "2025-12-04",
      window: "02:00 - 04:00 UTC",
      status: "scheduled",
      automated: false
    },
    {
      device: "Router RTR-DC-01",
      action: "Replace Cooling Fan Assembly",
      scheduled: "2025-12-08",
      window: "03:00 - 04:30 UTC",
      status: "scheduled",
      automated: false
    },
    {
      device: "Load Balancer LB-03",
      action: "Firmware Update & Health Check",
      scheduled: "2025-12-01",
      window: "01:00 - 02:00 UTC",
      status: "approved",
      automated: true
    },
    {
      device: "UPS-MAIN-A",
      action: "Battery Bank Replacement",
      scheduled: "2025-12-15",
      window: "00:00 - 06:00 UTC",
      status: "pending",
      automated: false
    }
  ];

  const aiInsights = [
    {
      title: "Pattern Recognition",
      description: "ML model detected correlation between temperature spikes and increased error rates in core switches.",
      impact: "High",
      action: "Review cooling infrastructure"
    },
    {
      title: "Predictive Accuracy",
      description: "Last 30 days: 94.2% prediction accuracy with 2.1 day average early warning time.",
      impact: "Info",
      action: "Model performing optimally"
    },
    {
      title: "Cost Optimization",
      description: "Predictive maintenance has reduced emergency repair costs by 67% vs. reactive approach.",
      impact: "Medium",
      action: "Continue current strategy"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'text-error border-error';
      case 'medium':
        return 'text-warning border-warning';
      default:
        return 'text-success border-success';
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 70) return 'bg-success';
    if (health >= 50) return 'bg-warning';
    return 'bg-error';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary/10 text-primary';
      case 'approved':
        return 'bg-success/10 text-success';
      case 'pending':
        return 'bg-warning/10 text-warning';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Predictive Maintenance</h1>
        <p className="text-muted-foreground">
          AI-powered infrastructure health monitoring and failure prediction
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Devices Monitored
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">248</span>
              <Server className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-success mt-2">+12 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Predictions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">4</span>
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prediction Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">94.2%</span>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <p className="text-xs text-success mt-2">+2.1% vs last period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Prevented Failures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-bold">23</span>
              <CheckCircle2 className="h-4 w-4 text-success" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="predictions">Failure Predictions</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="schedule">Maintenance Schedule</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-4">
          {predictions.map((prediction) => (
            <Card key={prediction.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{prediction.device}</CardTitle>
                    <CardDescription>{prediction.component}</CardDescription>
                  </div>
                  <Badge variant="outline" className={getSeverityColor(prediction.severity)}>
                    {prediction.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="ml-2">
                    <strong>{prediction.prediction}</strong> (Confidence: {prediction.confidence}%)
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Equipment Health</span>
                    <span className="font-medium">{prediction.health}%</span>
                  </div>
                  <Progress value={prediction.health} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  {Object.entries(prediction.metrics).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-xs text-muted-foreground capitalize">{key}</p>
                      <p className="text-sm font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="default">
                    <Clock className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Dismiss</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Anomaly Detection</CardTitle>
              <CardDescription>
                ML-powered baseline deviation alerts for proactive monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {anomalies.map((anomaly, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          <Activity className="h-4 w-4 text-warning" />
                          {anomaly.device}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Metric: <span className="font-medium">{anomaly.metric}</span>
                        </p>
                      </div>
                      <Badge variant="outline" className="text-warning border-warning">
                        Anomaly
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Baseline</p>
                        <p className="font-medium">{anomaly.baseline}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Current</p>
                        <p className="font-medium text-warning">{anomaly.current}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deviation</p>
                        <p className="font-medium text-error">{anomaly.deviation}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t">
                      <p className="text-xs text-muted-foreground">
                        Detected {anomaly.detected}
                      </p>
                      <Button size="sm" variant="outline">Investigate</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Maintenance</CardTitle>
              <CardDescription>
                Proactive maintenance windows based on predictive analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceSchedule.map((item, idx) => (
                  <div key={idx} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-semibold">{item.device}</h4>
                        <p className="text-sm text-muted-foreground">{item.action}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.automated && (
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                            <Zap className="h-3 w-3 mr-1" />
                            Automated
                          </Badge>
                        )}
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Scheduled Date</p>
                        <p className="font-medium">{item.scheduled}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Maintenance Window</p>
                        <p className="font-medium">{item.window}</p>
                      </div>
                    </div>

                    {item.status === 'pending' && (
                      <div className="flex gap-2 pt-2 border-t">
                        <Button size="sm" variant="default">
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">Reschedule</Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  ML Model Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prediction Accuracy</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">False Positive Rate</span>
                    <span className="font-medium">5.8%</span>
                  </div>
                  <Progress value={5.8} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Early Warning Time</span>
                    <span className="font-medium">2.1 days avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Cost Optimization
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Emergency Repairs Avoided</p>
                  <p className="text-2xl font-bold text-success">$127,450</p>
                  <p className="text-xs text-success">vs. reactive maintenance</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Downtime Prevented</p>
                  <p className="text-2xl font-bold text-success">847 hours</p>
                  <p className="text-xs text-muted-foreground">Last 90 days</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>
                Machine learning analysis and recommendations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold">{insight.title}</h4>
                    <Badge variant="outline">{insight.impact}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.description}</p>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      Recommended Action: {insight.action}
                    </p>
                    <Button size="sm" variant="outline">View Report</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
