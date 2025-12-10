import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays } from "lucide-react";

export function OnCallRoster() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <CardTitle>On-Call Roster</CardTitle>
        </div>
        <CardDescription>
          Current on-call personnel for key teams.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between text-sm"><span className="font-semibold">SOC:</span><span>Ben Hughes</span></div>
        <div className="flex justify-between text-sm"><span className="font-semibold">NOC:</span><span>Sarah Chen</span></div>
        <div className="flex justify-between text-sm"><span className="font-semibold">DBA:</span><span>Mike Rivera</span></div>
      </CardContent>
    </Card>
  );
}