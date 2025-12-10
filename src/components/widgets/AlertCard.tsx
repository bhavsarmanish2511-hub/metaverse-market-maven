import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Info, AlertCircle, Fingerprint, Target, Shield } from "lucide-react";
import { Alert } from "@/lib/mockData";
import { cn } from "@/lib/utils";

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}

const getRoleBadge = (targetRole?: string) => {
  switch (targetRole) {
    case 'irc_leader':
      return { icon: Fingerprint, label: 'IRC Leader', color: 'bg-primary/10 border-primary/30 text-primary' };
    case 'analyst':
      return { icon: Shield, label: 'Ops Analyst', color: 'bg-soc/10 border-soc/30 text-soc' };
    case 'offensive_tester':
      return { icon: Target, label: 'Offensive Tester', color: 'bg-warning/10 border-warning/30 text-warning' };
    default:
      return null;
  }
};

export function AlertCard({ alert, onClick }: AlertCardProps) {
  const getIcon = () => {
    switch (alert.type) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-error" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Info className="h-5 w-5 text-info" />;
    }
  };

  const getStatusColor = () => {
    switch (alert.status) {
      case 'active':
        return 'bg-error/10 text-error border-error/20';
      case 'investigating':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-success/10 text-success border-success/20';
    }
  };

  const getCategoryColor = () => {
    return alert.category === 'SOC' 
      ? 'bg-soc/10 text-soc border-soc/20' 
      : 'bg-noc/10 text-noc border-noc/20';
  };

  const isClickable = alert.targetRole && onClick;
  const roleBadge = getRoleBadge(alert.targetRole);

  return (
    <Card 
      className={cn(
        "hover:shadow-lg transition-smooth border-border hover:border-primary/50",
        isClickable && "cursor-pointer hover:scale-[1.02]",
        isClickable && alert.type === 'critical' && "ring-2 ring-error/30 animate-pulse"
      )}
      onClick={isClickable ? onClick : undefined}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-3">
            {getIcon()}
            <div className="flex-1">
              <CardTitle className="text-base font-semibold">{alert.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {alert.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          {roleBadge && (
            <div className={cn("flex items-center gap-1 px-2 py-1 rounded-full border", roleBadge.color)}>
              <roleBadge.icon className="h-3 w-3" />
              <span className="text-xs font-medium">{roleBadge.label}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-foreground/80 mb-3">{alert.description}</p>
        <div className="flex gap-2">
          <Badge variant="outline" className={getCategoryColor()}>
            {alert.category}
          </Badge>
          <Badge variant="outline" className={getStatusColor()}>
            {alert.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
