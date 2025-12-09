import { useState } from 'react';
import { offensiveTesterAlerts, OffensiveTesterAlert } from '@/lib/offensiveTesterAlertData';
import { AlertTriangle, Clock, MapPin, Server, Brain, Shield, Activity, Zap, Crosshair } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { OffensiveTesterAlertDetail } from './OffensiveTesterAlertDetail';

const severityStyles = {
  critical: 'bg-error/20 text-error border-error/30 animate-pulse',
  high: 'bg-warning/20 text-warning border-warning/30',
  medium: 'bg-noc/20 text-noc border-noc/30',
  low: 'bg-muted text-muted-foreground border-border',
};

const statusStyles = {
  active: 'bg-error text-error-foreground',
  investigating: 'bg-warning text-warning-foreground',
  mitigating: 'bg-noc text-noc-foreground',
  resolved: 'bg-success text-success-foreground',
};

export function OffensiveTesterDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<OffensiveTesterAlert | null>(null);

  if (selectedAlert) {
    return <OffensiveTesterAlertDetail alert={selectedAlert} onBack={() => setSelectedAlert(null)} />;
  }

  const criticalCount = offensiveTesterAlerts.filter(a => a.severity === 'critical').length;
  const activeCount = offensiveTesterAlerts.filter(a => a.status === 'active').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Crosshair className="h-8 w-8 text-error" />
            Offensive Tester Command Console
          </h1>
          <p className="text-muted-foreground">
            Red Team Operations - AI/ML Security Assessment
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-error/10 text-error border-error/20 text-sm px-3 py-1">
            <AlertTriangle className="h-4 w-4 mr-1" />
            {criticalCount} Critical
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20 text-sm px-3 py-1">
            <Activity className="h-4 w-4 mr-1" />
            {activeCount} Active
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-sm px-3 py-1">
            <Zap className="h-4 w-4 mr-1" />
            HELIOS Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-error/30 bg-error/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-error/20">
              <AlertTriangle className="h-6 w-6 text-error" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Threats</p>
              <p className="text-2xl font-bold text-error">{criticalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/20">
              <Brain className="h-6 w-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">AI Models at Risk</p>
              <p className="text-2xl font-bold text-warning">3</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-noc/30 bg-noc/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-noc/20">
              <Server className="h-6 w-6 text-noc" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">APIs Monitored</p>
              <p className="text-2xl font-bold text-noc">47</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-soc/30 bg-soc/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-soc/20">
              <Shield className="h-6 w-6 text-soc" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Adversarial Tests</p>
              <p className="text-2xl font-bold text-soc">156</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crosshair className="h-5 w-5 text-error" />
            Active Security Assessments - Click to Manage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {offensiveTesterAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg",
                severityStyles[alert.severity]
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={statusStyles[alert.status]}>
                      {alert.status.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="uppercase">
                      {alert.severity}
                    </Badge>
                    <span className="text-sm font-mono">{alert.id}</span>
                  </div>
                  <h3 className="font-semibold text-lg">{alert.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {alert.region}
                    </span>
                    <span className="flex items-center gap-1">
                      <Server className="h-4 w-4" />
                      {alert.affectedSystems.length} systems
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">{alert.businessImpact}</p>
                  <p className="text-xs text-error">{alert.slaRisk}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
