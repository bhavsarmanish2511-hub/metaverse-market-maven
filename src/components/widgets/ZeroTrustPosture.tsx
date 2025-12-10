import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShieldCheck, User, Smartphone, Network } from "lucide-react";

export function ZeroTrustPosture() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Zero-Trust Posture</CardTitle>
        </div>
        <CardDescription>
          Adherence to zero-trust architecture principles.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-center">
          <p className="text-4xl font-bold text-success">92%</p>
          <p className="text-xs text-muted-foreground">Overall Score</p>
        </div>
        <div className="flex justify-around text-xs pt-2">
          <div className="text-center"><User className="mx-auto h-4 w-4 mb-1"/>Identity: 95%</div>
          <div className="text-center"><Smartphone className="mx-auto h-4 w-4 mb-1"/>Device: 88%</div>
          <div className="text-center"><Network className="mx-auto h-4 w-4 mb-1"/>Network: 93%</div>
        </div>
      </CardContent>
    </Card>
  );
}