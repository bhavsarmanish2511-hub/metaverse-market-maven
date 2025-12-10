import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { HeartPulse, ServerCrash, Component } from "lucide-react";

export function ServiceApplicationHealth() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-5 w-5 text-noc" />
          <CardTitle>Service & Application Health</CardTitle>
        </div>
        <CardDescription>
          SLA compliance and service disruption monitoring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">SLA Compliance</p>
              <p className="text-lg font-bold text-success">99.98%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ServerCrash className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Service Disruptions</p>
              <p className="text-lg font-bold">1 <span className="text-xs text-warning">(Minor)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Component className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Top Failing Component</p>
              <p className="text-lg font-bold">Auth Service API</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}