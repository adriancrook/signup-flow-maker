// Core Flow Types for Signup Flow Builder

export type FlowCategory = "individual" | "educator";
export type TargetPortal = "student" | "teacher";

export type ScreenType =
  | "gatekeeper"
  | "question"
  | "multi-select"
  | "input"
  | "typing-test"
  | "branch"
  | "interstitial"
  | "social-proof"
  | "affirmation"
  | "confirm-location"
  | "discovery"
  | "account-creation"
  | "sso-handoff"
  | "paywall";

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

// Affirmation displayed after a screen
export interface Affirmation {
  id: string;
  headline?: string;
  copy: string; // Supports [variable] interpolation
  duration?: number; // ms
  style: "toast" | "inline" | "modal";
  icon?: string;
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

// Interstitial Message
export interface InterstitialMessage {
  text: string; // Supports [variable] interpolation
  duration?: number;
  condition?: BranchCondition;
}

// Social Proof Variant
export interface SocialProofVariant {
  headline: string;
  copy: string;
  stats?: { label: string; value: string }[];
}

// Base Screen - all screen types extend this
export interface BaseScreen {
  id: string;
  type: ScreenType;
  title: string;
  subtitle?: string;
  position: { x: number; y: number };
  nextScreenId?: string;
  branches?: Branch[];
  affirmation?: Affirmation;
  tags?: string[];
  notes?: string;
}

// Gatekeeper Screen - role selection entry point
export interface GatekeeperScreen extends BaseScreen {
  type: "gatekeeper";
  question: string;
  options: QuestionOption[];
  variableBinding: string;
}

// Question Screen - single select
export interface QuestionScreen extends BaseScreen {
  type: "question";
  question: string;
  options: QuestionOption[];
  variableBinding?: string;
}

// Multi-Select Screen
export interface MultiSelectScreen extends BaseScreen {
  type: "multi-select";
  question: string;
  options: QuestionOption[];
  minSelections?: number;
  maxSelections?: number;
  variableBinding: string;
}

// Input Screen - text input
export interface InputScreen extends BaseScreen {
  type: "input";
  prompt: string;
  inputType: "text" | "email" | "number" | "textarea";
  placeholder?: string;
  validation?: ValidationRule[];
  variableBinding: string;
}

// Typing Test Screen
export interface TypingTestScreen extends BaseScreen {
  type: "typing-test";
  prompt: string;
  testText: string;
  minDuration?: number;
  variableBindings: {
    wpm: string;
    accuracy?: string;
  };
}

// Branch Screen - pure routing logic (invisible to user)
export interface BranchScreen extends BaseScreen {
  type: "branch";
  branches: Branch[];
  defaultScreenId: string;
}

// Interstitial Screen - animated loading/transition
export interface InterstitialScreen extends BaseScreen {
  type: "interstitial";
  headline: string;
  messages: InterstitialMessage[];
  duration: number;
  animation: "spinner" | "progress-bar" | "dots";
}

// Social Proof Screen with role variants
export interface SocialProofScreen extends BaseScreen {
  type: "social-proof";
  variants: Record<string, SocialProofVariant>;
  defaultVariant: string;
  roleVariable: string;
}

// Affirmation Variant (for conditional mode)
export interface AffirmationVariant {
  headline: string;
  copy: string;
}

// Affirmation Screen - displays after user actions
// Simple mode: just headline + copy
// Conditional mode: different messages based on a variable value (usually from prior screen)
export interface AffirmationScreen extends BaseScreen {
  type: "affirmation";
  // Simple mode - used when no conditionVariable is set
  headline?: string;
  copy?: string;
  // Conditional mode - variants keyed by variable value
  conditionVariable?: string; // e.g., "barrier", "motivation"
  variants?: Record<string, AffirmationVariant>;
  defaultVariant?: string; // fallback variant key
  // Display options
  autoProceed?: boolean; // auto-advance after duration
  duration?: number; // ms before auto-proceeding (default: 3000)
}

// Confirm Location Screen
export interface ConfirmLocationScreen extends BaseScreen {
  type: "confirm-location";
  question: string;
  detectedStateVariable: string;
  variableBinding: string;
  confirmationMessage: string;
}

// Discovery Screen - "How did you hear about us"
export interface DiscoveryScreen extends BaseScreen {
  type: "discovery";
  question: string;
  options: QuestionOption[];
  variableBinding: string;
}

// Account Creation Screen
export interface AccountCreationScreen extends BaseScreen {
  type: "account-creation";
  headline: string;
  copy: string;
  showSocialLogin: boolean;
  socialProviders?: ("google" | "microsoft" | "clever")[];
  collectFields: ("email" | "password" | "firstName" | "lastName")[];
}

// SSO Handoff Screen - terminal
export interface SSOHandoffScreen extends BaseScreen {
  type: "sso-handoff";
  provider: string;
  providerVariable: string;
  headline: string;
  copy: string;
  actionLabel: string;
  isTerminal: true;
}

// Paywall Screen
export interface PaywallScreen extends BaseScreen {
  type: "paywall";
  headline: string;
  valuePropositions: string[];
  primaryAction: { label: string; action: "upgrade" };
  secondaryAction: { label: string; action: "continue-free" };
}

// Union type of all screens
export type Screen =
  | GatekeeperScreen
  | QuestionScreen
  | MultiSelectScreen
  | InputScreen
  | TypingTestScreen
  | BranchScreen
  | InterstitialScreen
  | SocialProofScreen
  | AffirmationScreen
  | ConfirmLocationScreen
  | DiscoveryScreen
  | AccountCreationScreen
  | SSOHandoffScreen
  | PaywallScreen;

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

// Component Template for the library
export type ComponentCategory =
  | "entry"
  | "question"
  | "input"
  | "feedback"
  | "routing"
  | "terminal"
  | "utility";

export interface ComponentTemplate {
  id: string;
  name: string;
  description: string;
  category: ComponentCategory;
  icon: string;
  defaultScreen: Partial<Screen>;
  validFlows?: FlowCategory[];
  tags: string[];
  isShared: boolean;
}

// Helper type guards
export function isGatekeeperScreen(screen: Screen): screen is GatekeeperScreen {
  return screen.type === "gatekeeper";
}

export function isQuestionScreen(screen: Screen): screen is QuestionScreen {
  return screen.type === "question";
}

export function isMultiSelectScreen(screen: Screen): screen is MultiSelectScreen {
  return screen.type === "multi-select";
}

export function isInputScreen(screen: Screen): screen is InputScreen {
  return screen.type === "input";
}

export function isTypingTestScreen(screen: Screen): screen is TypingTestScreen {
  return screen.type === "typing-test";
}

export function isBranchScreen(screen: Screen): screen is BranchScreen {
  return screen.type === "branch";
}

export function isInterstitialScreen(screen: Screen): screen is InterstitialScreen {
  return screen.type === "interstitial";
}

export function isSocialProofScreen(screen: Screen): screen is SocialProofScreen {
  return screen.type === "social-proof";
}

export function isAffirmationScreen(screen: Screen): screen is AffirmationScreen {
  return screen.type === "affirmation";
}

export function isConfirmLocationScreen(screen: Screen): screen is ConfirmLocationScreen {
  return screen.type === "confirm-location";
}

export function isDiscoveryScreen(screen: Screen): screen is DiscoveryScreen {
  return screen.type === "discovery";
}

export function isAccountCreationScreen(screen: Screen): screen is AccountCreationScreen {
  return screen.type === "account-creation";
}

export function isSSOHandoffScreen(screen: Screen): screen is SSOHandoffScreen {
  return screen.type === "sso-handoff";
}

export function isPaywallScreen(screen: Screen): screen is PaywallScreen {
  return screen.type === "paywall";
}

// Utility to check if screen has options
export function hasOptions(
  screen: Screen
): screen is GatekeeperScreen | QuestionScreen | MultiSelectScreen | DiscoveryScreen {
  return ["gatekeeper", "question", "multi-select", "discovery"].includes(screen.type);
}

// Utility to check if screen is terminal (ends flow)
export function isTerminalScreen(screen: Screen): boolean {
  return screen.type === "sso-handoff" || screen.type === "paywall";
}
