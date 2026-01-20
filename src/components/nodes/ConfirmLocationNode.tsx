"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { MapPin } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, ConfirmLocationScreen } from "@/types/flow";

function ConfirmLocationNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as ConfirmLocationScreen;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<MapPin size={16} />}
      color="bg-teal-50"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700">{screen.question}</p>

        <div className="bg-teal-100 rounded p-2 text-xs">
          <p className="text-teal-700">
            Detected: [{screen.detectedStateVariable}]
          </p>
        </div>

        <div className="flex gap-2">
          <span className="text-[10px] bg-green-100 text-green-700 rounded px-2 py-0.5">
            Yes
          </span>
          <span className="text-[10px] bg-gray-100 text-gray-600 rounded px-2 py-0.5">
            No, I&apos;m in ___
          </span>
        </div>

        <p className="text-[10px] text-teal-600 italic line-clamp-2">
          &quot;{screen.confirmationMessage}&quot;
        </p>

        {screen.variableBinding && (
          <p className="text-xs text-teal-600 bg-teal-100 rounded px-2 py-0.5 inline-block">
            → {screen.variableBinding}
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const ConfirmLocationNode = memo(ConfirmLocationNodeComponent);
