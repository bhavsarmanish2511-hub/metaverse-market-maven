import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface IndicatorCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  valueClassName?: string;
  children?: React.ReactNode;
}

export function IndicatorCard({ title, value, description, icon, valueClassName, children }: IndicatorCardProps) {
  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {children ? (
          children
        ) : (
          <div className={`text-2xl font-bold ${valueClassName}`}>{value}</div>
        )}
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  );
}