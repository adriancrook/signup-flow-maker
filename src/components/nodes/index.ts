import type { NodeTypes } from "@xyflow/react";
import { QuestionNode } from "./QuestionNode";
import { InputNode } from "./InputNode";
import { TypingTestNode } from "./TypingTestNode";
import { BranchNode } from "./BranchNode";
import { InterstitialNode } from "./InterstitialNode";
import { AffirmationNode } from "./AffirmationNode";
import { TerminalNode } from "./TerminalNode";

// Map screen types to React Flow node components
export const nodeTypes: NodeTypes = {
  MC: QuestionNode,
  MS: QuestionNode,
  TXT: InputNode,
  NUM: InputNode,
  TEST: TypingTestNode,
  MSG: AffirmationNode, // Reusing AffirmationNode for generic Messages
  INT: InterstitialNode,
  FORM: TerminalNode, // Using TerminalNode for Form initially
  PAY: TerminalNode,  // Using TerminalNode for Paywall
  EXIT: TerminalNode,
  LOGIC: BranchNode,

  // Keep legacy mappings for safety if needed, or remove them
  gatekeeper: QuestionNode,
  question: QuestionNode,
  "multi-select": QuestionNode,
  input: InputNode,
  "typing-test": TypingTestNode,
  branch: BranchNode,
  interstitial: InterstitialNode,
  "social-proof": AffirmationNode,
  affirmation: AffirmationNode,
  "confirm-location": QuestionNode,
  discovery: QuestionNode,
  "account-creation": TerminalNode,
  "sso-handoff": TerminalNode,
  paywall: TerminalNode,
};

export {
  QuestionNode,
  InputNode,
  TypingTestNode,
  BranchNode,
  InterstitialNode,
  AffirmationNode,
  TerminalNode,
};
