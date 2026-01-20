import type { ComponentTemplate, Screen } from "@/types/flow";
import { nanoid } from "nanoid";

// Helper to create screen templates with unique IDs
function createTemplate(
  template: Omit<ComponentTemplate, "id"> & { defaultScreen: Partial<Screen> }
): ComponentTemplate {
  return {
    ...template,
    id: template.name.toLowerCase().replace(/\s+/g, "-"),
    defaultScreen: {
      ...template.defaultScreen,
      id: "", // Will be set when added to canvas
    },
  };
}

export const componentTemplates: ComponentTemplate[] = [
  // Entry Components
  createTemplate({
    name: "Gatekeeper",
    description: "Role selection entry point for the flow",
    category: "entry",
    icon: "users",
    tags: ["entry", "role", "selection"],
    isShared: true,
    validFlows: ["individual", "educator"],
    defaultScreen: {
      type: "gatekeeper",
      title: "Select Your Role",
      question: "How will you use Typing.com?",
      options: [
        { id: nanoid(), label: "I'm a student", value: "student" },
        { id: nanoid(), label: "I'm a parent/homeschool teacher", value: "parent" },
        { id: nanoid(), label: "I'm an adult learner", value: "adult" },
      ],
      variableBinding: "role",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Educator Gatekeeper",
    description: "Role selection for educator flows",
    category: "entry",
    icon: "users",
    tags: ["entry", "role", "educator"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "gatekeeper",
      title: "Select Your Role",
      question: "What is your role in education?",
      options: [
        { id: nanoid(), label: "Teacher (I manage my own classroom)", value: "teacher" },
        { id: nanoid(), label: "School Administrator (I manage a school building)", value: "school-admin" },
        { id: nanoid(), label: "District Administrator (I manage multiple schools)", value: "district-admin" },
      ],
      variableBinding: "role",
      position: { x: 0, y: 0 },
    },
  }),

  // Question Components
  createTemplate({
    name: "Question",
    description: "Single-select question with options",
    category: "question",
    icon: "help-circle",
    tags: ["question", "select", "single"],
    isShared: true,
    defaultScreen: {
      type: "question",
      title: "New Question",
      question: "Enter your question here",
      options: [
        { id: nanoid(), label: "Option 1", value: "option-1" },
        { id: nanoid(), label: "Option 2", value: "option-2" },
      ],
      variableBinding: "answer",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Multi-Select",
    description: "Multiple selection question",
    category: "question",
    icon: "check-square",
    tags: ["question", "select", "multiple"],
    isShared: true,
    defaultScreen: {
      type: "multi-select",
      title: "Multi-Select Question",
      question: "Select all that apply",
      options: [
        { id: nanoid(), label: "Option 1", value: "option-1" },
        { id: nanoid(), label: "Option 2", value: "option-2" },
        { id: nanoid(), label: "Option 3", value: "option-3" },
      ],
      minSelections: 1,
      variableBinding: "selections",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Grade Level",
    description: "Teacher grade level selection",
    category: "question",
    icon: "graduation-cap",
    tags: ["teacher", "grade", "educator"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "multi-select",
      title: "Select Grade Level",
      question: "What grade levels do you teach?",
      options: [
        { id: nanoid(), label: "K-2", value: "k-2" },
        { id: nanoid(), label: "3-5", value: "3-5" },
        { id: nanoid(), label: "6-8", value: "6-8" },
        { id: nanoid(), label: "9-12", value: "9-12" },
      ],
      variableBinding: "gradeLevels",
      affirmation: {
        id: nanoid(),
        copy: "Excellent. We have curriculum aligned specifically to [state] standards for those grades.",
        style: "inline",
      },
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Student Count",
    description: "How many students",
    category: "question",
    icon: "users",
    tags: ["teacher", "students", "count"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "question",
      title: "Student Count",
      question: "How many students do you teach?",
      options: [
        { id: nanoid(), label: "1-30", value: "1-30" },
        { id: nanoid(), label: "31-100", value: "31-100" },
        { id: nanoid(), label: "101-500", value: "101-500" },
        { id: nanoid(), label: "500+", value: "500+" },
      ],
      variableBinding: "studentCount",
      affirmation: {
        id: nanoid(),
        copy: "Tools to manage student counts of any size... live tracking, etc.",
        style: "inline",
      },
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Content Needs",
    description: "Beyond typing skills needed",
    category: "question",
    icon: "book-open",
    tags: ["content", "curriculum", "teacher"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "multi-select",
      title: "Content Needs",
      question: "Beyond typing, what other skills are you looking to teach?",
      options: [
        { id: nanoid(), label: "Coding/Computer Basics", value: "coding" },
        { id: nanoid(), label: "Digital Citizenship", value: "digital-citizenship" },
        { id: nanoid(), label: "Career Prep", value: "career-prep" },
        { id: nanoid(), label: "Just Typing", value: "just-typing" },
      ],
      variableBinding: "contentNeeds",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Rostering Method",
    description: "How students will log in",
    category: "question",
    icon: "log-in",
    tags: ["rostering", "sso", "educator"],
    isShared: true,
    validFlows: ["educator"],
    defaultScreen: {
      type: "question",
      title: "Rostering",
      question: "How do you want your students to log in?",
      options: [
        { id: nanoid(), label: "Google/Microsoft Classroom", value: "google-microsoft" },
        { id: nanoid(), label: "Class Code/Username", value: "class-code" },
        { id: nanoid(), label: "Clever Secure Sync", value: "clever-secure-sync" },
        { id: nanoid(), label: "Clever Library", value: "clever-library" },
        { id: nanoid(), label: "ClassLink", value: "classlink" },
        { id: nanoid(), label: "Rapid Identity", value: "rapid-identity" },
      ],
      variableBinding: "rosteringMethod",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Learning Environment",
    description: "Ad importance for classroom",
    category: "question",
    icon: "monitor",
    tags: ["ads", "environment", "teacher"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "question",
      title: "Learning Environment",
      question: "How important is removing ads to your classroom management?",
      options: [
        { id: nanoid(), label: "Very Important", value: "very-important" },
        { id: nanoid(), label: "Somewhat Important", value: "somewhat-important" },
        { id: nanoid(), label: "Not a Priority", value: "not-priority" },
      ],
      variableBinding: "adImportance",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Accessibility",
    description: "IEP/504 accommodations needed",
    category: "question",
    icon: "accessibility",
    tags: ["accessibility", "iep", "teacher"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "question",
      title: "Accessibility",
      question: "Do you have students who require accessibility accommodations (IEP/504)?",
      options: [
        { id: nanoid(), label: "Yes", value: "yes" },
        { id: nanoid(), label: "No", value: "no" },
      ],
      variableBinding: "needsAccessibility",
      affirmation: {
        id: nanoid(),
        copy: "We provide WCAG 2.2 AA-compliant themes, audio dictation, and one-handed settings to ensure every student succeeds.",
        style: "inline",
      },
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Device Selection",
    description: "What devices students use",
    category: "question",
    icon: "laptop",
    tags: ["device", "hardware", "teacher"],
    isShared: false,
    validFlows: ["educator"],
    defaultScreen: {
      type: "question",
      title: "Device",
      question: "What device(s) will your students use to access Typing.com?",
      options: [
        { id: nanoid(), label: "Chromebooks", value: "chromebooks" },
        { id: nanoid(), label: "iPads/Tablets", value: "tablets" },
        { id: nanoid(), label: "Windows/Mac", value: "desktop" },
        { id: nanoid(), label: "Mixed", value: "mixed" },
      ],
      variableBinding: "device",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Purpose Assessment",
    description: "Why improving typing - for students",
    category: "question",
    icon: "target",
    tags: ["student", "purpose", "goal"],
    isShared: false,
    validFlows: ["individual"],
    defaultScreen: {
      type: "question",
      title: "Purpose Assessment",
      question: "Why are you looking to improve your typing today?",
      options: [
        { id: nanoid(), label: "Success in School/College", value: "school" },
        { id: nanoid(), label: "Tech & Coding Interests", value: "tech" },
        { id: nanoid(), label: "Just for Fun & Games", value: "fun" },
        { id: nanoid(), label: "Personal Growth", value: "growth" },
      ],
      variableBinding: "purpose",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Target Speed",
    description: "WPM goal selection",
    category: "question",
    icon: "gauge",
    tags: ["student", "speed", "goal"],
    isShared: false,
    validFlows: ["individual"],
    defaultScreen: {
      type: "question",
      title: "Target Speed",
      question: "What is your target typing speed?",
      options: [
        { id: nanoid(), label: "30 WPM", value: "30" },
        { id: nanoid(), label: "50 WPM", value: "50" },
        { id: nanoid(), label: "70 WPM", value: "70" },
        { id: nanoid(), label: "100+ WPM", value: "100" },
      ],
      variableBinding: "targetSpeed",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Barriers to Practice",
    description: "What stops them from practicing",
    category: "question",
    icon: "shield-off",
    tags: ["barriers", "practice", "shared"],
    isShared: true,
    defaultScreen: {
      type: "question",
      title: "Barriers to Practice",
      question: "What usually stops you from practicing?",
      options: [
        { id: nanoid(), label: "Distractions/Ads", value: "distractions" },
        { id: nanoid(), label: "Boredom", value: "boredom" },
        { id: nanoid(), label: "Lack of Time", value: "time" },
      ],
      variableBinding: "barrier",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Select Motivation",
    description: "What keeps them motivated",
    category: "question",
    icon: "zap",
    tags: ["motivation", "engagement", "shared"],
    isShared: true,
    defaultScreen: {
      type: "question",
      title: "Select Motivation",
      question: "What keeps you motivated when you're learning?",
      options: [
        { id: nanoid(), label: "Streaks", value: "streaks" },
        { id: nanoid(), label: "Games", value: "games" },
        { id: nanoid(), label: "Progress Tracking", value: "progress" },
      ],
      variableBinding: "motivation",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Daily Practice Goal",
    description: "How much time for practice",
    category: "question",
    icon: "clock",
    tags: ["practice", "time", "shared"],
    isShared: true,
    defaultScreen: {
      type: "question",
      title: "Daily Practice Goal",
      question: "How much time can you commit to practicing each day?",
      options: [
        { id: nanoid(), label: "5 Minutes", value: "5" },
        { id: nanoid(), label: "15 Minutes", value: "15" },
        { id: nanoid(), label: "30 Minutes", value: "30" },
      ],
      variableBinding: "dailyGoal",
      position: { x: 0, y: 0 },
    },
  }),

  // Input Components
  createTemplate({
    name: "Text Input",
    description: "Single line text input",
    category: "input",
    icon: "type",
    tags: ["input", "text", "form"],
    isShared: true,
    defaultScreen: {
      type: "input",
      title: "Text Input",
      prompt: "Enter your response",
      inputType: "text",
      placeholder: "Type here...",
      variableBinding: "textInput",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Child's Name",
    description: "Collect child's first name for parent flow",
    category: "input",
    icon: "user",
    tags: ["parent", "name", "child"],
    isShared: false,
    validFlows: ["individual"],
    defaultScreen: {
      type: "input",
      title: "Child's Name",
      prompt: "What is your child's first name?",
      subtitle: "So we can personalize their plan",
      inputType: "text",
      placeholder: "First name",
      validation: [{ type: "required", message: "Please enter a name" }],
      variableBinding: "childName",
      position: { x: 0, y: 0 },
    },
  }),

  // Feedback Components
  createTemplate({
    name: "Social Proof",
    description: "Trust messaging with role variants",
    category: "feedback",
    icon: "award",
    tags: ["trust", "social-proof", "shared"],
    isShared: true,
    defaultScreen: {
      type: "social-proof",
      title: "Social Proof",
      variants: {
        teacher: {
          headline: "Great choice!",
          copy: "You are joining 50 million teachers, students, and parents who trust Typing.com.",
        },
        "school-admin": {
          headline: "Great choice!",
          copy: "You are joining thousands of schools and 50 million users who trust Typing.com.",
        },
        "district-admin": {
          headline: "Great choice!",
          copy: "You are joining hundreds of districts and 50 million users who trust Typing.com.",
        },
        student: {
          headline: "Great choice!",
          copy: "You are joining 50 million students, parents, and teachers who trust Typing.com.",
        },
        parent: {
          headline: "Great choice!",
          copy: "You are joining 50 million parents, homeschoolers, teachers and students who trust Typing.com.",
        },
        adult: {
          headline: "Great choice!",
          copy: "You are joining 50 million professionals, teachers, and students who trust Typing.com.",
        },
      },
      defaultVariant: "student",
      roleVariable: "role",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Confirm Location",
    description: "Geo-detection confirmation for educators",
    category: "feedback",
    icon: "map-pin",
    tags: ["location", "state", "educator"],
    isShared: true,
    validFlows: ["educator"],
    defaultScreen: {
      type: "confirm-location",
      title: "Confirm Location",
      question: "We detected you're in [detectedState]. Is this correct?",
      detectedStateVariable: "detectedState",
      variableBinding: "confirmedState",
      confirmationMessage: "Great. We'll align your curriculum to [confirmedState] standards.",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Discovery",
    description: "How did you hear about us",
    category: "feedback",
    icon: "search",
    tags: ["discovery", "referral", "shared"],
    isShared: true,
    defaultScreen: {
      type: "discovery",
      title: "Discovery",
      question: "How did you hear about Typing.com?",
      options: [
        { id: nanoid(), label: "Colleague", value: "colleague" },
        { id: nanoid(), label: "Conference/PD", value: "conference" },
        { id: nanoid(), label: "Social Media", value: "social" },
        { id: nanoid(), label: "Search Engine", value: "search" },
        { id: nanoid(), label: "District Recommendation", value: "district" },
      ],
      variableBinding: "discoverySource",
      position: { x: 0, y: 0 },
    },
  }),

  // Routing Components
  createTemplate({
    name: "Branch",
    description: "Conditional routing logic",
    category: "routing",
    icon: "git-branch",
    tags: ["branch", "routing", "logic"],
    isShared: true,
    defaultScreen: {
      type: "branch",
      title: "Conditional Branch",
      branches: [],
      defaultScreenId: "",
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "SSO Handoff",
    description: "Redirect to SSO provider (exits flow)",
    category: "routing",
    icon: "external-link",
    tags: ["sso", "handoff", "exit"],
    isShared: true,
    validFlows: ["educator"],
    defaultScreen: {
      type: "sso-handoff",
      title: "SSO Handoff",
      headline: "Account setup managed by your school",
      copy: "Ask your IT administrator to add Typing.com in your [provider] dashboard. Once added, you can log in instantly using your existing school credentials.",
      provider: "",
      providerVariable: "rosteringMethod",
      actionLabel: "Got it",
      isTerminal: true,
      position: { x: 0, y: 0 },
    },
  }),

  // Utility Components
  createTemplate({
    name: "Typing Test",
    description: "Mini WPM baseline test",
    category: "utility",
    icon: "keyboard",
    tags: ["typing", "test", "wpm"],
    isShared: false,
    validFlows: ["individual"],
    defaultScreen: {
      type: "typing-test",
      title: "Mini Typing Test",
      prompt: "Let's get a baseline. Type the sentence below:",
      testText: "The quick brown fox jumps over the lazy dog.",
      variableBindings: {
        wpm: "currentWpm",
        accuracy: "currentAccuracy",
      },
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Plan Analysis",
    description: "Animated interstitial with dynamic messages",
    category: "utility",
    icon: "loader",
    tags: ["interstitial", "loading", "analysis"],
    isShared: true,
    defaultScreen: {
      type: "interstitial",
      title: "Plan Analysis",
      headline: "Building Your Plan",
      messages: [
        { text: "Analyzing your responses..." },
        { text: "Configuring curriculum..." },
        { text: "Personalizing your experience..." },
        { text: "Finalizing your plan..." },
      ],
      duration: 4000,
      animation: "progress-bar",
      position: { x: 0, y: 0 },
    },
  }),

  // Terminal Components
  createTemplate({
    name: "Account Creation",
    description: "Email/password signup form",
    category: "terminal",
    icon: "user-plus",
    tags: ["signup", "account", "form"],
    isShared: true,
    defaultScreen: {
      type: "account-creation",
      title: "Create Account",
      headline: "Your Plan is Ready!",
      copy: "Create your free account to save your settings and start your first lesson.",
      showSocialLogin: true,
      socialProviders: ["google", "microsoft"],
      collectFields: ["email", "password", "firstName"],
      position: { x: 0, y: 0 },
    },
  }),

  createTemplate({
    name: "Paywall",
    description: "PLUS upgrade offer",
    category: "terminal",
    icon: "credit-card",
    tags: ["paywall", "upgrade", "plus"],
    isShared: true,
    defaultScreen: {
      type: "paywall",
      title: "PLUS Offer",
      headline: "Unlock the Full Experience",
      valuePropositions: [
        "Full curriculum access",
        "Ad-free learning environment",
        "Progress tracking and reports",
      ],
      primaryAction: { label: "Upgrade to PLUS", action: "upgrade" },
      secondaryAction: { label: "Continue with Free", action: "continue-free" },
      position: { x: 0, y: 0 },
    },
  }),
];

// Group templates by category
export function getTemplatesByCategory() {
  const categories: Record<string, ComponentTemplate[]> = {};

  componentTemplates.forEach((template) => {
    if (!categories[template.category]) {
      categories[template.category] = [];
    }
    categories[template.category].push(template);
  });

  return categories;
}

// Get templates valid for a specific flow category
export function getTemplatesForFlow(flowCategory: "individual" | "educator") {
  return componentTemplates.filter(
    (t) => !t.validFlows || t.validFlows.includes(flowCategory)
  );
}

// Category display names and order
export const categoryInfo: Record<string, { label: string; order: number }> = {
  entry: { label: "Entry Points", order: 1 },
  question: { label: "Questions", order: 2 },
  input: { label: "Input", order: 3 },
  feedback: { label: "Feedback", order: 4 },
  routing: { label: "Routing", order: 5 },
  utility: { label: "Utility", order: 6 },
  terminal: { label: "Terminal", order: 7 },
};
