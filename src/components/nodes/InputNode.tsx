"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Type, Mail, Hash, FileText } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, InputScreen } from "@/types/flow";

const inputTypeIcons = {
  text: Type,
  email: Mail,
  number: Hash,
  textarea: FileText,
};

function InputNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as InputScreen;
  const Icon = inputTypeIcons[screen.inputType] || Type;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<Icon size={16} />}
      color="bg-green-50"
    >
      <div className="space-y-2">
        <p className="text-sm text-gray-700 line-clamp-2">{screen.prompt}</p>

        <div className="bg-white border rounded px-3 py-2 text-xs text-gray-400">
          {screen.placeholder || `Enter ${screen.inputType}...`}
        </div>

        {screen.validation && screen.validation.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {screen.validation.map((rule, index) => (
              <span
                key={index}
                className="text-[10px] bg-green-100 text-green-700 rounded px-1.5 py-0.5"
              >
                {rule.type}
              </span>
            ))}
          </div>
        )}

        {screen.variableBinding && (
          <p className="text-xs text-green-600 bg-green-100 rounded px-2 py-0.5 inline-block">
            → {screen.variableBinding}
          </p>
        )}
      </div>
    </BaseNode>
  );
}

export const InputNode = memo(InputNodeComponent);
