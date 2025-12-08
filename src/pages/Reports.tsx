import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { FileText, Download, Calendar, CheckCircle, AlertTriangle, Shield, FileDown, Clock, TrendingUp, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const complianceFrameworks = [
  { id: "pci-dss", name: "PCI-DSS", score: 87, status: "compliant", controls: 234, passed: 204, failed: 30 },
  { id: "hipaa", name: "HIPAA", score: 92, status: "compliant", controls: 164, passed: 151, failed: 13 },
  { id: "gdpr", name: "GDPR", score: 78, status: "partial", controls: 186, passed: 145, failed: 41 },
  { id: "iso27001", name: "ISO 27001", score: 85, status: "compliant", controls: 312, passed: 265, failed: 47 },
];

const reportTemplates = [
  { id: 1, name: "Executive Security Summary", framework: "All", frequency: "Weekly", lastGenerated: "2024-01-15", format: "PDF" },
  { id: 2, name: "PCI-DSS Compliance Report", framework: "PCI-DSS", frequency: "Monthly", lastGenerated: "2024-01-10", format: "PDF" },
  { id: 3, name: "Incident Response Report", framework: "All", frequency: "On-Demand", lastGenerated: "2024-01-14", format: "PDF/CSV" },
  { id: 4, name: "Vulnerability Assessment", framework: "ISO 27001", frequency: "Bi-Weekly", lastGenerated: "2024-01-12", format: "PDF" },
  { id: 5, name: "HIPAA Audit Trail", framework: "HIPAA", frequency: "Monthly", lastGenerated: "2024-01-08", format: "CSV" },
  { id: 6, name: "GDPR Data Protection Report", framework: "GDPR", frequency: "Quarterly", lastGenerated: "2024-01-01", format: "PDF" },
];

const auditTrail = [
  { id: 1, timestamp: "2024-01-15 14:32:18", user: "john.doe@company.com", action: "Generated PCI-DSS Report", resource: "Report #2341", status: "success" },
  { id: 2, timestamp: "2024-01-15 13:45:22", user: "jane.smith@company.com", action: "Modified Compliance Policy", resource: "HIPAA-2024", status: "success" },
  { id: 3, timestamp: "2024-01-15 12:18:45", user: "admin@company.com", action: "Exported Audit Trail", resource: "audit_2024_01.csv", status: "success" },
  { id: 4, timestamp: "2024-01-15 11:22:33", user: "security.analyst@company.com", action: "Updated Control Status", resource: "Control-334", status: "success" },
  { id: 5, timestamp: "2024-01-15 10:05:12", user: "compliance.officer@company.com", action: "Scheduled Report Generation", resource: "Report #2342", status: "success" },
  { id: 6, timestamp: "2024-01-15 09:30:44", user: "john.doe@company.com", action: "Failed Authentication Attempt", resource: "Reports Dashboard", status: "failed" },
];

const executiveMetrics = [
  { metric: "Overall Compliance Score", value: "85%", change: "+3%", trend: "up" },
  { metric: "Open Findings", value: "127", change: "-12", trend: "down" },
  { metric: "Critical Controls", value: "98%", change: "+2%", trend: "up" },
  { metric: "Audit Readiness", value: "92%", change: "+5%", trend: "up" },
];

const complianceTrend = [
  { month: "Jul", "PCI-DSS": 82, "HIPAA": 88, "GDPR": 75, "ISO 27001": 80 },
  { month: "Aug", "PCI-DSS": 84, "HIPAA": 89, "GDPR": 76, "ISO 27001": 82 },
  { month: "Sep", "PCI-DSS": 85, "HIPAA": 90, "GDPR": 77, "ISO 27001": 83 },
  { month: "Oct", "PCI-DSS": 86, "HIPAA": 91, "GDPR": 76, "ISO 27001": 84 },
  { month: "Nov", "PCI-DSS": 86, "HIPAA": 91, "GDPR": 77, "ISO 27001": 84 },
  { month: "Dec", "PCI-DSS": 87, "HIPAA": 92, "GDPR": 78, "ISO 27001": 85 },
];

const controlStatus = [
  { name: "Passed", value: 765, color: "hsl(var(--chart-2))" },
  { name: "Failed", value: 131, color: "hsl(var(--chart-1))" },
  { name: "Pending Review", value: 48, color: "hsl(var(--chart-3))" },
];

const Reports = () => {
  const [selectedFramework, setSelectedFramework] = useState("all");
  const { toast } = useToast();

  const handleExport = (format: string, reportName: string) => {
    toast({
      title: "Export Started",
      description: `Generating ${reportName} in ${format} format...`,
    });
  };

  const handleGenerateReport = (templateId: number) => {
    toast({
      title: "Report Generation Started",
      description: "Your report is being generated and will be available shortly.",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Reporting & Compliance
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive compliance monitoring and audit trail management
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport("CSV", "Audit Trail")}>
            <FileDown className="mr-2 h-4 w-4" />
            Export Audit Trail
          </Button>
          <Button onClick={() => handleExport("PDF", "Executive Summary")}>
            <Download className="mr-2 h-4 w-4" />
            Generate Summary
          </Button>
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard">Executive Dashboard</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Monitoring</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
        </TabsList>

        {/* Executive Dashboard */}
        <TabsContent value="dashboard" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {executiveMetrics.map((metric, idx) => (
              <Card key={idx} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">{metric.metric}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <p className="text-3xl font-bold text-foreground">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      {metric.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-chart-2" />
                      ) : (
                        <TrendingUp className="h-4 w-4 text-chart-1 rotate-180" />
                      )}
                      <span className={metric.trend === "up" ? "text-chart-2" : "text-chart-1"}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Compliance Trend */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Compliance Score Trends
                </CardTitle>
                <CardDescription>6-month compliance framework scores</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={complianceTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="PCI-DSS" stroke="hsl(var(--chart-1))" strokeWidth={2} />
                    <Line type="monotone" dataKey="HIPAA" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                    <Line type="monotone" dataKey="GDPR" stroke="hsl(var(--chart-3))" strokeWidth={2} />
                    <Line type="monotone" dataKey="ISO 27001" stroke="hsl(var(--chart-4))" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Control Status Distribution */}
            <Card className="border-border/50 bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Control Status Distribution
                </CardTitle>
                <CardDescription>Current status of all security controls</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={controlStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {controlStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px"
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Report Templates */}
        <TabsContent value="templates" className="space-y-6">
          <div className="flex gap-4 items-center mb-4">
            <Select value={selectedFramework} onValueChange={setSelectedFramework}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="pci-dss">PCI-DSS</SelectItem>
                <SelectItem value="hipaa">HIPAA</SelectItem>
                <SelectItem value="gdpr">GDPR</SelectItem>
                <SelectItem value="iso27001">ISO 27001</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTemplates.map((template) => (
              <Card key={template.id} className="border-border/50 bg-card/50 backdrop-blur hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="h-8 w-8 text-primary" />
                    <Badge variant={template.frequency === "On-Demand" ? "secondary" : "default"}>
                      {template.frequency}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg mt-4">{template.name}</CardTitle>
                  <CardDescription>{template.framework}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="font-medium">{template.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Generated:</span>
                      <span className="font-medium">{template.lastGenerated}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleGenerateReport(template.id)}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Generate
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleExport("PDF", template.name)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Compliance Monitoring */}
        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complianceFrameworks.map((framework) => (
              <Card key={framework.id} className="border-border/50 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{framework.name}</CardTitle>
                    <Badge 
                      variant={framework.status === "compliant" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {framework.status === "compliant" ? (
                        <CheckCircle className="mr-1 h-3 w-3" />
                      ) : (
                        <AlertTriangle className="mr-1 h-3 w-3" />
                      )}
                      {framework.status}
                    </Badge>
                  </div>
                  <CardDescription>Compliance Score</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Overall Score</span>
                      <span className="text-2xl font-bold text-foreground">{framework.score}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${framework.score}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">{framework.controls}</p>
                      <p className="text-xs text-muted-foreground">Total Controls</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-chart-2">{framework.passed}</p>
                      <p className="text-xs text-muted-foreground">Passed</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-chart-1">{framework.failed}</p>
                      <p className="text-xs text-muted-foreground">Failed</p>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" onClick={() => handleExport("PDF", `${framework.name} Report`)}>
                    <FileDown className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Audit Trail */}
        <TabsContent value="audit" className="space-y-6">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Activity Log
              </CardTitle>
              <CardDescription>
                Detailed audit trail of all security and compliance actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditTrail.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex items-start gap-4 p-4 rounded-lg border border-border/50 bg-background/50 hover:border-primary/50 transition-all"
                  >
                    <div className={`p-2 rounded-full ${log.status === "success" ? "bg-chart-2/20" : "bg-chart-1/20"}`}>
                      {log.status === "success" ? (
                        <CheckCircle className="h-5 w-5 text-chart-2" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-chart-1" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-foreground">{log.action}</p>
                        <Badge variant={log.status === "success" ? "default" : "destructive"}>
                          {log.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{log.resource}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{log.user}</span>
                        <span>•</span>
                        <span>{log.timestamp}</span>
                      </div>
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
};

export default Reports;
