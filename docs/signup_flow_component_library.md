# Typing.com Signup Flow Component Library

This document defines all reusable components for the signup flow editor. Each component includes role-variant copy that auto-populates based on the selected flow context.

---

## Component Types & Coding System

We use a human-readable coding convention: `[TYPE]-[SLUG]-[VARIANT]`

| Type Code | Full Type | Description |
|-----------|-----------|-------------|
| **MC** | Multiple Choice | Single-select radio buttons or buttons |
| **MS** | Multi-Select | Checkbox-style selection |
| **TXT** | Text Input | Single line or text area input |
| **NUM** | Number Input | Text field restricted to numbers |
| **TEST** | Typing Test | Interactive typing game box |
| **MSG** | Message | Static text/affirmation with no input (auto-advance or "Next" button) |
| **INT** | Interstitial | Animated loading screen with dynamic text cycling |
| **FORM** | Account Creation | Full signup form (Email, Password, SSO) |
| **PAY** | Paywall | Conversion screen with value proposition |
| **EXIT** | Handoff | Termination screen that ends the flow |
| **LOGIC** | Branch/Logic | Invisible step for routing (no UI) |

---

## 1. SCREEN COMPONENTS

### 1.1 Social Proof
**Type:** `MSG` (Message)
**Code:** `MSG-SOCIAL-PROOF-[ROLE]`
**Used In:** All flows
**Placement:** First step after Gatekeeper

| Code | Role | Copy |
|------|------|------|
| `MSG-SOCIAL-PROOF-STU` | Student | "Great choice. You are joining 50 million students, parents, and teachers who trust Typing.com." |
| `MSG-SOCIAL-PROOF-PAR` | Parent | "Great choice. You are joining 50 million parents, homeschoolers, teachers and students who trust Typing.com." |
| `MSG-SOCIAL-PROOF-ADL` | Adult | "Great choice. You are joining 50 million professionals, teachers, and students who trust Typing.com." |
| `MSG-SOCIAL-PROOF-TCH` | Teacher | "Great choice. You are joining 50 million teachers, students, and parents who trust Typing.com." |
| `MSG-SOCIAL-PROOF-SCH` | School Admin | "Great choice. You are joining thousands of schools and 50 million users who trust Typing.com." |
| `MSG-SOCIAL-PROOF-DST` | District Admin | "Great choice. You are joining hundreds of districts and 50 million users who trust Typing.com." |

---

### 1.2 Confirm Location
**Type:** `MC` (Multiple Choice)
**Code:** `MC-LOCATION-EDU`
**Used In:** Teacher, School Admin, District Admin
**Variable Captured:** `[State]`

| Element | Copy |
|---------|------|
| Question | "We detected you're in [Detected State]. Is this correct?" |
| Options | [Yes], [No, I'm in ___] |

**Affirmation (MSG-LOCATION-EDU-AFF):** "Great. We'll align your curriculum to [State] standards."

---

### 1.3 Purpose Assessment
**Type:** `MC` (Multiple Choice)
**Code:** `MC-PURPOSE-[ROLE]`
**Used In:** Student, Adult
**Variable Captured:** `[Purpose]` / `[Primary Goal]`

| Code | Role | Question | Options |
|------|------|----------|---------|
| `MC-PURPOSE-STU` | Student | "Why are you looking to improve your typing today?" | [Success in School/College], [Tech & Coding Interests], [Just for Fun & Games], [Personal Growth] |
| `MC-PURPOSE-ADL` | Adult | "What is your primary goal today?" | [I want to learn proper technique from scratch], [I want to boost my existing speed and accuracy], [I just want to take a quick typing test] |

---

### 1.4 Mini Typing Test
**Type:** `TEST` (Typing Test)
**Code:** `TEST-BASELINE-ALL`
**Used In:** Student, Adult
**Variable Captured:** `[Current WPM]`

| Element | Copy |
|---------|------|
| Prompt | "Let's get a baseline. Type the sentence below:" |
| Sentence | "The quick brown fox jumps over the lazy dog." |

**Affirmation (MSG-BASELINE-AFF):** "You clocked in at [Current WPM] WPM. We can 2x that speed with practice."

---

### 1.5 Target Speed
**Type:** `MC` (Multiple Choice)
**Code:** `MC-TARGET-ALL`
**Used In:** Student, Adult
**Variable Captured:** `[Target Speed]`

| Element | Copy |
|---------|------|
| Question | "What is your target typing speed?" |
| Options | [40 WPM], [60 WPM], [80 WPM], [100+ WPM] |

**Affirmation (MSG-TARGET-AFF):** "We've got you. We'll track your progress every step of the way to ensure you hit that goal."

---

### 1.6 Experience Level
**Type:** `MC` (Multiple Choice)
**Code:** `MC-EXPERIENCE-PAR`
**Used In:** Parent
**Variable Captured:** `[Experience Level]`

| Element | Copy |
|---------|------|
| Question | "What is your child's typing experience level?" |
| Options | [Brand New], [Dabbles / Hunts & Pecks], [Fluent] |

**Affirmation (MSG-EXPERIENCE-AFF):** "Perfect. Typing.com has standards-aligned curriculum for every typing level."

---

### 1.7 Tech Skills Assessment
**Type:** `MC` (Multiple Choice)
**Code:** `MC-TECHSKILLS-PAR`
**Used In:** Parent
**Variable Captured:** `[Tech Skills Level]`

| Element | Copy |
|---------|------|
| Question | "How would you rate their current Tech Literacy, Online Safety, and Coding skills?" |
| Options | [Beginner/None], [Intermediate], [Advanced] |

**Affirmation (MSG-TECHSKILLS-AFF):** "Our curriculum is designed specifically to build these future-ready skills, including Beyond Typing modules in our PLUS plan."

---

### 1.8 Screen Time Concern
**Type:** `MC` (Multiple Choice)
**Code:** `MC-SCREENTIME-PAR`
**Used In:** Parent
**Variable Captured:** `[Screen Time Concern]`

| Element | Copy |
|---------|------|
| Question | "What is your biggest concern regarding screen time?" |
| Options | [Exposure to Ads/Tracking], [Lack of Focus], [Wasting Time], [Safety] |

**Affirmation (MSG-SCREENTIME-AFF):** "Understood. That's why PLUS is 100% Ad-Free—eliminating distractions for safe, focused learning."

---

### 1.9 Certificate Need
**Type:** `MC` (Multiple Choice)
**Code:** `MC-CERTIFICATE-ADL`
**Used In:** Adult
**Variable Captured:** `[Certificate]` (boolean)

| Element | Copy |
|---------|------|
| Question | "Do you need a certificate of your WPM for work?" |
| Options | [Yes], [No] |

**Affirmation (MSG-CERTIFICATE-AFF):** "We provide verifiable certificates authenticating your performance for employers."

---

### 1.10 Barriers to Practice
**Type:** `MC` (Multiple Choice)
**Code:** `MC-BARRIERS-[ROLE]`
**Used In:** Student, Parent, Adult
**Variable Captured:** `[Barrier]`

| Code | Role | Question | Options |
|------|------|----------|---------|
| `MC-BARRIERS-STU` | Student | "What usually stops you from practicing?" | [Distractions/Ads], [Boredom], [Lack of Time] |
| `MC-BARRIERS-PAR` | Parent | "What usually stops them from practicing?" | [Distractions/Ads], [Boredom], [Lack of Time] |
| `MC-BARRIERS-ADL` | Adult | "What usually stops you from practicing?" | [Distractions/Ads], [Boredom], [Lack of Time] |

**Affirmation:**
*   **MSG-BARRIERS-STU:** "We get it. That's why PLUS removes all video ads to keep you focused."
*   **MSG-BARRIERS-PAR:** "We get it. That's why PLUS removes all video ads to keep them focused."
*   **MSG-BARRIERS-ADL:** "We get it. That's why PLUS removes all video ads to keep you in a 'Flow State'."

---

### 1.11 Select Motivation
**Type:** `MC` (Multiple Choice)
**Code:** `MC-MOTIVATION-[ROLE]`
**Used In:** Student, Parent, Adult
**Variable Captured:** `[Motivation]`

| Code | Role | Question | Options |
|------|------|----------|---------|
| `MC-MOTIVATION-STU` | Student | "What keeps you motivated when you're learning?" | [Streaks], [Games], [Progress Tracking] |
| `MC-MOTIVATION-PAR` | Parent | "What motivates them to learn a new skill?" | [Fun], [Grades], [Rewards] |
| `MC-MOTIVATION-ADL` | Adult | "What keeps you motivated when you're learning?" | [Streaks], [Certificates] |

---

### 1.12 Discovery
**Type:** `MC` (Multiple Choice)
**Code:** `MC-DISCOVERY-[ROLE]`
**Used In:** All flows
**Variable Captured:** `[Discovery Source]`

| Code | Role | Options |
|------|------|---------|
| `MC-DISCOVERY-IND` | Student/Parent | [Teacher], [Friend/Classmate], [Social Media], [Search Engine] |
| `MC-DISCOVERY-ADL` | Adult | [Coworker], [Friend], [Social Media], [Search Engine] |
| `MC-DISCOVERY-EDU` | Educator/Admin | [Colleague], [Conference/PD], [Social Media], [Search Engine], [District Recommendation] |

---

### 1.13 Daily Practice Goal
**Type:** `MC` (Multiple Choice)
**Code:** `MC-DAILYGOAL-[ROLE]`
**Used In:** Student, Parent, Adult
**Variable Captured:** `[Daily Goal]`

| Code | Role | Question | Options |
|------|------|----------|---------|
| `MC-DAILYGOAL-STU` | Student | "How much time can you commit to practicing each day?" | [5 Mins], [15 Mins], [30 Mins] |
| `MC-DAILYGOAL-PAR` | Parent | "How much time will they be able to use Typing.com?" | [5 Mins], [15 Mins], [30 Mins] |
| `MC-DAILYGOAL-ADL` | Adult | "How much time can you commit?" | [5 Mins], [15 Mins], [30 Mins] |

---

### 1.14 Child's Name
**Type:** `TXT` (Text Input)
**Code:** `TXT-CHILDNAME-PAR`
**Used In:** Parent
**Variable Captured:** `[Child Name]`

| Element | Copy |
|---------|------|
| Question | "What is your child's first name?" |
| Helper | "So we can personalize their plan" |

---

### 1.15 Grade Level
**Type:** `MS` (Multi-Select)
**Code:** `MS-GRADES-TCH`
**Used In:** Teacher
**Variable Captured:** `[Grade Levels]`

| Element | Copy |Options |
|---------|------|--------|
| Question | "What grade levels do you teach?" | [K-2], [3-5], [6-8], [9-12] |

---

### 1.16 Student Count
**Type:** `NUM` (Number Input) or `MC` (Range)
**Code:** `NUM-STUDENTS-[ROLE]`
**Used In:** Teacher, School Admin
**Variable Captured:** `[Student Count]`

| Code | Role | Question |
|------|------|----------|
| `NUM-STUDENTS-TCH` | Teacher | "How many students do you teach?" |
| `NUM-STUDENTS-SCH` | School Admin | "Approximately how many students will be using the program?" |

---

### 1.17 District Scope
**Type:** `NUM` (Number Input)
**Code:** `NUM-SCHOOLS-DST`
**Used In:** District Admin
**Variable Captured:** `[School Count]`

| Element | Copy |
|---------|------|
| Question | "How many schools in your district require a solution?" |

---

### 1.18 Content Needs
**Type:** `MS` (Multi-Select)
**Code:** `MS-CONTENT-[ROLE]`
**Used In:** Teacher, Dual-Role
**Variable Captured:** `[Content Needs]`

| Code | Role | Question | Options |
|------|------|----------|---------|
| `MS-CONTENT-TCH` | Teacher | "Beyond typing, what other skills are you looking to teach?" | [Coding/Computer Basics], [Digital Citizenship], [Career Prep], [Just Typing] |
| `MS-CONTENT-DUAL` | Dual-Role | "For your own students, are you looking to teach skills beyond basic typing?" | [Coding Basics], [Digital Citizenship], [Just Typing] |

---

### 1.19 Rostering
**Type:** `MC` (Multiple Choice)
**Code:** `MC-ROSTERING-[ROLE]`
**Used In:** Teacher, School Admin, District Admin
**Logic:** Branch on specific triggers (Clever, ClassLink, etc.)

| Code | Role | Question |
|------|------|----------|
| `MC-ROSTERING-TCH` | Teacher | "How do you want your students to log in?" |
| `MC-ROSTERING-SCH` | School Admin | "How does your school manage student data?" |
| `MC-ROSTERING-DST` | District Admin | "What is your district's primary rostering integration?" |

---

### 1.20 Environment / Ads Concern
**Type:** `MC` (Multiple Choice)
**Code:** `MC-ENVIRONMENT-[ROLE]`
**Used In:** Teacher, School Admin, District Admin

| Code | Role | Question |
|------|------|----------|
| `MC-ENVIRONMENT-TCH` | Teacher | "How important is removing ads to your classroom management?" |
| `MC-ENVIRONMENT-SCH` | School Admin | "What is your primary concern regarding free software in schools?" |
| `MC-ENVIRONMENT-DST` | District Admin | "What is your primary concern regarding free software in schools?" |

---

### 1.21 Accessibility
**Type:** `MC` (Multiple Choice - Boolean)
**Code:** `MC-ACCESSIBILITY-[ROLE]`
**Used In:** Teacher, Dual-Role

| Code | Role | Question |
|------|------|----------|
| `MC-ACCESSIBILITY-TCH` | Teacher | "Do you have students who require accessibility accommodations (IEP/504)?" |
| `MC-ACCESSIBILITY-DUAL` | Dual-Role | "Do the students in your specific classes need accessibility accommodations?" |

---

### 1.22 Device
**Type:** `MC` (Multiple Choice)
**Code:** `MC-DEVICE-TCH`
**Used In:** Teacher
**Variable Captured:** `[Device]`

| Element | Copy |
|---------|------|
| Question | "What device(s) will your students use to access Typing.com?" |

---

### 1.23 Compliance / DPA
**Type:** `MC` (Multiple Choice - Boolean)
**Code:** `MC-COMPLIANCE-DST`
**Used In:** District Admin
**Variable Captured:** `[DPA Status]`

| Element | Copy |
|---------|------|
| Question | "Does your district require a signed Data Privacy Agreement (DPA/SOPPA)?" |

---

### 1.24 Data Retention
**Type:** `MC` (Multiple Choice - Boolean)
**Code:** `MC-RETENTION-[ROLE]`
**Used In:** School Admin, District Admin
**Variable Captured:** `[Data Retention]`

| Code | Role | Question |
|------|------|----------|
| `MC-RETENTION-SCH` | School Admin | "Do you need to track student growth year-over-year?" |
| `MC-RETENTION-DST` | District Admin | "Do you need to track student growth year-over-year across the district?" |

---

### 1.25 Analytics / ROI
**Type:** `MC` (Multiple Choice - Boolean)
**Code:** `MC-ANALYTICS-[ROLE]`
**Used In:** School Admin, District Admin
**Variable Captured:** `[Analytics]`

| Code | Role | Question |
|------|------|----------|
| `MC-ANALYTICS-SCH` | School Admin | "Do you need to report on usage and ROI to leadership?" |
| `MC-ANALYTICS-DST` | District Admin | "Do you need oversight on usage and ROI across the district?" |

---

### 1.26 Dual-Role Verification
**Type:** `MC` (Multiple Choice - Boolean)
**Code:** `MC-DUALROLE-EDU`
**Used In:** School Admin, District Admin
**Branching:** Yes -> Dual-Role Sub-Path

| Element | Copy |
|---------|------|
| Question | "In addition to your administrative duties, do you teach any classes of your own?" |

---

## 2. INTERSTITIAL COMPONENTS

### 2.1 Plan Analysis Interstitial
**Type:** `INT` (Interstitial)
**Code:** `INT-PLAN-ANALYSIS-[ROLE]`
**Used In:** All flows

| Code | Role | Visual |
|------|------|--------|
| `INT-PLAN-ANALYSIS-STU` | Student | Dynamic Text Cycling (Student Vars) |
| `INT-PLAN-ANALYSIS-PAR` | Parent | Dynamic Text Cycling (Parent Vars) |
| `INT-PLAN-ANALYSIS-ADL` | Adult | Dynamic Text Cycling (Adult Vars) |
| `INT-PLAN-ANALYSIS-TCH` | Teacher | Dynamic Text Cycling (Teacher Vars) |
| `INT-PLAN-ANALYSIS-SCH` | School Admin | Dynamic Text Cycling (Admin Vars) |
| `INT-PLAN-ANALYSIS-DST` | District Admin | Dynamic Text Cycling (District Vars) |

---

## 3. ACCOUNT CREATION COMPONENTS

### 3.1 Account Creation Screen
**Type:** `FORM` (Form)
**Code:** `FORM-SIGNUP-[ROLE]`
**Used In:** All flows

| Code | Role | Headline | Fields |
|------|------|----------|--------|
| `FORM-SIGNUP-STU` | Student | "Your Customized Typing Plan is Ready!" | Email, Password, SSO, Name |
| `FORM-SIGNUP-PAR` | Parent | "Save [Child Name]'s Custom Plan" | Email, Password, SSO |
| `FORM-SIGNUP-ADL` | Adult | "Your Customized Typing Plan is Ready!" | Email, Password, SSO, Name |
| `FORM-SIGNUP-TCH` | Teacher | "Your Classroom is Ready." | Email, Password, SSO |
| `FORM-SIGNUP-SCH` | School Admin | "Secure Your School's Learning Environment." | Email, Password, SSO |
| `FORM-SIGNUP-DST` | District Admin | "Your Compliant District Plan." | Email, Password, SSO |

---

## 4. PAYWALL COMPONENTS

### 4.1 PLUS Offer Paywall
**Type:** `PAY` (Paywall)
**Code:** `PAY-PLUS-[ROLE]`
**Used In:** All flows

| Code | Role | Headline |
|------|------|----------|
| `PAY-PLUS-STU` | Student | "Unlock the Full Experience" |
| `PAY-PLUS-PAR` | Parent | "Unlock the Full Experience for [Child Name]" |
| `PAY-PLUS-ADL` | Adult | "Your Typing.com PLUS plan is ready for you to begin today." |
| `PAY-PLUS-TCH` | Teacher | "Unlock the Full Classroom Experience" |
| `PAY-PLUS-SCH` | School Admin | "Your School's Ad-Free Quote" |
| `PAY-PLUS-DST` | District Admin | "Your District Implementation Roadmap" |

---

## 5. HANDOFF / EXIT COMPONENTS

### 5.1 SSO Handoff
**Type:** `EXIT` (Handoff)
**Code:** `EXIT-SSO-HANDOFF-[ROLE]`
**Triggered By:** Clever/ClassLink/RapidIdentity Logic

### 5.2 Class Code Redirect
**Type:** `EXIT` (Handoff)
**Code:** `EXIT-CLASS-CODE`
**Triggered By:** Student Gatekeeper -> Yes

---

## 6. GATEKEEPER COMPONENTS

### 6.1 Individual Gatekeeper
**Type:** `MC` (Multiple Choice / Branching)
**Code:** `MC-GATEKEEPER-IND`
**Used In:** Individual Entry
**Options:** Student, Parent, Adult

### 6.2 Education Gatekeeper
**Type:** `MC` (Multiple Choice / Branching)
**Code:** `MC-GATEKEEPER-EDU`
**Used In:** Education Entry
**Options:** Teacher, School Admin, District Admin
