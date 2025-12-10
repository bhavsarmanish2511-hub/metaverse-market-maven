import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AIPrioritizedRisks() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldQuestion className="h-5 w-5 text-primary" />
          <CardTitle>Risks Awaiting Approval</CardTitle>
        </div>
        <CardDescription>
          AI-prioritized actions pending manual review.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <p>Patch server <span className="font-semibold">Prod-DB-01</span></p>
          <Button size="sm" variant="outline">Approve</Button>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p>Isolate user <span className="font-semibold">j.doe</span></p>
          <Button size="sm" variant="outline">Approve</Button>
        </div>
      </CardContent>
    </Card>
  );
}