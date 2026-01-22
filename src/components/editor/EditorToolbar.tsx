"use client";

import { useCallback, useState } from "react";
import {
  Save,
  Undo2,
  Redo2,
  Download,
  Upload,
  Play,
  PanelLeftClose,
  PanelRightClose,
  PanelLeft,
  PanelRight,
  FolderOpen,
  ChevronLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserMenu } from "@/components/layout/UserMenu";
import { useEditorStore } from "@/store/editorStore";
import { LoadFlowModal } from "@/components/editor/LoadFlowModal";
import { flowService } from "@/services/flowService";
import { useFlowSave } from "@/hooks/useFlowSave";

interface EditorToolbarProps {
  flowName?: string;
}

export function EditorToolbar({ flowName }: EditorToolbarProps) {
  const { saveFlow, isSaving } = useFlowSave();

  const {
    currentFlow,
    isDirty,
    leftPanelOpen,
    rightPanelOpen,
    previewMode,
    toggleLeftPanel,
    toggleRightPanel,
    togglePreviewMode,
    getFlowJson,
    loadFlowJson,
    markClean,
    setFlow,
  } = useEditorStore();

  // Access temporal store for undo/redo via the store's temporal property
  const temporalStore = useEditorStore.temporal;
  const pastStates = temporalStore.getState().pastStates;
  const futureStates = temporalStore.getState().futureStates;

  const canUndo = pastStates.length > 0;
  const canRedo = futureStates.length > 0;

  const [loadModalOpen, setLoadModalOpen] = useState(false);

  const handleSave = useCallback(async () => {
    const success = await saveFlow();
    if (!success) {
      alert("Failed to save flow to database.");
    }
  }, [saveFlow]);

  const handleExport = useCallback(() => {
    const json = getFlowJson();
    if (!json) return;

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentFlow?.name || "flow"}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [getFlowJson, currentFlow?.name]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const json = e.target?.result as string;
        if (!loadFlowJson(json)) {
          alert("Failed to import flow. Invalid JSON format.");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [loadFlowJson]);

  const handleUndo = useCallback(() => {
    temporalStore.getState().undo();
  }, [temporalStore]);

  const handleRedo = useCallback(() => {
    temporalStore.getState().redo();
  }, [temporalStore]);

  return (
    <>
      <div className="h-12 border-b bg-white flex items-center px-4 gap-2">
        {/* Left panel toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          asChild
          title="Back to Dashboard"
        >
          <a href="/">
            <ChevronLeft size={16} />
          </a>
        </Button>

        <Separator orientation="vertical" className="h-6 mx-2" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleLeftPanel}
          title={leftPanelOpen ? "Hide component library" : "Show component library"}
        >
          {leftPanelOpen ? <PanelLeftClose size={16} /> : <PanelLeft size={16} />}
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Load Flow */}
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-1.5 text-slate-600"
          onClick={() => setLoadModalOpen(true)}
        >
          <FolderOpen size={14} />
          <span className="text-sm">Load</span>
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Flow name */}
        <div className="flex items-center gap-2 flex-1">
          <h1 className="font-medium text-sm truncate max-w-[200px]">
            {flowName || currentFlow?.name || "Untitled Flow"}
          </h1>
          {isDirty && (
            <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              Unsaved
            </span>
          )}

          {/* Version Badge (if persisted) */}
          {currentFlow?.version && (
            <span className="text-xs text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
              v{currentFlow.version}
            </span>
          )}
        </div>

        {/* Dev Auth Details */}
        <UserMenu />

        <Separator orientation="vertical" className="h-6 mx-2" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Save */}
          <Button
            variant="default" // Emphasize save
            size="sm"
            className="h-8 gap-1.5"
            onClick={handleSave}
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <Save size={14} />
            )}
            <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
          </Button>

          {/* Export */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleExport}
            title="Export JSON file"
          >
            <Download size={16} />
          </Button>

          {/* Import */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleImport}
            title="Import JSON file"
          >
            <Upload size={16} />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-2" />

          {/* Preview */}
          <Button
            variant={previewMode ? "secondary" : "outline"} // Distinct from primary save
            size="sm"
            className="h-8 gap-1.5"
            onClick={togglePreviewMode}
          >
            <Play size={14} />
            <span className="text-sm">Preview</span>
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Right panel toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={toggleRightPanel}
          title={rightPanelOpen ? "Hide properties" : "Show properties"}
        >
          {rightPanelOpen ? <PanelRightClose size={16} /> : <PanelRight size={16} />}
        </Button>
      </div>

      <LoadFlowModal
        open={loadModalOpen}
        onOpenChange={setLoadModalOpen}
      />
    </>
  );
}
