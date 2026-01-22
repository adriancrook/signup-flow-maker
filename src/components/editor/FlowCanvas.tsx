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

interface FlowCanvasProps {
  onNodeClick?: (nodeId: string) => void;
}

export function FlowCanvas({ onNodeClick }: FlowCanvasProps) {
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
    currentFlow,
    activeDiscussionNodeId,
    openDiscussion,
    closeDiscussion,
  } = useEditorStore();

  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [panelPosition, setPanelPosition] = useState<{ x: number, y: number } | undefined>(undefined);
  const prevActiveNodeId = useRef<string | null>(null);

  // Destructure all needed methods/state from the hook
  const {
    comments,
    isLoading,
    createComment,
    updateStatus,
    deleteComment,
    editComment
  } = useComments(currentFlow?.id || "");
  const { lastViewedAt } = useFlowVisits(currentFlow?.id || "");

  // Calculate panel position when active node changes
  useEffect(() => {
    if (activeDiscussionNodeId && activeDiscussionNodeId !== prevActiveNodeId.current && reactFlowInstance.current) {
      const node = nodes.find(n => n.id === activeDiscussionNodeId);
      if (node) {
        // Position: Right side of the node + 20px padding
        const nodeWidth = node.measured?.width ?? node.width ?? 300;
        const nodeX = node.position.x + nodeWidth + 20;
        const nodeY = node.position.y;

        const screenPos = reactFlowInstance.current.flowToScreenPosition({
          x: nodeX,
          y: nodeY
        });

        // Boundary checks (keep it on screen if possible)
        // Simplified: prevent negative
        setPanelPosition({
          x: Math.max(20, screenPos.x),
          y: Math.max(80, screenPos.y) // 80 to account for header
        });
      }
    }
    prevActiveNodeId.current = activeDiscussionNodeId;
  }, [activeDiscussionNodeId, nodes]);
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    fetchUser();
  }, []);

  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: FlowNode) => {
      selectNode(node.id);
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

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      const screenData = event.dataTransfer.getData("application/json");
      if (!screenData || !reactFlowInstance.current) return;

      try {
        const screen = JSON.parse(screenData) as Partial<Screen>;

        // Inject metadata for Sticky Notes (for unread tracking)
        if (screen.type === "STICKY-NOTE") {
          (screen as any).metadata = {
            authorId: currentUserId,
            createdAt: new Date().toISOString(),
          };
        }

        const position = reactFlowInstance.current.screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        addNode(screen, position);
      } catch (e) {
        console.error("Failed to parse dropped data:", e);
      }
    },
    [addNode]
  );

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
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onPaneClick={handlePaneClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
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
