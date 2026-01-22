"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { useEditorStore, type FlowNode, type FlowEdge } from "@/store/editorStore";
import { nodeTypes } from "@/components/nodes";
import { DiscussionPanel } from "@/components/comments/DiscussionPanel";
import type { Screen } from "@/types/flow";
import { supabase } from "@/lib/supabase/client";
import { useComments } from "@/hooks/useComments";
import { useFlowVisits } from "@/hooks/useFlowVisits";
import { CommentsProvider } from "@/components/comments/CommentsContext";
import { useFlowSave } from "@/hooks/useFlowSave";

interface FlowCanvasProps {
  onNodeClick?: (nodeId: string) => void;
  isReadOnly?: boolean;
}

export function FlowCanvas({ onNodeClick, isReadOnly }: FlowCanvasProps) {
  const reactFlowInstance = useRef<ReactFlowInstance<FlowNode, FlowEdge> | null>(null);

  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
    selectEdge,
    addNode,
    updateNode,
    removeNode,
    currentFlow,
    activeDiscussionNodeId,
    openDiscussion,
    closeDiscussion,
  } = useEditorStore();

  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [panelPosition, setPanelPosition] = useState<{ x: number, y: number } | undefined>(undefined);
  const prevActiveNodeId = useRef<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                       Relational Sticky Notes Logic                        */
  /* -------------------------------------------------------------------------- */

  const {
    comments,
    isLoading,
    createComment,
    updateStatus,
    deleteComment,
    editComment,
    updateCommentMetadata
  } = useComments(currentFlow?.id || "");
  const { lastViewedAt } = useFlowVisits(currentFlow?.id || "");

  // 1. Lazy Migration: Move legacy sticky notes to DB
  useEffect(() => {
    // Only run if nodes exist and we haven't checked yet (simplified)
    const legacyStickyNotes = nodes.filter(n =>
      n.type === "STICKY-NOTE" &&
      // Identify legacy nodes by ID format (UUID vs random string) or missing author in DB
      // Ideally, we just check if it's NOT in our comments list? 
      // Safe bet: If it's in `nodes` but not in `comments` map?
      // Actually, simplest is to migrate ALL 'STICKY-NOTE' nodes found on initial load 
      // that came from 'loadFlowJson'. 
      // But `nodes` changes. 
      // Strategy: Mark migrated?
      // Let's rely on the fact that `getFlowJson` now excludes them. 
      // So if we see one, it MUST be legacy (loaded from old JSON).
      // BUT `comments` sync will also try to add nodes.
      // We need to distinguish "DB Node" vs "Legacy Node".
      // Let's assume Legacy Nodes have short IDs or IDs not matching any comment?
      // Or just migrate once.
      true
    );

    if (isLoading) return; // Wait for comments to load

    const commentIds = new Set(comments.map(c => c.id));

    legacyStickyNotes.forEach(node => {
      // CRITICAL FIX: If the node ID matches a known comment (UUID), it's already DB-backed.
      if (commentIds.has(node.id)) return;

      // Migrating
      console.log("Migrating legacy sticky note:", node.id);
      const screen = node.data.screen as any;
      const content = screen.notes || "";
      const metadata = {
        type: 'sticky',
        x: node.position.x,
        y: node.position.y,
        color: screen.color || 'yellow',
        authorId: screen.metadata?.authorId || currentUserId
      };

      createComment(content, node.id, undefined, metadata);

      // CRITICAL FIX: Remove the legacy node immediately to prevent infinite loop.
      // The Sync effect will re-add it as a DB-backed node (with the new Comment ID) once the comment is created.
      // Note: createComment is optimistic, so `comments` updates immediately, triggering Sync.
      removeNode(node.id);
    });
  }, [nodes, comments, isLoading, createComment, currentUserId, removeNode]);


  // 2. Sync: Render DB Comments as Sticky Nodes
  useEffect(() => {
    if (isLoading) return;

    const stickyComments = comments.filter(c => c.metadata?.type === 'sticky');

    // Diffing logic to avoid infinite loops
    // We only Add/Update nodes that don't match or are missing

    const newNodes = stickyComments.map(c => {
      return {
        id: c.id,
        type: 'STICKY-NOTE',
        position: { x: c.metadata.x || 0, y: c.metadata.y || 0 },
        data: {
          screen: {
            id: c.id,
            type: 'STICKY-NOTE',
            notes: c.content,
            color: c.metadata.color || 'yellow',
            metadata: {
              authorId: c.user_id,
              createdAt: c.created_at
            }
          }
        },
        dragHandle: '.custom-drag-handle' // Optional if we added one
      } as FlowNode;
    });

    // Strategy: 
    // 1. Get all Non-Sticky Nodes.
    // 2. Append `newNodes`.
    // Valid? Yes, if we assume migration is done or we don't care about preserving un-migrated ones (we do).

    // Safer functions:
    newNodes.forEach(newNode => {
      const existing = nodes.find(n => n.id === newNode.id);
      if (!existing) {
        addNode(newNode.data.screen as Screen, newNode.position, newNode.id);
      } else {
        // Update if content changed (remote update)
        if (JSON.stringify(existing.data) !== JSON.stringify(newNode.data) ||
          (Math.abs(existing.position.x - newNode.position.x) > 1 && !existing.dragging)) {

          updateNode(newNode.id, {
            ...newNode.data.screen,
            position: newNode.position
          });
        }
      }
    });

    // Optional: cleanup removed sticky notes (if deleted from DB)
    const dbStickyIds = new Set(stickyComments.map(c => c.id));
    nodes.forEach(node => {
      if (node.type === 'STICKY-NOTE') {
        // If it's a UUID (DB id) and not in our list, it was deleted remotely.
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(node.id);
        if (isUuid && !dbStickyIds.has(node.id)) {
          // It's gone from DB, remove locally
          if (!isLoading) { // Ensure initial load is done
            removeNode(node.id);
          }
        }
      }
    });

  }, [comments, isLoading, addNode, updateNode, removeNode]); // Minimal dependencies

  const handleDragStop = useCallback((e: React.MouseEvent, node: FlowNode) => {
    if (node.type === "STICKY-NOTE") {
      // Update DB position
      updateCommentMetadata(node.id, {
        x: node.position.x,
        y: node.position.y
      });
    }
  }, [updateCommentMetadata]);

  /* -------------------------------------------------------------------------- */
  /*                               Interaction                                  */
  /* -------------------------------------------------------------------------- */

  const handleNodeClick = useCallback(
    (event: React.MouseEvent, node: FlowNode) => {
      selectNode(node.id);

      // Position the panel near the click
      setPanelPosition({
        x: event.clientX + 20,
        y: event.clientY - 20
      });

      onNodeClick?.(node.id);
    },
    [selectNode, onNodeClick]
  );

  const handleEdgeClick = useCallback(
    (_: React.MouseEvent, edge: FlowEdge) => {
      selectEdge(edge.id);
    },
    [selectEdge]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
    closeDiscussion();
  }, [selectNode, selectEdge, closeDiscussion]);

  const { saveFlow } = useFlowSave();

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const screenData = event.dataTransfer.getData("application/json");
      if (!screenData || !reactFlowInstance.current) return;

      try {
        const screen = JSON.parse(screenData) as Partial<Screen>;

        // Enforce Read-Only: Only allow Sticky Notes
        if (isReadOnly && screen.type !== "STICKY-NOTE") {
          return;
        }

        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        // Relational Sticky Note: Create directly in DB
        if (screen.type === "STICKY-NOTE") {
          createComment(
            "", // Empty content initially
            "global", // Not attached to a specific node, or use "root"?
            undefined,
            {
              type: 'sticky',
              x: position.x,
              y: position.y,
              color: screen.color || 'yellow'
            }
          );
          // Do NOT addNode locally; the subscription will add it.
        } else {
          // Normal Node
          addNode(screen, position);
        }

      } catch (e) {
        console.error("Failed to parse dropped data:", e);
      }
    },
    [addNode, currentUserId, createComment]
  );

  // Also need to handle Delete
  const onNodesDelete = useCallback((nodesToDelete: FlowNode[]) => {
    nodesToDelete.forEach(node => {
      if (node.type === 'STICKY-NOTE') {
        deleteComment(node.id);
      }
    });



  }, [deleteComment]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  return (
    <CommentsProvider value={{
      comments,
      lastViewedAt,
      currentUserId,
      isLoading,
      createComment,
      updateStatus,
      deleteComment,
      editComment
    }}>
      <div className="w-full h-full relative">
        <ReactFlow
          nodes={nodes.map((n) => ({
            ...n,
            draggable: !isReadOnly || n.type === "STICKY-NOTE",
            connectable: !isReadOnly,
            deletable: !isReadOnly || n.type === "STICKY-NOTE",
          }))}
          edges={edges.map(e => ({ ...e, deletable: !isReadOnly }))}
          onNodesChange={onNodesChange} // Enable for all; draggable/deletable props control specific node behavior
          onEdgesChange={!isReadOnly ? onEdgesChange : undefined}
          onConnect={!isReadOnly ? onConnect : undefined}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          onDrop={handleDrop} // Logic inside handleDrop handles isReadOnly check
          onDragOver={!isReadOnly || true ? handleDragOver : undefined} // Allow dragover for sticky notes too. Actually handleDragOver just sets dropEffect.
          onNodeDragStop={handleDragStop} // Keep enabled to save position
          onNodesDelete={onNodesDelete} // Keep enabled to allow deletion of allowed nodes (sticky notes)
          onInit={(instance) => {
            reactFlowInstance.current = instance;
          }}
          nodeTypes={nodeTypes}
          fitView
          snapToGrid
          snapGrid={[15, 15]}
          defaultEdgeOptions={{
            type: "smoothstep",
            style: { strokeWidth: 2 },
          }}
          proOptions={{ hideAttribution: true }}
        >
          <Background variant={BackgroundVariant.Dots} gap={15} size={1} />
          <Controls />
          <MiniMap
            nodeStrokeWidth={3}
            zoomable
            pannable
            className="bg-white/80 rounded-lg shadow-lg"
          />

          {/* Discussion Panel managed by global store */}
          {activeDiscussionNodeId && currentFlow && (
            <DiscussionPanel
              flowId={currentFlow.id}
              nodeId={activeDiscussionNodeId}
              onClose={closeDiscussion}
              currentUserId={currentUserId}
              initialPosition={panelPosition}
            />
          )}

          {/* Empty state */}
          {nodes.length === 0 && (
            <Panel position="top-center" className="mt-20">
              <div className="text-center text-gray-500 bg-white/90 rounded-lg p-6 shadow-lg">
                <p className="text-lg font-medium mb-2">No screens yet</p>
                <p className="text-sm">
                  Drag components from the library to start building your flow
                </p>
              </div>
            </Panel>
          )}
        </ReactFlow>
      </div>
    </CommentsProvider>
  );
}
