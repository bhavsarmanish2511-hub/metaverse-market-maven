import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bot, TrendingUp, ShieldOff, ServerOff } from "lucide-react";

export function CostAvoidance() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle>AI Cost-Avoidance</CardTitle>
        </div>
        <CardDescription>
          Estimated savings from AI-driven actions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-center">
          <p className="text-4xl font-bold text-success">$1.2M</p>
          <p className="text-xs text-muted-foreground">Last 30 days</p>
        </div>
        <div className="flex justify-around text-xs pt-2">
          <div className="text-center"><ShieldOff className="mx-auto h-4 w-4 mb-1"/>Breach Prevention</div>
          <div className="text-center"><ServerOff className="mx-auto h-4 w-4 mb-1"/>Downtime Reduction</div>
        </div>
      </CardContent>
    </Card>
  );
}