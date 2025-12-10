import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export function EscalationSuggestions() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-primary" />
          <CardTitle>Escalation Suggestions</CardTitle>
        </div>
        <CardDescription>
          AI-recommended escalation paths for active incidents.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <p className="font-semibold">Incident #5821 (Critical)</p>
          <p className="text-muted-foreground">→ Escalate to <span className="font-bold text-primary">Network L2</span></p>
        </div>
        <div className="text-sm">
          <p className="font-semibold">Incident #5823 (High)</p>
          <p className="text-muted-foreground">→ Escalate to <span className="font-bold text-primary">SOC Lead</span></p>
        </div>
      </CardContent>
    </Card>
  );
}