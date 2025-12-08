import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { SystemHealth } from "@/lib/mockData";

interface StatusCardProps {
  health: SystemHealth;
}

export function StatusCard({ health }: StatusCardProps) {
  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      default:
        return 'text-error';
    }
  };

  const getTrendIcon = () => {
    switch (health.trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-error" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getProgressColor = () => {
    if (health.value >= 90) return 'bg-success';
    if (health.value >= 70) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <Card className="hover:shadow-lg transition-smooth">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {health.category}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-2">
          <span className={`text-3xl font-bold ${getStatusColor()}`}>
            {health.value}%
          </span>
          {getTrendIcon()}
        </div>
        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${health.value}%` }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-2 capitalize">
          Status: {health.status}
        </p>
      </CardContent>
    </Card>
  );
}
