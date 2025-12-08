import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download, FileJson, FileCode } from "lucide-react";
import { XDR_PLATFORMS, exportPlaybook } from "@/lib/soarExport";
import { Node, Edge } from "reactflow";
import { useToast } from "@/hooks/use-toast";

interface SoarExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playbookName: string;
  nodes: Node[];
  edges: Edge[];
}

export function SoarExportDialog({
  open,
  onOpenChange,
  playbookName,
  nodes,
  edges,
}: SoarExportDialogProps) {
  const [selectedPlatform, setSelectedPlatform] = useState("native");
  const { toast } = useToast();

  const handleExport = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty Workflow",
        description: "Add nodes to your playbook before exporting",
        variant: "destructive",
      });
      return;
    }

    try {
      const { content, filename } = exportPlaybook(
        selectedPlatform,
        playbookName,
        nodes,
        edges
      );

      const blob = new Blob([content], {
        type: selectedPlatform === "xsoar" ? "text/yaml" : "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);

      const platform = XDR_PLATFORMS.find((p) => p.id === selectedPlatform);
      toast({
        title: "Export Successful",
        description: `Playbook exported for ${platform?.name}`,
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the playbook",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export to XDR Platform</DialogTitle>
          <DialogDescription>
            Choose a platform format to export your playbook for integration
            with external XDR systems
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <RadioGroup value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <div className="grid gap-3">
              {XDR_PLATFORMS.map((platform) => (
                <Card
                  key={platform.id}
                  className={`p-4 cursor-pointer transition-all hover:border-soc/50 ${
                    selectedPlatform === platform.id
                      ? "border-soc bg-soc/5"
                      : "border-border"
                  }`}
                  onClick={() => setSelectedPlatform(platform.id)}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value={platform.id} id={platform.id} />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <Label
                          htmlFor={platform.id}
                          className="text-base font-semibold cursor-pointer"
                        >
                          {platform.name}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {platform.fileExtension.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {platform.description}
                      </p>
                    </div>
                    {platform.fileExtension === "json" ? (
                      <FileJson className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <FileCode className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </RadioGroup>

          {/* Platform-specific notes */}
          <Card className="p-4 bg-muted/50">
            <h4 className="text-sm font-semibold mb-2">Integration Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>
                Export formats are designed for compatibility with respective
                platforms
              </li>
              <li>
                Manual adjustments may be needed after import to match your
                specific platform configuration
              </li>
              <li>
                Test imported playbooks in a development environment before
                production use
              </li>
              <li>
                Refer to your XDR platform documentation for import
                instructions
              </li>
            </ul>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} className="bg-soc hover:bg-soc/90">
              <Download className="h-4 w-4 mr-2" />
              Export Playbook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
