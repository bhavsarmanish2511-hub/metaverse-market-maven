import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Share2 } from "lucide-react";

export function TopologySnapshot() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Share2 className="h-5 w-5 text-noc" />
          <CardTitle>Topology Snapshot</CardTitle>
        </div>
        <CardDescription>
          Auto-generated, real-time network topology.
        </CardDescription>
      </CardHeader>
      <CardContent className="h-[200px] p-2">
        <div className="h-full w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center"><p className="text-muted-foreground">[Network Topology Visualization Placeholder]</p></div>
      </CardContent>
    </Card>
  );
}