"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Award } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, SocialProofScreen } from "@/types/flow";

function SocialProofNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as SocialProofScreen;
  const variantKeys = Object.keys(screen.variants || {});

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Award size={16} />}
      color="bg-yellow-50"
    >
      <div className="space-y-2">
        {variantKeys.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-1">
              {variantKeys.map((key) => (
                <span
                  key={key}
                  className={`text-[10px] rounded px-1.5 py-0.5 ${
                    key === screen.defaultVariant
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {key}
                </span>
              ))}
            </div>

            {screen.defaultVariant && screen.variants[screen.defaultVariant] && (
              <div className="bg-yellow-100 rounded p-2">
                <p className="text-xs font-medium text-yellow-800">
                  {screen.variants[screen.defaultVariant].headline}
                </p>
                <p className="text-[10px] text-yellow-700 mt-1 line-clamp-2">
                  {screen.variants[screen.defaultVariant].copy}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-gray-500 italic">No variants defined</p>
        )}

        {screen.roleVariable && (
          <p className="text-xs text-yellow-600">
            Shows based on: [{screen.roleVariable}]
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const SocialProofNode = memo(SocialProofNodeComponent);
