import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap, Search, UserSearch, AlertCircle } from "lucide-react";

export function ThreatIntelligenceDetection() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-soc" />
          <CardTitle>Threat Intelligence & Detection</CardTitle>
        </div>
        <CardDescription>
          Correlated insights from threat feeds, SIEM, and UEBA.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Threat Feed Highlights</p>
              <p className="text-lg font-bold text-warning">New Malware Variant</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Correlated SIEM Alerts</p>
              <p className="text-lg font-bold">34 <span className="text-xs text-error">(+5 critical)</span></p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserSearch className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Suspicious User Behavior (UEBA)</p>
            <p className="text-lg font-bold">Ben Hughes <span className="text-xs text-warning">(Unusual Login)</span></p>
          </div>
        </div>
        <div className="h-24 w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">[Threat Graph Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
}