"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Keyboard } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, TypingTestScreen } from "@/types/flow";

function TypingTestNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as TypingTestScreen;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Keyboard size={16} />}
      color="bg-cyan-50"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700">{screen.prompt}</p>

        <div className="bg-white border rounded p-2">
          <p className="text-xs text-gray-600 font-mono line-clamp-2">
            &quot;{screen.testText}&quot;
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="text-[10px] bg-cyan-100 text-cyan-700 rounded px-1.5 py-0.5">
            WPM → {screen.variableBindings.wpm}
          </span>
          <span className="text-[10px] bg-cyan-100 text-cyan-700 rounded px-1.5 py-0.5">
            Accuracy → {screen.variableBindings.accuracy}
          </span>
        </div>

        {screen.minDuration && (
          <p className="text-[10px] text-gray-500">
            Min duration: {screen.minDuration}s
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const TypingTestNode = memo(TypingTestNodeComponent);
