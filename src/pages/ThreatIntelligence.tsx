import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  Globe, 
  Search,
  Download,
  FileText,
  Users,
  Bug,
  Target,
  Activity
} from "lucide-react";
import { useState } from "react";

// Mock data
const threatKPIs = [
  { label: "IoC Hit Rate", value: "87%", trend: "up", icon: Target },
  { label: "MTTD", value: "12 min", trend: "down", icon: Activity },
  { label: "MTTR", value: "45 min", trend: "down", icon: Activity },
  { label: "Active Threats", value: "23", trend: "up", icon: AlertTriangle },
];

const iocData = [
  { 
    id: 1, 
    type: "IP Address", 
    value: "192.168.100.45", 
    threat: "Malware C2", 
    confidence: "High",
    source: "Commercial Feed",
    action: "Blocked",
    lastSeen: "2 hours ago"
  },
  { 
    id: 2, 
    type: "Domain", 
    value: "malicious-site.xyz", 
    threat: "Phishing", 
    confidence: "Medium",
    source: "OSINT",
    action: "Monitored",
    lastSeen: "5 hours ago"
  },
  { 
    id: 3, 
    type: "File Hash", 
    value: "a3c8f9e2d1b4...", 
    threat: "Ransomware", 
    confidence: "High",
    source: "Internal Investigation",
    action: "Quarantined",
    lastSeen: "1 day ago"
  },
  { 
    id: 4, 
    type: "Email", 
    value: "attacker@evil.com", 
    threat: "Spear Phishing", 
    confidence: "High",
    source: "Commercial Feed",
    action: "Blocked",
    lastSeen: "3 hours ago"
  },
  { 
    id: 5, 
    type: "URL", 
    value: "http://badsite.com/payload", 
    threat: "Exploit Kit", 
    confidence: "Medium",
    source: "OSINT",
    action: "Monitored",
    lastSeen: "6 hours ago"
  },
];

const threatActors = [
  {
    id: 1,
    name: "APT-32",
    motivation: "Cyber Espionage",
    capability: "Advanced",
    target: "Government, Technology",
    activeCampaigns: 3,
    lastActive: "Active Now"
  },
  {
    id: 2,
    name: "Lazarus Group",
    motivation: "Financial Gain",
    capability: "Advanced",
    target: "Financial Services",
    activeCampaigns: 5,
    lastActive: "2 days ago"
  },
  {
    id: 3,
    name: "FIN7",
    motivation: "Financial Gain",
    capability: "Intermediate",
    target: "Retail, Hospitality",
    activeCampaigns: 2,
    lastActive: "1 week ago"
  },
];

const vulnerabilities = [
  {
    id: "CVE-2024-1234",
    severity: "Critical",
    cvss: 9.8,
    description: "Remote Code Execution in Apache Struts",
    exploited: true,
    affectedAssets: 12,
    mitigation: "Apply patch v2.5.31"
  },
  {
    id: "CVE-2024-5678",
    severity: "High",
    cvss: 8.1,
    description: "SQL Injection in Legacy Database",
    exploited: true,
    affectedAssets: 5,
    mitigation: "Update to v3.2.1"
  },
  {
    id: "CVE-2024-9012",
    severity: "Medium",
    cvss: 6.5,
    description: "XSS Vulnerability in Web Portal",
    exploited: false,
    affectedAssets: 8,
    mitigation: "Input validation required"
  },
];

const mitreTechniques = [
  { id: "T1566", name: "Phishing", tactic: "Initial Access", frequency: 45 },
  { id: "T1059", name: "Command and Scripting Interpreter", tactic: "Execution", frequency: 38 },
  { id: "T1070", name: "Indicator Removal", tactic: "Defense Evasion", frequency: 32 },
  { id: "T1003", name: "OS Credential Dumping", tactic: "Credential Access", frequency: 28 },
  { id: "T1041", name: "Exfiltration Over C2 Channel", tactic: "Exfiltration", frequency: 22 },
];

export default function ThreatIntelligence() {
  const [searchQuery, setSearchQuery] = useState("");

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'high':
        return 'bg-error/10 text-error border-error/20';
      case 'medium':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-info/10 text-info border-info/20';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-error/10 text-error border-error/20';
      case 'high':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'medium':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-success/10 text-success border-success/20';
    }
  };

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient-soc">Threat Intelligence</h1>
          <p className="text-muted-foreground mt-2">
            Aggregate and prioritize actionable threat information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Intelligence
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {threatKPIs.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {kpi.label}
              </CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className={`text-xs mt-1 flex items-center ${
                kpi.trend === 'up' ? 'text-success' : 'text-error'
              }`}>
                <TrendingUp className={`h-3 w-3 mr-1 ${
                  kpi.trend === 'down' ? 'rotate-180' : ''
                }`} />
                {kpi.trend === 'up' ? 'Improving' : 'Degraded'} from last week
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">
            <Globe className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="iocs">
            <Shield className="h-4 w-4 mr-2" />
            IoCs
          </TabsTrigger>
          <TabsTrigger value="actors">
            <Users className="h-4 w-4 mr-2" />
            Threat Actors
          </TabsTrigger>
          <TabsTrigger value="vulnerabilities">
            <Bug className="h-4 w-4 mr-2" />
            Vulnerabilities
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Threat Landscape */}
            <Card>
              <CardHeader>
                <CardTitle>Threat Landscape Summary</CardTitle>
                <CardDescription>Current global and industry-specific threat trends</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium">Ransomware Campaigns</p>
                    <p className="text-xs text-muted-foreground">Technology sector</p>
                  </div>
                  <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                    Critical
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium">Phishing Attacks</p>
                    <p className="text-xs text-muted-foreground">Financial services</p>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    High
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div>
                    <p className="text-sm font-medium">Supply Chain Attacks</p>
                    <p className="text-xs text-muted-foreground">Manufacturing</p>
                  </div>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    High
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Geographic Threat Map */}
            <Card>
              <CardHeader>
                <CardTitle>Geographic Threat Map</CardTitle>
                <CardDescription>Malicious traffic sources and destinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-64 bg-card rounded-lg border border-border overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background opacity-50" />
                  
                  {/* Simulated threat indicators */}
                  <div className="absolute inset-0">
                    {[
                      { x: 20, y: 30, severity: 'critical' },
                      { x: 45, y: 25, severity: 'high' },
                      { x: 65, y: 40, severity: 'medium' },
                      { x: 80, y: 35, severity: 'high' },
                      { x: 35, y: 60, severity: 'critical' },
                      { x: 55, y: 70, severity: 'medium' },
                    ].map((threat, index) => (
                      <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-pulse"
                        style={{
                          left: `${threat.x}%`,
                          top: `${threat.y}%`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      >
                        <div className={`w-3 h-3 rounded-full ${
                          threat.severity === 'critical' ? 'bg-error' :
                          threat.severity === 'high' ? 'bg-warning' :
                          'bg-info'
                        }`} />
                      </div>
                    ))}
                  </div>

                  <div className="absolute inset-0 opacity-20">
                    <div className="w-full h-full grid grid-cols-12 grid-rows-6">
                      {Array.from({ length: 72 }).map((_, i) => (
                        <div key={i} className="border-r border-b border-muted-foreground/10" />
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* MITRE ATT&CK Techniques */}
          <Card>
            <CardHeader>
              <CardTitle>Top MITRE ATT&CK Techniques</CardTitle>
              <CardDescription>Most frequently observed attack techniques</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mitreTechniques.map((technique) => (
                  <div key={technique.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{technique.id}</Badge>
                        <span className="text-sm font-medium">{technique.name}</span>
                        <span className="text-xs text-muted-foreground">• {technique.tactic}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{technique.frequency} incidents</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${technique.frequency}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* IoCs Tab */}
        <TabsContent value="iocs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Indicators of Compromise (IoCs)</CardTitle>
                  <CardDescription>Malicious indicators detected across the network</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search IoCs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Threat</TableHead>
                    <TableHead>Confidence</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Last Seen</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {iocData
                    .filter(ioc => 
                      searchQuery === "" || 
                      ioc.value.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ioc.threat.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((ioc) => (
                      <TableRow key={ioc.id}>
                        <TableCell>
                          <Badge variant="outline">{ioc.type}</Badge>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{ioc.value}</TableCell>
                        <TableCell>{ioc.threat}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getConfidenceColor(ioc.confidence)}>
                            {ioc.confidence}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{ioc.source}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={
                            ioc.action === 'Blocked' ? 'bg-error/10 text-error border-error/20' :
                            ioc.action === 'Quarantined' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-info/10 text-info border-info/20'
                          }>
                            {ioc.action}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">{ioc.lastSeen}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Threat Actors Tab */}
        <TabsContent value="actors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Threat Actor Profiles</CardTitle>
              <CardDescription>Known threat groups and their characteristics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threatActors.map((actor) => (
                  <div key={actor.id} className="p-4 rounded-lg border border-border bg-card hover:bg-secondary/50 transition-smooth">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold">{actor.name}</h3>
                        <p className="text-sm text-muted-foreground">{actor.motivation}</p>
                      </div>
                      <Badge variant="outline" className={
                        actor.lastActive === 'Active Now' 
                          ? 'bg-error/10 text-error border-error/20' 
                          : 'bg-muted'
                      }>
                        {actor.lastActive}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Capability</p>
                        <p className="font-medium">{actor.capability}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Primary Target</p>
                        <p className="font-medium">{actor.target}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Active Campaigns</p>
                        <p className="font-medium">{actor.activeCampaigns}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerabilities Tab */}
        <TabsContent value="vulnerabilities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Known Exploited Vulnerabilities (KEVs)</CardTitle>
              <CardDescription>Vulnerabilities actively being exploited in the wild</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>CVE ID</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>CVSS Score</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Affected Assets</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Mitigation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {vulnerabilities.map((vuln) => (
                    <TableRow key={vuln.id}>
                      <TableCell className="font-mono text-xs">{vuln.id}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getSeverityColor(vuln.severity)}>
                          {vuln.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">{vuln.cvss}</span>
                      </TableCell>
                      <TableCell className="max-w-xs">{vuln.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vuln.affectedAssets} assets</Badge>
                      </TableCell>
                      <TableCell>
                        {vuln.exploited ? (
                          <Badge variant="outline" className="bg-error/10 text-error border-error/20">
                            Actively Exploited
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            Not Exploited
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{vuln.mitigation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Asset Correlation */}
          <Card>
            <CardHeader>
              <CardTitle>Asset Vulnerability Correlation</CardTitle>
              <CardDescription>Mapping vulnerabilities to internal assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-error" />
                    <div>
                      <p className="text-sm font-medium">Production Web Servers</p>
                      <p className="text-xs text-muted-foreground">12 critical vulnerabilities detected</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-sm font-medium">Database Cluster</p>
                      <p className="text-xs text-muted-foreground">5 high vulnerabilities detected</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-info" />
                    <div>
                      <p className="text-sm font-medium">Internal Applications</p>
                      <p className="text-xs text-muted-foreground">8 medium vulnerabilities detected</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
