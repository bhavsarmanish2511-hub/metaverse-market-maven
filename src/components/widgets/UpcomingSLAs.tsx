import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock } from "lucide-react";

export function UpcomingSLAs() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>SLAs at Risk</CardTitle>
        </div>
        <CardDescription>
          Service Level Agreements approaching breach.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <p>Payment API (99.9%)</p>
          <p className="font-bold text-warning">15m remaining</p>
        </div>
        <div className="flex items-center justify-between text-sm">
          <p>Customer Auth (99.95%)</p>
          <p className="font-bold">45m remaining</p>
        </div>
      </CardContent>
    </Card>
  );
}