"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { ReactFlowProvider } from "@xyflow/react";
import { useEditorStore } from "@/store/editorStore";
import { FlowCanvas } from "@/components/editor/FlowCanvas";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { flowService } from "@/services/flowService";
import { ComponentLibrary } from "@/components/panels/ComponentLibrary";
import { PropertiesPanel } from "@/components/panels/PropertiesPanel";
import { FlowPreview } from "@/components/preview/FlowPreview";
import { blueprints } from "@/data/blueprints";
import { useComments } from "@/hooks/useComments";
import { useFlowVisits } from "@/hooks/useFlowVisits";
import { CommentsProvider } from "@/components/comments/CommentsContext";

// Flow metadata for display
const flowMeta: Record<string, { name: string; category: "individual" | "educator" }> = {
  "educator-teacher": { name: "Teacher Flow", category: "educator" },
  "educator-school-admin": { name: "School Admin Flow", category: "educator" },
  "educator-district-admin": { name: "District Admin Flow", category: "educator" },
  "individual-student": { name: "Student Flow", category: "individual" },
  "individual-parent": { name: "Parent Flow", category: "individual" },
  "individual-adult": { name: "Adult Flow", category: "individual" },
  new: { name: "New Flow", category: "individual" },
};

export default function EditorPage() {
  const params = useParams();
  const flowId = params.flowId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { role: userRole } = useUserRole();

  const {
    currentFlow,
    createNewFlow,
    loadFlowJson,
    loadFromBlueprint,
    leftPanelOpen,
    rightPanelOpen,
    previewMode,
  } = useEditorStore();

  const {
    comments,
    isLoading: commentsLoading,
    createComment,
    updateStatus,
    deleteComment,
    editComment,
    updateCommentMetadata
  } = useComments(currentFlow?.id || "");
  const { lastViewedAt } = useFlowVisits(currentFlow?.id || "");

  const [currentUserId, setCurrentUserId] = useState<string>("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setCurrentUserId(data.user.id);
      }
    });
  }, []);

  // Load flow on mount
  useEffect(() => {
    async function loadFlow() {
      setIsLoading(true);
      setLoadError(null);

      // 1. New Flow
      if (flowId === "new") {
        createNewFlow("New Flow", "individual");
        setIsLoading(false);
        return;
      }

      try {
        // 2. Check Database (UUID)
        // Only try fetching if it looks like a UUID to avoid 400 errors for slugs
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(flowId);

        if (isUuid) {
          const dbFlow = await flowService.fetchFlow(flowId);
          if (dbFlow) {
            // Determine if we need to auto-layout (legacy flows might lack positions)
            // For now, assume DB flows are saved with positions.
            // We use setFlow from store (which we need to expose or use loadFlowJson)
            // loadFlowJson expects a JSON string
            loadFlowJson(JSON.stringify(dbFlow));
            setIsLoading(false);
            return;
          }
        }

        // 3. Fallback: Blueprints (Static Slugs)
        if (blueprints[flowId]) {
          loadFromBlueprint(flowId);
          setIsLoading(false);
          return;
        }

        // 4. Fallback: Legacy JSON Files (e.g. "individual-student.json")
        // Dynamically import the JSON file
        const flowModule = await import(`@/data/flows/${flowId}.json`);
        const flowData = flowModule.default;

        // Add positions to screens if not present (auto-layout)
        // Landscape-oriented layout: more columns, fewer rows (16:9 friendly)
        const COLUMN_WIDTH = 320;  // Horizontal spacing between nodes
        const ROW_HEIGHT = 380;    // Vertical spacing between rows
        const COLUMNS = 6;         // More columns for landscape orientation
        const START_X = 100;       // Left padding
        const START_Y = 80;        // Top padding

        const screensWithPositions = flowData.screens.map((screen: Record<string, unknown> & { position?: { x: number; y: number } }, index: number) => ({
          ...screen,
          position: screen.position || {
            x: START_X + (index % COLUMNS) * COLUMN_WIDTH,
            y: START_Y + Math.floor(index / COLUMNS) * ROW_HEIGHT,
          },
        }));

        const flowWithPositions = {
          ...flowData,
          screens: screensWithPositions,
        };

        const success = loadFlowJson(JSON.stringify(flowWithPositions));
        if (!success) {
          setLoadError("Failed to parse flow data");
        }
      } catch (err) {
        console.error("Failed to load flow:", err);
        // Flow doesn't exist, create new one with the name from meta
        const meta = flowMeta[flowId];
        if (meta) {
          createNewFlow(meta.name, meta.category);
        } else {
          // If it looked like a UUID but failed, show error
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(flowId)) {
            setLoadError("Could not load flow. It may have been deleted or you don't have permission.");
          } else {
            createNewFlow("Untitled Flow", "individual");
          }
        }
      }

      setIsLoading(false);
    }

    loadFlow();
  }, [flowId, createNewFlow, loadFlowJson, loadFromBlueprint]);

  // Removed manual fetch role logic in favor of hook

  const meta = flowMeta[flowId];

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4" />
          <p className="text-gray-600">Loading flow...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <Link href="/" className="text-blue-600 hover:underline">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <EditorToolbar
          flowName={currentFlow?.name || meta?.name}
          isReadOnly={userRole === 'viewer'}
          comments={comments}
        />

        <div className="flex-1 flex overflow-hidden">
          <CommentsProvider value={{
            comments,
            lastViewedAt,
            currentUserId,
            isLoading: commentsLoading,
            createComment,
            updateStatus,
            deleteComment,
            editComment,
            updateCommentMetadata
          }}>
            {/* Left Panel - Component Library */}
            {leftPanelOpen && (
              <div className="w-72 flex-shrink-0">
                <ComponentLibrary flowCategory={currentFlow?.category} isReadOnly={userRole === 'viewer'} />
              </div>
            )}

            {/* Canvas */}
            <div className="flex-1 relative">
              <FlowCanvas isReadOnly={userRole === 'viewer'} />
            </div>

            {/* Right Panel - Properties */}
            {rightPanelOpen && (
              <div className="w-[450px] flex-shrink-0 border-l border-gray-200 bg-white">
                <PropertiesPanel isReadOnly={userRole === 'viewer'} />
              </div>
            )}
          </CommentsProvider>
        </div>

        {/* Preview Mode Overlay */}
        {previewMode && <FlowPreview />}
      </div>
    </ReactFlowProvider>
  );
}
