// Core Flow Types for Signup Flow Builder

export type FlowCategory = "individual" | "educator";
export type TargetPortal = "student" | "teacher";

// Granular Component Types
// Granular Component Types
export type ScreenType =
  | "MC" // Multiple Choice
  | "MS" // Multi-Select
  | "TXT" // Text Input
  | "NUM" // Number Input
  | "TEST" // Typing Test
  | "MSG" // Message/Affirmation
  | "INT" // Interstitial
  | "FORM" // Account Creation
  | "PAY" // Paywall
  | "EXIT" // Handoff
  | "PAY" // Paywall
  | "EXIT" // Handoff
  | "LOGIC" // Branch/Logic
  | "STICKY-NOTE"; // Sticky Note

// Component Code format: [TYPE]-[SLUG]-[VARIANT]
export type ComponentCode = string;

export type ConditionOperator =
  | "equals"
  | "not_equals"
  | "contains"
  | "not_contains"
  | "greater_than"
  | "less_than"
  | "is_empty"
  | "is_not_empty"
  | "in_array";

export type VariableType = "string" | "number" | "array" | "boolean";

// Flow Variable - data collected during the flow
export interface FlowVariable {
  id: string;
  name: string; // e.g., "userName", "gradeLevel"
  displayName: string; // e.g., "User Name", "Grade Level"
  type: VariableType;
  defaultValue?: string | number | boolean | string[];
  source?: string; // Screen ID where this is collected
}

// Flow Settings
export interface FlowSettings {
  showProgressBar: boolean;
  progressBarStyle: "steps" | "percentage" | "dots";
  allowBackNavigation: boolean;
  autoSaveResponses: boolean;
  theme: "default" | "educator" | "individual";
}

// Main Flow interface
export interface Flow {
  id: string;
  name: string;
  description: string;
  category: FlowCategory;
  targetPortal: TargetPortal;
  version: string;
  createdAt: string;
  updatedAt: string;
  entryScreenId: string;
  screens: Screen[];
  variables: FlowVariable[];
  settings: FlowSettings;
}

// Branching Logic
export interface BranchCondition {
  variable: string;
  operator: ConditionOperator;
  value: string | number | boolean | string[];
}

export interface Branch {
  id: string;
  conditions: BranchCondition[];
  conditionOperator: "AND" | "OR";
  targetScreenId: string;
  label?: string;
}

// Validation Rule for inputs
export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern";
  value?: string | number;
  message: string;
}

// Question Option
export interface QuestionOption {
  id: string;
  label: string;
  value: string;
  icon?: string;
  description?: string;
  nextScreenId?: string; // Override default next screen
  setVariables?: Record<string, string | number | boolean>;
}

// Question Variant - role-specific question and options
export interface QuestionVariant {
  question?: string; // Optional to allow variants to just override options
  options: QuestionOption[];
}

// Interstitial Message
export interface InterstitialMessage {
  text: string; // Supports [variable] interpolation
  duration?: number;
  condition?: BranchCondition;
}

// Base Screen - all screen types extend this
export interface BaseScreen {
  id: string;
  type: ScreenType;
  componentCode?: ComponentCode; // e.g., MC-PURPOSE-STU
  title: string;
  subtitle?: string;
  position: { x: number; y: number };
  nextScreenId?: string;
  branches?: Branch[];
  tags?: string[];
  notes?: string;
  isLocked?: boolean;
}

// Logic Screen - pure routing logic (invisible to user)
export interface LogicScreen extends BaseScreen {
  type: "LOGIC";
  branches: Branch[];
  defaultScreenId: string;
}

// Multiple Choice Screen (MC)
// Replaces: Gatekeeper, Question, Discovery, ConfirmLocation
export interface MultipleChoiceScreen extends BaseScreen {
  type: "MC";
  // Content
  question?: string;
  options?: QuestionOption[];
  // Data Binding
  variableBinding?: string;
  // Variant Logic
  roleVariable?: string;
  variants?: Record<string, QuestionVariant>;
  defaultVariant?: string;
  // Settings
  allowMultiSelect?: boolean;
}

// Multi-Select Screen (MS)
export interface MultiSelectScreen extends BaseScreen {
  type: "MS";
  question: string;
  options: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  variableBinding: string;
}

// Input Screen (TXT | NUM)
export interface InputScreen extends BaseScreen {
  type: "TXT" | "NUM";
  prompt: string;
  inputType: "text" | "email" | "number" | "textarea";
  placeholder?: string;
  validation?: ValidationRule[];
  variableBinding: string;
}

// Typing Test Screen (TEST)
export interface TypingTestScreen extends BaseScreen {
  type: "TEST";
  prompt: string;
  testText: string;
  minDuration?: number;
  variableBindings: {
    wpm: string;
    accuracy: string;
  };
}

// Interstitial Variant - role-specific content
export interface InterstitialVariant {
  headline: string;
  messages: InterstitialMessage[];
}

// Interstitial Screen (INT)
export interface InterstitialScreen extends BaseScreen {
  type: "INT";
  // Simple mode
  headline?: string;
  messages?: InterstitialMessage[];
  // Variant mode
  roleVariable?: string;
  variants?: Record<string, InterstitialVariant>;
  defaultVariant?: string;
  // Settings
  duration: number;
  animation: "spinner" | "progress-bar" | "dots";
}

// Message Variant (MSG)
export interface MessageVariant {
  headline: string;
  copy: string;
  style?: "standard" | "toast" | "inline" | "modal" | "overlay";
}

// Message Screen (MSG) - Replaces Affirmation, SocialProof
export interface MessageScreen extends BaseScreen {
  type: "MSG";
  // Content (Simple)
  headline?: string;
  copy?: string;
  style?: "standard" | "toast" | "inline" | "modal" | "overlay";
  stats?: { label: string; value: string }[]; // For social proof legacy support

  // Logic
  conditionVariable?: string;
  variants?: Record<string, MessageVariant>;
  defaultVariant?: string;

  // Behavior
  autoProceed?: boolean;
  duration?: number;
}

// Account Creation Screen (FORM)
export interface FormScreen extends BaseScreen {
  type: "FORM";
  headline: string;
  copy: string;
  showSocialLogin: boolean;
  socialProviders?: ("google" | "microsoft" | "clever")[];
  collectFields: ("email" | "password" | "firstName" | "lastName")[];
  variants?: Record<string, Partial<FormScreen>>;
  defaultVariant?: string;
}

// Paywall Variant
export interface PaywallVariant {
  headline: string;
  valuePropositions: string[];
}

// Paywall Screen (PAY)
export interface PaywallScreen extends BaseScreen {
  type: "PAY";
  // Simple mode
  headline?: string;
  valuePropositions?: string[];
  // Variant mode
  roleVariable?: string;
  variants?: Record<string, PaywallVariant>;
  defaultVariant?: string;
  // Actions
  primaryAction: { label: string; action: "upgrade" };
  secondaryAction: { label: string; action: "continue-free" };
}

// Exit/Handoff Screen (EXIT)
export interface ExitScreen extends BaseScreen {
  type: "EXIT";
  provider?: string;
  providerVariable?: string;
  headline: string;
  copy: string;
  actionLabel: string;
  isTerminal: true;
}

// Sticky Note Screen (STICKY-NOTE)
export interface StickyNoteScreen extends BaseScreen {
  type: "STICKY-NOTE";
  color?: "yellow" | "blue" | "green" | "pink";
  metadata?: {
    authorId: string;
    createdAt: string;
  };
}

// Union type of all screens
export type Screen =
  | MultipleChoiceScreen
  | MultiSelectScreen
  | InputScreen
  | TypingTestScreen
  | LogicScreen
  | InterstitialScreen
  | MessageScreen
  | FormScreen
  | ExitScreen
  | PaywallScreen
  | StickyNoteScreen;

// React Flow Node Data
export interface FlowNodeData extends Record<string, unknown> {
  screen: Screen;
  isValid: boolean;
  validationErrors?: string[];
  isSelected: boolean;
  isHighlighted: boolean;
}

// React Flow Edge Data
export interface FlowEdgeData extends Record<string, unknown> {
  branch?: Branch;
  isDefault: boolean;
  label?: string;
}

// Component Template
export type ComponentCategory =
  | "entry"
  | "question"
  | "input"
  | "routing"
  | "terminal"
  | "message"
  | "annotation";

export interface ComponentTemplate {
  id: string;
  name: string;
  code: ComponentCode;
  description: string;
  category: ComponentCategory;
  icon: string;
  defaultScreen: Partial<Screen>;
  validFlows?: FlowCategory[];
  tags: string[];
  isShared: boolean;
}

// Helper type guards
export function isMultipleChoiceScreen(screen: Screen): screen is MultipleChoiceScreen {
  return screen.type === "MC";
}

export function isMultiSelectScreen(screen: Screen): screen is MultiSelectScreen {
  return screen.type === "MS";
}

export function isInputScreen(screen: Screen): screen is InputScreen {
  return screen.type === "TXT" || screen.type === "NUM";
}

export function isTypingTestScreen(screen: Screen): screen is TypingTestScreen {
  return screen.type === "TEST";
}

export function isLogicScreen(screen: Screen): screen is LogicScreen {
  return screen.type === "LOGIC";
}

export function isInterstitialScreen(screen: Screen): screen is InterstitialScreen {
  return screen.type === "INT";
}

export function isMessageScreen(screen: Screen): screen is MessageScreen {
  return screen.type === "MSG";
}

export function isFormScreen(screen: Screen): screen is FormScreen {
  return screen.type === "FORM";
}

export function isExitScreen(screen: Screen): screen is ExitScreen {
  return screen.type === "EXIT";
}

export function isPaywallScreen(screen: Screen): screen is PaywallScreen {
  return screen.type === "PAY";
}

export function isStickyNoteScreen(screen: Screen): screen is StickyNoteScreen {
  return screen.type === "STICKY-NOTE";
}

// Utility to check if screen has options
export function hasOptions(
  screen: Screen
): screen is MultipleChoiceScreen | MultiSelectScreen {
  return ["MC", "MS"].includes(screen.type);
}

// Utility to check if screen is terminal (ends flow)
export function isTerminalScreen(screen: Screen): boolean {
  return screen.type === "EXIT" || screen.type === "PAY";
}
