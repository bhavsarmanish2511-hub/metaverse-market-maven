import { Node, Edge } from "reactflow";

export interface SoarPlatform {
  id: string;
  name: string;
  description: string;
  fileExtension: string;
}

export const XDR_PLATFORMS: SoarPlatform[] = [
  {
    id: "phantom",
    name: "Splunk XDR (Phantom)",
    description: "Export as Phantom playbook JSON format",
    fileExtension: "json",
  },
  {
    id: "xsoar",
    name: "Palo Alto Cortex XSOAR",
    description: "Export as XSOAR playbook YAML format",
    fileExtension: "yml",
  },
  {
    id: "siemplify",
    name: "Google Chronicle XDR (Siemplify)",
    description: "Export as Siemplify workflow JSON format",
    fileExtension: "json",
  },
  {
    id: "swimlane",
    name: "Swimlane XDR",
    description: "Export as Swimlane playbook JSON format",
    fileExtension: "json",
  },
  {
    id: "native",
    name: "Native Format",
    description: "Export in native Lovable format (JSON)",
    fileExtension: "json",
  },
];

// Convert to Splunk XDR (Phantom) format
export function exportToPhantom(
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const phantom = {
    playbook: {
      name: playbookName,
      description: `Automated playbook exported from XDR platform`,
      type: "automation",
      version: "1.0.0",
      blocks: nodes.map((node, idx) => ({
        id: `block_${idx}`,
        type: mapNodeTypeToPhantom(node.type || "action"),
        name: node.data.label || `Block ${idx + 1}`,
        note: node.data.description || "",
        custom_function: node.type === "action" ? node.data.actionType : undefined,
        conditions: node.type === "condition" ? [
          {
            logic: "and",
            conditions: [
              [node.data.condition || "true", "==", "true"]
            ]
          }
        ] : undefined,
        next: edges
          .filter((e) => e.source === node.id)
          .map((e) => {
            const targetIndex = nodes.findIndex((n) => n.id === e.target);
            return targetIndex !== -1 ? `block_${targetIndex}` : null;
          })
          .filter(Boolean),
      })),
    },
  };

  return JSON.stringify(phantom, null, 2);
}

// Convert to Palo Alto Cortex XSOAR format
export function exportToXSOAR(
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const xsoar = {
    id: playbookName.toLowerCase().replace(/\s+/g, "_"),
    version: -1,
    name: playbookName,
    description: "Automated playbook exported from XDR platform",
    starttaskid: "0",
    tasks: Object.fromEntries(
      nodes.map((node, idx) => [
        idx.toString(),
        {
          id: idx.toString(),
          taskid: idx.toString(),
          type: mapNodeTypeToXSOAR(node.type || "regular"),
          task: {
            id: idx.toString(),
            name: node.data.label || `Task ${idx + 1}`,
            description: node.data.description || "",
            type: mapNodeTypeToXSOAR(node.type || "regular"),
          },
          nexttasks: edges
            .filter((e) => e.source === node.id)
            .reduce((acc, e) => {
              const targetIndex = nodes.findIndex((n) => n.id === e.target);
              if (targetIndex !== -1) {
                acc["#default#"] = [targetIndex.toString()];
              }
              return acc;
            }, {} as Record<string, string[]>),
          conditions:
            node.type === "condition"
              ? [
                  {
                    label: "yes",
                    condition: [[{ left: { value: { simple: node.data.condition || "true" } } }]],
                  },
                ]
              : undefined,
        },
      ])
    ),
  };

  // Convert to YAML-like format
  return `id: ${xsoar.id}
version: ${xsoar.version}
name: ${xsoar.name}
description: ${xsoar.description}
starttaskid: "${xsoar.starttaskid}"
tasks:
${Object.entries(xsoar.tasks)
  .map(
    ([id, task]) => `  "${id}":
    id: "${task.id}"
    taskid: "${task.taskid}"
    type: ${task.type}
    task:
      id: "${task.task.id}"
      name: ${task.task.name}
      description: ${task.task.description}
      type: ${task.task.type}${
      task.nexttasks && Object.keys(task.nexttasks).length > 0
        ? `
    nexttasks:
      "#default#":${task.nexttasks["#default#"]?.map((t) => `
      - "${t}"`).join("") || ""}`
        : ""
    }${
      task.conditions
        ? `
    conditions:
    - label: yes
      condition:
      - - left:
            value:
              simple: ${task.conditions[0].condition[0][0].left.value.simple}`
        : ""
    }`
  )
  .join("\n")}`;
}

// Convert to Chronicle XDR (Siemplify) format
export function exportToSiemplify(
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const siemplify = {
    Name: playbookName,
    Description: "Automated workflow exported from XDR platform",
    IsEnabled: true,
    IsCustom: true,
    Version: "1.0.0",
    Blocks: nodes.map((node, idx) => ({
      Id: `block_${idx}`,
      Type: mapNodeTypeToSiemplify(node.type || "Action"),
      Name: node.data.label || `Block ${idx + 1}`,
      Description: node.data.description || "",
      ActionName: node.type === "action" ? node.data.actionType : undefined,
      Condition: node.type === "condition" ? node.data.condition : undefined,
      NextBlocks: edges
        .filter((e) => e.source === node.id)
        .map((e) => {
          const targetIndex = nodes.findIndex((n) => n.id === e.target);
          return targetIndex !== -1 ? `block_${targetIndex}` : null;
        })
        .filter(Boolean),
    })),
  };

  return JSON.stringify(siemplify, null, 2);
}

// Convert to Swimlane format
export function exportToSwimlane(
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const swimlane = {
    name: playbookName,
    description: "Automated playbook exported from XDR platform",
    version: "1.0",
    steps: nodes.map((node, idx) => ({
      id: `step_${idx}`,
      type: mapNodeTypeToSwimlane(node.type || "task"),
      name: node.data.label || `Step ${idx + 1}`,
      description: node.data.description || "",
      action: node.type === "action" ? node.data.actionType : undefined,
      condition: node.type === "condition" ? node.data.condition : undefined,
      transitions: edges
        .filter((e) => e.source === node.id)
        .map((e) => {
          const targetIndex = nodes.findIndex((n) => n.id === e.target);
          return targetIndex !== -1
            ? {
                to: `step_${targetIndex}`,
                type: "default",
              }
            : null;
        })
        .filter(Boolean),
    })),
  };

  return JSON.stringify(swimlane, null, 2);
}

// Export in native format
export function exportNative(
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): string {
  const native = {
    name: playbookName,
    nodes,
    edges,
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    platform: "XDR Platform",
  };

  return JSON.stringify(native, null, 2);
}

// Helper functions to map node types
function mapNodeTypeToPhantom(type: string): string {
  const typeMap: Record<string, string> = {
    trigger: "start",
    condition: "decision",
    action: "action",
  };
  return typeMap[type] || "action";
}

function mapNodeTypeToXSOAR(type: string): string {
  const typeMap: Record<string, string> = {
    trigger: "start",
    condition: "condition",
    action: "regular",
  };
  return typeMap[type] || "regular";
}

function mapNodeTypeToSiemplify(type: string): string {
  const typeMap: Record<string, string> = {
    trigger: "Trigger",
    condition: "Condition",
    action: "Action",
  };
  return typeMap[type] || "Action";
}

function mapNodeTypeToSwimlane(type: string): string {
  const typeMap: Record<string, string> = {
    trigger: "trigger",
    condition: "decision",
    action: "task",
  };
  return typeMap[type] || "task";
}

// Main export function
export function exportPlaybook(
  platformId: string,
  playbookName: string,
  nodes: Node[],
  edges: Edge[]
): { content: string; filename: string } {
  let content: string;
  const platform = XDR_PLATFORMS.find((p) => p.id === platformId);
  const extension = platform?.fileExtension || "json";
  const safeName = playbookName.replace(/\s+/g, "-").toLowerCase();

  switch (platformId) {
    case "phantom":
      content = exportToPhantom(playbookName, nodes, edges);
      break;
    case "xsoar":
      content = exportToXSOAR(playbookName, nodes, edges);
      break;
    case "siemplify":
      content = exportToSiemplify(playbookName, nodes, edges);
      break;
    case "swimlane":
      content = exportToSwimlane(playbookName, nodes, edges);
      break;
    case "native":
    default:
      content = exportNative(playbookName, nodes, edges);
      break;
  }

  return {
    content,
    filename: `${safeName}.${extension}`,
  };
}
