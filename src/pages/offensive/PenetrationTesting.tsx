import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Crosshair, Play, Square, CheckCircle2, Clock, AlertTriangle, Terminal, FileText, Target, Shield, Zap } from 'lucide-react';

const engagements = [
  { id: 1, name: 'External Network Pentest', client: 'Production Environment', status: 'active', progress: 65, startDate: '2024-01-15', findings: 12 },
  { id: 2, name: 'Web App Security Assessment', client: 'Customer Portal', status: 'active', progress: 40, startDate: '2024-01-18', findings: 8 },
  { id: 3, name: 'Red Team Exercise', client: 'Corporate Network', status: 'planning', progress: 0, startDate: '2024-01-25', findings: 0 },
  { id: 4, name: 'API Security Testing', client: 'Mobile Backend', status: 'completed', progress: 100, startDate: '2024-01-01', findings: 23 },
];

const attackPhases = [
  { name: 'Reconnaissance', status: 'completed', techniques: 15, findings: 3 },
  { name: 'Initial Access', status: 'completed', techniques: 8, findings: 2 },
  { name: 'Execution', status: 'in-progress', techniques: 12, findings: 4 },
  { name: 'Persistence', status: 'pending', techniques: 6, findings: 0 },
  { name: 'Privilege Escalation', status: 'pending', techniques: 9, findings: 0 },
  { name: 'Lateral Movement', status: 'pending', techniques: 7, findings: 0 },
  { name: 'Exfiltration', status: 'pending', techniques: 5, findings: 0 },
];

const recentFindings = [
  { id: 1, title: 'Default Admin Credentials', severity: 'critical', phase: 'Initial Access', timestamp: '10 min ago' },
  { id: 2, title: 'Unpatched RCE Vulnerability', severity: 'critical', phase: 'Execution', timestamp: '25 min ago' },
  { id: 3, title: 'Exposed Internal API', severity: 'high', phase: 'Reconnaissance', timestamp: '1 hour ago' },
  { id: 4, title: 'Weak Password Policy', severity: 'medium', phase: 'Initial Access', timestamp: '2 hours ago' },
];

const statusColors = {
  active: 'bg-success/20 text-success',
  planning: 'bg-primary/20 text-primary',
  completed: 'bg-muted text-muted-foreground',
  paused: 'bg-warning/20 text-warning',
};

const phaseStatusColors = {
  completed: 'bg-success text-success-foreground',
  'in-progress': 'bg-warning text-warning-foreground',
  pending: 'bg-muted text-muted-foreground',
};

export default function PenetrationTesting() {
  const [activeTab, setActiveTab] = useState('engagements');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-warning/20 rounded-lg">
            <Crosshair className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Penetration Testing</h1>
            <p className="text-muted-foreground">Manage red team engagements and attack simulations</p>
          </div>
        </div>
        <Button className="gap-2 bg-warning hover:bg-warning/90 text-warning-foreground">
          <Play className="h-4 w-4" />
          New Engagement
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-success" />
              <div>
                <div className="text-2xl font-bold text-success">2</div>
                <p className="text-xs text-muted-foreground">Active Engagements</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <div>
                <div className="text-2xl font-bold text-destructive">43</div>
                <p className="text-xs text-muted-foreground">Total Findings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-8 w-8 text-warning" />
              <div>
                <div className="text-2xl font-bold text-warning">62</div>
                <p className="text-xs text-muted-foreground">Techniques Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <div className="text-2xl font-bold text-primary">87%</div>
                <p className="text-xs text-muted-foreground">Objectives Achieved</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Engagements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {engagements.map((engagement) => (
                <div key={engagement.id} className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{engagement.name}</span>
                        <Badge className={statusColors[engagement.status as keyof typeof statusColors]}>
                          {engagement.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{engagement.client}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {engagement.status === 'active' && (
                        <>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Terminal className="h-3 w-3" />
                            Console
                          </Button>
                          <Button variant="outline" size="sm">
                            <Square className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button variant="outline" size="sm" className="gap-1">
                        <FileText className="h-3 w-3" />
                        Report
                      </Button>
                    </div>
                  </div>
                  {engagement.progress > 0 && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span>{engagement.progress}%</span>
                      </div>
                      <Progress value={engagement.progress} className="h-2" />
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                    <span>Started: {engagement.startDate}</span>
                    <span>•</span>
                    <span>{engagement.findings} findings</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Attack Kill Chain */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Attack Kill Chain Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {attackPhases.map((phase, index) => (
                  <div key={phase.name} className="flex-1">
                    <div className={`h-2 rounded-full ${phaseStatusColors[phase.status as keyof typeof phaseStatusColors]}`} />
                    <p className="text-xs mt-2 text-center truncate">{phase.name}</p>
                    {phase.findings > 0 && (
                      <p className="text-xs text-center text-destructive">{phase.findings} findings</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Findings */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Recent Findings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFindings.map((finding) => (
              <div key={finding.id} className="p-3 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={finding.severity === 'critical' ? 'destructive' : finding.severity === 'high' ? 'default' : 'secondary'} className="text-xs">
                    {finding.severity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{finding.phase}</span>
                </div>
                <p className="font-medium text-sm">{finding.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{finding.timestamp}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">View All Findings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
