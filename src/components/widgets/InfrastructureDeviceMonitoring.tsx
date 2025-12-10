import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Router, Cpu, Thermometer, Bot } from "lucide-react";

export function InfrastructureDeviceMonitoring() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Router className="h-5 w-5 text-noc" />
          <CardTitle>Infrastructure Device Monitoring</CardTitle>
        </div>
        <CardDescription>
          Health status of core network hardware.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">CPU/Memory/Temp Alerts</p>
              <p className="text-lg font-bold">3 <span className="text-xs text-warning">(High CPU)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Device Health</p>
              <p className="text-lg font-bold text-success">99% Stable</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Bot className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Device Anomaly Score</p>
              <p className="text-lg font-bold">8.2 / 10</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}