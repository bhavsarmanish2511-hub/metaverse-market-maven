import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { 
  Zap, Mail, Database, Server, Shield, Ban, 
  FileText, Bell, Users, Globe, Terminal 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const actionIcons = {
  email: Mail,
  database: Database,
  api: Server,
  isolate: Shield,
  block: Ban,
  ticket: FileText,
  notify: Bell,
  enrichment: Globe,
  script: Terminal,
  default: Zap,
};

export default memo(({ data, selected }: NodeProps) => {
  const Icon = actionIcons[data.actionType as keyof typeof actionIcons] || actionIcons.default;

  return (
    <Card className={`w-64 transition-all ${selected ? 'ring-2 ring-blue-500 shadow-lg' : 'shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Icon className="h-5 w-5 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm truncate">{data.label}</h4>
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-500 border-blue-500/20">
                Action
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {data.description || "Executes action"}
            </p>
            {data.parameters && (
              <div className="mt-2 space-y-1">
                {Object.entries(data.parameters).slice(0, 3).map(([key, value]) => (
                  <div key={key} className="text-xs truncate">
                    <span className="font-medium text-muted-foreground">{key}:</span>{" "}
                    <span>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-blue-500 !w-3 !h-3 !border-2 !border-background"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-blue-500 !w-3 !h-3 !border-2 !border-background"
        />
      </CardContent>
    </Card>
  );
});
