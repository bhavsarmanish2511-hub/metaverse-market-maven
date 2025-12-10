import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Scale, CheckCircle } from "lucide-react";

export function ComplianceHealthIndex() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          <CardTitle>Compliance Health</CardTitle>
        </div>
        <CardDescription>
          Overall score for regulatory adherence.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-center">
          <p className="text-4xl font-bold text-success">94%</p>
          <p className="text-xs text-muted-foreground">Overall Index</p>
        </div>
        <div className="flex justify-around text-xs pt-2">
          <div className="text-center">PCI-DSS</div>
          <div className="text-center">GDPR</div>
          <div className="text-center">ISO 27001</div>
        </div>
      </CardContent>
    </Card>
  );
}