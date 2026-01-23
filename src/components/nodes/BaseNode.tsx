"use client";

import { memo, type ReactNode, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Lock as LockIcon, Check, Link, Image as ImageIcon } from "lucide-react";
import { toPng } from "html-to-image";
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
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isImageCopied, setIsImageCopied] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleCopyImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!nodeRef.current) return;

    try {
      const dataUrl = await toPng(nodeRef.current, {
        cacheBust: true,
        backgroundColor: "white",
        pixelRatio: 1,
        filter: (node) => {
          if (node.classList && node.classList.contains("exclude-from-capture")) {
            return false;
          }
          return true;
        },
      });

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setIsImageCopied(true);
      setTimeout(() => setIsImageCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy node image:", err);
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("nodeId", screen.id);
      const linkUrl = url.toString();

      await navigator.clipboard.writeText(linkUrl);

      setIsLinkCopied(true);
      setTimeout(() => setIsLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      ref={nodeRef}
      className={cn(
        "w-[280px] rounded-lg border-2 shadow-md transition-all bg-white",
        color,
        selected ? "border-blue-500 ring-2 ring-blue-200" : "border-gray-200",
        !isValid && "border-red-500"
      )}
    >
      {/* Target Handle (input) - Left side for landscape layout */}
      {showTargetHandle && (
        <Handle
          type="target"
          position={Position.Left}
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
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide flex items-center gap-1">
            {screen.type.replace("-", " ")}
            {screen.isLocked !== false && <LockIcon size={10} className="text-gray-400" />}
          </p>
          <p className="text-sm font-semibold text-gray-900 truncate">
            {screen.title}
          </p>
        </div>
        <div className="flex gap-1 mr-9 self-start exclude-from-capture">
          <button
            onClick={handleCopyImage}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
            title="Copy Image"
          >
            {isImageCopied ? <Check size={14} className="text-green-600" /> : <ImageIcon size={14} />}
          </button>
          <button
            onClick={handleCopyLink}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-600 hover:bg-black/5 transition-colors"
            title="Copy Link"
          >
            {isLinkCopied ? <Check size={14} className="text-green-600" /> : <Link size={14} />}
          </button>
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

      {/* Source Handles - Right side for landscape layout */}
      {showSourceHandle && !sourceHandles && (
        <Handle
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white"
        />
      )}

      {/* Multiple source handles for options - stacked vertically on right side */}
      {sourceHandles &&
        sourceHandles.map((handle, index) => (
          <Handle
            key={handle.id}
            type="source"
            position={Position.Right}
            id={handle.id}
            className="!w-2 !h-2 !bg-blue-400 !border-2 !border-white"
            style={{
              top: `${((index + 1) / (sourceHandles.length + 1)) * 100}%`,
            }}
          />
        ))}
    </div>
  );
}

export const BaseNode = memo(BaseNodeComponent);
