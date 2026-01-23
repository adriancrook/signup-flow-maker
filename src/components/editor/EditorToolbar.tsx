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
  ChevronLeft,
  FileJson,
  ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/layout/UserMenu";
import { useEditorStore } from "@/store/editorStore";
import { LoadFlowModal } from "@/components/editor/LoadFlowModal";
import { flowService } from "@/services/flowService";
import { useFlowSave } from "@/hooks/useFlowSave";
import { useReactFlow, getNodesBounds } from "@xyflow/react";
import { toPng } from "html-to-image";

interface EditorToolbarProps {
  flowName?: string;
  isReadOnly?: boolean;
}

export function EditorToolbar({ flowName, isReadOnly }: EditorToolbarProps) {
  const { saveFlow, isSaving } = useFlowSave();
  const { getNodes } = useReactFlow();

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

  const handleExportJson = useCallback(() => {
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

  const handleExportPng = useCallback(async () => {
    const nodes = getNodes();
    if (nodes.length === 0) return;

    const nodesBounds = getNodesBounds(nodes);
    const padding = 50;
    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;

    const viewportElem = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewportElem) return;

    const transform = `translate(${-(nodesBounds.x - padding)}px, ${-(nodesBounds.y - padding)}px) scale(1)`;

    try {
      const dataUrl = await toPng(viewportElem, {
        backgroundColor: '#fff',
        width: width,
        height: height,
        style: {
          width: width.toString(),
          height: height.toString(),
          transform: transform,
        },
      });

      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${currentFlow?.name || "flow"}.png`;
      a.click();
    } catch (err) {
      console.error("Failed to export PNG:", err);
      alert("Failed to export PNG.");
    }
  }, [getNodes, currentFlow?.name]);

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
          disabled={isReadOnly}
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
            disabled={!canUndo || isReadOnly}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            disabled={!canRedo || isReadOnly}
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
            disabled={isSaving || !isDirty || isReadOnly}
          >
            {isSaving ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
            ) : (
              <Save size={14} />
            )}
            <span className="text-sm">{isSaving ? "Saving..." : "Save"}</span>
          </Button>

          {/* Export */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                title="Export"
              >
                <Download size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleExportJson}>
                <FileJson className="mr-2 h-4 w-4" />
                <span>Export as JSON</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPng}>
                <ImageIcon className="mr-2 h-4 w-4" />
                <span>Export as PNG</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Import */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleImport}
            title="Import JSON file"
            disabled={isReadOnly}
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
        </div >

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
      </div >

      <LoadFlowModal
        open={loadModalOpen}
        onOpenChange={setLoadModalOpen}
      />
    </>
  );
}
