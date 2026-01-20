"use client";

import { useCallback } from "react";
import { Trash2, Copy, Plus, GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useEditorStore,
  selectSelectedNode,
  selectSelectedScreen,
} from "@/store/editorStore";
import type {
  Screen,
  QuestionScreen,
  MultiSelectScreen,
  InputScreen,
  GatekeeperScreen,
  QuestionOption,
  InterstitialScreen,
  InterstitialMessage,
  SocialProofScreen,
  SocialProofVariant,
} from "@/types/flow";
import { nanoid } from "nanoid";

export function PropertiesPanel() {
  const selectedNode = useEditorStore(selectSelectedNode);
  const selectedScreen = useEditorStore(selectSelectedScreen);
  const { updateNode, removeNode, duplicateNode } = useEditorStore();

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

  const handleUpdate = (updates: Partial<Screen>) => {
    updateNode(selectedNode.id, updates);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this screen?")) {
      removeNode(selectedNode.id);
    }
  };

  const handleDuplicate = () => {
    duplicateNode(selectedNode.id);
  };

  return (
    <div className="h-full flex flex-col bg-white border-l">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-sm">Properties</h2>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleDuplicate}
              title="Duplicate"
            >
              <Copy size={14} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-500 hover:text-red-600"
              onClick={handleDelete}
              title="Delete"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 uppercase tracking-wide">
          {selectedScreen.type.replace("-", " ")}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="content"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Content
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="p-4 space-y-4">
            {/* Common Fields */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-xs">
                Title
              </Label>
              <Input
                id="title"
                value={selectedScreen.title}
                onChange={(e) => handleUpdate({ title: e.target.value })}
                className="h-8 text-sm"
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
                  placeholder="Optional subtitle"
                />
              </div>
            )}

            <Separator />

            {/* Type-specific fields */}
            <ScreenTypeFields screen={selectedScreen} onUpdate={handleUpdate} />
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
  onUpdate: (updates: Partial<Screen>) => void;
}

function ScreenTypeFields({ screen, onUpdate }: ScreenTypeFieldsProps) {
  switch (screen.type) {
    case "gatekeeper":
    case "question":
    case "multi-select":
    case "discovery":
      return <QuestionFields screen={screen as QuestionScreen} onUpdate={onUpdate} />;

    case "input":
      return <InputFields screen={screen as InputScreen} onUpdate={onUpdate} />;

    case "interstitial":
      return (
        <InterstitialFields screen={screen as InterstitialScreen} onUpdate={onUpdate} />
      );

    case "social-proof":
      return (
        <SocialProofFields screen={screen as SocialProofScreen} onUpdate={onUpdate} />
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
  screen: QuestionScreen | MultiSelectScreen | GatekeeperScreen;
  onUpdate: (updates: Partial<QuestionScreen>) => void;
}

function QuestionFields({ screen, onUpdate }: QuestionFieldsProps) {
  const handleOptionChange = (
    index: number,
    field: keyof QuestionOption,
    value: string
  ) => {
    const newOptions = [...screen.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    onUpdate({ options: newOptions });
  };

  const handleAddOption = () => {
    const newOption: QuestionOption = {
      id: nanoid(),
      label: `Option ${screen.options.length + 1}`,
      value: `option-${screen.options.length + 1}`,
    };
    onUpdate({ options: [...screen.options, newOption] });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = screen.options.filter((_, i) => i !== index);
    onUpdate({ options: newOptions });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="question" className="text-xs">
          Question
        </Label>
        <textarea
          id="question"
          value={screen.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          className="w-full h-20 px-3 py-2 text-sm border rounded-md resize-none"
          placeholder="Enter your question..."
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Options</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={handleAddOption}
          >
            <Plus size={12} className="mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {screen.options.map((option, index) => (
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
              />
              <Input
                value={option.value}
                onChange={(e) => handleOptionChange(index, "value", e.target.value)}
                className="h-7 text-sm w-24"
                placeholder="Value"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleRemoveOption(index)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {screen.variableBinding !== undefined && (
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
          />
        </div>
      )}
    </div>
  );
}

interface InputFieldsProps {
  screen: InputScreen;
  onUpdate: (updates: Partial<InputScreen>) => void;
}

function InputFields({ screen, onUpdate }: InputFieldsProps) {
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
        />
      </div>
    </div>
  );
}

interface InterstitialFieldsProps {
  screen: InterstitialScreen;
  onUpdate: (updates: Partial<InterstitialScreen>) => void;
}

function InterstitialFields({ screen, onUpdate }: InterstitialFieldsProps) {
  const handleMessageChange = (index: number, text: string) => {
    const newMessages = [...screen.messages];
    newMessages[index] = { ...newMessages[index], text };
    onUpdate({ messages: newMessages });
  };

  const handleAddMessage = () => {
    const newMessage: InterstitialMessage = {
      text: "New message...",
    };
    onUpdate({ messages: [...screen.messages, newMessage] });
  };

  const handleRemoveMessage = (index: number) => {
    const newMessages = screen.messages.filter((_, i) => i !== index);
    onUpdate({ messages: newMessages });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="headline" className="text-xs">
          Headline
        </Label>
        <Input
          id="headline"
          value={screen.headline}
          onChange={(e) => onUpdate({ headline: e.target.value })}
          className="h-8 text-sm"
        />
      </div>

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
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs">Messages</Label>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 text-xs"
            onClick={handleAddMessage}
          >
            <Plus size={12} className="mr-1" />
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {screen.messages.map((message, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={message.text}
                onChange={(e) => handleMessageChange(index, e.target.value)}
                className="h-8 text-sm flex-1"
                placeholder="Message text..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleRemoveMessage(index)}
              >
                <X size={12} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface SocialProofFieldsProps {
  screen: SocialProofScreen;
  onUpdate: (updates: Partial<SocialProofScreen>) => void;
}

function SocialProofFields({ screen, onUpdate }: SocialProofFieldsProps) {
  const variantKeys = Object.keys(screen.variants || {});

  const handleVariantChange = (
    key: string,
    field: keyof SocialProofVariant,
    value: string
  ) => {
    const newVariants = {
      ...screen.variants,
      [key]: {
        ...screen.variants[key],
        [field]: value,
      },
    };
    onUpdate({ variants: newVariants });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roleVariable" className="text-xs">
          Role Variable
        </Label>
        <Input
          id="roleVariable"
          value={screen.roleVariable}
          onChange={(e) => onUpdate({ roleVariable: e.target.value })}
          className="h-8 text-sm"
          placeholder="role"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="defaultVariant" className="text-xs">
          Default Variant
        </Label>
        <select
          id="defaultVariant"
          value={screen.defaultVariant}
          onChange={(e) => onUpdate({ defaultVariant: e.target.value })}
          className="w-full h-8 px-2 text-sm border rounded-md"
        >
          {variantKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
      </div>

      <Separator />

      <div className="space-y-3">
        <Label className="text-xs">Variants</Label>
        {variantKeys.map((key) => (
          <div key={key} className="p-3 bg-gray-50 rounded space-y-2">
            <p className="text-xs font-medium text-gray-700">{key}</p>
            <Input
              value={screen.variants[key].headline}
              onChange={(e) => handleVariantChange(key, "headline", e.target.value)}
              className="h-7 text-sm"
              placeholder="Headline"
            />
            <textarea
              value={screen.variants[key].copy}
              onChange={(e) => handleVariantChange(key, "copy", e.target.value)}
              className="w-full h-16 px-2 py-1 text-xs border rounded resize-none"
              placeholder="Copy text..."
            />
          </div>
        ))}
      </div>
    </div>
  );
}
