"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Users } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, GatekeeperScreen } from "@/types/flow";

function GatekeeperNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as GatekeeperScreen;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Users size={16} />}
      color="bg-purple-50"
      showTargetHandle={false}
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700 line-clamp-2">{screen.question}</p>

        {screen.options && screen.options.length > 0 && (
          <div className="space-y-1">
            {screen.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center gap-2 text-xs bg-purple-100 rounded px-2 py-1.5"
              >
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                <span className="text-purple-800 truncate flex-1">
                  {option.label}
                </span>
                {option.nextScreenId && (
                  <span className="text-purple-500 text-[10px]">→</span>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center gap-1 mt-2">
          <span className="text-[10px] uppercase tracking-wide text-purple-600 font-medium">
            Entry Point
          </span>
        </div>
      </div>
    </BaseNode>
  );
}

export const GatekeeperNode = memo(GatekeeperNodeComponent);
