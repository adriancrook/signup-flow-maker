"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { HelpCircle, CheckSquare } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, MultipleChoiceScreen, MultiSelectScreen } from "@/types/flow";

function QuestionNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as MultipleChoiceScreen | MultiSelectScreen;

  // Determine if multi-select mode is active (either native MS type or MC with toggle)
  const isMultiSelect =
    screen.type === "MS" ||
    (screen.type === "MC" && !!(screen as MultipleChoiceScreen).allowMultiSelect);

  // Check if this question has role-based variants (only MultipleChoiceScreen supports this)
  const hasVariants =
    screen.type === "MC" && !!(screen as MultipleChoiceScreen).roleVariable;
  const variantKeys = hasVariants
    ? Object.keys((screen as MultipleChoiceScreen).variants || {})
    : [];

  // Get question and options - use default variant content if in variant mode, otherwise direct fields
  let displayQuestion: string | undefined;
  let displayOptions: typeof screen.options;

  if (hasVariants && (screen as MultipleChoiceScreen).variants) {
    const defaultVariant = (screen as MultipleChoiceScreen).variants![
      (screen as MultipleChoiceScreen).defaultVariant || ""
    ];
    displayQuestion = defaultVariant?.question || screen.question;
    displayOptions = defaultVariant?.options || screen.options;
  } else {
    displayQuestion = screen.question;
    displayOptions = screen.options;
  }

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={isMultiSelect ? <CheckSquare size={16} /> : <HelpCircle size={16} />}
      color="bg-white"
      showSourceHandle={false}
    >
      <div className="space-y-2">
        {/* Variant badges */}
        {hasVariants && variantKeys.length > 0 && (
          <>
            <div className="flex flex-wrap gap-1 mb-1">
              {variantKeys.map((key) => (
                <span
                  key={key}
                  className={`text-[10px] px-1.5 py-0.5 rounded ${key === (screen as MultipleChoiceScreen).defaultVariant
                    ? "bg-purple-200 text-purple-800"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {key}
                </span>
              ))}
            </div>
            <p className="text-xs text-purple-600">
              Shows based on: [{(screen as MultipleChoiceScreen).roleVariable}]
            </p>
          </>
        )}

        <p className="text-sm text-gray-700 line-clamp-2">{displayQuestion}</p>

        {displayOptions && displayOptions.length > 0 && (
          <div className="space-y-1">
            {displayOptions.map((option) => (
              <div
                key={option.id}
                className="relative flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 group"
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded border border-gray-300",
                    isMultiSelect ? "rounded" : "rounded-full"
                  )}
                />
                <span className="truncate flex-1">{option.label}</span>
                {/* Visual indicator of flow */}
                {option.nextScreenId && (
                  <span className="text-blue-500">→</span>
                )}

                {/* Actual Source Handle for wiring */}
                <Handle
                  type="source"
                  position={Position.Right}
                  id={option.id}
                  className="!w-2 !h-2 !bg-blue-400 !border-2 !border-white opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ right: -4 }}
                />
              </div>
            ))}
          </div>
        )}

        {screen.variableBinding && (
          <p className="text-xs text-blue-600 bg-blue-50 rounded px-2 py-0.5 inline-block">
            → {screen.variableBinding}
          </p>
        )}
      </div>
    </BaseNode>
  );
}

// Helper for className
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export const QuestionNode = memo(QuestionNodeComponent);
