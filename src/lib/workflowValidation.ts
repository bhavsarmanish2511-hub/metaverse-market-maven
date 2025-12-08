import { Node, Edge } from "reactflow";

export interface ValidationIssue {
  type: "error" | "warning";
  category: "trigger" | "connection" | "circular" | "config";
  message: string;
  nodeIds?: string[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export function validateWorkflow(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  // Check 1: Must have at least one trigger node
  const triggerNodes = nodes.filter((node) => node.type === "trigger");
  if (triggerNodes.length === 0) {
    errors.push({
      type: "error",
      category: "trigger",
      message: "Workflow must have at least one trigger node to start execution",
    });
  }

  // Check 2: Find disconnected nodes (nodes with no incoming or outgoing connections)
  const connectedNodeIds = new Set<string>();
  edges.forEach((edge) => {
    connectedNodeIds.add(edge.source);
    connectedNodeIds.add(edge.target);
  });

  const disconnectedNodes = nodes.filter((node) => {
    // Trigger nodes can have no incoming edges
    if (node.type === "trigger") {
      return !edges.some((edge) => edge.source === node.id);
    }
    // Other nodes should have at least one connection
    return !connectedNodeIds.has(node.id);
  });

  if (disconnectedNodes.length > 0) {
    warnings.push({
      type: "warning",
      category: "connection",
      message: `${disconnectedNodes.length} node(s) are disconnected from the workflow`,
      nodeIds: disconnectedNodes.map((n) => n.id),
    });
  }

  // Check 3: Find nodes with no outgoing connections (dead ends)
  const nodesWithoutOutgoing = nodes.filter((node) => {
    const hasOutgoing = edges.some((edge) => edge.source === node.id);
    return !hasOutgoing;
  });

  if (nodesWithoutOutgoing.length > 1) {
    warnings.push({
      type: "warning",
      category: "connection",
      message: `${nodesWithoutOutgoing.length} node(s) have no outgoing connections (workflow endpoints)`,
      nodeIds: nodesWithoutOutgoing.map((n) => n.id),
    });
  }

  // Check 4: Detect circular dependencies
  const circularPaths = detectCircularDependencies(nodes, edges);
  if (circularPaths.length > 0) {
    errors.push({
      type: "error",
      category: "circular",
      message: `Circular dependency detected: workflow would loop infinitely`,
      nodeIds: circularPaths,
    });
  }

  // Check 5: Check for nodes with incomplete configuration
  const incompleteNodes = nodes.filter((node) => {
    if (!node.data.label || node.data.label.trim() === "") {
      return true;
    }
    if (node.type === "condition" && !node.data.condition) {
      return true;
    }
    if (node.type === "action" && !node.data.actionType) {
      return true;
    }
    return false;
  });

  if (incompleteNodes.length > 0) {
    warnings.push({
      type: "warning",
      category: "config",
      message: `${incompleteNodes.length} node(s) have incomplete configuration`,
      nodeIds: incompleteNodes.map((n) => n.id),
    });
  }

  // Check 6: Validate trigger nodes have proper configuration
  triggerNodes.forEach((trigger) => {
    if (!trigger.data.triggerType || trigger.data.triggerType === "") {
      warnings.push({
        type: "warning",
        category: "config",
        message: "Trigger node missing trigger type configuration",
        nodeIds: [trigger.id],
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function detectCircularDependencies(nodes: Node[], edges: Edge[]): string[] {
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  const circularPath: string[] = [];

  function hasCycle(nodeId: string, path: string[]): boolean {
    visited.add(nodeId);
    recursionStack.add(nodeId);
    path.push(nodeId);

    // Get all outgoing edges from current node
    const outgoingEdges = edges.filter((edge) => edge.source === nodeId);

    for (const edge of outgoingEdges) {
      const targetId = edge.target;

      if (!visited.has(targetId)) {
        if (hasCycle(targetId, [...path])) {
          return true;
        }
      } else if (recursionStack.has(targetId)) {
        // Found a cycle
        const cycleStartIndex = path.indexOf(targetId);
        circularPath.push(...path.slice(cycleStartIndex), targetId);
        return true;
      }
    }

    recursionStack.delete(nodeId);
    return false;
  }

  // Check for cycles starting from each trigger node
  const triggerNodes = nodes.filter((node) => node.type === "trigger");
  
  for (const trigger of triggerNodes) {
    if (!visited.has(trigger.id)) {
      if (hasCycle(trigger.id, [])) {
        return circularPath;
      }
    }
  }

  return [];
}

export function getIssuesBySeverity(result: ValidationResult): {
  critical: ValidationIssue[];
  moderate: ValidationIssue[];
} {
  return {
    critical: result.errors,
    moderate: result.warnings,
  };
}
