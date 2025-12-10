import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, ServerCrash, BatteryWarning, Waves } from "lucide-react";

export function NetworkForecasting() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AreaChart className="h-5 w-5 text-primary" />
          <CardTitle>Network Forecasting</CardTitle>
        </div>
        <CardDescription>
          Predicted outages, capacity, and traffic surges.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <ServerCrash className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Predicted Outage</p>
            <p className="text-lg font-bold text-error">Core-SW-02 (PSU, 85%)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BatteryWarning className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Capacity Exhaustion</p>
            <p className="text-lg font-bold">WAN Link: 14 days</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Predicted Traffic Surge</p>
            <p className="text-lg font-bold">Marketing Campaign (+300%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}