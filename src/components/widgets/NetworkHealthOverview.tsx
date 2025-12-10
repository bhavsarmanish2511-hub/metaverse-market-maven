import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Network, Link, BarChart3, Timer, TrafficCone } from "lucide-react";

export function NetworkHealthOverview() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-noc" />
          <CardTitle>Network Health Overview</CardTitle>
        </div>
        <CardDescription>
          Real-time status of network links and performance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Link Status</p>
              <p className="text-lg font-bold text-success">All Up</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Bandwidth Utilization</p>
              <p className="text-lg font-bold">78%</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Packet Loss / Latency</p>
              <p className="text-lg font-bold">0.02% / 45ms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrafficCone className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Top Congested Interface</p>
              <p className="text-lg font-bold text-warning">Core-RTR-01:Gi0/1</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}