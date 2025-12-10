import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GitCommit, ShieldAlert, LocateFixed, Crosshair, Bot, ShieldCheck } from "lucide-react";

const timelineEvents = [
  {
    stage: "Initial Access",
    description: "Phishing link clicked by user in marketing.",
    time: "2m ago",
    icon: <ShieldAlert className="h-4 w-4 text-error" />,
    status: "complete",
  },
  {
    stage: "Execution",
    description: "Malicious payload executed via PowerShell.",
    time: "1m 45s ago",
    icon: <GitCommit className="h-4 w-4 text-warning" />,
    status: "complete",
  },
  {
    stage: "Persistence",
    description: "Scheduled task created for backdoor.",
    time: "1m 10s ago",
    icon: <LocateFixed className="h-4 w-4 text-warning" />,
    status: "complete",
  },
  {
    stage: "Lateral Movement",
    description: "Attempting to access adjacent file server...",
    time: "now",
    icon: <Crosshair className="h-4 w-4 text-primary animate-pulse" />,
    status: "in-progress",
  },
  {
    stage: "Impact",
    description: "AI Prediction: Data exfiltration attempt.",
    time: "pending",
    icon: <Bot className="h-4 w-4 text-muted-foreground" />,
    status: "pending",
  },
];

export function LiveAttackChainTimeline() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <CardTitle>Live Attack Chain Timeline</CardTitle>
        </div>
        <CardDescription>
          MITRE ATT&CK visualization of in-progress incidents.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${event.status === 'in-progress' ? 'bg-primary/10' : 'bg-muted'}`}>
                  {event.icon}
                </div>
                {index < timelineEvents.length - 1 && <div className="w-px h-8 bg-border" />}
              </div>
              <div className="pt-1.5">
                <p className="font-semibold">{event.stage} <span className="text-xs text-muted-foreground font-normal ml-2">{event.time}</span></p>
                <p className="text-sm text-muted-foreground">{event.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}