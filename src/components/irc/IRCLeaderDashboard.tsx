import { useState, useEffect } from 'react';
import { ircAlerts as initialAlerts, IRCAlert } from '@/lib/ircAlertData';
import { AlertTriangle, Clock, MapPin, Server, DollarSign, Shield, Activity, Zap, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IRCAlertDetail } from './IRCAlertDetail';

const severityStyles = {
  critical: 'bg-red-950/40 border-red-500/40 hover:border-red-500/60',
  medium: 'bg-amber-950/20 border-amber-500/25 hover:border-amber-500/40',
  low: 'bg-slate-800/20 border-slate-500/20 hover:border-slate-500/30',
  resolved: 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50',
};

const statusStyles = {
  active: 'bg-green-500 text-white font-semibold shadow-sm shadow-green-500/30',
  resolved: 'bg-emerald-500 text-white font-medium',
};

const severityBadgeStyles = {
  critical: 'text-red-400 border-red-500/40 bg-red-950/50',
  medium: 'text-amber-400 border-amber-500/40 bg-amber-950/50',
  low: 'text-slate-400 border-slate-500/30 bg-slate-800/50',
};

interface ResolvedMetrics {
  mttr: string;
  revenueProtected: string;
  transactionsRecovered: number;
  serviceRestoration: number;
}

export function IRCLeaderDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<IRCAlert | null>(null);
  const [alerts, setAlerts] = useState<IRCAlert[]>(initialAlerts);
  const [resolvedMetrics, setResolvedMetrics] = useState<Record<string, ResolvedMetrics>>({});

  const handleStatusUpdate = (alertId: string, newStatus: string, metrics?: ResolvedMetrics) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId 
        ? { ...alert, status: newStatus as IRCAlert['status'] }
        : alert
    ));
    if (metrics) {
      setResolvedMetrics(prev => ({ ...prev, [alertId]: metrics }));
    }
  };

  const handleBack = () => {
    setSelectedAlert(null);
  };

  if (selectedAlert) {
    // Get the updated alert from state
    const currentAlert = alerts.find(a => a.id === selectedAlert.id) || selectedAlert;
    return (
      <IRCAlertDetail 
        alert={currentAlert} 
        onBack={handleBack}
        onStatusUpdate={handleStatusUpdate}
      />
    );
  }

  const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length;
  const activeCount = alerts.filter(a => a.status === 'active').length;
  const resolvedCount = alerts.filter(a => a.status === 'resolved').length;
  const totalSystemsAffected = alerts.filter(a => a.status !== 'resolved').reduce((acc, a) => acc + a.affectedSystems.length, 0);

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
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-error/10 text-error border-error/20 text-sm px-3 py-1">
              <AlertTriangle className="h-4 w-4 mr-1.5" />
              {criticalCount} Critical
            </Badge>
          )}
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 text-sm px-3 py-1">
            <Activity className="h-4 w-4 mr-1.5" />
            {activeCount} Active
          </Badge>
          {resolvedCount > 0 && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-sm px-3 py-1">
              <CheckCircle className="h-4 w-4 mr-1.5" />
              {resolvedCount} Resolved
            </Badge>
          )}
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 text-sm px-3 py-1">
            <Zap className="h-4 w-4 mr-1.5" />
            HELIOS Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className={cn(
          "border-border/30",
          criticalCount > 0 ? "border-error/20 bg-error/5" : "bg-emerald-950/10 border-emerald-500/20"
        )}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-lg",
              criticalCount > 0 ? "bg-error/10" : "bg-emerald-500/10"
            )}>
              {criticalCount > 0 ? (
                <AlertTriangle className="h-5 w-5 text-error" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-400" />
              )}
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Critical Incidents</p>
              <p className={cn(
                "text-2xl font-bold",
                criticalCount > 0 ? "text-error" : "text-emerald-400"
              )}>
                {criticalCount}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/30 bg-muted/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Avg MTTR</p>
              <p className="text-2xl font-bold text-foreground/80">
                {resolvedCount > 0 ? '14m 23s' : '15 min'}
              </p>
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
              <p className="text-2xl font-bold text-foreground/80">{totalSystemsAffected}</p>
            </div>
          </CardContent>
        </Card>
        <Card className={cn(
          "border-border/30",
          criticalCount > 0 ? "bg-muted/10" : "bg-emerald-950/10 border-emerald-500/20"
        )}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className={cn(
              "p-3 rounded-lg",
              criticalCount > 0 ? "bg-muted/50" : "bg-emerald-500/10"
            )}>
              <DollarSign className={cn(
                "h-5 w-5",
                criticalCount > 0 ? "text-muted-foreground" : "text-emerald-400"
              )} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                {criticalCount > 0 ? 'Revenue at Risk' : 'Revenue Protected'}
              </p>
              <p className={cn(
                "text-2xl font-bold",
                criticalCount > 0 ? "text-foreground/80" : "text-emerald-400"
              )}>
                {criticalCount > 0 ? '$2.3M/hr' : '$2.1M'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="border-border/30">
        <CardHeader className="py-3">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-foreground/90">
            <AlertTriangle className="h-5 w-5 text-muted-foreground" />
            Incidents - Click to Manage
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {alerts.map((alert) => {
            const isResolved = alert.status === 'resolved';
            const metrics = resolvedMetrics[alert.id];
            
            return (
              <div
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={cn(
                  "p-4 rounded-lg border cursor-pointer transition-all hover:scale-[1.005] hover:shadow-md",
                  isResolved ? severityStyles.resolved : severityStyles[alert.severity]
                )}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={cn(statusStyles[alert.status], "text-xs px-2.5 py-0.5 uppercase tracking-wide")}>
                        {alert.status}
                      </Badge>
                      {!isResolved && (
                        <Badge variant="outline" className={cn(
                          "uppercase text-xs px-2.5 py-0.5 font-semibold tracking-wide",
                          severityBadgeStyles[alert.severity]
                        )}>
                          {alert.severity}
                        </Badge>
                      )}
                      {isResolved && (
                        <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 bg-emerald-950/50 text-xs px-2.5 py-0.5">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Incident Closed
                        </Badge>
                      )}
                      <span className="text-xs font-mono text-muted-foreground/70">{alert.id}</span>
                    </div>
                    <h3 className={cn(
                      "font-semibold text-base",
                      isResolved ? "text-emerald-400/90" : "text-foreground/90"
                    )}>
                      {isResolved ? alert.title.replace('Critical:', 'Resolved:') : alert.title}
                    </h3>
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
                    {isResolved && metrics ? (
                      <>
                        <p className="text-sm font-medium text-emerald-400">MTTR: {metrics.mttr}</p>
                        <p className="text-sm text-emerald-400/80">Protected: {metrics.revenueProtected}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground/70">{alert.businessImpact}</p>
                        <p className="text-sm text-error">{alert.slaRisk}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
