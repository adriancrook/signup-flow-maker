"use client";

import { useCallback, useEffect } from "react";
import {
  X,
  ChevronLeft,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Code,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editorStore";
import {
  usePreviewStore,
  selectCanGoBack,
  type DeviceMode,
} from "@/store/previewStore";
import { ScreenRenderer } from "./ScreenRenderer";
import type { Screen } from "@/types/flow";

const deviceDimensions: Record<DeviceMode, { width: number; height: number }> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1024, height: 768 },
};

export function FlowPreview() {
  const { currentFlow, togglePreviewMode } = useEditorStore();
  const {
    isActive,
    currentScreenId,
    variables,
    deviceMode,
    showVariableInspector,
    startPreview,
    endPreview,
    goToScreen,
    goBack,
    setVariable,
    setDeviceMode,
    toggleVariableInspector,
    resetPreview,
  } = usePreviewStore();

  const canGoBack = usePreviewStore(selectCanGoBack);

  // Start preview when entering preview mode
  useEffect(() => {
    if (currentFlow?.entryScreenId && !isActive) {
      startPreview(currentFlow.entryScreenId);
    }
  }, [currentFlow?.entryScreenId, isActive, startPreview]);

  // Handle closing preview
  const handleClose = useCallback(() => {
    endPreview();
    togglePreviewMode();
  }, [endPreview, togglePreviewMode]);

  // Get current screen
  const currentScreen = currentFlow?.screens.find(
    (s) => s.id === currentScreenId
  );

  // Handle screen completion (move to next screen)
  const handleNext = useCallback(
    (selectedValue?: string, targetScreenId?: string) => {
      if (!currentScreen) return;

      // Determine next screen
      let nextScreenId = targetScreenId || currentScreen.nextScreenId;

      // Check for conditional branches
      if (!nextScreenId && currentScreen.branches) {
        for (const branch of currentScreen.branches) {
          const conditionsMet = branch.conditions.every((cond) => {
            const varValue = variables[cond.variable];
            switch (cond.operator) {
              case "equals":
                return varValue === cond.value;
              case "not_equals":
                return varValue !== cond.value;
              case "contains":
                return String(varValue).includes(String(cond.value));
              case "in_array":
                return Array.isArray(varValue) && varValue.includes(String(cond.value));
              default:
                return false;
            }
          });

          if (conditionsMet) {
            nextScreenId = branch.targetScreenId;
            break;
          }
        }
      }

      // Fallback to default for branch screens
      if (!nextScreenId && currentScreen.type === "branch") {
        nextScreenId = (currentScreen as { defaultScreenId?: string }).defaultScreenId;
      }

      if (nextScreenId) {
        goToScreen(nextScreenId);
      }
    },
    [currentScreen, variables, goToScreen]
  );

  if (!currentScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 text-center">
          <p className="text-lg mb-4">No entry screen defined</p>
          <p className="text-sm text-gray-500 mb-4">
            Add a Gatekeeper component to start your flow
          </p>
          <Button onClick={handleClose}>Close Preview</Button>
        </div>
      </div>
    );
  }

  const dimensions = deviceDimensions[deviceMode];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex">
      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-8">
        {/* Device Frame */}
        <div
          className="bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: dimensions.width,
            height: dimensions.height,
            maxHeight: "calc(100vh - 100px)",
          }}
        >
          {/* Screen Content */}
          <div className="flex-1 overflow-auto">
            <ScreenRenderer
              screen={currentScreen}
              variables={variables}
              onSetVariable={setVariable}
              onNext={handleNext}
            />
          </div>
        </div>
      </div>

      {/* Controls Sidebar */}
      <div className="w-80 bg-white border-l flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold">Preview</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X size={18} />
          </Button>
        </div>

        {/* Navigation */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goBack}
              disabled={!canGoBack}
            >
              <ChevronLeft size={14} className="mr-1" />
              Back
            </Button>
            <Button variant="outline" size="sm" onClick={resetPreview}>
              <RotateCcw size={14} className="mr-1" />
              Restart
            </Button>
          </div>
        </div>

        {/* Device Selection */}
        <div className="p-4 border-b">
          <p className="text-xs font-medium text-gray-500 mb-2">Device</p>
          <div className="flex gap-1">
            <Button
              variant={deviceMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceMode("mobile")}
            >
              <Smartphone size={14} />
            </Button>
            <Button
              variant={deviceMode === "tablet" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceMode("tablet")}
            >
              <Tablet size={14} />
            </Button>
            <Button
              variant={deviceMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceMode("desktop")}
            >
              <Monitor size={14} />
            </Button>
          </div>
        </div>

        {/* Current Screen Info */}
        <div className="p-4 border-b">
          <p className="text-xs font-medium text-gray-500 mb-1">Current Screen</p>
          <p className="text-sm font-medium">{currentScreen.title}</p>
          <p className="text-xs text-gray-500">{currentScreen.type}</p>
        </div>

        {/* Variable Inspector */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="p-4 border-b flex items-center justify-between cursor-pointer"
            onClick={toggleVariableInspector}
          >
            <div className="flex items-center gap-2">
              <Code size={14} />
              <p className="text-xs font-medium text-gray-500">Variables</p>
            </div>
            <span className="text-xs text-gray-400">
              {Object.keys(variables).length} set
            </span>
          </div>

          {showVariableInspector && (
            <div className="flex-1 overflow-auto p-4">
              {Object.keys(variables).length === 0 ? (
                <p className="text-xs text-gray-400">No variables collected yet</p>
              ) : (
                <div className="space-y-2">
                  {Object.entries(variables).map(([key, value]) => (
                    <div key={key} className="text-xs">
                      <span className="font-medium text-blue-600">{key}:</span>{" "}
                      <span className="text-gray-700">
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
