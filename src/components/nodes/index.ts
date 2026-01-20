import type { NodeTypes } from "@xyflow/react";
import { GatekeeperNode } from "./GatekeeperNode";
import { QuestionNode } from "./QuestionNode";
import { InputNode } from "./InputNode";
import { TypingTestNode } from "./TypingTestNode";
import { BranchNode } from "./BranchNode";
import { InterstitialNode } from "./InterstitialNode";
import { SocialProofNode } from "./SocialProofNode";
import { ConfirmLocationNode } from "./ConfirmLocationNode";
import { DiscoveryNode } from "./DiscoveryNode";
import { TerminalNode } from "./TerminalNode";

// Map screen types to React Flow node components
export const nodeTypes: NodeTypes = {
  gatekeeper: GatekeeperNode,
  question: QuestionNode,
  "multi-select": QuestionNode, // Reuse QuestionNode for multi-select
  input: InputNode,
  "typing-test": TypingTestNode,
  branch: BranchNode,
  interstitial: InterstitialNode,
  "social-proof": SocialProofNode,
  "confirm-location": ConfirmLocationNode,
  discovery: DiscoveryNode,
  "account-creation": TerminalNode,
  "sso-handoff": TerminalNode,
  paywall: TerminalNode,
};

export {
  GatekeeperNode,
  QuestionNode,
  InputNode,
  TypingTestNode,
  BranchNode,
  InterstitialNode,
  SocialProofNode,
  ConfirmLocationNode,
  DiscoveryNode,
  TerminalNode,
};
