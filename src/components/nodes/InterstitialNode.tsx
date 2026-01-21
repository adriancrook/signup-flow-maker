"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Loader2, BarChart3, MoreHorizontal } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, InterstitialScreen } from "@/types/flow";

const animationIcons = {
  spinner: Loader2,
  "progress-bar": BarChart3,
  dots: MoreHorizontal,
};

function InterstitialNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as InterstitialScreen;
  const Icon = animationIcons[screen.animation] || Loader2;

  // Check if using variant mode
  const hasVariants = screen.roleVariable && screen.variants && Object.keys(screen.variants).length > 0;
  const variantKeys = Object.keys(screen.variants || {});

  // Get display content (from variant or direct)
  const displayHeadline = hasVariants && screen.defaultVariant && screen.variants?.[screen.defaultVariant]
    ? screen.variants[screen.defaultVariant].headline
    : screen.headline;
  const displayMessages = hasVariants && screen.defaultVariant && screen.variants?.[screen.defaultVariant]
    ? screen.variants[screen.defaultVariant].messages
    : screen.messages;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Icon size={16} className="animate-spin" />}
      color="bg-amber-50"
    >
      <div className="space-y-2">
        {/* Show variant badges if using variants */}
        {hasVariants && (
          <>
            <div className="flex flex-wrap gap-1">
              {variantKeys.map((key) => (
                <span
                  key={key}
                  className={`text-[10px] rounded px-1.5 py-0.5 ${
                    key === screen.defaultVariant
                      ? "bg-amber-200 text-amber-800"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {key}
                </span>
              ))}
            </div>
            <p className="text-xs text-amber-600">
              Shows based on: [{screen.roleVariable}]
            </p>
          </>
        )}

        <p className="text-sm font-medium text-gray-700">{displayHeadline}</p>

        {displayMessages && displayMessages.length > 0 && (
          <div className="space-y-1">
            {displayMessages.slice(0, 3).map((message, index) => (
              <p
                key={index}
                className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 truncate"
              >
                &quot;{message.text}&quot;
              </p>
            ))}
            {displayMessages.length > 3 && (
              <p className="text-xs text-amber-500">
                +{displayMessages.length - 3} more messages
              </p>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Icon size={12} />
          <span>Duration: {screen.duration}ms</span>
        </div>
      </div>
    </BaseNode>
  );
}

export const InterstitialNode = memo(InterstitialNodeComponent);
