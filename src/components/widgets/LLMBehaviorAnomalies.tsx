import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, AlertCircle, Lock, MessageSquare } from "lucide-react";

export function LLMBehaviorAnomalies() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <CardTitle>LLM / AI Behavior Anomalies</CardTitle>
        </div>
        <CardDescription>
          Monitoring for unusual activity in AI models.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Unexpected Prompts</p>
              <p className="text-lg font-bold">4 <span className="text-xs text-warning">(+1)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Hallucination Risk</p>
              <p className="text-lg font-bold text-error">High</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Unauthorized Model Access</p>
            <p className="text-lg font-bold">1 <span className="text-xs text-error">(Blocked)</span></p>
          </div>
        </div>
        <div className="h-24 w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">[LLM Anomaly Graph Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
}