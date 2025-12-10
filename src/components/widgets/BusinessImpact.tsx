import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, ShieldAlert } from "lucide-react";

export function BusinessImpact() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          <CardTitle>Business Impact</CardTitle>
        </div>
        <CardDescription>
          Financial and operational impact of current incidents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Estimated Revenue Loss (24h)</p>
            <p className="text-lg font-bold text-error">$15,200</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Affected Customers</p>
            <p className="text-lg font-bold">~850</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">SLA Breach Risk</p>
            <p className="text-lg font-bold text-warning">High (Payment API)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}