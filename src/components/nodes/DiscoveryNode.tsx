"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Search } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, DiscoveryScreen } from "@/types/flow";

function DiscoveryNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as DiscoveryScreen;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Search size={16} />}
      color="bg-pink-50"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700">{screen.question}</p>

        {screen.options && screen.options.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {screen.options.map((option) => (
              <span
                key={option.id}
                className="text-[10px] bg-pink-100 text-pink-700 rounded px-1.5 py-0.5"
              >
                {option.label}
              </span>
            ))}
          </div>
        )}

        {screen.variableBinding && (
          <p className="text-xs text-pink-600 bg-pink-100 rounded px-2 py-0.5 inline-block">
            → {screen.variableBinding}
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const DiscoveryNode = memo(DiscoveryNodeComponent);
