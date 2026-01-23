import { useEffect, useCallback } from "react";
import { useReactFlow } from "@xyflow/react";
import { useEditorStore, type FlowNode, type FlowEdge } from "@/store/editorStore";
import { nanoid } from "nanoid";
import type { Screen } from "@/types/flow";

interface UseCopyPasteProps {
  createComment: (content: string, screenId: string, parentId?: string, metadata?: any) => Promise<any>;
}

export function useCopyPaste({ createComment }: UseCopyPasteProps) {
  const { addNodes, addEdges, nodes } = useEditorStore();
  const { getNodes, getEdges, setNodes } = useReactFlow();

  const handleCopy = useCallback(async () => {
    // Get selected nodes from React Flow state
    // We use getNodes() to ensure we have the latest selection state from React Flow
    const currentNodes = getNodes();
    const selectedNodes = currentNodes.filter((n) => n.selected);

    if (selectedNodes.length === 0) return;

    const selectedNodeIds = new Set(selectedNodes.map((n) => n.id));

    // Get edges where both source and target are selected
    const selectedEdges = getEdges().filter(
      (e) => selectedNodeIds.has(e.source) && selectedNodeIds.has(e.target)
    );

    const clipboardData = {
      type: "signup-flow-clipboard-v1",
      nodes: selectedNodes,
      edges: selectedEdges,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(clipboardData));
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }, [getNodes, getEdges]);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        return; // Not valid JSON
      }

      if (data.type !== "signup-flow-clipboard-v1") return;

      const { nodes: pastedNodes, edges: pastedEdges } = data as {
        nodes: FlowNode[];
        edges: FlowEdge[];
      };

      // Deselect all current nodes first so only pasted ones are selected
      setNodes((nds) => nds.map((n) => ({ ...n, selected: false })));

      const idMapping = new Map<string, string>();
      const newNodes: FlowNode[] = [];
      const stickyNotes: any[] = [];

      // 1. Generate new IDs and split Sticky Notes
      pastedNodes.forEach((node) => {
        const newId = nanoid();
        idMapping.set(node.id, newId);

        const isSticky = node.type === "STICKY-NOTE";

        // Offset position slightly (e.g. 50px down/right)
        // In a real app we might use mouse position if available, but for keyboard paste this is standard.
        const position = {
          x: node.position.x + 50,
          y: node.position.y + 50,
        };

        if (isSticky) {
             const screen = node.data.screen as any;
             stickyNotes.push({
                 content: screen.notes || "",
                 metadata: {
                     type: 'sticky',
                     x: position.x,
                     y: position.y,
                     color: screen.color || 'yellow'
                 }
             });
        } else {
             // Clone screen data with new ID
             const oldScreen = node.data.screen as Screen;
             const newScreen = {
               ...oldScreen,
               id: newId,
               position,
               // We will update links in pass 2
             };

             newNodes.push({
               ...node,
               id: newId,
               position,
               data: {
                 ...node.data,
                 screen: newScreen,
                 isSelected: true,
                 isHighlighted: false,
               },
               selected: true,
             });
        }
      });

      // 2. Update references in screen data for normal nodes
      newNodes.forEach((node) => {
        const screen = node.data.screen as any;

        // Remap nextScreenId
        if (screen.nextScreenId && idMapping.has(screen.nextScreenId)) {
          screen.nextScreenId = idMapping.get(screen.nextScreenId);
        } else if (screen.nextScreenId && !idMapping.has(screen.nextScreenId)) {
          // If referencing a node NOT in the paste group:
          // If we are in the SAME flow, we could keep the link.
          // If we are in a DIFFERENT flow, this ID is invalid.
          // Safe default: Keep it. If it doesn't exist in current flow, it just won't render an edge.
        }

        // Remap Options nextScreenId
        if (screen.options && Array.isArray(screen.options)) {
            screen.options = screen.options.map((opt: any) => ({
                ...opt,
                nextScreenId: opt.nextScreenId && idMapping.has(opt.nextScreenId)
                    ? idMapping.get(opt.nextScreenId)
                    : opt.nextScreenId
            }));
        }

        // Remap Branches
        if (screen.branches && Array.isArray(screen.branches)) {
            screen.branches = screen.branches.map((branch: any) => ({
                ...branch,
                targetScreenId: idMapping.has(branch.targetScreenId)
                    ? idMapping.get(branch.targetScreenId)
                    : branch.targetScreenId
            }));
        }
      });

      // 3. Remap edges
      const newEdges = pastedEdges.map((edge) => {
        const newSource = idMapping.get(edge.source);
        const newTarget = idMapping.get(edge.target);

        // Only include edges that connect two nodes within the pasted group
        if (!newSource || !newTarget) return null;

        return {
            ...edge,
            id: `${newSource}->${newTarget}${edge.sourceHandle ? `-option-${edge.sourceHandle}` : ''}`,
            source: newSource,
            target: newTarget,
            selected: false,
        };
      }).filter((e): e is FlowEdge => e !== null);


      // 4. Commit to store
      if (newNodes.length > 0) {
          addNodes(newNodes);
      }

      if (newEdges.length > 0) {
          addEdges(newEdges);
      }

      // 5. Create sticky notes
      stickyNotes.forEach(async (note) => {
          await createComment(
              note.content,
              "global",
              undefined,
              note.metadata
          );
      });

    } catch (err) {
      console.error("Failed to paste from clipboard:", err);
    }
  }, [getNodes, getEdges, setNodes, addNodes, addEdges, createComment]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if target is input/textarea to avoid hijacking
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;

      if (isCmdOrCtrl && e.key === "c") {
        e.preventDefault();
        handleCopy();
      }

      if (isCmdOrCtrl && e.key === "v") {
        e.preventDefault();
        handlePaste();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCopy, handlePaste]);
}
