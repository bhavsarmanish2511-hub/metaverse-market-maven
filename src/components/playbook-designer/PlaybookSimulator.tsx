import { useState, useEffect } from "react";
import { Node, Edge } from "reactflow";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Pause, RotateCcw, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface PlaybookSimulatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nodes: Node[];
  edges: Edge[];
  onHighlightNode: (nodeId: string | null) => void;
}

interface ExecutionLog {
  nodeId: string;
  nodeName: string;
  status: "pending" | "running" | "success" | "error";
  timestamp: string;
  result?: string;
}

export function PlaybookSimulator({
  open,
  onOpenChange,
  nodes,
  edges,
  onHighlightNode,
}: PlaybookSimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  const findExecutionOrder = () => {
    // Find trigger nodes (starting points)
    const triggerNodes = nodes.filter((node) => node.type === "trigger");
    if (triggerNodes.length === 0) return [];

    const executionOrder: Node[] = [];
    const visited = new Set<string>();

    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      const node = nodes.find((n) => n.id === nodeId);
      if (node) {
        executionOrder.push(node);

        // Find connected nodes
        const outgoingEdges = edges.filter((e) => e.source === nodeId);
        outgoingEdges.forEach((edge) => traverse(edge.target));
      }
    };

    triggerNodes.forEach((trigger) => traverse(trigger.id));
    return executionOrder;
  };

  const simulateExecution = async () => {
    const executionOrder = findExecutionOrder();
    if (executionOrder.length === 0) return;

    setIsRunning(true);
    setExecutionLogs([]);
    setCurrentNodeIndex(0);

    for (let i = 0; i < executionOrder.length; i++) {
      if (!isRunning || isPaused) break;

      const node = executionOrder[i];
      setCurrentNodeIndex(i);

      // Add pending log
      setExecutionLogs((prev) => [
        ...prev,
        {
          nodeId: node.id,
          nodeName: node.data.label || `Node ${i + 1}`,
          status: "pending",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      // Highlight current node
      onHighlightNode(node.id);

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Update to running
      setExecutionLogs((prev) =>
        prev.map((log, idx) =>
          idx === i ? { ...log, status: "running" as const } : log
        )
      );

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Simulate success or conditional branching
      const isCondition = node.type === "condition";
      const result = isCondition
        ? Math.random() > 0.3
          ? "Condition met - TRUE"
          : "Condition not met - FALSE"
        : getSampleResult(node.type || "action");

      setExecutionLogs((prev) =>
        prev.map((log, idx) =>
          idx === i
            ? { ...log, status: "success" as const, result }
            : log
        )
      );
    }

    onHighlightNode(null);
    setIsRunning(false);
  };

  const getSampleResult = (type: string) => {
    const results: Record<string, string> = {
      trigger: "Alert detected: Suspicious email received",
      action: "Action completed successfully",
      condition: "Evaluation complete",
    };
    return results[type] || "Executed successfully";
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setExecutionLogs([]);
    setCurrentNodeIndex(0);
    onHighlightNode(null);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Playbook Execution Simulator</DialogTitle>
          <DialogDescription>
            Test your playbook workflow with simulated data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Control Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={simulateExecution}
              disabled={isRunning || nodes.length === 0}
              className="bg-soc hover:bg-soc/90"
            >
              <Play className="h-4 w-4 mr-2" />
              {isRunning ? "Running..." : "Start Simulation"}
            </Button>
            <Button
              variant="outline"
              onClick={handlePause}
              disabled={!isRunning}
            >
              <Pause className="h-4 w-4 mr-2" />
              {isPaused ? "Resume" : "Pause"}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {/* Execution Logs */}
          <Card className="p-4">
            <h3 className="text-sm font-semibold mb-3">Execution Log</h3>
            <ScrollArea className="h-[400px] pr-4">
              {executionLogs.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Click "Start Simulation" to begin testing your playbook
                </div>
              ) : (
                <div className="space-y-3">
                  {executionLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className="border rounded-lg p-3 space-y-2 transition-all"
                      style={{
                        borderColor:
                          log.status === "success"
                            ? "hsl(var(--soc))"
                            : log.status === "running"
                            ? "hsl(var(--primary))"
                            : "hsl(var(--border))",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {log.status === "success" && (
                            <CheckCircle className="h-4 w-4 text-soc" />
                          )}
                          {log.status === "running" && (
                            <Clock className="h-4 w-4 text-primary animate-pulse" />
                          )}
                          {log.status === "pending" && (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium text-sm">
                            {log.nodeName}
                          </span>
                        </div>
                        <Badge
                          variant={
                            log.status === "success"
                              ? "default"
                              : log.status === "running"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.timestamp}
                      </div>
                      {log.result && (
                        <div className="text-sm bg-muted p-2 rounded">
                          {log.result}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
