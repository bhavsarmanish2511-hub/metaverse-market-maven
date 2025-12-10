import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardCheck, CheckSquare, Square } from "lucide-react";

export function PendingAudits() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardCheck className="h-5 w-5 text-primary" />
          <CardTitle>Audits & Reporting</CardTitle>
        </div>
        <CardDescription>
          Pending compliance audits and reports.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <CheckSquare className="h-4 w-4 text-success" />
          <span>PCI-DSS Q2 Report</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Square className="h-4 w-4 text-muted-foreground" />
          <span>ISO 27001 Audit Prep</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Square className="h-4 w-4 text-muted-foreground" />
          <span>SOC 2 Type II Evidence</span>
        </div>
      </CardContent>
    </Card>
  );
}