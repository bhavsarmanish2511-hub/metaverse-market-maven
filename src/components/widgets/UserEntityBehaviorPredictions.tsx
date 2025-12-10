import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, UserCheck, Smartphone, CloudOff } from "lucide-react";

export function UserEntityBehaviorPredictions() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>User & Entity Predictions</CardTitle>
        </div>
        <CardDescription>
          Identifying users, devices, and services at risk.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Likely Compromised User</p>
            <p className="text-lg font-bold text-warning">j.doe (Phishing Risk)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Device Likely to Fail</p>
            <p className="text-lg font-bold">FW-DMZ-01 (Memory Leak)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CloudOff className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Shadow IT Probability</p>
            <p className="text-lg font-bold">New SaaS Tool (92%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}