import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Target, MoveRight, Fingerprint, Lightbulb } from "lucide-react";

export function DeceptionDecoyActivity() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-soc" />
          <CardTitle>Deception Decoy Activity</CardTitle>
        </div>
        <CardDescription>
          Monitoring honeypot interactions and attacker engagement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Decoy Interactions</p>
              <p className="text-lg font-bold">7 <span className="text-xs text-warning">(+2 new)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MoveRight className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Lateral Movement</p>
              <p className="text-lg font-bold text-error">Detected</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Fingerprint className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">TTP Classification</p>
            <p className="text-lg font-bold">TA0003 (Persistence)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Attacker Intent</p>
            <p className="text-lg font-bold text-primary">Reconnaissance</p>
          </div>
        </div>
        <div className="h-24 w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">[Decoy Engagement Map Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
}