import { useState, useCallback } from "react";
import { Node, Edge } from "reactflow";

interface WorkflowState {
  nodes: Node[];
  edges: Edge[];
}

export function useWorkflowHistory() {
  const [history, setHistory] = useState<WorkflowState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const pushState = useCallback((nodes: Node[], edges: Edge[]) => {
    setHistory((prev) => {
      const newHistory = prev.slice(0, currentIndex + 1);
      newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
      return newHistory;
    });
    setCurrentIndex((prev) => prev + 1);
  }, [currentIndex]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    pushState,
    undo,
    redo,
    canUndo,
    canRedo,
  };
}
