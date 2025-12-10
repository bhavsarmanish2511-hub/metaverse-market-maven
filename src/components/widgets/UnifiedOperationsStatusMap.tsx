import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe } from "lucide-react";

export function UnifiedOperationsStatusMap() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          <CardTitle>Unified Operations Status Map</CardTitle>
        </div>
        <CardDescription>
          Real-time global view of security alerts, network health, and active threats.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[450px] p-2">
        <div className="h-full w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center"><p className="text-muted-foreground">[Global Map Visualization Placeholder]</p></div>
      </CardContent>
    </Card>
  );
}