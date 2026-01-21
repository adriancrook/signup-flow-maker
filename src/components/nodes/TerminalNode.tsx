"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { UserPlus, ExternalLink, CreditCard } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type {
  FlowNodeData,
  FormScreen,
  ExitScreen,
  PaywallScreen,
} from "@/types/flow";

function TerminalNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as FlowNodeData;
  const screen = nodeData.screen as FormScreen | ExitScreen | PaywallScreen;

  if (screen.type === "FORM") {
    return <AccountCreationNode data={nodeData} selected={selected} screen={screen as FormScreen} />;
  }

  if (screen.type === "EXIT") {
    return <SSOHandoffNode data={nodeData} selected={selected} screen={screen as ExitScreen} />;
  }

  if (screen.type === "PAY") {
    return <PaywallNode data={nodeData} selected={selected} screen={screen} />;
  }

  return null;
}

function AccountCreationNode({
  data,
  selected,
  screen,
}: {
  data: FlowNodeData;
  selected?: boolean;
  screen: FormScreen;
}) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      icon={<UserPlus size={16} />}
      color="bg-blue-50"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{screen.headline}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{screen.copy}</p>

        <div className="flex flex-wrap gap-1">
          {screen.collectFields.map((field) => (
            <span
              key={field}
              className="text-[10px] bg-blue-100 text-blue-700 rounded px-1.5 py-0.5"
            >
              {field}
            </span>
          ))}
        </div>

        {screen.showSocialLogin && screen.socialProviders && (
          <div className="flex gap-1 mt-1">
            {screen.socialProviders.map((provider) => (
              <span
                key={provider}
                className="text-[10px] bg-gray-100 text-gray-600 rounded px-1.5 py-0.5 capitalize"
              >
                {provider}
              </span>
            ))}
          </div>
        )}
      </div>
    </BaseNode>
  );
}

function SSOHandoffNode({
  data,
  selected,
  screen,
}: {
  data: FlowNodeData;
  selected?: boolean;
  screen: ExitScreen;
}) {
  return (
    <BaseNode
      data={data}
      selected={selected}
      icon={<ExternalLink size={16} />}
      color="bg-orange-50"
      showSourceHandle={false}
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">{screen.headline}</p>
        <p className="text-xs text-gray-500 line-clamp-2">{screen.copy}</p>

        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-orange-100 text-orange-700 rounded px-1.5 py-0.5">
            Provider: [{screen.providerVariable}]
          </span>
        </div>

        <div className="bg-orange-100 text-orange-800 text-xs rounded px-2 py-1 text-center">
          {screen.actionLabel}
        </div>

        <div className="text-[10px] text-orange-600 font-medium text-center uppercase">
          Terminal - Exits Flow
        </div>
      </div>
    </BaseNode>
  );
}

function PaywallNode({
  data,
  selected,
  screen,
}: {
  data: FlowNodeData;
  selected?: boolean;
  screen: PaywallScreen;
}) {
  // Check if using variant mode
  const hasVariants = screen.roleVariable && screen.variants && Object.keys(screen.variants).length > 0;
  const variantKeys = Object.keys(screen.variants || {});

  // Get display content (from selected default variant or direct fields)
  let displayHeadline: string | undefined;
  let displayValuePropositions: string[] | undefined;

  if (hasVariants && screen.defaultVariant && screen.variants?.[screen.defaultVariant]) {
    displayHeadline = screen.variants[screen.defaultVariant].headline;
    displayValuePropositions = screen.variants[screen.defaultVariant].valuePropositions;
  } else {
    displayHeadline = screen.headline;
    displayValuePropositions = screen.valuePropositions;
  }

  return (
    <BaseNode
      data={data}
      selected={selected}
      icon={<CreditCard size={16} />}
      color="bg-emerald-50"
    >
      <div className="space-y-2">
        {/* Show variant badges if using variants */}
        {hasVariants && (
          <>
            <div className="flex flex-wrap gap-1">
              {variantKeys.map((key) => (
                <span
                  key={key}
                  className={`text-[10px] rounded px-1.5 py-0.5 ${key === screen.defaultVariant
                    ? "bg-emerald-200 text-emerald-800"
                    : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {key}
                </span>
              ))}
            </div>
            <p className="text-xs text-emerald-600">
              Shows based on: [{screen.roleVariable}]
            </p>
          </>
        )}

        <p className="text-sm font-medium text-gray-700">{displayHeadline}</p>

        {displayValuePropositions && displayValuePropositions.length > 0 && (
          <ul className="space-y-1">
            {displayValuePropositions.slice(0, 3).map((prop, index) => (
              <li
                key={index}
                className="text-xs text-emerald-700 flex items-start gap-1"
              >
                <span className="text-emerald-500">✓</span>
                <span className="truncate">{prop}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-1 mt-2">
          <div className="bg-emerald-500 text-white text-xs rounded px-2 py-1.5 text-center font-medium">
            {screen.primaryAction.label}
          </div>
          {screen.secondaryAction && (
            <div className="bg-gray-100 text-gray-600 text-xs rounded px-2 py-1 text-center">
              {screen.secondaryAction.label}
            </div>
          )}
        </div>
      </div>
    </BaseNode>
  );
}

export const TerminalNode = memo(TerminalNodeComponent);
