import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Timer, Siren, ShieldCheck } from "lucide-react";

export function TimeToRespond() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Timer className="h-5 w-5 text-primary" />
          <CardTitle>Response Times</CardTitle>
        </div>
        <CardDescription>
          Mean time to detect and respond to incidents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Siren className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">MTTD (Mean Time to Detect)</p>
            <p className="text-lg font-bold">12 min</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">MTTR (Mean Time to Respond)</p>
            <p className="text-lg font-bold">45 min</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}