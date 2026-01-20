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

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Icon size={16} className="animate-spin" />}
      color="bg-amber-50"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{screen.headline}</p>

        {screen.messages && screen.messages.length > 0 && (
          <div className="space-y-1">
            {screen.messages.slice(0, 3).map((message, index) => (
              <p
                key={index}
                className="text-xs text-amber-700 bg-amber-100 rounded px-2 py-1 truncate"
              >
                &quot;{message.text}&quot;
              </p>
            ))}
            {screen.messages.length > 3 && (
              <p className="text-xs text-amber-500">
                +{screen.messages.length - 3} more messages
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
