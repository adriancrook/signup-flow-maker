"use client";

import { useCallback } from "react";
import { Trash2, Copy, Plus, GripVertical, X, Lock, Unlock, Flag, ArrowRight, Save, Unlink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useEditorStore,
  selectSelectedNode,
  selectSelectedScreen,
  selectCurrentFlow,
} from "@/store/editorStore";
import type {
  Screen,
  MultipleChoiceScreen,
  MultiSelectScreen,
  InputScreen,
  QuestionOption,
  QuestionVariant,
  InterstitialScreen,
  InterstitialMessage,
  InterstitialVariant,
  MessageScreen,
  MessageVariant,
  FormScreen,
  PaywallScreen,
  PaywallVariant,
  TypingTestScreen,
} from "@/types/flow";
import { nanoid } from "nanoid";
import { componentTemplates } from "@/data/componentRegistry";
import { getComponentAvailability } from "@/lib/componentUtils";

interface PropertiesPanelProps {
  isReadOnly?: boolean;
}

export function PropertiesPanel({ isReadOnly }: PropertiesPanelProps) {
  const selectedNode = useEditorStore(selectSelectedNode);
  const selectedScreen = useEditorStore(selectSelectedScreen);
  const currentFlow = useEditorStore(selectCurrentFlow);
  const selectedLibraryItemId = useEditorStore((state) => state.selectedLibraryItemId);
  const librarySnapshots = useEditorStore((state) => state.librarySnapshots);
  const { updateNode, updateSharedNode, removeNode, duplicateNode, setEntryScreen } = useEditorStore();

  if (selectedLibraryItemId && !selectedNode) {
    let template = componentTemplates.find((t) => t.id === selectedLibraryItemId);

    if (template) {
      // MERGE SNAPSHOT IF EXISTS
      if (template.code) {
        const tCode = template.code;
        const snapshot = librarySnapshots.find(s => s.component_code === tCode);
        if (snapshot) {
          template = {
            ...template,
            name: snapshot.label || template.name,
            description: snapshot.description || template.description,
            icon: snapshot.icon || template.icon,
            defaultScreen: {
              ...template.defaultScreen,
              ...snapshot.default_props
            }
          };
        }
      }

      const availability = getComponentAvailability(template);

      return (
        <div className="h-full flex flex-col bg-white border-l">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm">Library Item</h2>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* Header */}
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  {/* We don't have the icon component map here easily without huge imports, 
                      so we'll just show the category as fallback or simpler UI */}
                  <div className="text-2xl font-bold text-gray-400">
                    {template.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{template.name}</h3>
                  <p className="text-sm text-gray-500">{template.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-gray-100 text-xs rounded text-gray-600 font-mono">
                      {template.code}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-50 text-xs rounded text-blue-600 capitalize">
                      {template.category}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Availability */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Availability
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Shared Component</p>
                    <p className="font-medium text-sm">
                      {availability.isShared ? "Yes" : "No"}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Valid Flows</p>
                    <div className="flex flex-wrap gap-1">
                      {availability.validFlows.length > 0 ? (
                        availability.validFlows.map(f => (
                          <span key={f} className="px-1.5 py-0.5 bg-white border rounded text-xs">
                            {f}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm">-</span>
                      )}
                    </div>
                  </div>
                </div>

                {availability.validRoles.length > 0 && (
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-xs text-gray-500 mb-1">Target Roles</p>
                    <div className="flex flex-wrap gap-1">
                      {availability.validRoles.map(role => (
                        <span key={role} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs border border-indigo-100">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Default Content Preview */}
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Default Configuration
                </h4>
                <div className="bg-gray-50 p-3 rounded-md border text-xs font-mono overflow-x-auto">
                  <pre>{JSON.stringify(template.defaultScreen, null, 2)}</pre>
                </div>
              </div>

            </div>
          </ScrollArea>
        </div>
      );
    }
  }

  if (!selectedNode || !selectedScreen) {
    return (
      <div className="h-full flex flex-col bg-white border-l">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-sm">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-gray-500 text-center">
            Select a screen to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const isLocked = (selectedScreen.isLocked !== false) || isReadOnly;
  const isEntryPoint = currentFlow?.entryScreenId === selectedScreen.id;
  const isSharedComponent = !!selectedScreen.componentCode;

  const handleUpdate = (updates: Partial<Screen>) => {
    if (!selectedScreen || !selectedNode) return;

    // Check for shared component code
    const componentCode = selectedScreen.componentCode;

    console.log(`[DEBUG] handleUpdate - ID: ${selectedNode.id}, ComponentCode: ${componentCode}, Updates:`, Object.keys(updates));

    if (componentCode) {
      // Sync to shared storage
      updateSharedNode(selectedNode.id, updates, componentCode);
    } else {
      // Standard local update
      updateNode(selectedNode.id, updates);
    }
  };

  const handleUpdateLibraryDefault = async () => {
    if (!selectedScreen.componentCode) return;
    if (!confirm("Update Library Default?\n\nThis will update the Library Sidebar icon/label and the default template for all users in your organization.")) return;

    try {
      const { sharedComponentService } = await import("@/services/sharedComponentService");
      const { id, type, nextScreenId, componentCode, ...propsToSave } = selectedScreen as any;

      await sharedComponentService.saveLibraryItem(
        selectedScreen.componentCode,
        selectedScreen.title || "Untitled Component",
        (selectedScreen as any).description || "Custom Component",
        selectedScreen.type === 'MC' ? 'help-circle' : 'layout',
        propsToSave
      );

      // Trigger Library Refresh
      useEditorStore.getState().refreshLibrary();

      alert("Library Default Updated!");
    } catch (e) {
      console.error("Failed to update library default", e);
      alert("Failed to update. See console.");
    }
  };

  const handleRepair = () => {
    // Manually assign the correct code based on type
    let code = "";
    if (selectedScreen.type === 'FORM') code = 'FORM-SIGNUP';
    if (selectedScreen.type === 'PAY') code = 'PAY-PLUS';
    if (selectedScreen.type === 'INT' && selectedScreen.title === 'Plan Analysis') code = 'INT-PLAN-ANALYSIS';

    if (code) {
      // We cast to any because componentCode might strict type check if we didn't export it well,
      // but we updated Screen type so it should be fine.
      updateNode(selectedNode.id, { componentCode: code } as any);
      alert("Component linked! Please reload the page to sync data.");
    } else {
      alert("Could not automatically determine the Link Code for this component.");
    }
  };




  const handleDelete = () => {
    if (isLocked) return;
    if (confirm("Are you sure you want to delete this screen?")) {
      removeNode(selectedNode.id);
    }
  };

  const handleDuplicate = () => {
    if (isLocked) return;
    duplicateNode(selectedNode.id);
  };

  const toggleLock = () => {
    handleUpdate({ isLocked: !isLocked });
  };

  const handleSetEntryPoint = () => {
    if (isLocked) return;
    setEntryScreen(selectedNode.id);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold text-sm">Properties</h2>
            {isSharedComponent ? (
              <div className="flex items-center gap-1">
                {/* Master Control Badge */}
                <div className="flex items-center bg-blue-50 border border-blue-200 rounded-md px-1.5 py-0.5 gap-1.5">
                  <div className="flex flex-col">
                    <span className="text-[8px] font-bold text-blue-700 leading-none tracking-wider uppercase">MASTER</span>
                    <span className="text-[9px] text-blue-500 leading-none font-mono" title={selectedScreen.componentCode}>{selectedScreen.componentCode}</span>
                  </div>

                  <Separator orientation="vertical" className="h-4 bg-blue-200" />

                  {/* Push Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 px-1.5 text-[10px] text-blue-700 hover:bg-blue-100 hover:text-blue-900"
                    title="Update Library Default (Snapshot)"
                    onClick={handleUpdateLibraryDefault}
                  >
                    <Save size={10} className="mr-1" />
                    Save Default
                  </Button>

                  <Separator orientation="vertical" className="h-4 bg-blue-200" />

                  {/* Unlink */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 text-blue-400 hover:text-red-500 hover:bg-blue-100"
                    title="Unlink Component"
                    onClick={() => updateNode(selectedNode.id, { componentCode: undefined })}
                  >
                    <Unlink size={10} />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <Input
                  className="h-6 text-[10px] w-32"
                  placeholder="Link ID (e.g. MC-GOAL)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const val = e.currentTarget.value;
                      if (val) updateNode(selectedNode.id, { componentCode: val });
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-gray-400"
                  title="Auto-Generate Link ID from Title"
                  onClick={() => {
                    const prefix = selectedScreen.type;
                    const slug = (selectedScreen.title || "untitled").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    const code = `${prefix}-${slug}`.toUpperCase();
                    updateNode(selectedNode.id, { componentCode: code });
                  }}
                >
                  <ArrowRight size={10} />
                </Button>
              </div>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7", isLocked ? "text-amber-500" : "text-gray-400")}
              onClick={toggleLock}
              title={isLocked ? "Unlock" : "Lock"}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDuplicate}
              disabled={isLocked}
              title="Duplicate"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600"
              onClick={handleDelete}
              disabled={isLocked}
              title="Delete"
            >
              <Trash2 size={14} />
            </Button>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className={cn("h-7 w-7", isEntryPoint ? "text-green-600" : "text-gray-400 hover:text-green-600")}
              onClick={handleSetEntryPoint}
              disabled={isLocked}
              title={isEntryPoint ? "Entry Point" : "Mark as Entry Point"}
            >
              <Flag size={14} fill={isEntryPoint ? "currentColor" : "none"} />
            </Button>
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            {selectedScreen.type}
          </p>
          <Input
            value={selectedScreen.title}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            className="font-medium h-8"
            placeholder="Screen Title"
            disabled={isLocked || isReadOnly}
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <div className="px-4 pt-2 border-b">
            <TabsList className="w-full">
              <TabsTrigger value="content" className="flex-1 text-xs">
                Content
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex-1 text-xs">
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="content" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="componentCode" className="text-xs">
                Component Code
              </Label>
              <Input
                id="componentCode"
                value={selectedScreen.componentCode || ""}
                onChange={(e) => handleUpdate({ componentCode: e.target.value })}
                className="h-8 text-sm font-mono bg-gray-50"
                placeholder="e.g. MC-PURPOSE-STU"
                disabled={isLocked}
              />
            </div>

            {selectedScreen.subtitle !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="subtitle" className="text-xs">
                  Subtitle
                </Label>
                <Input
                  id="subtitle"
                  value={selectedScreen.subtitle || ""}
                  onChange={(e) => handleUpdate({ subtitle: e.target.value })}
                  className="h-8 text-sm"
                  placeholder="Subtitle text"
                  disabled={isLocked}
                />
              </div>
            )}

            <Separator />

            {/* Type-specific fields */}
            <div>
              <ScreenTypeFields screen={selectedScreen} onUpdate={handleUpdate} isLocked={!!isLocked} />
            </div>
          </TabsContent>

          <TabsContent value="settings" className="p-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-xs">
                Internal Notes
              </Label>
              <textarea
                id="notes"
                value={selectedScreen.notes || ""}
                onChange={(e) => handleUpdate({ notes: e.target.value })}
                className="w-full h-24 px-3 py-2 text-sm border rounded-md resize-none"
                placeholder="Notes for your team..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs">Tags</Label>
              <Input
                value={(selectedScreen.tags || []).join(", ")}
                onChange={(e) =>
                  handleUpdate({
                    tags: e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  })
                }
                className="h-8 text-sm"
                placeholder="tag1, tag2, tag3"
                disabled={isLocked}
              />
            </div>
          </TabsContent>
        </Tabs>
      </ScrollArea>
    </div>
  );
}

interface ScreenTypeFieldsProps {
  screen: Screen;
  isLocked: boolean;
  onUpdate: (updates: Partial<Screen>) => void;
}

function ScreenTypeFields({ screen, onUpdate, isLocked }: ScreenTypeFieldsProps) {
  switch (screen.type) {
    case "MC":
      return <QuestionFields screen={screen as MultipleChoiceScreen} onUpdate={onUpdate} isLocked={isLocked} />;

    case "MS":
      return <QuestionFields screen={screen as MultiSelectScreen} onUpdate={onUpdate} isLocked={isLocked} />;

    case "TXT":
    case "NUM":
      return <InputFields screen={screen as InputScreen} onUpdate={onUpdate} isLocked={isLocked} />;

    case "INT":
      return (
        <InterstitialFields screen={screen as InterstitialScreen} onUpdate={onUpdate} isLocked={isLocked} />
      );

    case "MSG":
      return (
        <MessageFields screen={screen as MessageScreen} onUpdate={onUpdate} isLocked={isLocked} />
      );

    case "FORM":
      return (
        <FormFields screen={screen as FormScreen} onUpdate={onUpdate} isLocked={isLocked} />
      );

    case "PAY":
      return (
        <PaywallFields screen={screen as PaywallScreen} onUpdate={onUpdate} isLocked={isLocked} />
      );

    case "TEST":
      return (
        <TypingTestFields screen={screen as TypingTestScreen} onUpdate={onUpdate} isLocked={isLocked} />
      );

    default:
      return (
        <p className="text-sm text-gray-500">
          Configure this screen type in the JSON editor.
        </p>
      );
  }
}

interface QuestionFieldsProps {
  screen: MultipleChoiceScreen | MultiSelectScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<MultipleChoiceScreen>) => void;
}

function QuestionFields({ screen, onUpdate, isLocked }: QuestionFieldsProps) {
  // Variant mode is available for MC and MS types
  const supportsVariants = true;
  const variantKeys = Object.keys((screen as MultipleChoiceScreen).variants || {});

  // Ensure roleVariable defaults if variants exist but it's missing (migration/safety)
  if (variantKeys.length > 0 && !(screen as MultipleChoiceScreen).roleVariable) {
    // Side effect in render is bad practice, but we are just deriving display state here
    // Ideally we'd fix data upstream, but let's just default display
  }

  const handleOptionChange = (
    index: number,
    field: keyof QuestionOption,
    value: string,
    variantKey?: string
  ) => {
    if (variantKey && (screen as MultipleChoiceScreen).variants) {
      const variant = (screen as MultipleChoiceScreen).variants![variantKey];
      const newOptions = [...variant.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      onUpdate({
        variants: {
          ...(screen as MultipleChoiceScreen).variants,
          [variantKey]: { ...variant, options: newOptions },
        },
      });
    } else {
      const newOptions = [...(screen.options || [])];
      newOptions[index] = { ...newOptions[index], [field]: value };
      onUpdate({ options: newOptions });
    }
  };

  const handleAddOption = (variantKey?: string) => {
    const newOption: QuestionOption = {
      id: nanoid(),
      label: "New Option",
      value: `option-${Date.now()}`,
    };
    if (variantKey && (screen as MultipleChoiceScreen).variants) {
      const variant = (screen as MultipleChoiceScreen).variants![variantKey];
      onUpdate({
        variants: {
          ...(screen as MultipleChoiceScreen).variants,
          [variantKey]: { ...variant, options: [...variant.options, newOption] },
        },
      });
    } else {
      onUpdate({ options: [...(screen.options || []), newOption] });
    }
  };

  const handleRemoveOption = (index: number, variantKey?: string) => {
    if (variantKey && (screen as MultipleChoiceScreen).variants) {
      const variant = (screen as MultipleChoiceScreen).variants![variantKey];
      const newOptions = variant.options.filter((_, i) => i !== index);
      onUpdate({
        variants: {
          ...(screen as MultipleChoiceScreen).variants,
          [variantKey]: { ...variant, options: newOptions },
        },
      });
    } else {
      const newOptions = (screen.options || []).filter((_, i) => i !== index);
      onUpdate({ options: newOptions });
    }
  };

  const handleAddVariant = () => {
    const newKey = `variant-${variantKeys.length + 1}`;
    const updates: Partial<MultipleChoiceScreen> = {
      variants: {
        ...(screen as MultipleChoiceScreen).variants,
        [newKey]: {
          question: screen.question || "Enter your question",
          options: screen.options || [{ id: nanoid(), label: "Option 1", value: "option-1" }],
        },
      }
    };

    // Set default role variable if not set
    if (!(screen as MultipleChoiceScreen).roleVariable) {
      updates.roleVariable = "role";
    }

    onUpdate(updates);
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...(screen as MultipleChoiceScreen).variants };
    delete newVariants[key];
    onUpdate({ variants: newVariants });
  };

  return (
    <div className="space-y-6">
      {/* Defaults Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Default Content
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="question" className="text-xs">
            Question
          </Label>
          <textarea
            id="question"
            value={screen.question || ""}
            onChange={(e) => onUpdate({ question: e.target.value })}
            className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
            placeholder="Enter your question..."
            disabled={isLocked}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Options</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => handleAddOption()}
              disabled={isLocked}
            >
              <Plus size={12} className="mr-1" />
              Add
            </Button>
          </div>

          <div className="space-y-2">
            {(screen.options || []).map((option, index) => (
              <div
                key={option.id}
                className="flex items-center gap-2 p-2 bg-gray-50 rounded"
              >
                <GripVertical size={14} className="text-gray-400 cursor-grab" />
                <Input
                  value={option.label}
                  onChange={(e) => handleOptionChange(index, "label", e.target.value)}
                  className="h-7 text-sm flex-1"
                  placeholder="Label"
                  disabled={isLocked}
                />
                <Input
                  value={option.value}
                  onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                  className="h-7 text-sm w-24"
                  placeholder="Value"
                  disabled={isLocked}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveOption(index)}
                  disabled={isLocked}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Variants Section */}
      {supportsVariants && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Role-Based Variants
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs"
              onClick={handleAddVariant}
              disabled={isLocked}
            >
              <Plus size={12} className="mr-1" />
              Add Variant
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleVariable" className="text-xs text-gray-500">
              Role Variable
            </Label>
            <Input
              id="roleVariable"
              value={(screen as MultipleChoiceScreen).roleVariable || "role"}
              onChange={(e) => onUpdate({ roleVariable: e.target.value })}
              className="h-8 text-sm"
              placeholder="role"
              disabled={isLocked}
            />
          </div>

          {variantKeys.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="defaultVariant" className="text-xs text-gray-500">
                Default Variant (Fallback)
              </Label>
              <select
                id="defaultVariant"
                value={(screen as MultipleChoiceScreen).defaultVariant || ""}
                onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
                className="w-full h-8 px-2 text-sm border rounded-md"
                disabled={isLocked}
              >
                <option value="">None (Use Default Content)</option>
                {variantKeys.map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-4 pt-2">
            {variantKeys.map((key) => {
              const variant = (screen as MultipleChoiceScreen).variants?.[key];
              if (!variant) return null;
              return (
                <div key={key} className="p-3 bg-gray-50 rounded space-y-3 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded border">{key}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-gray-400 hover:text-red-500"
                      onClick={() => handleRemoveVariant(key)}
                      disabled={isLocked}
                    >
                      <X size={12} />
                    </Button>
                  </div>

                  <Input
                    value={variant.question || ""}
                    onChange={(e) =>
                      onUpdate({
                        variants: {
                          ...(screen as MultipleChoiceScreen).variants,
                          [key]: { ...variant, question: e.target.value },
                        },
                      })
                    }
                    className="h-7 text-sm"
                    placeholder="Question override (optional)"
                    disabled={isLocked}
                  />

                  <div className="space-y-1">
                    {variant.options.map((option, index) => (
                      <div key={option.id} className="flex items-center gap-1">
                        <Input
                          value={option.label || ""}
                          onChange={(e) => handleOptionChange(index, "label", e.target.value, key)}
                          className="h-6 text-xs flex-1"
                          placeholder="Label"
                          disabled={isLocked}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveOption(index, key)}
                          disabled={isLocked}
                        >
                          <X size={10} />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-5 text-[10px] w-full mt-1"
                      onClick={() => handleAddOption(key)}
                      disabled={isLocked}
                    >
                      + Add Option
                    </Button>
                  </div>
                </div>
              );
            })}

            {variantKeys.length === 0 && (
              <div className="text-center p-4 border border-dashed rounded-md text-gray-400 text-xs">
                No variants added yet.
              </div>
            )}
          </div>
        </div>
      )}

      {screen.variableBinding !== undefined && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label htmlFor="variableBinding" className="text-xs">
              Save to Variable
            </Label>
            <Input
              id="variableBinding"
              value={screen.variableBinding || ""}
              onChange={(e) => onUpdate({ variableBinding: e.target.value })}
              className="h-8 text-sm"
              placeholder="variableName"
              disabled={isLocked}
            />
          </div>
        </>
      )}
    </div>
  );
}

interface InputFieldsProps {
  screen: InputScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<InputScreen>) => void;
}

function InputFields({ screen, onUpdate, isLocked }: InputFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-xs">
          Prompt
        </Label>
        <textarea
          id="prompt"
          value={screen.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
          placeholder="Enter your prompt..."
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inputType" className="text-xs">
          Input Type
        </Label>
        <select
          id="inputType"
          value={screen.inputType}
          onChange={(e) =>
            onUpdate({ inputType: e.target.value as InputScreen["inputType"] })
          }
          className="w-full h-8 px-2 text-sm border rounded-md"
          disabled={isLocked}
        >
          <option value="text">Text</option>
          <option value="email">Email</option>
          <option value="number">Number</option>
          <option value="textarea">Text Area</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="placeholder" className="text-xs">
          Placeholder
        </Label>
        <Input
          id="placeholder"
          value={screen.placeholder || ""}
          onChange={(e) => onUpdate({ placeholder: e.target.value })}
          className="h-8 text-sm"
          placeholder="Type here..."
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="variableBinding" className="text-xs">
          Save to Variable
        </Label>
        <Input
          id="variableBinding"
          value={screen.variableBinding}
          onChange={(e) => onUpdate({ variableBinding: e.target.value })}
          className="h-8 text-sm"
          placeholder="variableName"
          disabled={isLocked}
        />
      </div>
    </div>
  );
}

interface InterstitialFieldsProps {
  screen: InterstitialScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<InterstitialScreen>) => void;
}

function InterstitialFields({ screen, onUpdate, isLocked }: InterstitialFieldsProps) {
  const variantKeys = Object.keys(screen.variants || {});
  // hasVariants is true if roleVariable is set - even with empty variants (user can add them)
  const hasVariants = !!screen.roleVariable;

  const handleMessageChange = (index: number, text: string, variantKey?: string) => {
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      const newMessages = [...variant.messages];
      newMessages[index] = { ...newMessages[index], text };
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, messages: newMessages },
        },
      });
    } else if (screen.messages) {
      const newMessages = [...screen.messages];
      newMessages[index] = { ...newMessages[index], text };
      onUpdate({ messages: newMessages });
    }
  };

  const handleAddMessage = (variantKey?: string) => {
    const newMessage: InterstitialMessage = { text: "New message..." };
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, messages: [...variant.messages, newMessage] },
        },
      });
    } else {
      onUpdate({ messages: [...(screen.messages || []), newMessage] });
    }
  };

  const handleRemoveMessage = (index: number, variantKey?: string) => {
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, messages: variant.messages.filter((_, i) => i !== index) },
        },
      });
    } else if (screen.messages) {
      onUpdate({ messages: screen.messages.filter((_, i) => i !== index) });
    }
  };

  const handleAddVariant = () => {
    const newKey = `variant-${variantKeys.length + 1}`;
    const updates: Partial<InterstitialScreen> = {
      variants: {
        ...screen.variants,
        [newKey]: {
          headline: screen.headline || "Analyzing your responses...",
          messages: screen.messages || [{ text: "Loading..." }],
        },
      },
    };

    // Set default role variable if not set
    if (!screen.roleVariable) {
      updates.roleVariable = "role";
    }

    onUpdate(updates);
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...screen.variants };
    delete newVariants[key];
    onUpdate({ variants: newVariants });
  };



  return (
    <div className="space-y-4">
      {/* Defaults Section */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Default Content
        </h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="headline"
          value={screen.headline || ""}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          className="h-8 text-sm"
          placeholder="Headline"
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Messages</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={() => handleAddMessage()}
            disabled={isLocked}
          >
            <Plus size={12} className="mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {(screen.messages || []).map((message, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={message.text}
                onChange={(e) => handleMessageChange(index, e.target.value)}
                className="h-8 text-sm flex-1"
                placeholder="Message text..."
                disabled={isLocked}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveMessage(index)}
                disabled={isLocked}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>


      <Separator />

      {/* Shared settings (animation, duration) */}
      <div className="space-y-2">
        <Label htmlFor="animation" className="text-xs">
          Animation
        </Label>
        <select
          id="animation"
          value={screen.animation}
          onChange={(e) =>
            onUpdate({ animation: e.target.value as InterstitialScreen["animation"] })
          }
          className="w-full h-8 px-2 text-sm border rounded-md"
          disabled={isLocked}
        >
          <option value="spinner">Spinner</option>
          <option value="progress-bar">Progress Bar</option>
          <option value="dots">Dots</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="duration" className="text-xs">
          Duration (ms)
        </Label>
        <Input
          id="duration"
          type="number"
          value={screen.duration}
          onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 0 })}
          className="h-8 text-sm"
          disabled={isLocked}
        />
      </div>

      <Separator />

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role-Based Variants
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddVariant}
            disabled={isLocked}
          >
            <Plus size={12} className="mr-1" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roleVariable" className="text-xs text-gray-500">
            Role Variable
          </Label>
          <Input
            id="roleVariable"
            value={screen.roleVariable || "role"}
            onChange={(e) => onUpdate({ roleVariable: e.target.value })}
            className="h-8 text-sm"
            placeholder="role"
            disabled={isLocked}
          />
        </div>

        {variantKeys.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="defaultVariant" className="text-xs text-gray-500">
              Default Variant (Fallback)
            </Label>
            <select
              id="defaultVariant"
              value={screen.defaultVariant || ""}
              onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
              className="w-full h-8 px-2 text-sm border rounded-md"
              disabled={isLocked}
            >
              <option value="">None (Use Default Content)</option>
              {variantKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {variantKeys.map((key) => {
            const variant = screen.variants?.[key];
            if (!variant) return null;
            return (
              <div key={key} className="p-3 bg-gray-50 rounded space-y-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded border">{key}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveVariant(key)}
                    disabled={isLocked}
                  >
                    <X size={12} />
                  </Button>
                </div>

                <Input
                  value={variant.headline}
                  onChange={(e) =>
                    onUpdate({
                      variants: {
                        ...screen.variants,
                        [key]: { ...variant, headline: e.target.value },
                      },
                    })
                  }
                  className="h-7 text-sm"
                  placeholder="Headline override (optional)"
                  disabled={isLocked}
                />

                <div className="space-y-1">
                  {variant.messages.map((message, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Input
                        value={message.text}
                        onChange={(e) => handleMessageChange(index, e.target.value, key)}
                        className="h-6 text-xs flex-1"
                        placeholder="Message"
                        disabled={isLocked}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveMessage(index, key)}
                        disabled={isLocked}
                      >
                        <X size={10} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 text-[10px] w-full mt-1"
                    onClick={() => handleAddMessage(key)}
                    disabled={isLocked}
                  >
                    + Add Message
                  </Button>
                </div>
              </div>
            );
          })}

          {variantKeys.length === 0 && (
            <div className="text-center p-4 border border-dashed rounded-md text-gray-400 text-xs">
              No variants added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Message Fields (formerly Affirmation/SocialProof)
interface MessageFieldsProps {
  screen: MessageScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<MessageScreen>) => void;
}

function MessageFields({ screen, onUpdate, isLocked }: MessageFieldsProps) {
  const variantKeys = Object.keys(screen.variants || {});


  const handleVariantChange = (
    key: string,
    field: keyof MessageVariant,
    value: string
  ) => {
    const existingVariant = screen.variants?.[key] || { headline: "", copy: "" };
    const newVariants: Record<string, MessageVariant> = {
      ...screen.variants,
      [key]: {
        ...existingVariant,
        [field]: value,
      },
    };
    onUpdate({ variants: newVariants });
  };

  const handleAddVariant = () => {
    const newKey = `variant-${variantKeys.length + 1}`;
    const newVariants = {
      ...screen.variants,
      [newKey]: {
        headline: "New headline",
        copy: "New copy text",
      },
    };
    onUpdate({ variants: newVariants });
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...screen.variants };
    delete newVariants[key];
    onUpdate({ variants: newVariants });
  };

  const handleRenameVariant = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !screen.variants) return;
    const newVariants: Record<string, MessageVariant> = {};
    for (const [k, v] of Object.entries(screen.variants)) {
      newVariants[k === oldKey ? newKey : k] = v;
    }
    const updates: Partial<MessageScreen> = { variants: newVariants };
    if (screen.defaultVariant === oldKey) {
      updates.defaultVariant = newKey;
    }
    onUpdate(updates);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="style" className="text-xs">
          Style
        </Label>
        <select
          id="style"
          value={screen.style || "standard"}
          onChange={(e) => onUpdate({ style: e.target.value as MessageScreen["style"] })}
          className="w-full h-8 px-2 text-sm border rounded-md"
          disabled={isLocked}
        >
          <option value="standard">Standard</option>
          <option value="toast">Toast</option>
          <option value="inline">Inline</option>
          <option value="modal">Modal</option>
          <option value="overlay">Overlay</option>
        </select>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Default Content
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline" className="text-xs">
            Headline
          </Label>
          <Input
            id="headline"
            value={screen.headline || ""}
            onChange={(e) => onUpdate({ headline: e.target.value })}
            className="h-8 text-sm"
            placeholder="Great choice!"
            disabled={isLocked}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="copy" className="text-xs">
            Copy
          </Label>
          <textarea
            id="copy"
            value={screen.copy || ""}
            onChange={(e) => onUpdate({ copy: e.target.value })}
            className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
            placeholder="You're on the right track..."
            disabled={isLocked}
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role-Based Variants
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddVariant}
            disabled={isLocked}
          >
            <Plus size={12} className="mr-1" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="conditionVariable" className="text-xs text-gray-500">
            Condition Variable
          </Label>
          <Input
            id="conditionVariable"
            value={screen.conditionVariable || "variable"}
            onChange={(e) => onUpdate({ conditionVariable: e.target.value })}
            className="h-8 text-sm"
            placeholder="e.g. barrier"
            disabled={isLocked}
          />
        </div>

        {variantKeys.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="defaultVariant" className="text-xs text-gray-500">
              Default Variant (Fallback)
            </Label>
            <select
              id="defaultVariant"
              value={screen.defaultVariant || ""}
              onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
              className="w-full h-8 px-2 text-sm border rounded-md"
              disabled={isLocked}
            >
              <option value="">None (Use Default Content)</option>
              {variantKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          {variantKeys.map((key) => (
            <div key={key} className="p-3 bg-gray-50 rounded space-y-2 border border-gray-200">
              <div className="flex items-center gap-2">
                <Input
                  value={key}
                  onChange={(e) => handleRenameVariant(key, e.target.value)}
                  className="h-6 text-xs flex-1 font-medium"
                  placeholder="Variant key"
                  disabled={isLocked}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => handleRemoveVariant(key)}
                  disabled={isLocked}
                >
                  <X size={12} />
                </Button>
              </div>
              <Input
                value={screen.variants?.[key]?.headline || ""}
                onChange={(e) => handleVariantChange(key, "headline", e.target.value)}
                className="h-7 text-sm"
                placeholder="Headline"
                disabled={isLocked}
              />
              <textarea
                value={screen.variants?.[key]?.copy || ""}
                onChange={(e) => handleVariantChange(key, "copy", e.target.value)}
                className="w-full h-16 px-2 py-1 text-xs border rounded resize-none"
                placeholder="Copy text..."
                disabled={isLocked}
              />
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Auto-proceed settings */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="autoProceed"
          checked={screen.autoProceed || false}
          onChange={(e) => onUpdate({ autoProceed: e.target.checked })}
          className="rounded"
          disabled={isLocked}
        />
        <Label htmlFor="autoProceed" className="text-xs cursor-pointer">
          Auto-proceed to next screen
        </Label>
      </div>

      {screen.autoProceed && (
        <div className="space-y-2">
          <Label htmlFor="duration" className="text-xs">
            Duration (ms)
          </Label>
          <Input
            id="duration"
            type="number"
            value={screen.duration || 3000}
            onChange={(e) => onUpdate({ duration: parseInt(e.target.value) || 3000 })}
            className="h-8 text-sm"
            disabled={isLocked}
          />
        </div>
      )}
    </div>
  );
}

// Form Fields (formerly AccountCreation)
interface FormFieldsProps {
  screen: FormScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<FormScreen>) => void;
}

function FormFields({ screen, onUpdate, isLocked }: FormFieldsProps) {
  const variantKeys = Object.keys(screen.variants || {});

  const toggleField = (field: "email" | "password" | "firstName" | "lastName") => {
    const current = screen.collectFields || [];
    const newFields = current.includes(field)
      ? current.filter((f) => f !== field)
      : [...current, field];
    onUpdate({ collectFields: newFields });
  };

  const toggleProvider = (provider: "google" | "microsoft" | "clever") => {
    const current = screen.socialProviders || [];
    const newProviders = current.includes(provider)
      ? current.filter((p) => p !== provider)
      : [...current, provider];
    onUpdate({ socialProviders: newProviders });
  };

  const handleVariantChange = (
    key: string,
    field: keyof FormScreen,
    value: any
  ) => {
    const existingVariant = screen.variants?.[key] || {};
    const newVariants = {
      ...screen.variants,
      [key]: {
        ...existingVariant,
        [field]: value,
      },
    };
    onUpdate({ variants: newVariants });
  };

  const handleAddVariant = () => {
    const newKey = `variant-${variantKeys.length + 1}`;
    const newVariants = {
      ...screen.variants,
      [newKey]: {
        headline: "New Headline",
        copy: "New copy text",
      },
    };
    onUpdate({ variants: newVariants });
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...screen.variants };
    delete newVariants[key];
    onUpdate({ variants: newVariants });
  };

  const handleRenameVariant = (oldKey: string, newKey: string) => {
    if (oldKey === newKey || !screen.variants) return;
    const newVariants: Record<string, Partial<FormScreen>> = {};
    for (const [k, v] of Object.entries(screen.variants)) {
      newVariants[k === oldKey ? newKey : k] = v;
    }
    const updates: Partial<FormScreen> = { variants: newVariants };
    if (screen.defaultVariant === oldKey) {
      updates.defaultVariant = newKey;
    }
    onUpdate(updates);
  };

  const toggleVariantField = (variantKey: string, field: "email" | "password" | "firstName" | "lastName") => {
    const variant = screen.variants?.[variantKey] || {};
    const current = variant.collectFields || screen.collectFields || [];
    const newFields = current.includes(field)
      ? current.filter((f) => f !== field)
      : [...current, field];

    handleVariantChange(variantKey, "collectFields", newFields);
  };

  const toggleVariantProvider = (variantKey: string, provider: "google" | "microsoft" | "clever") => {
    const variant = screen.variants?.[variantKey] || {};
    const current = variant.socialProviders || screen.socialProviders || [];
    const newProviders = current.includes(provider)
      ? current.filter((p) => p !== provider)
      : [...current, provider];
    handleVariantChange(variantKey, "socialProviders", newProviders);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="headline"
          value={screen.headline || ""}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          className="h-8 text-sm"
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="copy" className="text-xs">
          Copy
        </Label>
        <textarea
          id="copy"
          value={screen.copy || ""}
          onChange={(e) => onUpdate({ copy: e.target.value })}
          className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
          disabled={isLocked}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label className="text-xs">Collect Fields</Label>
        <div className="space-y-1">
          {(["email", "password", "firstName", "lastName"] as const).map((field) => (
            <label key={field} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={screen.collectFields?.includes(field) || false}
                onChange={() => toggleField(field)}
                className="rounded"
                disabled={isLocked}
              />
              {field}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="showSocialLogin"
          checked={screen.showSocialLogin}
          onChange={(e) => onUpdate({ showSocialLogin: e.target.checked })}
          className="rounded"
          disabled={isLocked}
        />
        <Label htmlFor="showSocialLogin" className="text-xs cursor-pointer">
          Show social login options
        </Label>
      </div>

      {screen.showSocialLogin && (
        <div className="space-y-2">
          <Label className="text-xs">Social Providers</Label>
          <div className="space-y-1">
            {(["google", "microsoft", "clever"] as const).map((provider) => (
              <label key={provider} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={screen.socialProviders?.includes(provider) || false}
                  onChange={() => toggleProvider(provider)}
                  className="rounded"
                  disabled={isLocked}
                />
                {provider}
              </label>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role-Based Variants
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddVariant}
            disabled={isLocked}
          >
            <Plus size={12} className="mr-1" />
            Add Variant
          </Button>
        </div>

        {variantKeys.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="defaultVariant" className="text-xs text-gray-500">
              Default Variant (Fallback)
            </Label>
            <select
              id="defaultVariant"
              value={screen.defaultVariant || ""}
              onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
              className="w-full h-8 px-2 text-sm border rounded-md"
              disabled={isLocked}
            >
              <option value="">None (Use Default Content)</option>
              {variantKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-3">
          {variantKeys.map((key) => {
            const variant = screen.variants?.[key];
            if (!variant) return null;
            // Determine active custom settings or inherit from default
            const showSocial = variant.showSocialLogin !== undefined ? variant.showSocialLogin : screen.showSocialLogin;
            const collectFields = variant.collectFields || screen.collectFields || [];
            const socialProviders = variant.socialProviders || screen.socialProviders || [];
            const fieldsInherited = variant.collectFields === undefined;
            const socialInherited = variant.socialProviders === undefined;

            return (
              <div key={key} className="p-3 bg-gray-50 rounded space-y-3 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Input
                    value={key}
                    onChange={(e) => handleRenameVariant(key, e.target.value)}
                    className="h-6 text-xs flex-1 font-medium"
                    placeholder="Variant key"
                    disabled={isLocked}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleRemoveVariant(key)}
                    disabled={isLocked}
                  >
                    <X size={12} />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-gray-500">Messaging</Label>
                  <Input
                    value={variant.headline || ""}
                    onChange={(e) => handleVariantChange(key, "headline", e.target.value)}
                    className="h-7 text-sm"
                    placeholder="Headline"
                    disabled={isLocked}
                  />
                  <textarea
                    value={variant.copy || ""}
                    onChange={(e) => handleVariantChange(key, "copy", e.target.value)}
                    className="w-full h-16 px-2 py-1 text-xs border rounded resize-none"
                    placeholder="Copy text..."
                    disabled={isLocked}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-gray-500">Fields</Label>
                  <div className="space-y-1 pl-1">
                    {(["email", "password", "firstName", "lastName"] as const).map((field) => (
                      <label key={field} className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={collectFields.includes(field)}
                          onChange={() => toggleVariantField(key, field)}
                          className="rounded"
                          disabled={isLocked}
                        />
                        <span className={collectFields.includes(field) ? "text-black" : "text-gray-500"}>
                          {field} {fieldsInherited ? "(inherited)" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] uppercase text-gray-500">Social</Label>
                  <div className="flex items-center gap-2 pl-1 mb-1">
                    <input
                      type="checkbox"
                      checked={showSocial}
                      onChange={(e) => handleVariantChange(key, "showSocialLogin", e.target.checked)}
                      className="rounded"
                      disabled={isLocked}
                    />
                    <span className="text-xs">Show Social Login</span>
                  </div>

                  {showSocial && (
                    <div className="space-y-1 pl-1 ml-4 border-l-2 border-gray-200 pl-2">
                      {(["google", "microsoft", "clever"] as const).map((provider) => (
                        <label key={provider} className="flex items-center gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={socialProviders.includes(provider)}
                            onChange={() => toggleVariantProvider(key, provider)}
                            className="rounded"
                            disabled={isLocked}
                          />
                          <span className={socialProviders.includes(provider) ? "text-black" : "text-gray-500"}>
                            {provider} {socialInherited ? "(inherited)" : ""}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Paywall Fields
interface PaywallFieldsProps {
  screen: PaywallScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<PaywallScreen>) => void;
}

function PaywallFields({ screen, onUpdate, isLocked }: PaywallFieldsProps) {
  const variantKeys = Object.keys(screen.variants || {});

  const handlePropChange = (index: number, value: string, variantKey?: string) => {
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      const newProps = [...variant.valuePropositions];
      newProps[index] = value;
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, valuePropositions: newProps },
        },
      });
    } else if (screen.valuePropositions) {
      const newProps = [...screen.valuePropositions];
      newProps[index] = value;
      onUpdate({ valuePropositions: newProps });
    }
  };

  const handleAddProp = (variantKey?: string) => {
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, valuePropositions: [...variant.valuePropositions, "New benefit"] },
        },
      });
    } else {
      onUpdate({ valuePropositions: [...(screen.valuePropositions || []), "New benefit"] });
    }
  };

  const handleRemoveProp = (index: number, variantKey?: string) => {
    if (variantKey && screen.variants) {
      const variant = screen.variants[variantKey];
      onUpdate({
        variants: {
          ...screen.variants,
          [variantKey]: { ...variant, valuePropositions: variant.valuePropositions.filter((_, i) => i !== index) },
        },
      });
    } else if (screen.valuePropositions) {
      onUpdate({ valuePropositions: screen.valuePropositions.filter((_, i) => i !== index) });
    }
  };

  const handleAddVariant = () => {
    const newKey = `variant-${variantKeys.length + 1}`;
    const updates: Partial<PaywallScreen> = {
      variants: {
        ...screen.variants,
        [newKey]: {
          headline: screen.headline || "Unlock the Full Experience",
          valuePropositions: screen.valuePropositions || ["Premium feature"],
        },
      },
    };

    if (!screen.roleVariable) {
      updates.roleVariable = "role";
    }

    onUpdate(updates);
  };

  const handleRemoveVariant = (key: string) => {
    const newVariants = { ...screen.variants };
    delete newVariants[key];
    onUpdate({ variants: newVariants });
  };

  return (
    <div className="space-y-4">
      {/* Defaults Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Default Content
          </h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="headline" className="text-xs">
            Headline
          </Label>
          <Input
            id="headline"
            value={screen.headline || ""}
            onChange={(e) => onUpdate({ headline: e.target.value })}
            className="h-8 text-sm"
            placeholder="Headline"
            disabled={isLocked}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Value Propositions</Label>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={() => handleAddProp()}
              disabled={isLocked}
            >
              <Plus size={12} className="mr-1" />
              Add
            </Button>
          </div>
          <div className="space-y-2">
            {(screen.valuePropositions || []).map((prop, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={prop}
                  onChange={(e) => handlePropChange(index, e.target.value)}
                  className="h-8 text-sm flex-1"
                  placeholder="Benefit"
                  disabled={isLocked}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleRemoveProp(index)}
                  disabled={isLocked}
                >
                  <X size={12} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      {/* Variants Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Role-Based Variants
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs"
            onClick={handleAddVariant}
            disabled={isLocked}
          >
            <Plus size={12} className="mr-1" />
            Add Variant
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="roleVariable" className="text-xs text-gray-500">
            Role Variable
          </Label>
          <Input
            id="roleVariable"
            value={screen.roleVariable || "role"}
            onChange={(e) => onUpdate({ roleVariable: e.target.value })}
            className="h-8 text-sm"
            placeholder="role"
            disabled={isLocked}
          />
        </div>

        {variantKeys.length > 0 && (
          <div className="space-y-2">
            <Label htmlFor="defaultVariant" className="text-xs text-gray-500">
              Default Variant (Fallback)
            </Label>
            <select
              id="defaultVariant"
              value={screen.defaultVariant || ""}
              onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
              className="w-full h-8 px-2 text-sm border rounded-md"
              disabled={isLocked}
            >
              <option value="">None (Use Default Content)</option>
              {variantKeys.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-4 pt-2">
          {variantKeys.map((key) => {
            const variant = screen.variants?.[key];
            if (!variant) return null;
            return (
              <div key={key} className="p-3 bg-gray-50 rounded space-y-3 border border-gray-200">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-gray-700 bg-white px-2 py-0.5 rounded border">{key}</p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-400 hover:text-red-500"
                    onClick={() => handleRemoveVariant(key)}
                    disabled={isLocked}
                  >
                    <X size={12} />
                  </Button>
                </div>

                <Input
                  value={variant.headline}
                  onChange={(e) =>
                    onUpdate({
                      variants: {
                        ...screen.variants,
                        [key]: { ...variant, headline: e.target.value },
                      },
                    })
                  }
                  className="h-7 text-sm"
                  placeholder="Headline override (optional)"
                  disabled={isLocked}
                />

                <div className="space-y-2">
                  {variant.valuePropositions.map((prop, index) => (
                    <div key={index} className="flex items-center gap-1">
                      <Input
                        value={prop}
                        onChange={(e) => handlePropChange(index, e.target.value, key)}
                        className="h-7 text-xs flex-1"
                        placeholder="Benefit override"
                        disabled={isLocked}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveProp(index, key)}
                        disabled={isLocked}
                      >
                        <X size={10} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 text-[10px] w-full"
                    onClick={() => handleAddProp(key)}
                    disabled={isLocked}
                  >
                    + Add Benefit
                  </Button>
                </div>
              </div>
            );
          })}

          {variantKeys.length === 0 && (
            <div className="text-center p-4 border border-dashed rounded-md text-gray-400 text-xs">
              No variants added yet.
            </div>
          )}
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="primaryLabel" className="text-xs">
          Primary Button Label
        </Label>
        <Input
          id="primaryLabel"
          value={screen.primaryAction?.label || ""}
          onChange={(e) =>
            onUpdate({
              primaryAction: {
                ...(screen.primaryAction || { label: "Upgrade", action: "upgrade" }),
                label: e.target.value,
              },
            })
          }
          className="h-8 text-sm"
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="secondaryLabel" className="text-xs">
          Secondary Button Label
        </Label>
        <Input
          id="secondaryLabel"
          value={screen.secondaryAction?.label || ""}
          onChange={(e) =>
            onUpdate({
              secondaryAction: {
                ...(screen.secondaryAction || { label: "Maybe Later", action: "continue-free" }),
                label: e.target.value,
              },
            })
          }
          className="h-8 text-sm"
          disabled={isLocked}
        />
      </div>
    </div>
  );
}

// Typing Test Fields
interface TypingTestFieldsProps {
  screen: TypingTestScreen;
  isLocked: boolean;
  onUpdate: (updates: Partial<TypingTestScreen>) => void;
}

function TypingTestFields({ screen, onUpdate, isLocked }: TypingTestFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="prompt" className="text-xs">
          Prompt
        </Label>
        <textarea
          id="prompt"
          value={screen.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          className="w-full h-16 px-3 py-2 text-sm border rounded-md resize-none"
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="testText" className="text-xs">
          Test Text
        </Label>
        <textarea
          id="testText"
          value={screen.testText}
          onChange={(e) => onUpdate({ testText: e.target.value })}
          className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
          placeholder="The quick brown fox..."
          disabled={isLocked}
        />
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="wpmVariable" className="text-xs">
          WPM Variable
        </Label>
        <Input
          id="wpmVariable"
          value={screen.variableBindings.wpm}
          onChange={(e) =>
            onUpdate({ variableBindings: { ...screen.variableBindings, wpm: e.target.value } })
          }
          className="h-8 text-sm"
          placeholder="currentWpm"
          disabled={isLocked}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="accuracyVariable" className="text-xs">
          Accuracy Variable (optional)
        </Label>
        <Input
          id="accuracyVariable"
          value={screen.variableBindings.accuracy || ""}
          onChange={(e) =>
            onUpdate({
              variableBindings: { ...screen.variableBindings, accuracy: e.target.value || undefined },
            })
          }
          className="h-8 text-sm"
          placeholder="currentAccuracy"
          disabled={isLocked}
        />
      </div>
    </div>
  );
}

