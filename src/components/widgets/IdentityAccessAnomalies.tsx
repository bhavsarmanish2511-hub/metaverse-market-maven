import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UserCog, KeyRound, Globe, UserX } from "lucide-react";

export function IdentityAccessAnomalies() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <UserCog className="h-5 w-5 text-primary" />
          <CardTitle>Identity & Access</CardTitle>
        </div>
        <CardDescription>
          Anomalous identity and access patterns.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Privilege Escalations</p>
            <p className="text-lg font-bold">2 <span className="text-xs text-warning">(Blocked)</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Impossible Travel Alerts</p>
            <p className="text-lg font-bold">1</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}