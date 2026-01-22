import type { NodeTypes } from "@xyflow/react";
import { QuestionNode } from "./QuestionNode";
import { InputNode } from "./InputNode";
import { TypingTestNode } from "./TypingTestNode";
import { BranchNode } from "./BranchNode";
import { InterstitialNode } from "./InterstitialNode";
import { AffirmationNode } from "./AffirmationNode";
import { TerminalNode } from "./TerminalNode";
import { default as StickyNoteNode } from "./StickyNoteNode";
import { withCommentBadge } from "@/components/comments/withCommentBadge";

// Wrapped components
const BadgeQuestionNode = withCommentBadge(QuestionNode);
const BadgeInputNode = withCommentBadge(InputNode);
const BadgeTypingTestNode = withCommentBadge(TypingTestNode);
const BadgeBranchNode = withCommentBadge(BranchNode);
const BadgeInterstitialNode = withCommentBadge(InterstitialNode);
const BadgeAffirmationNode = withCommentBadge(AffirmationNode);
const BadgeTerminalNode = withCommentBadge(TerminalNode);
const BadgeStickyNoteNode = withCommentBadge(StickyNoteNode);

// Map screen types to React Flow node components
export const nodeTypes: NodeTypes = {
  MC: BadgeQuestionNode,
  MS: BadgeQuestionNode,
  TXT: BadgeInputNode,
  NUM: BadgeInputNode,
  TEST: BadgeTypingTestNode,
  MSG: BadgeAffirmationNode,
  INT: BadgeInterstitialNode,
  FORM: BadgeTerminalNode,
  PAY: BadgeTerminalNode,
  EXIT: BadgeTerminalNode,
  LOGIC: BadgeBranchNode,

  // Keep legacy mappings for safety if needed, or remove them
  gatekeeper: BadgeQuestionNode,
  question: BadgeQuestionNode,
  "multi-select": BadgeQuestionNode,
  input: BadgeInputNode,
  "typing-test": BadgeTypingTestNode,
  branch: BadgeBranchNode,
  interstitial: BadgeInterstitialNode,
  "social-proof": BadgeAffirmationNode,
  affirmation: BadgeAffirmationNode,
  "confirm-location": BadgeQuestionNode,
  discovery: BadgeQuestionNode,
  "account-creation": BadgeTerminalNode,
  "sso-handoff": BadgeTerminalNode,
  paywall: BadgeTerminalNode,
  "sticky-note": BadgeStickyNoteNode,
  "STICKY-NOTE": BadgeStickyNoteNode,
};

export {
  QuestionNode,
  InputNode,
  TypingTestNode,
  BranchNode,
  InterstitialNode,
  AffirmationNode,
  TerminalNode,
  StickyNoteNode,
};
