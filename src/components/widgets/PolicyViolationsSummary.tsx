import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Gavel, FileWarning, BarChartHorizontal } from "lucide-react";

export function PolicyViolationsSummary() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Gavel className="h-5 w-5 text-primary" />
          <CardTitle>Policy Violations</CardTitle>
        </div>
        <CardDescription>
          Summary of compliance and policy breaches.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <FileWarning className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Total Violations (24h)</p>
            <p className="text-lg font-bold">18 <span className="text-xs text-warning">(+3)</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BarChartHorizontal className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Top Violation Type</p>
            <p className="text-lg font-bold">Data Access Policy</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}