import { Shield, Database, Activity, AlertTriangle, FileText, Book } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const socModules = [
  {
    title: "Log",
    icon: Database,
    description: "Centralized log aggregation from all security devices and systems",
    status: "Active",
    metrics: "2.4M logs/hour",
  },
  {
    title: "SIEM",
    icon: Activity,
    description: "Real-time security event correlation and analysis",
    status: "Active",
    metrics: "1,247 rules active",
  },
  {
    title: "Threat Intelligence",
    icon: AlertTriangle,
    description: "Advanced threat detection using AI-powered analysis",
    status: "Active",
    metrics: "342 IOCs tracked",
  },
  {
    title: "Incident Tracking",
    icon: FileText,
    description: "Automated incident response and workflow management",
    status: "Active",
    metrics: "23 open tickets",
  },
  {
    title: "Reporting & Compliance",
    icon: FileText,
    description: "Comprehensive security reporting and compliance monitoring",
    status: "Active",
    metrics: "15 reports scheduled",
  },
  {
    title: "Knowledge Base",
    icon: Book,
    description: "Security playbooks and best practices repository",
    status: "Active",
    metrics: "156 articles",
  },
];

export default function SocOverview() {
  return (
    <div className="min-h-screen bg-background">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-soc/10">
                <Shield className="h-6 w-6 text-soc" />
              </div>
              <h1 className="text-3xl font-bold text-gradient-soc">Security Operations Center</h1>
            </div>
            <p className="text-muted-foreground">
              AI-powered security monitoring and threat detection
            </p>
          </div>
          <Badge variant="outline" className="bg-soc/10 text-soc border-soc/20 w-fit">
            All Systems Operational
          </Badge>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-soc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Threats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-soc">14</p>
              <p className="text-xs text-muted-foreground mt-1">2 critical, 12 medium</p>
            </CardContent>
          </Card>
          <Card className="border-soc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Events Analyzed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-soc">2.4M</p>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
          <Card className="border-soc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Incidents Resolved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-soc">89</p>
              <p className="text-xs text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
          <Card className="border-soc/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Detection Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-soc">98.7%</p>
              <p className="text-xs text-muted-foreground mt-1">Accuracy score</p>
            </CardContent>
          </Card>
        </div>

        {/* SOC Modules */}
        <div>
          <h2 className="text-2xl font-bold mb-4">SOC Components</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socModules.map((module) => (
              <Card 
                key={module.title}
                className="hover:shadow-lg transition-smooth hover:border-soc/50 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-soc/10">
                      <module.icon className="h-5 w-5 text-soc" />
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

        {/* Security Layers */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Security Layers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Protection Coverage</CardTitle>
                <CardDescription>Active security layers across infrastructure</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'AI Security',
                  'Network Security',
                  'Endpoint Security',
                  'Application Security',
                  'Cloud Security',
                  'Identity Security',
                ].map((layer) => (
                  <div key={layer} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-sm font-medium">{layer}</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Protected
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Coverage</CardTitle>
                <CardDescription>Detection capabilities for common threats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  'Malware',
                  'Ransomware',
                  'Phishing',
                  'DDoS',
                  'Insider Threats',
                  'AI Attacks',
                ].map((threat) => (
                  <div key={threat} className="flex items-center justify-between p-2 rounded-md bg-secondary/50">
                    <span className="text-sm font-medium">{threat}</span>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Monitored
                    </Badge>
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
