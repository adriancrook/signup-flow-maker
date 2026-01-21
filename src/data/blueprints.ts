import { ComponentCode } from "../types/flow";

export const blueprints: Record<string, ComponentCode[]> = {
    // ---------------------------------------------------------------------------
    // TEACHER FLOW (Educator)
    // ---------------------------------------------------------------------------
    "educator-teacher": [
        "MC-GATEKEEPER-EDU",       // Entry
        "MSG-SOCIAL-PROOF-TCH",    // Social Proof
        "MC-LOCATION-EDU",         // Location
        "MSG-LOCATION-EDU-AFF",    // Location Affirmation
        "MS-GRADES-TCH",           // Grade Levels
        "MSG-GRADES-TCH-AFF",      // Grades Affirmation
        "NUM-STUDENTS-TCH",        // Student Count
        "MSG-STUDENTS-TCH-AFF",    // Student Count Affirmation
        "MS-CONTENT-TCH",          // Content Needs
        "MSG-CONTENT-TCH-AFF",     // Content Affirmation
        "MC-ROSTERING-TCH",        // Rostering (Branching Point)
        "MSG-ROSTERING-TCH-AFF",   // Rostering Affirmation
        // NOTE: Branching logic handles SSO vs Manual here. 
        // For linear hydration, we assume the "Happy Path" continues.
        // The visual editor will allow manual connection of the "SSO Handoff" branch.
        "MC-ENVIRONMENT-TCH",      // Ads/Environment
        "MSG-ENVIRONMENT-TCH-AFF", // Environment Affirmation
        "MC-ACCESSIBILITY-TCH",    // Accessibility
        "MSG-ACCESSIBILITY-TCH-AFF", // Accessibility Affirmation
        "MC-DEVICE-TCH",           // Device
        "MSG-DEVICE-TCH-AFF",      // Device Affirmation
        "MC-DISCOVERY-EDU",        // Discovery
        "INT-PLAN-ANALYSIS-TCH",   // Interstitial
        "FORM-SIGNUP-TCH",         // Account Creation
        "PAY-PLUS-TCH"            // Paywall
    ],

    // ---------------------------------------------------------------------------
    // STUDENT FLOW (Individual)
    // ---------------------------------------------------------------------------
    "individual-student": [
        "MC-GATEKEEPER-IND",       // Entry: Student
        "MC-CLASSCODE-STU",        // Class Code
        "MSG-SOCIAL-PROOF-STU",    // Social Proof
        "MC-PURPOSE-STU",          // Purpose
        "MSG-PURPOSE-AFF",         // Purpose Affirmation
        "TEST-BASELINE-ALL",       // Mini Test
        "MSG-BASELINE-AFF",        // Baseline Affirmation
        "MC-TARGET-ALL",           // Target Speed
        "MSG-TARGET-AFF",          // Target Affirmation
        "MC-BARRIERS-STU",         // Barriers
        "MSG-BARRIERS-STU",        // Barriers Affirmation
        "MC-MOTIVATION-STU",       // Motivation
        "MSG-MOTIVATION-AFF",      // Motivation Affirmation
        "MC-DISCOVERY-IND",        // Discovery
        "MC-DAILYGOAL-STU",        // Daily Goal
        "MSG-DAILYGOAL-AFF",       // Daily Goal Affirmation
        "INT-PLAN-ANALYSIS-STU",   // Interstitial
        "FORM-SIGNUP-STU",         // Account Creation
        "PAY-PLUS-STU"             // Paywall
    ],

    // ---------------------------------------------------------------------------
    // PARENT FLOW (Individual)
    // ---------------------------------------------------------------------------
    "individual-parent": [
        "MC-GATEKEEPER-IND",       // Entry: Parent
        "MSG-SOCIAL-PROOF-PAR",
        "TXT-CHILDNAME-PAR",       // Child Name
        "MC-EXPERIENCE-PAR",       // Experience
        "MSG-EXPERIENCE-AFF",      // Experience Affirmation
        "MC-TECHSKILLS-PAR",       // Tech Skills
        "MSG-TECHSKILLS-AFF",      // Tech Skills Affirmation
        "MC-SCREENTIME-PAR",       // Screen Time
        "MSG-SCREENTIME-AFF",      // Screen Time Affirmation
        "MC-BARRIERS-PAR",
        "MSG-BARRIERS-PAR",
        "MC-MOTIVATION-PAR",
        "MC-DAILYGOAL-PAR",
        "MC-DISCOVERY-IND",
        "INT-PLAN-ANALYSIS-PAR",
        "FORM-SIGNUP-PAR",
        "PAY-PLUS-PAR"
    ],

    // ---------------------------------------------------------------------------
    // ADULT FLOW (Individual)
    // ---------------------------------------------------------------------------
    "individual-adult": [
        "MC-GATEKEEPER-IND",       // Entry: Adult
        "MSG-SOCIAL-PROOF-ADL",
        "MC-PURPOSE-ADL",
        "TEST-BASELINE-ALL",
        "MSG-BASELINE-AFF",
        "MC-TARGET-ALL",
        "MSG-TARGET-AFF",
        "MC-CERTIFICATE-ADL",      // Certificate
        "MSG-CERTIFICATE-AFF",     // Certificate Affirmation
        "MC-BARRIERS-ADL",
        "MSG-BARRIERS-ADL",
        "MC-MOTIVATION-ADL",
        "MC-DAILYGOAL-ADL",
        "MC-DISCOVERY-ADL",
        "INT-PLAN-ANALYSIS-ADL",
        "FORM-SIGNUP-ADL",
        "PAY-PLUS-ADL"
    ],

    // ---------------------------------------------------------------------------
    // SCHOOL ADMIN FLOW
    // ---------------------------------------------------------------------------
    "educator-school-admin": [
        "MC-GATEKEEPER-EDU",
        "MSG-SOCIAL-PROOF-SCH",
        "MC-LOCATION-EDU",
        "NUM-STUDENTS-SCH",
        "MSG-SCHOOLSIZE-SCH-AFF",
        "MC-ROSTERING-SCH",
        "MSG-ROSTERING-SCH-AFF",
        "MC-ENVIRONMENT-SCH",
        "MSG-ENVIRONMENT-SCH-AFF",
        "MC-RETENTION-SCH",
        "MSG-RETENTION-SCH-AFF",
        "MC-ANALYTICS-SCH",
        "MSG-ANALYTICS-SCH-AFF",
        "MC-DUALROLE-EDU",
        "MSG-DUALROLE-AFF",        // Dual Role Affirmation
        "MS-CONTENT-TCH-DUAL",     // Dual Role Content
        "MSG-TEACHERCONTENT-AFF",  // Dual Role Content Affirmation
        "MC-ACCESSIBILITY-TCH-DUAL", // Dual Role Accessibility
        "MSG-TEACHERACCESS-AFF",   // Dual Role Accessibility Affirmation
        "MC-DISCOVERY-EDU",
        "INT-PLAN-ANALYSIS-SCH",
        "FORM-SIGNUP-SCH",
        "PAY-PLUS-SCH"
    ],

    // ---------------------------------------------------------------------------
    // DISTRICT ADMIN FLOW
    // ---------------------------------------------------------------------------
    "educator-district-admin": [
        "MC-GATEKEEPER-EDU",
        "MSG-SOCIAL-PROOF-DST",
        "MC-LOCATION-EDU",
        "MC-DISTRICTSCOPE-DST",
        "MSG-DISTRICTSCOPE-DST-AFF",
        "MC-ROSTERING-DST",
        "MSG-ROSTERING-DST-AFF",
        "MC-COMPLIANCE-DST",
        "MSG-COMPLIANCE-DST-AFF",
        "MC-DUALROLE-EDU",
        "MSG-DUALROLE-AFF",        // Dual Role Affirmation
        "MS-CONTENT-TCH-DUAL",     // Dual Role Content
        "MSG-TEACHERCONTENT-AFF",  // Dual Role Content Affirmation
        "MC-ACCESSIBILITY-TCH-DUAL", // Dual Role Accessibility
        "MSG-TEACHERACCESS-AFF",   // Dual Role Accessibility Affirmation
        "MC-DISCOVERY-EDU",
        "INT-PLAN-ANALYSIS-DST",
        "FORM-SIGNUP-DST",
        "PAY-PLUS-DST"
    ]
};
