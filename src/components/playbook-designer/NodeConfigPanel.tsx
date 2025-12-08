import { useState, useEffect } from "react";
import { Node } from "reactflow";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Save, X, Plus, Trash2 } from "lucide-react";

interface NodeConfigPanelProps {
  node: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
}

export function NodeConfigPanel({ node, onClose, onUpdateNode, onDeleteNode }: NodeConfigPanelProps) {
  const [localData, setLocalData] = useState<any>(null);

  useEffect(() => {
    if (node) {
      setLocalData({ ...node.data });
    }
  }, [node]);

  if (!node || !localData) return null;

  const handleSave = () => {
    onUpdateNode(node.id, localData);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Delete this node? This cannot be undone.")) {
      onDeleteNode(node.id);
      onClose();
    }
  };

  const updateField = (field: string, value: any) => {
    setLocalData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent: string, field: string, value: any) => {
    setLocalData((prev: any) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const addParameter = (parent: string) => {
    const key = prompt("Parameter name:");
    if (key) {
      setLocalData((prev: any) => ({
        ...prev,
        [parent]: { ...prev[parent], [key]: "" },
      }));
    }
  };

  const removeParameter = (parent: string, key: string) => {
    setLocalData((prev: any) => {
      const newData = { ...prev };
      if (newData[parent]) {
        const { [key]: removed, ...rest } = newData[parent];
        newData[parent] = rest;
      }
      return newData;
    });
  };

  const getNodeTypeColor = () => {
    switch (node.type) {
      case "trigger":
        return "bg-soc/10 text-soc border-soc/20";
      case "condition":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "action":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "";
    }
  };

  return (
    <Sheet open={!!node} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SheetTitle>Configure Node</SheetTitle>
              <Badge variant="outline" className={getNodeTypeColor()}>
                {node.type}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SheetDescription>
            Edit the properties and parameters of this node
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4 mt-6">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="label" className="text-sm font-semibold">
                  Node Name
                </Label>
                <Input
                  id="label"
                  value={localData.label || ""}
                  onChange={(e) => updateField("label", e.target.value)}
                  placeholder="Enter node name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={localData.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  placeholder="Describe what this node does"
                  className="mt-2 min-h-[80px]"
                />
              </div>
            </div>

            <Separator />

            {/* Trigger-specific fields */}
            {node.type === "trigger" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Trigger Configuration</h3>
                
                <div>
                  <Label htmlFor="triggerType">Trigger Type</Label>
                  <Select
                    value={localData.triggerType || "alert"}
                    onValueChange={(value) => updateField("triggerType", value)}
                  >
                    <SelectTrigger id="triggerType" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alert">SIEM Alert</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="schedule">Schedule</SelectItem>
                      <SelectItem value="webhook">Webhook</SelectItem>
                      <SelectItem value="database">Database Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">Configuration</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addParameter("config")}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {localData.config && Object.entries(localData.config).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">{key}</Label>
                          <Input
                            value={String(value)}
                            onChange={(e) => updateNestedField("config", key, e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="mt-5"
                          onClick={() => removeParameter("config", key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Condition-specific fields */}
            {node.type === "condition" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Condition Configuration</h3>
                
                <div>
                  <Label htmlFor="conditionType">Condition Type</Label>
                  <Select
                    value={localData.conditionType || "comparison"}
                    onValueChange={(value) => updateField("conditionType", value)}
                  >
                    <SelectTrigger id="conditionType" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comparison">Compare Values</SelectItem>
                      <SelectItem value="threshold">Threshold Check</SelectItem>
                      <SelectItem value="timeWindow">Time Window</SelectItem>
                      <SelectItem value="regex">Regex Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="condition">Condition Expression</Label>
                  <Textarea
                    id="condition"
                    value={localData.condition || ""}
                    onChange={(e) => updateField("condition", e.target.value)}
                    placeholder="e.g., severity > 7 or status == 'critical'"
                    className="mt-2 font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use logical operators: ==, !=, &gt;, &lt;, &gt;=, &lt;=, &&, ||
                  </p>
                </div>
              </div>
            )}

            {/* Action-specific fields */}
            {node.type === "action" && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Action Configuration</h3>
                
                <div>
                  <Label htmlFor="actionType">Action Type</Label>
                  <Select
                    value={localData.actionType || "email"}
                    onValueChange={(value) => updateField("actionType", value)}
                  >
                    <SelectTrigger id="actionType" className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Send Email</SelectItem>
                      <SelectItem value="ticket">Create Ticket</SelectItem>
                      <SelectItem value="isolate">Isolate Endpoint</SelectItem>
                      <SelectItem value="block">Block IP/Domain</SelectItem>
                      <SelectItem value="database">Query Database</SelectItem>
                      <SelectItem value="api">Call API</SelectItem>
                      <SelectItem value="enrichment">Enrich IOC</SelectItem>
                      <SelectItem value="script">Run Script</SelectItem>
                      <SelectItem value="notify">Send Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-semibold">Parameters</Label>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addParameter("parameters")}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {localData.parameters && Object.entries(localData.parameters).map(([key, value]) => (
                      <div key={key} className="flex gap-2">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">{key}</Label>
                          <Input
                            value={String(value)}
                            onChange={(e) => updateNestedField("parameters", key, e.target.value)}
                            placeholder="Value"
                          />
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="mt-5"
                          onClick={() => removeParameter("parameters", key)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1 bg-soc hover:bg-soc/90">
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
