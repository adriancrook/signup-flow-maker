"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MessageSquareHeart } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, MessageScreen, MessageVariant } from "@/types/flow";

function AffirmationNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as MessageScreen;

  // Determine if this is conditional mode (has conditionVariable and variants)
  const isConditional = screen.conditionVariable && screen.variants && Object.keys(screen.variants).length > 0;
  const variantEntries = Object.entries(screen.variants || {});

  // Helper to count total nested conditions across all variants
  const getTotalNestedCount = () => {
    let count = 0;
    for (const [, variant] of variantEntries) {
      if (variant.nestedGroup?.variants) {
        count += Object.keys(variant.nestedGroup.variants).length;
      }
    }
    return count;
  };

  const totalNestedConditions = getTotalNestedCount();

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<MessageSquareHeart size={16} />}
      color="bg-green-50"
    >
      <div className="space-y-2">
        {isConditional ? (
          // Conditional mode - show variants with nested conditions
          <>
            <p className="text-xs text-green-600">
              Based on: [{screen.conditionVariable}]
            </p>

            {/* Show up to 3 variants with their nested conditions */}
            <div className="space-y-1.5">
              {variantEntries.slice(0, 3).map(([key, variant]: [string, MessageVariant]) => {
                const nestedKeys = variant.nestedGroup?.variants
                  ? Object.keys(variant.nestedGroup.variants)
                  : [];
                const nestedVar = variant.nestedGroup?.variable;

                return (
                  <div
                    key={key}
                    className={`text-xs rounded px-2 py-1.5 ${key === screen.defaultVariant
                      ? "bg-green-200 text-green-800"
                      : "bg-gray-50 text-gray-700"
                      }`}
                  >
                    <div className="font-medium">{key}</div>

                    {/* Show headline preview */}
                    {variant.headline && (
                      <div className="text-[10px] opacity-75 truncate mt-0.5">
                        &ldquo;{variant.headline}&rdquo;
                      </div>
                    )}

                    {/* Show nested conditions if present */}
                    {nestedKeys.length > 0 && nestedVar && (
                      <div className="mt-1 text-[10px] text-blue-600">
                        + {nestedKeys.length} AND IF [{nestedVar}]
                        <span className="text-gray-400 ml-1">
                          ({nestedKeys.slice(0, 2).join(", ")}{nestedKeys.length > 2 ? "..." : ""})
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {variantEntries.length > 3 && (
                <p className="text-xs text-gray-400 pl-2">
                  +{variantEntries.length - 3} more variants
                </p>
              )}
            </div>

            {/* Summary of nested conditions */}
            {totalNestedConditions > 0 && (
              <p className="text-[10px] text-blue-500 bg-blue-50 rounded px-2 py-0.5">
                {totalNestedConditions} total AND IF conditions
              </p>
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

