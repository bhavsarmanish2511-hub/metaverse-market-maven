import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Copy, Trash2 } from "lucide-react";

interface NodeContextMenuProps {
  children: React.ReactNode;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function NodeContextMenu({
  children,
  onDuplicate,
  onDelete,
}: NodeContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuItem onClick={onDuplicate}>
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Node
        </ContextMenuItem>
        <ContextMenuItem onClick={onDelete} className="text-destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Node
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
