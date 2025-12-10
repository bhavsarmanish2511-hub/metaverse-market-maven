import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, CheckCircle, UserX, MessageSquareWarning } from "lucide-react";

export function DeepfakeContentIntegrity() {
  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Video className="h-5 w-5 text-primary" />
          <CardTitle>Deepfake & Content Integrity</CardTitle>
        </div>
        <CardDescription>
          Real-time detection and verification of digital media.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Live Deepfake Detections</p>
              <p className="text-lg font-bold">2 <span className="text-xs text-error">(Active)</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Verified Media</p>
              <p className="text-lg font-bold">98.7%</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserX className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Impersonation Attempts</p>
            <p className="text-lg font-bold">1 <span className="text-xs text-warning">(Voice)</span></p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Social Engineering Risk</p>
            <p className="text-lg font-bold text-warning">Elevated</p>
          </div>
        </div>
        <div className="h-24 w-full bg-muted/30 border border-dashed rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground text-sm">[Media Integrity Dashboard Placeholder]</p>
        </div>
      </CardContent>
    </Card>
  );
}