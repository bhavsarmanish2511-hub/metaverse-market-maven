import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldAlert, TrendingUp, BarChart, MapPin } from "lucide-react";

export function SecurityIncidentSummary() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-soc" />
          <CardTitle>Security Incident Summary</CardTitle>
        </div>
        <CardDescription>
          Overview of active security incidents and trends.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Incidents (24h)</p>
              <p className="text-lg font-bold">12 <span className="text-xs text-success">(+2)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Top Severity</p>
              <p className="text-lg font-bold text-error">Critical</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Top Affected Asset</p>
            <p className="text-lg font-bold">Prod-DB-01</p>
          </div>
        </div>
        <div className="h-32 w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">[Incident Heatmap Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
}