"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { FlowNodeData, LogicScreen } from "@/types/flow";

function BranchNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as LogicScreen;

  return (
    <BaseNode
      data={nodeData}
      selected={selected}
      icon={<GitBranch size={16} />}
      color="bg-indigo-50"
    >
      <div className="space-y-2">
        {screen.branches && screen.branches.length > 0 ? (
          <div className="space-y-1.5">
            {screen.branches.map((branch) => (
              <div
                key={branch.id}
                className="text-xs bg-indigo-100 rounded px-2 py-1.5"
              >
                <div className="flex items-center gap-1 text-indigo-700">
                  <span className="font-medium">if</span>
                  {branch.conditions.map((cond, i) => (
                    <span key={i}>
                      {i > 0 && (
                        <span className="text-indigo-500 mx-1">
                          {branch.conditionOperator}
                        </span>
                      )}
                      <span className="bg-indigo-200 rounded px-1">
                        {cond.variable}
                      </span>
                      <span className="text-indigo-500 mx-1">{cond.operator}</span>
                      <span className="bg-indigo-200 rounded px-1">
                        {String(cond.value)}
                      </span>
                    </span>
                  ))}
                </div>
                {branch.label && (
                  <p className="text-indigo-600 mt-1 text-[10px]">
                    → {branch.label}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-500 italic">No conditions defined</p>
        )}

        {screen.defaultScreenId && (
          <div className="text-xs text-gray-500 border-t pt-2">
            <span className="font-medium">else →</span> default path
          </div>
        )}

        <div className="text-[10px] text-indigo-600 font-medium uppercase">
          Routing Logic (Hidden)
        </div>
      </div>
    </BaseNode>
  );
}

export const BranchNode = memo(BranchNodeComponent);
