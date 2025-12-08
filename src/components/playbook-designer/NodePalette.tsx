import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, GitBranch, Mail, AlertTriangle, Clock, Database, 
  Shield, Hash, FileText, Server, Ban, Bell, Globe, Terminal 
} from "lucide-react";

interface NodeTemplate {
  type: string;
  label: string;
  description: string;
  icon: any;
  data: any;
}

const triggerTemplates: NodeTemplate[] = [
  {
    type: "trigger",
    label: "SIEM Alert",
    description: "Triggered when a SIEM alert is generated",
    icon: AlertTriangle,
    data: { triggerType: "alert", label: "SIEM Alert" }
  },
  {
    type: "trigger",
    label: "Email Received",
    description: "Triggered when an email is received",
    icon: Mail,
    data: { triggerType: "email", label: "Email Received" }
  },
  {
    type: "trigger",
    label: "Scheduled",
    description: "Runs on a schedule",
    icon: Clock,
    data: { triggerType: "schedule", label: "Scheduled Trigger" }
  },
  {
    type: "trigger",
    label: "Webhook",
    description: "Triggered by external webhook",
    icon: GitBranch,
    data: { triggerType: "webhook", label: "Webhook Trigger" }
  },
  {
    type: "trigger",
    label: "Database Event",
    description: "Triggered by database changes",
    icon: Database,
    data: { triggerType: "database", label: "Database Event" }
  }
];

const conditionTemplates: NodeTemplate[] = [
  {
    type: "condition",
    label: "Compare Values",
    description: "Compare two values",
    icon: GitBranch,
    data: { conditionType: "comparison", label: "Compare Values", condition: "value1 == value2" }
  },
  {
    type: "condition",
    label: "Threshold Check",
    description: "Check if value exceeds threshold",
    icon: Hash,
    data: { conditionType: "threshold", label: "Threshold Check", condition: "severity > 7" }
  },
  {
    type: "condition",
    label: "Time Window",
    description: "Check if within time window",
    icon: Clock,
    data: { conditionType: "timeWindow", label: "Time Window", condition: "within_hours(24)" }
  },
  {
    type: "condition",
    label: "Regex Match",
    description: "Match against regex pattern",
    icon: FileText,
    data: { conditionType: "regex", label: "Regex Match", condition: "matches('pattern')" }
  }
];

const actionTemplates: NodeTemplate[] = [
  {
    type: "action",
    label: "Send Email",
    description: "Send email notification",
    icon: Mail,
    data: { actionType: "email", label: "Send Email", parameters: { to: "analyst@company.com" } }
  },
  {
    type: "action",
    label: "Create Ticket",
    description: "Create incident ticket",
    icon: FileText,
    data: { actionType: "ticket", label: "Create Ticket", parameters: { system: "ServiceNow" } }
  },
  {
    type: "action",
    label: "Isolate Endpoint",
    description: "Isolate infected endpoint",
    icon: Shield,
    data: { actionType: "isolate", label: "Isolate Endpoint", parameters: { endpoint: "hostname" } }
  },
  {
    type: "action",
    label: "Block IP/Domain",
    description: "Block IP or domain at firewall",
    icon: Ban,
    data: { actionType: "block", label: "Block IP/Domain", parameters: { target: "192.168.1.100" } }
  },
  {
    type: "action",
    label: "Query Database",
    description: "Query security database",
    icon: Database,
    data: { actionType: "database", label: "Query Database", parameters: { query: "SELECT ..." } }
  },
  {
    type: "action",
    label: "Call API",
    description: "Call external API",
    icon: Server,
    data: { actionType: "api", label: "API Call", parameters: { endpoint: "/api/v1/..." } }
  },
  {
    type: "action",
    label: "Enrich IOC",
    description: "Enrich with threat intelligence",
    icon: Globe,
    data: { actionType: "enrichment", label: "Enrich IOC", parameters: { source: "VirusTotal" } }
  },
  {
    type: "action",
    label: "Run Script",
    description: "Execute custom script",
    icon: Terminal,
    data: { actionType: "script", label: "Run Script", parameters: { script: "script.py" } }
  },
  {
    type: "action",
    label: "Send Notification",
    description: "Send team notification",
    icon: Bell,
    data: { actionType: "notify", label: "Send Notification", parameters: { channel: "Slack" } }
  }
];

export function NodePalette() {
  const onDragStart = (event: React.DragEvent, nodeTemplate: NodeTemplate) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify(nodeTemplate));
    event.dataTransfer.effectAllowed = "move";
  };

  const renderTemplate = (template: NodeTemplate) => (
    <div
      key={template.label}
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      className="flex items-start gap-3 p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/50 cursor-move transition-all"
    >
      <div className={`p-2 rounded-lg ${
        template.type === 'trigger' ? 'bg-soc/10' :
        template.type === 'condition' ? 'bg-yellow-500/10' :
        'bg-blue-500/10'
      }`}>
        <template.icon className={`h-4 w-4 ${
          template.type === 'trigger' ? 'text-soc' :
          template.type === 'condition' ? 'text-yellow-500' :
          'text-blue-500'
        }`} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{template.label}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </div>
    </div>
  );

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Node Palette</CardTitle>
        <p className="text-xs text-muted-foreground">Drag nodes onto the canvas</p>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="triggers" className="h-full">
          <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
            <TabsTrigger value="triggers" className="text-xs">Triggers</TabsTrigger>
            <TabsTrigger value="conditions" className="text-xs">Conditions</TabsTrigger>
            <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="triggers" className="mt-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4 space-y-2">
                {triggerTemplates.map(renderTemplate)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="conditions" className="mt-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4 space-y-2">
                {conditionTemplates.map(renderTemplate)}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="actions" className="mt-0">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="p-4 space-y-2">
                {actionTemplates.map(renderTemplate)}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
