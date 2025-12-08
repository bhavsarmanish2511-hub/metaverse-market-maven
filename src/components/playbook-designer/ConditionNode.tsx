import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { GitBranch, Shield, Hash, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const conditionIcons = {
  comparison: GitBranch,
  threshold: Hash,
  timeWindow: Clock,
  regex: FileText,
  default: Shield,
};

export default memo(({ data, selected }: NodeProps) => {
  const Icon = conditionIcons[data.conditionType as keyof typeof conditionIcons] || conditionIcons.default;

  return (
    <Card className={`w-64 transition-all ${selected ? 'ring-2 ring-yellow-500 shadow-lg' : 'shadow-md'}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-yellow-500/10">
            <Icon className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-semibold text-sm truncate">{data.label}</h4>
              <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Condition
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">
              {data.description || "Evaluates condition"}
            </p>
            {data.condition && (
              <div className="mt-2 p-2 bg-secondary/50 rounded text-xs font-mono">
                {data.condition}
              </div>
            )}
          </div>
        </div>
        <Handle
          type="target"
          position={Position.Top}
          className="!bg-yellow-500 !w-3 !h-3 !border-2 !border-background"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="!bg-green-500 !w-3 !h-3 !border-2 !border-background !-left-3"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="!bg-red-500 !w-3 !h-3 !border-2 !border-background !-right-3"
        />
      </CardContent>
    </Card>
  );
});
