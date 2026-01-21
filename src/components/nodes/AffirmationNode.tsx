"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MessageSquareHeart } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, MessageScreen } from "@/types/flow";

function AffirmationNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as MessageScreen;

  // Determine if this is conditional mode (has conditionVariable and variants)
  const isConditional = screen.conditionVariable && screen.variants && Object.keys(screen.variants).length > 0;
  const variantKeys = Object.keys(screen.variants || {});

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<MessageSquareHeart size={16} />}
      color="bg-green-50"
    >
      <div className="space-y-2">
        {isConditional ? (
          // Conditional mode - show variants
          <>
            <p className="text-xs text-green-600">
              Based on: [{screen.conditionVariable}]
            </p>
            <div className="flex flex-wrap gap-1">
              {variantKeys.map((key) => (
                <span
                  key={key}
                  className={`text-[10px] rounded px-1.5 py-0.5 ${key === screen.defaultVariant
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {key}
                </span>
              ))}
            </div>

            {screen.defaultVariant && screen.variants?.[screen.defaultVariant] && (
              <div className="bg-green-100 rounded p-2">
                <p className="text-xs font-medium text-green-800">
                  {screen.variants[screen.defaultVariant].headline}
                </p>
                <p className="text-[10px] text-green-700 mt-1 line-clamp-2">
                  {screen.variants[screen.defaultVariant].copy}
                </p>
              </div>
            )}
          </>
        ) : (
          // Simple mode - static headline + copy
          <div className="bg-green-100 rounded p-2">
            {screen.headline ? (
              <p className="text-xs font-medium text-green-800">{screen.headline}</p>
            ) : (
              <p className="text-xs text-gray-500 italic">No headline set</p>
            )}
            {screen.copy ? (
              <p className="text-[10px] text-green-700 mt-1 line-clamp-2">{screen.copy}</p>
            ) : (
              <p className="text-[10px] text-gray-400 italic mt-1">No copy set</p>
            )}
          </div>
        )}

        {screen.autoProceed && (
          <p className="text-[10px] text-green-600">
            Auto-proceeds after {screen.duration || 3000}ms
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const AffirmationNode = memo(AffirmationNodeComponent);
