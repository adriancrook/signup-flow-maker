"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { HelpCircle, CheckSquare } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, QuestionScreen, MultiSelectScreen } from "@/types/flow";

function QuestionNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as QuestionScreen | MultiSelectScreen;
  const isMultiSelect = screen.type === "multi-select";

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={isMultiSelect ? <CheckSquare size={16} /> : <HelpCircle size={16} />}
      color="bg-white"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700 line-clamp-2">{screen.question}</p>

        {screen.options && screen.options.length > 0 && (
          <div className="space-y-1">
            {screen.options.slice(0, 3).map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1"
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded border border-gray-300",
                    isMultiSelect ? "rounded" : "rounded-full"
                  )}
                />
                <span className="truncate">{option.label}</span>
                {option.nextScreenId && (
                  <span className="ml-auto text-blue-500">→</span>
                )}
              </div>
            ))}
            {screen.options.length > 3 && (
              <p className="text-xs text-gray-400 pl-2">
                +{screen.options.length - 3} more options
              </p>
            )}
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
