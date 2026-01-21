import { ComponentTemplate, ScreenType, ComponentCategory } from "../types/flow";

export const categoryInfo: Record<string, { label: string; order: number }> = {
  entry: { label: "Entry Points", order: 1 },
  question: { label: "Questions", order: 2 },
  input: { label: "Inputs", order: 3 },
  message: { label: "Messages", order: 4 },
  terminal: { label: "End Screens", order: 5 },
};

export const componentRegistry: ComponentTemplate[] = [
  // ---------------------------------------------------------------------------
  // 1. SCREEN COMPONENTS
  // ---------------------------------------------------------------------------

  // 1.1 Social Proof
  {
    id: "msg-social-proof",
    name: "Social Proof",
    code: "MSG-SOCIAL-PROOF",
    description: "Trust indicators displayed after gatekeeper",
    category: "message",
    icon: "users",
    isShared: true,
    tags: ["social-proof", "trust", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Social Proof",
      style: "overlay", // Using overlay style for big social proof messages
      copy: "You are joining 50 million users who trust Typing.com.",
      headline: "Great choice!"
      // Note: Variants will be handled by the Hydrator applying specific copy based on the full code (e.g. MSG-SOCIAL-PROOF-STU)
    },
  },

  // 1.1b Location Affirmation
  {
    id: "msg-location-edu-aff",
    name: "Location Success",
    code: "MSG-LOCATION-EDU-AFF",
    description: "Confirm location alignment",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "location"],
    defaultScreen: {
      type: "MSG",
      title: "Location Confirmed",
      headline: "Great.",
      copy: "We'll align your curriculum to [State] standards.",
      style: "standard",
    },
  },

  // 1.2 Confirm Location
  {
    id: "mc-location-edu",
    name: "Confirm Location",
    code: "MC-LOCATION-EDU",
    description: "Detects and confirms user state for curriculum alignment",
    category: "question",
    icon: "map-pin",
    isShared: true,
    tags: ["educator", "location"],
    defaultScreen: {
      type: "MC",
      title: "Confirm Location",
      question: "We detected you're in [Detected State]. Is this correct?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No, I'm in ___", value: "no" },
      ],
      variableBinding: "state",
    },
  },

  // 1.3 Purpose Assessment
  {
    id: "mc-purpose",
    name: "Purpose Assessment",
    code: "MC-PURPOSE",
    description: "Asks user for their primary goal",
    category: "question",
    icon: "target",
    isShared: true,
    tags: ["student", "adult"],
    defaultScreen: {
      type: "MC",
      title: "Purpose",
      question: "Why are you looking to improve your typing today?",
      options: [
        { id: "opt-school", label: "Success in School/College", value: "school" },
        { id: "opt-coding", label: "Tech & Coding Interests", value: "coding" },
        { id: "opt-fun", label: "Just for Fun & Games", value: "fun" },
        { id: "opt-growth", label: "Personal Growth", value: "growth" },
      ],
      variableBinding: "purpose",
      variants: {
        student: {
          question: "Why are you looking to improve your typing today?",
          options: [
            { id: "opt-school", label: "Success in School/College", value: "school" },
            { id: "opt-coding", label: "Tech & Coding Interests", value: "coding" },
            { id: "opt-fun", label: "Just for Fun & Games", value: "fun" },
            { id: "opt-growth", label: "Personal Growth", value: "growth" },
          ],
        },
        adult: {
          question: "What is your primary goal today?",
          options: [
            { id: "opt-technique", label: "I want to learn proper technique from scratch", value: "technique" },
            { id: "opt-speed", label: "I want to boost my existing speed and accuracy", value: "speed" },
            { id: "opt-test", label: "I just want to take a quick typing test", value: "test" },
          ],
        },
      },
    },
  },

  // 1.3b Purpose Affirmation
  {
    id: "msg-purpose-aff",
    name: "Purpose Affirmation",
    code: "MSG-PURPOSE-AFF",
    description: "Affirm student purpose",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "purpose"],
    defaultScreen: {
      type: "MSG",
      title: "Great Goal",
      headline: "Great goal.",
      copy: "Many students use our premium coding and test prep units to get ahead.",
      style: "standard",
    },
  },

  // 1.4 Mini Typing Test
  {
    id: "test-baseline-all",
    name: "Mini Typing Test",
    code: "TEST-BASELINE-ALL",
    description: "Quick 1-sentence typing test for baseline WPM",
    category: "input",
    icon: "keyboard",
    isShared: true,
    tags: ["test", "baseline"],
    defaultScreen: {
      type: "TEST",
      title: "Baseline Test",
      prompt: "Let's get a baseline. Type the sentence below:",
      testText: "The quick brown fox jumps over the lazy dog.",
      minDuration: 0,
      variableBindings: {
        wpm: "currentWpm",
      },
    },
  },

  // 1.4b Baseline Affirmation
  {
    id: "msg-baseline-aff",
    name: "Baseline Result",
    code: "MSG-BASELINE-AFF",
    description: "Display WPM result",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "test"],
    defaultScreen: {
      type: "MSG",
      title: "Baseline Result",
      headline: "Not bad!",
      copy: "You clocked in at [Current WPM] WPM. We can 2x that speed with practice.",
      style: "standard",
      // variableBinding: "currentWpm", // Ensure WPM is available
    },
  },

  // 1.5 Target Speed
  {
    id: "mc-target-all",
    name: "Target Speed",
    code: "MC-TARGET-ALL",
    description: "User sets their goal WPM",
    category: "question",
    icon: "gauge",
    isShared: true,
    tags: ["goal", "wpm"],
    defaultScreen: {
      type: "MC",
      title: "Target Speed",
      question: "What is your target typing speed?",
      options: [
        { id: "opt-40", label: "40 WPM", value: "40" },
        { id: "opt-60", label: "60 WPM", value: "60" },
        { id: "opt-80", label: "80 WPM", value: "80" },
        { id: "opt-100", label: "100+ WPM", value: "100+" },
      ],
      variableBinding: "targetSpeed",
    },
  },

  // 1.5b Target Affirmation
  {
    id: "msg-target-aff",
    name: "Target Set",
    code: "MSG-TARGET-AFF",
    description: "Confirm target speed",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "goal"],
    defaultScreen: {
      type: "MSG",
      title: "Target Set",
      headline: "We've got you.",
      copy: "We'll track your progress every step of the way to ensure you hit that goal.",
      style: "standard",
    },
  },

  // 1.6 Experience Level (Parent)
  {
    id: "mc-experience-par",
    name: "Child's Experience",
    code: "MC-EXPERIENCE-PAR",
    description: "Parent assesses child's level",
    category: "question",
    icon: "activity",
    isShared: false,
    tags: ["parent"],
    defaultScreen: {
      type: "MC",
      title: "Experience Level",
      question: "What is your child's typing experience level?",
      options: [
        { id: "opt-new", label: "Brand New", value: "new" },
        { id: "opt-peck", label: "Dabbles / Hunts & Pecks", value: "dabbles" },
        { id: "opt-fluent", label: "Fluent", value: "fluent" },
      ],
      variableBinding: "experienceLevel",
    },
  },

  // 1.6b Experience Affirmation
  {
    id: "msg-experience-aff",
    name: "Experience Confirmed",
    code: "MSG-EXPERIENCE-AFF",
    description: "Confirm experience level",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["affirmation", "parent"],
    defaultScreen: {
      type: "MSG",
      title: "Perfect Match",
      headline: "Perfect.",
      copy: "Typing.com has standards-aligned curriculum for every typing level.",
      style: "standard",
    },
  },

  // 1.7 Tech Skills (Parent)
  {
    id: "mc-techskills-par",
    name: "Tech Skills",
    code: "MC-TECHSKILLS-PAR",
    description: "Parent assesses tech literacy",
    category: "question",
    icon: "cpu",
    isShared: false,
    tags: ["parent"],
    defaultScreen: {
      type: "MC",
      title: "Tech Skills",
      question: "How would you rate their current Tech Literacy?",
      options: [
        { id: "opt-beg", label: "Beginner/None", value: "beginner" },
        { id: "opt-int", label: "Intermediate", value: "intermediate" },
        { id: "opt-adv", label: "Advanced", value: "advanced" },
      ],
      variableBinding: "techSkillsLevel",
    },
  },

  // 1.7b Tech Skills Affirmation
  {
    id: "msg-techskills-aff",
    name: "Skills Confirmed",
    code: "MSG-TECHSKILLS-AFF",
    description: "Confirm tech skills",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["affirmation", "parent"],
    defaultScreen: {
      type: "MSG",
      title: "Skills Configured",
      headline: "Excellent.",
      copy: "Our curriculum is designed specifically to build these future-ready skills, including Beyond Typing modules in our PLUS plan.",
      style: "standard",
    },
  },

  // 1.8 Screen Time Concern (Parent)
  {
    id: "mc-screentime-par",
    name: "Screen Time Concern",
    code: "MC-SCREENTIME-PAR",
    description: "Parent's concern about screens",
    category: "question",
    icon: "clock",
    isShared: false,
    tags: ["parent"],
    defaultScreen: {
      type: "MC",
      title: "Screen Time",
      question: "What is your biggest concern regarding screen time?",
      options: [
        { id: "opt-ads", label: "Exposure to Ads/Tracking", value: "ads" },
        { id: "opt-focus", label: "Lack of Focus", value: "focus" },
        { id: "opt-waste", label: "Wasting Time", value: "waste" },
        { id: "opt-safe", label: "Safety", value: "safety" },
      ],
      variableBinding: "screenTimeConcern",
    },
  },

  // 1.8b Screen Time Affirmation
  {
    id: "msg-screentime-aff",
    name: "Safety Confirmed",
    code: "MSG-SCREENTIME-AFF",
    description: "Address screen time concerns",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["affirmation", "parent"],
    defaultScreen: {
      type: "MSG",
      title: "Safety First",
      headline: "Understood.",
      copy: "That's why PLUS is 100% Ad-Free—eliminating distractions for safe, focused learning.",
      style: "standard",
    },
  },

  // 1.9 Certificate Need (Adult)
  {
    id: "mc-certificate-adl",
    name: "Certificate Need",
    code: "MC-CERTIFICATE-ADL",
    description: "Does user need work certificate",
    category: "question",
    icon: "award",
    isShared: false,
    tags: ["adult"],
    defaultScreen: {
      type: "MC",
      title: "Certificate",
      question: "Do you need a certificate of your WPM for work?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "needsCertificate",
    },
  },

  // 1.9b Certificate Affirmation
  {
    id: "msg-certificate-aff",
    name: "Certificate Info",
    code: "MSG-CERTIFICATE-AFF",
    description: "Confirm certificate availability",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["affirmation", "adult"],
    defaultScreen: {
      type: "MSG",
      title: "Certificates",
      headline: "Certified.",
      copy: "We provide verifiable certificates authenticating your performance for employers.",
      style: "standard",
    },
  },

  // 1.10 Barriers
  {
    id: "mc-barriers",
    name: "Barriers",
    code: "MC-BARRIERS",
    description: "What stops practice",
    category: "question",
    icon: "shield-alert",
    isShared: true,
    tags: ["barrier"],
    defaultScreen: {
      type: "MC",
      title: "Barriers",
      question: "What usually stops you from practicing?",
      options: [
        { id: "opt-distract", label: "Distractions/Ads", value: "distractions" },
        { id: "opt-bored", label: "Boredom", value: "boredom" },
        { id: "opt-time", label: "Lack of Time", value: "time" },
      ],
      variableBinding: "barrier",
      variants: {
        student: {
          question: "What usually stops you from practicing?",
          options: [
            { id: "opt-distract", label: "Distractions/Ads", value: "distractions" },
            { id: "opt-bored", label: "Boredom", value: "boredom" },
            { id: "opt-time", label: "Lack of Time", value: "time" },
          ],
        },
        parent: {
          question: "What usually stops them from practicing?",
          options: [
            { id: "opt-distract", label: "Distractions/Ads", value: "distractions" },
            { id: "opt-bored", label: "Boredom", value: "boredom" },
            { id: "opt-time", label: "Lack of Time", value: "time" },
          ],
        },
        adult: {
          question: "What usually stops you from practicing?",
          options: [
            { id: "opt-distract", label: "Distractions/Ads", value: "distractions" },
            { id: "opt-bored", label: "Boredom", value: "boredom" },
            { id: "opt-time", label: "Lack of Time", value: "time" },
          ],
        },
      },
    },
  },

  // 1.10b Barriers Affirmation
  {
    id: "msg-barriers",
    name: "Barriers Solution",
    code: "MSG-BARRIERS",
    description: "Address user barriers",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "barrier"],
    defaultScreen: {
      type: "MSG",
      title: "We Get It",
      headline: "We get it.",
      copy: "That's why PLUS removes all video ads to keep you focused.",
      style: "standard",
      variants: {
        student: {
          headline: "We get it.", copy: "That's why PLUS removes all video ads to keep you focused."
        },
        parent: {
          headline: "We get it.", copy: "That's why PLUS removes all video ads to keep them focused."
        },
        adult: {
          headline: "We get it.", copy: "That's why PLUS removes all video ads to keep you in a 'Flow State'."
        }
      }
    },
  },

  // 1.11 Motivation
  {
    id: "mc-motivation",
    name: "Motivation",
    code: "MC-MOTIVATION",
    description: "What drives learning",
    category: "question",
    icon: "zap",
    isShared: true,
    tags: ["motivation"],
    defaultScreen: {
      type: "MC",
      title: "Motivation",
      question: "What keeps you motivated?",
      options: [
        { id: "opt-streaks", label: "Streaks", value: "streaks" },
        { id: "opt-games", label: "Games", value: "games" },
        { id: "opt-track", label: "Progress Tracking", value: "tracking" },
      ],
      variableBinding: "motivation",
      variants: {
        student: {
          question: "What keeps you motivated when you're learning?",
          options: [
            { id: "opt-streaks", label: "Streaks", value: "streaks" },
            { id: "opt-games", label: "Games", value: "games" },
            { id: "opt-track", label: "Progress Tracking", value: "tracking" },
          ],
        },
        parent: {
          question: "What motivates them to learn a new skill?",
          options: [
            { id: "opt-fun", label: "Fun", value: "fun" },
            { id: "opt-grades", label: "Grades", value: "grades" },
            { id: "opt-rewards", label: "Rewards", value: "rewards" },
          ],
        },
        adult: {
          question: "What keeps you motivated when you're learning?",
          options: [
            { id: "opt-streaks", label: "Streaks", value: "streaks" },
            { id: "opt-certificates", label: "Certificates", value: "certificates" },
          ],
        },
      },
    },
  },

  // 1.11b Motivation Affirmation
  {
    id: "msg-motivation-aff",
    name: "Motivation Confirmed",
    code: "MSG-MOTIVATION-AFF",
    description: "Confirm motivation selection",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "motivation"],
    defaultScreen: {
      type: "MSG",
      title: "Perfect Match",
      headline: "Perfect!",
      copy: "Typing.com uses gamified learning to keep you engaged.",
      style: "standard",
    },
  },

  // 1.12 Discovery
  {
    id: "mc-discovery",
    name: "Discovery",
    code: "MC-DISCOVERY",
    description: "How did you hear about us",
    category: "question",
    icon: "search",
    isShared: true,
    tags: ["marketing"],
    defaultScreen: {
      type: "MC",
      title: "Discovery",
      question: "How did you hear about us?",
      options: [
        { id: "opt-search", label: "Search Engine", value: "search" },
        { id: "opt-social", label: "Social Media", value: "social" },
        { id: "opt-friend", label: "Friend/Colleague", value: "friend" },
      ],
      variableBinding: "discoverySource",
      variants: {
        student: {
          options: [
            { id: "opt-teacher", label: "Teacher", value: "teacher" },
            { id: "opt-friend", label: "Friend/Classmate", value: "friend" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
          ],
        },
        parent: {
          options: [
            { id: "opt-teacher", label: "Teacher", value: "teacher" },
            { id: "opt-friend", label: "Friend/Classmate", value: "friend" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
          ],
        },
        adult: {
          options: [
            { id: "opt-coworker", label: "Coworker", value: "coworker" },
            { id: "opt-friend", label: "Friend", value: "friend" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
          ],
        },
        teacher: {
          options: [
            { id: "opt-colleague", label: "Colleague", value: "colleague" },
            { id: "opt-conf", label: "Conference/PD", value: "conference" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
            { id: "opt-dist", label: "District Recommendation", value: "district" },
          ],
        },
        "school-admin": {
          options: [
            { id: "opt-colleague", label: "Colleague", value: "colleague" },
            { id: "opt-conf", label: "Conference/PD", value: "conference" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
            { id: "opt-dist", label: "District Recommendation", value: "district" },
          ],
        },
        "district-admin": {
          options: [
            { id: "opt-colleague", label: "Colleague", value: "colleague" },
            { id: "opt-conf", label: "Conference/PD", value: "conference" },
            { id: "opt-social", label: "Social Media", value: "social" },
            { id: "opt-search", label: "Search Engine", value: "search" },
            { id: "opt-dist", label: "District Recommendation", value: "district" },
          ],
        },
      },
    },
  },

  // 1.13 Daily Goal
  {
    id: "mc-dailygoal",
    name: "Daily Goal",
    code: "MC-DAILYGOAL",
    description: "Time commitment",
    category: "question",
    icon: "calendar",
    isShared: true,
    tags: ["goal"],
    defaultScreen: {
      type: "MC",
      title: "Daily Goal",
      question: "How much time can you commit daily?",
      options: [
        { id: "opt-5", label: "5 Mins", value: "5" },
        { id: "opt-15", label: "15 Mins", value: "15" },
        { id: "opt-30", label: "30 Mins", value: "30" },
      ],
      variableBinding: "dailyGoal",
      variants: {
        student: {
          question: "How much time can you commit to practicing each day?",
          options: [
            { id: "opt-5", label: "5 Mins", value: "5" },
            { id: "opt-15", label: "15 Mins", value: "15" },
            { id: "opt-30", label: "30 Mins", value: "30" },
          ],
        },
        parent: {
          question: "How much time will they be able to use Typing.com?",
          options: [
            { id: "opt-5", label: "5 Mins", value: "5" },
            { id: "opt-15", label: "15 Mins", value: "15" },
            { id: "opt-30", label: "30 Mins", value: "30" },
          ],
        },
        adult: {
          question: "How much time can you commit?",
          options: [
            { id: "opt-5", label: "5 Mins", value: "5" },
            { id: "opt-15", label: "15 Mins", value: "15" },
            { id: "opt-30", label: "30 Mins", value: "30" },
          ],
        },
      },
    },
  },

  // 1.13b Daily Goal Affirmation
  {
    id: "msg-dailygoal-aff",
    name: "Goal Confirmed",
    code: "MSG-DAILYGOAL-AFF",
    description: "Confirm daily goal",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["affirmation", "goal"],
    defaultScreen: {
      type: "MSG",
      title: "Goal Activated",
      headline: "Great commitment!",
      copy: "Daily Goal tracker activated. Consistency is the secret to doubling your speed.",
      style: "standard",
    },
  },

  // 1.14 Child's Name
  {
    id: "txt-childname-par",
    name: "Child's Name",
    code: "TXT-CHILDNAME-PAR",
    description: "Input for child's name",
    category: "input",
    icon: "user",
    isShared: false,
    tags: ["parent"],
    defaultScreen: {
      type: "TXT",
      title: "Child's Name",
      prompt: "What is your child's first name?",
      placeholder: "e.g. Noah",
      inputType: "text",
      variableBinding: "childName",
    },
  },

  // 1.15 Grade Level (Teacher)
  {
    id: "ms-grades-tch",
    name: "Grade Levels",
    code: "MS-GRADES-TCH",
    description: "Teacher selects grades",
    category: "question",
    icon: "graduation-cap",
    isShared: false,
    tags: ["teacher"],
    defaultScreen: {
      type: "MS", // Multi-Select
      title: "Grade Levels",
      question: "What grade levels do you teach?",
      options: [
        { id: "opt-k2", label: "K-2", value: "k-2" },
        { id: "opt-35", label: "3-5", value: "3-5" },
        { id: "opt-68", label: "6-8", value: "6-8" },
        { id: "opt-912", label: "9-12", value: "9-12" },
      ],
      variableBinding: "gradeLevels",
    },
  },

  // 1.16 Student Count
  {
    id: "num-students",
    name: "Student Count",
    code: "NUM-STUDENTS",
    description: "Number of students",
    category: "input",
    icon: "users",
    isShared: true,
    tags: ["educator"],
    defaultScreen: {
      type: "NUM",
      title: "Student Count",
      prompt: "How many students do you teach?",
      placeholder: "e.g. 25",
      inputType: "number",
      variableBinding: "studentCount",
    },
  },

  // 1.17 District Scope
  {
    id: "num-schools-dst",
    name: "School Count",
    code: "NUM-SCHOOLS-DST",
    description: "Number of schools in district",
    category: "input",
    icon: "building",
    isShared: false,
    tags: ["district"],
    defaultScreen: {
      type: "NUM",
      title: "School Count",
      prompt: "How many schools in your district require a solution?",
      inputType: "number",
      variableBinding: "schoolCount",
    },
  },

  // 1.18 Content Needs
  {
    id: "ms-content",
    name: "Content Needs",
    code: "MS-CONTENT",
    description: "Curriculum beyond typing",
    category: "question",
    icon: "book-open",
    isShared: true,
    tags: ["educator"],
    defaultScreen: {
      type: "MS",
      title: "Content Needs",
      question: "Beyond typing, what other skills are you looking to teach?",
      options: [
        { id: "opt-coding", label: "Coding/Computer Basics", value: "coding" },
        { id: "opt-digcit", label: "Digital Citizenship", value: "digcit" },
        { id: "opt-career", label: "Career Prep", value: "career" },
        { id: "opt-typing", label: "Just Typing", value: "typing" },
      ],
      variableBinding: "contentNeeds",
    },
  },

  // 1.19 Rostering
  {
    id: "mc-rostering",
    name: "Rostering",
    code: "MC-ROSTERING",
    description: "Login method selection",
    category: "question",
    icon: "key",
    isShared: true,
    tags: ["educator"],
    defaultScreen: {
      type: "MC",
      title: "Rostering",
      question: "How do you want your students to log in?",
      options: [
        { id: "opt-google", label: "Google/Microsoft", value: "google" },
        { id: "opt-clever", label: "Clever", value: "clever" },
        { id: "opt-class", label: "Class Code", value: "manual" },
      ],
      variableBinding: "rosteringMethod",
    },
  },

  // 1.20 Environment/Ads
  {
    id: "mc-environment",
    name: "Ads Concern",
    code: "MC-ENVIRONMENT",
    description: "Importance of removing ads",
    category: "question",
    icon: "eye-off",
    isShared: true,
    tags: ["educator"],
    defaultScreen: {
      type: "MC",
      title: "Environment",
      question: "How important is removing ads?",
      options: [
        { id: "opt-very", label: "Very Important", value: "very" },
        { id: "opt-some", label: "Somewhat", value: "somewhat" },
        { id: "opt-not", label: "Not a Priority", value: "none" },
      ],
      variableBinding: "adImportance",
    },
  },

  // 1.21 Accessibility
  {
    id: "mc-accessibility",
    name: "Accessibility",
    code: "MC-ACCESSIBILITY",
    description: "Need for accommodations",
    category: "question",
    icon: "accessibility",
    isShared: true,
    tags: ["educator"],
    defaultScreen: {
      type: "MC",
      title: "Accessibility",
      question: "Do students require accommodations?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "needsAccessibility",
    },
  },

  // 1.22 Device
  {
    id: "mc-device-tch",
    name: "Device",
    code: "MC-DEVICE-TCH",
    description: "Classroom hardware",
    category: "question",
    icon: "monitor",
    isShared: false,
    tags: ["teacher"],
    defaultScreen: {
      type: "MC",
      title: "Device",
      question: "What device(s) will students use?",
      options: [
        { id: "opt-chrome", label: "Chromebooks", value: "chromebook" },
        { id: "opt-ipad", label: "iPads/Tablets", value: "tablet" },
        { id: "opt-desk", label: "Desktop/Laptop", value: "desktop" },
      ],
      variableBinding: "device",
    },
  },

  // 1.23 Compliance
  {
    id: "mc-compliance-dst",
    name: "Compliance",
    code: "MC-COMPLIANCE-DST",
    description: "DPA Requirement",
    category: "question",
    icon: "file-text",
    isShared: false,
    tags: ["district"],
    defaultScreen: {
      type: "MC",
      title: "Compliance",
      question: "Does your district require a signed DPA?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "dpaStatus",
    },
  },

  // 1.24 Data Retention
  {
    id: "mc-retention",
    name: "Data Retention",
    code: "MC-RETENTION",
    description: "Year-over-year tracking",
    category: "question",
    icon: "database",
    isShared: true,
    tags: ["admin"],
    defaultScreen: {
      type: "MC",
      title: "Data Retention",
      question: "Do you need to track growth year-over-year?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "dataRetention",
    },
  },

  // 1.25 Analytics
  {
    id: "mc-analytics",
    name: "Analytics / ROI",
    code: "MC-ANALYTICS",
    description: "Reporting needs",
    category: "question",
    icon: "bar-chart",
    isShared: true,
    tags: ["admin"],
    defaultScreen: {
      type: "MC",
      title: "Analytics",
      question: "Do you need ROI reporting?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "analytics",
    },
  },

  // 1.26 Dual Role
  {
    id: "mc-dualrole-edu",
    name: "Dual Role",
    code: "MC-DUALROLE-EDU",
    description: "Admin who also teaches",
    category: "question",
    icon: "user-plus",
    isShared: true,
    tags: ["admin"],
    defaultScreen: {
      type: "MC",
      title: "Dual Role",
      question: "Do you also teach your own classes?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes", nextScreenId: "CODE:MSG-DUALROLE-AFF" },
        { id: "opt-no", label: "No", value: "no", nextScreenId: "CODE:MC-DISCOVERY-EDU" },
      ],
      variableBinding: "dualRole",
    },
  },

  // ---------------------------------------------------------------------------
  // 2. INTERSTITIALS
  // ---------------------------------------------------------------------------
  {
    id: "int-plan-analysis",
    name: "Plan Analysis",
    code: "INT-PLAN-ANALYSIS",
    description: "Building Plan Loading Screen",
    category: "message",
    icon: "loader",
    isShared: true,
    tags: ["loading"],
    defaultScreen: {
      type: "INT",
      title: "Plan Analysis",
      headline: "Building Your Plan...",
      duration: 3000,
      animation: "progress-bar",
      messages: [
        { text: "Analyzing inputs..." },
        { text: "Generating curriculum..." },
        { text: "Finalizing..." }
      ],
      variants: {
        student: { headline: "Building Your Plan...", messages: [{ text: "Measuring your baseline..." }, { text: "Setting target speed..." }, { text: "Optimizing curriculum..." }] },
        parent: { headline: "Building Plan...", messages: [{ text: "Assessing typing level..." }, { text: "Calibrating tech literacy modules..." }, { text: "Addressing screen time concerns..." }] },
        adult: { headline: "Building Your Plan...", messages: [{ text: "Optimizing for your goal..." }, { text: "Tackling your barriers..." }, { text: "Finalizing roadmap..." }] },
        teacher: { headline: "Building Classroom Plan...", messages: [{ text: "Confirming standards alignment..." }, { text: "Loading curriculum..." }, { text: "Configuring rostering..." }] },
        "school-admin": { headline: "Building School Plan...", messages: [{ text: "Scaling for student count..." }, { text: "Securing environment..." }, { text: "Enabling data retention..." }] },
        "district-admin": { headline: "Building District Plan...", messages: [{ text: "Mapping schools to dashboard..." }, { text: "Verifying rostering protocols..." }, { text: "Preparing compliance docs..." }] }
      }
    }
  },

  // ---------------------------------------------------------------------------
  // 3. ACCOUNT CREATION
  // ---------------------------------------------------------------------------
  {
    id: "form-signup",
    name: "Signup Form",
    code: "FORM-SIGNUP",
    description: "Main account creation form",
    category: "terminal",
    icon: "form-input",
    isShared: true,
    tags: ["signup"],
    defaultScreen: {
      type: "FORM",
      title: "Create Account",
      headline: "Your Plan is Ready",
      copy: "Create details to save your plan.",
      collectFields: ["email", "password"],
      showSocialLogin: true,
      variants: {
        student: { headline: "Your customized typing plan is ready!", copy: "We've built a roadmap to help you reach your goal." },
        parent: { headline: "Save your child's custom plan", copy: "We've generated your child's personalized roadmap." },
        adult: { headline: "Your customized typing plan is ready!", copy: "We've built a roadmap to help you reach your goal." },
        teacher: { headline: "Your Classroom is Ready.", copy: "Create your free account to save your classroom settings." },
        "school-admin": { headline: "Secure Your School's Learning Environment.", copy: "Create an account to save your school's data configuration." },
        "district-admin": { headline: "Your Compliant District Plan.", copy: "Solve your privacy requirements and rostering infrastructure today." }
      }
    }
  },

  // ---------------------------------------------------------------------------
  // 4. PAYWALL
  // ---------------------------------------------------------------------------
  {
    id: "pay-plus",
    name: "Plus Paywall",
    code: "PAY-PLUS",
    description: "Upsell screen",
    category: "terminal",
    icon: "credit-card",
    isShared: true,
    tags: ["paywall"],
    defaultScreen: {
      type: "PAY",
      title: "PLUS Plan",
      headline: "Unlock Full Experience",
      valuePropositions: [
        "Ad-free learning",
        "Unlimited history",
        "Certificates"
      ],
      primaryAction: { label: "Upgrade", action: "upgrade" },
      variants: {
        student: { headline: "Unlock the Full Experience", valuePropositions: ["Premium Content", "Zero Distractions"] },
        parent: { headline: "Unlock the Full Experience for [Child Name]", valuePropositions: ["Premium Content", "Zero Distractions"] },
        adult: { headline: "Your Typing.com PLUS plan is ready", valuePropositions: ["Ad-free learning", "Certificates", "Unlimited history"] },
        teacher: { headline: "Unlock the Full Classroom Experience", valuePropositions: ["Full Coding Curriculum", "Ad-free environment", "Student progress tracking"] },
        "school-admin": { headline: "Your School's Ad-Free Quote", valuePropositions: ["100% Ad-Free Walled Garden", "Unlimited Data Retention", "School-wide SSO"] },
        "district-admin": { headline: "Your District Implementation Roadmap", valuePropositions: ["100% Ad-Free Walled Garden", "Signed DPA Compliance", "District Master Dashboard"] }
      }
    }
  },

  // ---------------------------------------------------------------------------
  // 5. EXIT / HANDOFF
  // ---------------------------------------------------------------------------
  {
    id: "exit-sso-handoff",
    name: "SSO Handoff",
    code: "EXIT-SSO-HANDOFF",
    description: "Redirect for SSO users",
    category: "terminal",
    icon: "external-link",
    isShared: true,
    tags: ["exit"],
    defaultScreen: {
      type: "EXIT",
      title: "SSO Login",
      headline: "Log in with School",
      copy: "Please use your school portal to log in.",
      actionLabel: "Got it"
    }
  },
  {
    id: "exit-class-code",
    name: "Class Code Redirect",
    code: "EXIT-CLASS-CODE",
    description: "Redirect for students with code",
    category: "terminal",
    icon: "log-out",
    isShared: false,
    tags: ["exit"],
    defaultScreen: {
      type: "EXIT",
      title: "Class Code",
      headline: "Join Class",
      copy: "Enter your class code on the next screen.",
      actionLabel: "Enter Code"
    }
  },

  // ---------------------------------------------------------------------------
  // 6. GATEKEEPERS
  // ---------------------------------------------------------------------------
  {
    id: "mc-classcode-stu",
    name: "Class Code Check",
    code: "MC-CLASSCODE-STU",
    description: "Student class code check",
    category: "question",
    icon: "key",
    isShared: false,
    tags: ["gatekeeper", "student"],
    defaultScreen: {
      type: "MC",
      title: "Class Code",
      question: "Do you have a class code from your teacher?",
      options: [
        { id: "opt-yes", label: "Yes", value: "yes", nextScreenId: "CODE:EXIT-CLASS-CODE" },
        { id: "opt-no", label: "No", value: "no" },
      ],
      variableBinding: "hasClassCode"
    }
  },
  {
    id: "mc-gatekeeper-ind",
    name: "Individual Gatekeeper",
    code: "MC-GATEKEEPER-IND",
    description: "Entry for individual flow",
    category: "entry",
    icon: "user",
    isShared: false,
    validFlows: ["individual"],
    tags: ["gatekeeper"],
    defaultScreen: {
      type: "MC",
      title: "Who are you?",
      question: "I am a...",
      options: [
        { id: "opt-stu", label: "Student", value: "student" },
        { id: "opt-par", label: "Parent", value: "parent" },
        { id: "opt-adl", label: "Adult Learner", value: "adult" },
      ],
      variableBinding: "role"
    }
  },
  {
    id: "mc-gatekeeper-edu",
    name: "Educator Gatekeeper",
    code: "MC-GATEKEEPER-EDU",
    description: "Entry for educator flow",
    category: "entry",
    icon: "briefcase",
    isShared: false,
    validFlows: ["educator"],
    tags: ["gatekeeper"],
    defaultScreen: {
      type: "MC",
      title: "Who are you?",
      question: "I am a...",
      options: [
        { id: "opt-tch", label: "Teacher", value: "teacher" },
        { id: "opt-sch", label: "School Admin", value: "school-admin" },
        { id: "opt-dst", label: "District Admin", value: "district-admin" },
      ],
      variableBinding: "role"
    }
  },

  // ---------------------------------------------------------------------------
  // 1a. TEACHER SPECIFIC AFFIRMATIONS
  // ---------------------------------------------------------------------------
  {
    id: "msg-grades-tch-aff",
    name: "Affirmation: Grades",
    code: "MSG-GRADES-TCH-AFF",
    description: "Teacher grades affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Content Match",
      headline: "Excellent.",
      copy: "We have curriculum aligned specifically to [State] standards for those grades.",
      style: "standard",
    },
  },
  {
    id: "msg-students-tch-aff",
    name: "Affirmation: Student Count",
    code: "MSG-STUDENTS-TCH-AFF",
    description: "Teacher student count affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Classroom Size",
      headline: "Got it.",
      copy: "Our tools are built to manage student counts of any size with live tracking.",
      style: "standard",
    },
  },
  {
    id: "msg-content-tch-aff",
    name: "Affirmation: Content Needs",
    code: "MSG-CONTENT-TCH-AFF",
    description: "Teacher content affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Perfect Choice",
      headline: "Perfect choice.",
      copy: "Our PLUS license unlocks a full Tech Literacy curriculum, not just keyboarding.",
      style: "standard",
    },
  },
  {
    id: "msg-rostering-tch-aff",
    name: "Affirmation: Rostering",
    code: "MSG-ROSTERING-TCH-AFF",
    description: "Teacher rostering affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Seamless Sync",
      headline: "Ease of Use.",
      copy: "We sync seamlessly with your rostering method so you don't have to manually manage passwords.",
      style: "standard",
    },
  },
  {
    id: "msg-environment-tch-aff",
    name: "Affirmation: Environment",
    code: "MSG-ENVIRONMENT-TCH-AFF",
    description: "Teacher environment affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Distraction Free",
      headline: "Understood.",
      copy: "PLUS removes all ads to keep students in a focused 'flow state'.",
      style: "standard",
    },
  },
  {
    id: "msg-accessibility-tch-aff",
    name: "Affirmation: Accessibility",
    code: "MSG-ACCESSIBILITY-TCH-AFF",
    description: "Teacher accessibility affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Inclusivity",
      headline: "Inclusive.",
      copy: "We provide WCAG 2.2 AA-compliant themes, audio dictation, and one-handed settings to ensure every student succeeds.",
      style: "standard",
    },
  },
  {
    id: "msg-device-tch-aff",
    name: "Affirmation: Device",
    code: "MSG-DEVICE-TCH-AFF",
    description: "Teacher device affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["teacher", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Compatibility",
      headline: "Awesome!",
      copy: "Typing.com is designed to work on all devices without issue!",
      style: "standard",
    },
  },
  // SCHOOL ADMIN
  {
    id: "msg-schoolsize-sch-aff",
    name: "Affirmation: School Size",
    code: "MSG-SCHOOLSIZE-SCH-AFF",
    description: "School admin size affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["school-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Scalability",
      headline: "Scalable.",
      copy: "Our platform is optimized to handle high-volume traffic for schools your size.",
      style: "standard",
    },
  },
  {
    id: "msg-rostering-sch-aff",
    name: "Affirmation: Rostering (School)",
    code: "MSG-ROSTERING-SCH-AFF",
    description: "School admin rostering affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["school-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Infrastructure",
      headline: "Great.",
      copy: "We support Single Sign-On (SSO) to make school-wide deployment instant.",
      style: "standard",
    },
  },
  {
    id: "msg-environment-sch-aff",
    name: "Affirmation: Environment (School)",
    code: "MSG-ENVIRONMENT-SCH-AFF",
    description: "School admin environment affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["school-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Walled Garden",
      headline: "We hear you.",
      copy: "That's why PLUS creates a 100% Ad-Free, Walled Garden environment to minimize risk.",
      style: "standard",
    },
  },
  {
    id: "msg-retention-sch-aff",
    name: "Affirmation: Retention",
    code: "MSG-RETENTION-SCH-AFF",
    description: "Admin data retention affirmation",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Unlimited History",
      headline: "Noted.",
      copy: "We will enable Unlimited Data Retention for your account (removing the standard 70-day limit).",
      style: "standard",
    },
  },
  {
    id: "msg-analytics-sch-aff",
    name: "Affirmation: Analytics",
    code: "MSG-ANALYTICS-SCH-AFF",
    description: "Admin analytics affirmation",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Admin Console",
      headline: "Visible ROI.",
      copy: "Our Admin Console provides analytics to prove utilization and ROI.",
      style: "standard",
    },
  },
  // DISTRICT ADMIN
  {
    id: "msg-districtscope-dst-aff",
    name: "Affirmation: District Scope",
    code: "MSG-DISTRICTSCOPE-DST-AFF",
    description: "District scope affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["district-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Master Dashboard",
      headline: "Multi-Tenant.",
      copy: "We provide a District Master Dashboard to manage all schools from a single login.",
      style: "standard",
    },
  },
  {
    id: "msg-rostering-dst-aff",
    name: "Affirmation: Rostering (District)",
    code: "MSG-ROSTERING-DST-AFF",
    description: "District rostering affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["district-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Nightly Sync",
      headline: "Certified Partner.",
      copy: "We are a certified partner with your provider and support automated nightly rostering updates.",
      style: "standard",
    },
  },
  {
    id: "msg-compliance-dst-aff",
    name: "Affirmation: Compliance",
    code: "MSG-COMPLIANCE-DST-AFF",
    description: "District compliance affirmation",
    category: "message",
    icon: "check-circle",
    isShared: false,
    tags: ["district-admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Legal Safety",
      headline: "Fully Compliant.",
      copy: "Your PLUS plan includes a signed DPA to satisfy your legal and security teams.",
      style: "standard",
    },
  },
  // DUAL ROLE
  {
    id: "msg-dualrole-aff",
    name: "Affirmation: Dual Role",
    code: "MSG-DUALROLE-AFF",
    description: "Dual role affirmation",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "The Solution",
      headline: "Perfect.",
      copy: "You won't need two accounts. Our Role Switcher lets you toggle instantly between District/School Oversight and Classroom Instruction.",
      style: "standard",
    },
  },
  {
    id: "msg-teachercontent-aff",
    name: "Affirmation: Teacher Content (Dual)",
    code: "MSG-TEACHERCONTENT-AFF",
    description: "Dual role teacher content affirmation",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Dual Access",
      headline: "Curriculum Unlocked.",
      copy: "Your account includes full access to the PLUS Curriculum for your students, while maintaining admin privileges.",
      style: "standard",
    },
  },
  {
    id: "msg-teacheraccess-aff",
    name: "Affirmation: Teacher Access (Dual)",
    code: "MSG-TEACHERACCESS-AFF",
    description: "Dual role teacher accessibility affirmation",
    category: "message",
    icon: "check-circle",
    isShared: true,
    tags: ["admin", "affirmation"],
    defaultScreen: {
      type: "MSG",
      title: "Granular Control",
      headline: "We've got you covered.",
      copy: "You can apply specific accessibility settings to your own roster without altering global settings.",
      style: "standard",
    },
  },
  {
    id: "ms-content-tch-dual",
    name: "Question: Teacher Content (Dual)",
    code: "MS-CONTENT-TCH-DUAL",
    description: "Dual role teacher content needs",
    category: "question",
    icon: "book-open",
    isShared: true,
    tags: ["admin"],
    defaultScreen: {
      type: "MS",
      title: "Teacher Content Needs",
      question: "For your own students, are you looking to teach skills beyond basic typing?",
      options: [
        { id: "opt-coding", label: "Coding Basics", value: "coding" },
        { id: "opt-digcit", label: "Digital Citizenship", value: "digcit" },
        { id: "opt-typing", label: "Just Typing", value: "typing" },
      ],
      variableBinding: "teacherContent",
    },
  },
  {
    id: "mc-accessibility-tch-dual",
    name: "Question: Teacher Accessibility (Dual)",
    code: "MC-ACCESSIBILITY-TCH-DUAL",
    description: "Dual role teacher accessibility needs",
    category: "question",
    icon: "accessibility",
    isShared: true,
    tags: ["admin"],
    defaultScreen: {
      type: "MC",
      title: "Teacher Accessibility",
      question: "Do the students in your specific classes need accessibility accommodations?",
      options: [
        { id: "opt-yes", label: "Yes, I have specific needs", value: "yes" },
        { id: "opt-no", label: "No, standard is fine", value: "no" },
      ],
      variableBinding: "teacherAccessibility",
    },
  },

];

export const componentTemplates = componentRegistry;

export function getTemplatesByCategory(category: ComponentCategory) {
  return componentRegistry.filter((c) => c.category === category);
}

// ---------------------------------------------------------------------------
// 1a. TEACHER SPECIFIC AFFIRMATIONS
// ---------------------------------------------------------------------------

