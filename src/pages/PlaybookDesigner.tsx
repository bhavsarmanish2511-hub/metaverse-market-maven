import { useState, useCallback, useRef, useEffect } from "react";
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  BackgroundVariant,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { NodePalette } from "@/components/playbook-designer/NodePalette";
import { TemplateGallery } from "@/components/playbook-designer/TemplateGallery";
import { NodeConfigPanel } from "@/components/playbook-designer/NodeConfigPanel";
import { PlaybookSimulator } from "@/components/playbook-designer/PlaybookSimulator";
import { NodeContextMenu } from "@/components/playbook-designer/NodeContextMenu";
import { ValidationDialog } from "@/components/playbook-designer/ValidationDialog";
import { SoarExportDialog } from "@/components/playbook-designer/SoarExportDialog";
import { useWorkflowHistory } from "@/hooks/useWorkflowHistory";
import { validateWorkflow, ValidationResult } from "@/lib/workflowValidation";
import { PlaybookTemplate } from "@/data/playbookTemplates";
import TriggerNode from "@/components/playbook-designer/TriggerNode";
import ConditionNode from "@/components/playbook-designer/ConditionNode";
import ActionNode from "@/components/playbook-designer/ActionNode";
import {
  Save,
  Play,
  Download,
  Upload,
  Trash2,
  ArrowLeft,
  BookTemplate,
  Undo,
  Redo,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let nodeId = 0;

function PlaybookDesignerFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [playbookName, setPlaybookName] = useState("Untitled Playbook");
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [showSoarExport, setShowSoarExport] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [pendingAction, setPendingAction] = useState<"save" | "test" | null>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [contextMenuNode, setContextMenuNode] = useState<string | null>(null);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { pushState, undo, redo, canUndo, canRedo } = useWorkflowHistory();

  // Push initial state to history
  useEffect(() => {
    pushState(nodes, edges);
  }, []);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const templateData = event.dataTransfer.getData("application/reactflow");

      if (!templateData) return;

      const template = JSON.parse(templateData);
      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `node-${nodeId++}`,
        type: template.type,
        position,
        data: { ...template.data },
      };

      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        pushState(newNodes, edges);
        return newNodes;
      });
      toast({
        title: "Node Added",
        description: `${template.label} added to workflow`,
      });
    },
    [reactFlowInstance, setNodes, edges, toast, pushState]
  );

  const handleSave = () => {
    // Validate workflow before saving
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    setPendingAction("save");
    setShowValidation(true);
  };

  const executeSave = () => {
    const workflow = {
      name: playbookName,
      nodes,
      edges,
      timestamp: new Date().toISOString(),
    };
    
    // In real app, save to backend
    localStorage.setItem("playbook-draft", JSON.stringify(workflow));
    toast({
      title: "Playbook Saved",
      description: `"${playbookName}" saved successfully`,
    });
    setShowValidation(false);
  };

  const handleExport = () => {
    if (nodes.length === 0) {
      toast({
        title: "Empty Workflow",
        description: "Add nodes to your playbook before exporting",
        variant: "destructive",
      });
      return;
    }
    setShowSoarExport(true);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const workflow = JSON.parse(event.target?.result as string);
            setNodes(workflow.nodes || []);
            setEdges(workflow.edges || []);
            setPlaybookName(workflow.name || "Imported Playbook");
            toast({
              title: "Playbook Imported",
              description: "Workflow loaded successfully",
            });
          } catch (error) {
            toast({
              title: "Import Failed",
              description: "Invalid playbook file",
              variant: "destructive",
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleClear = () => {
    if (confirm("Clear all nodes? This cannot be undone.")) {
      setNodes([]);
      setEdges([]);
      toast({
        title: "Canvas Cleared",
        description: "All nodes removed",
      });
    }
  };

  const handleTest = () => {
    if (nodes.length === 0) {
      toast({
        title: "No Workflow",
        description: "Add nodes to test the playbook",
        variant: "destructive",
      });
      return;
    }

    // Validate workflow before testing
    const result = validateWorkflow(nodes, edges);
    setValidationResult(result);
    setPendingAction("test");
    setShowValidation(true);
  };

  const executeTest = () => {
    setShowValidation(false);
    setShowSimulator(true);
  };

  const handleValidationProceed = () => {
    if (pendingAction === "save") {
      executeSave();
    } else if (pendingAction === "test") {
      executeTest();
    }
    setPendingAction(null);
  };

  const handleLoadTemplate = (template: PlaybookTemplate) => {
    setNodes(template.nodes);
    setEdges(template.edges);
    setPlaybookName(template.name);
    toast({
      title: "Template Loaded",
      description: `"${template.name}" loaded successfully. Customize it to fit your needs.`,
    });
  };

  const onNodeClick: NodeMouseHandler = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  const handleUpdateNode = useCallback((nodeId: string, data: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return { ...node, data };
        }
        return node;
      })
    );
    toast({
      title: "Node Updated",
      description: "Configuration saved successfully",
    });
  }, [setNodes, toast]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    setNodes((nds) => {
      const newNodes = nds.filter((node) => node.id !== nodeId);
      setEdges((eds) => {
        const newEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
        pushState(newNodes, newEdges);
        return newEdges;
      });
      return newNodes;
    });
    toast({
      title: "Node Deleted",
      description: "Node removed from workflow",
    });
    setSelectedNode(null);
  }, [setNodes, setEdges, toast, pushState]);

  const handleDuplicateNode = useCallback((nodeIdToDuplicate: string) => {
    const nodeToDuplicate = nodes.find((n) => n.id === nodeIdToDuplicate);
    if (!nodeToDuplicate) return;

    const newNode: Node = {
      ...nodeToDuplicate,
      id: `node-${nodeId++}`,
      position: {
        x: nodeToDuplicate.position.x + 50,
        y: nodeToDuplicate.position.y + 50,
      },
      data: { ...nodeToDuplicate.data },
    };

    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      pushState(newNodes, edges);
      return newNodes;
    });
    
    toast({
      title: "Node Duplicated",
      description: "Node copied successfully",
    });
  }, [nodes, edges, setNodes, toast, pushState]);

  const handleUndo = useCallback(() => {
    const previousState = undo();
    if (previousState) {
      setNodes(previousState.nodes);
      setEdges(previousState.edges);
      toast({
        title: "Undo",
        description: "Reverted last change",
      });
    }
  }, [undo, setNodes, setEdges, toast]);

  const handleRedo = useCallback(() => {
    const nextState = redo();
    if (nextState) {
      setNodes(nextState.nodes);
      setEdges(nextState.edges);
      toast({
        title: "Redo",
        description: "Reapplied change",
      });
    }
  }, [redo, setNodes, setEdges, toast]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      setContextMenuNode(node.id);
    },
    []
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      {/* Left Sidebar - Node Palette */}
      <div className="w-80 flex-shrink-0">
        <NodePalette />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Top Toolbar */}
        <Card className="p-4">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/soc/playbooks")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <Input
              value={playbookName}
              onChange={(e) => setPlaybookName(e.target.value)}
              className="max-w-md text-center font-semibold"
              placeholder="Playbook Name"
            />

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo className="h-4 w-4" />
              </Button>
              <div className="h-6 w-px bg-border" />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowTemplates(true)}
                className="border-soc/30 hover:bg-soc/10 hover:text-soc"
              >
                <BookTemplate className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleExport}
                className="border-soc/30 hover:bg-soc/10 hover:text-soc"
              >
                <Download className="h-4 w-4 mr-2" />
                Export to XDR
              </Button>
              <Button variant="outline" size="sm" onClick={handleClear}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
              <Button variant="outline" size="sm" onClick={handleTest}>
                <Play className="h-4 w-4 mr-2" />
                Test
              </Button>
              <Button size="sm" onClick={handleSave} className="bg-soc hover:bg-soc/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        </Card>

        {/* Canvas */}
        <Card className="flex-1 overflow-hidden">
          <div ref={reactFlowWrapper} className="w-full h-full">
            <NodeContextMenu
              onDuplicate={() => contextMenuNode && handleDuplicateNode(contextMenuNode)}
              onDelete={() => contextMenuNode && handleDeleteNode(contextMenuNode)}
            >
              <ReactFlow
                nodes={nodes.map((node) => ({
                  ...node,
                  style: {
                    ...node.style,
                    boxShadow:
                      highlightedNode === node.id
                        ? "0 0 0 3px hsl(var(--soc))"
                        : undefined,
                    transition: "box-shadow 0.3s ease",
                  },
                }))}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onNodeContextMenu={onNodeContextMenu}
                nodeTypes={nodeTypes}
                fitView
                snapToGrid
                snapGrid={[15, 15]}
              >
              <Background variant={BackgroundVariant.Dots} gap={15} size={1} />
              <Controls />
              <Panel position="bottom-left" className="bg-background/95 backdrop-blur border rounded-lg p-2 space-y-2">
                <div className="text-xs text-muted-foreground">
                  <div>Nodes: {nodes.length}</div>
                  <div>Connections: {edges.length}</div>
                </div>
              </Panel>
              <Panel position="top-right" className="space-y-2">
                <div className="bg-background/95 backdrop-blur border rounded-lg p-3 text-xs space-y-1">
                  <div className="font-semibold mb-2">Quick Guide</div>
                  <div>• Drag nodes from palette</div>
                  <div>• Connect nodes by dragging from handles</div>
                  <div>• Click nodes to select and configure</div>
                  <div>• Delete with backspace/delete key</div>
                </div>
              </Panel>
              </ReactFlow>
            </NodeContextMenu>
          </div>
        </Card>
      </div>

      {/* Template Gallery Dialog */}
      <TemplateGallery
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleLoadTemplate}
      />

      {/* Playbook Simulator Dialog */}
      <PlaybookSimulator
        open={showSimulator}
        onOpenChange={setShowSimulator}
        nodes={nodes}
        edges={edges}
        onHighlightNode={setHighlightedNode}
      />

      {/* Validation Dialog */}
      {validationResult && (
        <ValidationDialog
          open={showValidation}
          onOpenChange={setShowValidation}
          validationResult={validationResult}
          onProceed={handleValidationProceed}
          actionType={pendingAction || "save"}
        />
      )}

      {/* XDR Export Dialog */}
      <SoarExportDialog
        open={showSoarExport}
        onOpenChange={setShowSoarExport}
        playbookName={playbookName}
        nodes={nodes}
        edges={edges}
      />

      {/* Node Configuration Panel */}
      <NodeConfigPanel
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onUpdateNode={handleUpdateNode}
        onDeleteNode={handleDeleteNode}
      />
    </div>
  );
}

export default function PlaybookDesigner() {
  return (
    <ReactFlowProvider>
      <PlaybookDesignerFlow />
    </ReactFlowProvider>
  );
}
