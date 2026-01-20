"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ReactFlowProvider } from "@xyflow/react";
import { useEditorStore } from "@/store/editorStore";
import { FlowCanvas } from "@/components/editor/FlowCanvas";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { ComponentLibrary } from "@/components/panels/ComponentLibrary";
import { PropertiesPanel } from "@/components/panels/PropertiesPanel";
import { FlowPreview } from "@/components/preview/FlowPreview";

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

  const {
    currentFlow,
    createNewFlow,
    loadFlowJson,
    leftPanelOpen,
    rightPanelOpen,
    previewMode,
  } = useEditorStore();

  // Load flow on mount
  useEffect(() => {
    async function loadFlow() {
      setIsLoading(true);
      setLoadError(null);

      if (flowId === "new") {
        createNewFlow("New Flow", "individual");
        setIsLoading(false);
        return;
      }

      try {
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

        const screensWithPositions = flowData.screens.map((screen: any, index: number) => ({
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
          createNewFlow("Untitled Flow", "individual");
        }
      }

      setIsLoading(false);
    }

    loadFlow();
  }, [flowId, createNewFlow, loadFlowJson]);

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
          <a href="/" className="text-blue-600 hover:underline">
            Return to dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="h-screen flex flex-col bg-gray-100">
        <EditorToolbar flowName={currentFlow?.name || meta?.name} />

        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel - Component Library */}
          {leftPanelOpen && (
            <div className="w-72 flex-shrink-0">
              <ComponentLibrary flowCategory={currentFlow?.category} />
            </div>
          )}

          {/* Canvas */}
          <div className="flex-1 relative">
            <FlowCanvas />
          </div>

          {/* Right Panel - Properties */}
          {rightPanelOpen && (
            <div className="w-80 flex-shrink-0">
              <PropertiesPanel />
            </div>
          )}
        </div>

        {/* Preview Mode Overlay */}
        {previewMode && <FlowPreview />}
      </div>
    </ReactFlowProvider>
  );
}
