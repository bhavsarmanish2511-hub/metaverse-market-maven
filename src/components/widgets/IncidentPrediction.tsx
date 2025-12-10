import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, TrendingUp, ShieldAlert, Shuffle } from "lucide-react";

export function IncidentPrediction() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          <CardTitle>Incident Prediction</CardTitle>
        </div>
        <CardDescription>
          Forecast of likely security incidents and risks.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Most Likely Incident</p>
            <p className="text-lg font-bold text-warning">DDoS on Web-01 (78%)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Top Risk Asset</p>
            <p className="text-lg font-bold">Legacy-API (9.2/10)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Shuffle className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Lateral Movement Probability</p>
            <p className="text-lg font-bold">Web-01 → DB-01 (65%)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}