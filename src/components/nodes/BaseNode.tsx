"use client";

import { memo, type ReactNode } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { FlowNodeData } from "@/types/flow";

interface BaseNodeProps {
  data: FlowNodeData;
  selected?: boolean;
  children: ReactNode;
  color?: string;
  icon?: ReactNode;
  showSourceHandle?: boolean;
  showTargetHandle?: boolean;
  sourceHandles?: { id: string; label: string }[];
}

function BaseNodeComponent({
  data,
  selected,
  children,
  color = "bg-white",
  icon,
  showSourceHandle = true,
  showTargetHandle = true,
  sourceHandles,
}: BaseNodeProps) {
  const { screen, isValid, validationErrors } = data;

  return (
    <div
      className={cn(
        "min-w-[200px] max-w-[280px] rounded-lg border-2 shadow-md transition-all",
        color,
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
        !isValid && "border-red-500"
      )}
    >
      {/* Target Handle (input) */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-gray-400 !border-2 !border-white"
        />
      )}

      {/* Header */}
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-2 border-b rounded-t-lg",
          selected ? "bg-blue-50" : "bg-gray-50"
        )}
      >
        {icon && <div className="text-gray-500">{icon}</div>}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {screen.type.replace("-", " ")}
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {screen.title}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">{children}</div>

      {/* Validation Errors */}
      {!isValid && validationErrors && validationErrors.length > 0 && (
        <div className="px-3 pb-2">
          <p className="text-xs text-red-600">{validationErrors[0]}</p>
        </div>
      )}

      {/* Source Handles */}
      {showSourceHandle && !sourceHandles && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
        />
      )}

      {/* Multiple source handles for options */}
      {sourceHandles &&
        sourceHandles.map((handle, index) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Bottom}
            id={handle.id}
            className="!w-2 !h-2 !bg-blue-400 !border-2 !border-white"
            style={{
              left: `${((index + 1) / (sourceHandles.length + 1)) * 100}%`,
            }}
          />
        ))}
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);
