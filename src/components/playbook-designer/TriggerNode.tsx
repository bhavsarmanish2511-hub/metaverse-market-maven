import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Zap, GitBranch, Mail, AlertTriangle, Clock, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const triggerIcons = {
  alert: AlertTriangle,
  email: Mail,
  schedule: Clock,
  webhook: GitBranch,
  database: Database,
  default: Zap,
};

export default memo(({ data, selected }: NodeProps) => {
  const Icon = triggerIcons[data.triggerType as keyof typeof triggerIcons] || triggerIcons.default;

  return (
    <Card className={`w-64 transition-all ${selected ? 'ring-2 ring-soc shadow-lg' : 'shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-soc/10">
            <Icon className="h-5 w-5 text-soc" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm truncate">{data.label}</h4>
              <Badge variant="outline" className="text-xs bg-soc/10 text-soc border-soc/20">
                Trigger
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {data.description || "Initiates the workflow"}
            </p>
            {data.config && (
              <div className="mt-2 text-xs text-muted-foreground">
                {Object.entries(data.config).map(([key, value]) => (
                  <div key={key} className="truncate">
                    <span className="font-medium">{key}:</span> {String(value)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Bottom}
          className="!bg-soc !w-3 !h-3 !border-2 !border-background"
        />
      </CardContent>
    </Card>
  );
});
