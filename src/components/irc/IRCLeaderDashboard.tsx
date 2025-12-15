import { useState } from 'react';
import { ircAlerts, IRCAlert } from '@/lib/ircAlertData';
import { AlertTriangle, Clock, MapPin, Server, DollarSign, Shield, Activity, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IRCAlertDetail } from './IRCAlertDetail';

const severityStyles = {
  critical: 'bg-red-950/40 border-red-500/40 hover:border-red-500/60',
  high: 'bg-orange-950/30 border-orange-500/30 hover:border-orange-500/50',
  medium: 'bg-amber-950/20 border-amber-500/25 hover:border-amber-500/40',
  low: 'bg-slate-800/20 border-slate-500/20 hover:border-slate-500/30',
};

const statusStyles = {
  active: 'bg-red-500 text-white font-semibold shadow-sm shadow-red-500/30',
  investigating: 'bg-amber-500 text-amber-950 font-semibold shadow-sm shadow-amber-500/30',
  mitigating: 'bg-blue-500 text-white font-semibold shadow-sm shadow-blue-500/30',
  resolved: 'bg-emerald-500/80 text-white font-medium',
};

const severityBadgeStyles = {
  critical: 'text-red-400 border-red-500/40 bg-red-950/50',
  high: 'text-orange-400 border-orange-500/40 bg-orange-950/50',
  medium: 'text-amber-400 border-amber-500/40 bg-amber-950/50',
  low: 'text-slate-400 border-slate-500/30 bg-slate-800/50',
};

export function IRCLeaderDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<IRCAlert | null>(null);

  if (selectedAlert) {
    return <IRCAlertDetail alert={selectedAlert} onBack={() => setSelectedAlert(null)} />;
  }

  const criticalCount = ircAlerts.filter(a => a.severity === 'critical').length;
  const activeCount = ircAlerts.filter(a => a.status === 'active').length;

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground mb-1 flex items-center gap-3">
            <Shield className="h-6 w-6 text-muted-foreground" />
            IRC Leader Command Console
          </h1>
          <p className="text-sm text-muted-foreground">
            Incident Response Command Center - Real-time Alert Management
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-error/10 text-error border-error/20 text-sm px-3 py-1">
            <AlertTriangle className="h-4 w-4 mr-1.5" />
            {criticalCount} Critical
          </Badge>
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 text-sm px-3 py-1">
            <Activity className="h-4 w-4 mr-1.5" />
            {activeCount} Active
          </Badge>
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 text-sm px-3 py-1">
            <Zap className="h-4 w-4 mr-1.5" />
            HELIOS Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-error/20 bg-error/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-error/10">
              <AlertTriangle className="h-5 w-5 text-error" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical Incidents</p>
              <p className="text-2xl font-bold text-error">{criticalCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-muted/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">MTTR Target</p>
              <p className="text-2xl font-bold text-foreground/80">15 min</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-muted/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <Server className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Systems Affected</p>
              <p className="text-2xl font-bold text-foreground/80">12</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-muted/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Revenue at Risk</p>
              <p className="text-2xl font-bold text-foreground/80">$2.3M/hr</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="border-border/30">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
            <AlertTriangle className="h-5 w-5 text-error" />
            Active Incidents - Click to Manage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {ircAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.005] hover:shadow-md",
                severityStyles[alert.severity]
              )}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className={cn(statusStyles[alert.status], "text-xs px-2.5 py-0.5 uppercase tracking-wide")}>
                      {alert.status}
                    </Badge>
                    <Badge variant="outline" className={cn(
                      "uppercase text-xs px-2.5 py-0.5 font-semibold tracking-wide",
                      severityBadgeStyles[alert.severity]
                    )}>
                      {alert.severity}
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground/70">{alert.id}</span>
                  </div>
                  <h3 className="font-semibold text-base text-foreground/90">{alert.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" />
                      {alert.region}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Server className="h-4 w-4" />
                      {alert.affectedSystems.length} systems
                    </span>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium text-foreground/70">{alert.businessImpact}</p>
                  <p className="text-sm text-error">{alert.slaRisk}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
