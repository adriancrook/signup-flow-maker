## 1. The Gatekeeper (Education Portal)

* **Screen:** Select User Role
  * "What is your role in education?"
  * **Options:**
    * Teacher (I manage my own classroom)
    * School Administrator (I manage a school building)
    * District Administrator (I manage multiple schools/district)

---

## 2. Shared Components

These components are used across multiple flows and should be built as reusable modules.

### 2a. Social Proof
*Insert: Immediately after Gatekeeper for ALL educator flows*

| Flow | Copy |
|------|------|
| Teacher | "Great! You are joining 50 million teachers, students, and parents who trust Typing.com." |
| School Admin | "Great! You are joining thousands of schools and 50 million users who trust Typing.com." |
| District Admin | "Great! You are joining hundreds of districts and 50 million users who trust Typing.com." |

### 2b. Confirm Location
*Insert: Immediately after Social Proof confirmation*

* **Screen:** Confirm Location
  * "We detected you're in [Detected State]. Is this correct?"
  * **Options:** [Yes], [No, I'm in ___]
  * **Affirmation:** "Great. We'll align your curriculum to [State] standards."

### 2c. Discovery
*Insert: Before Interstitial for ALL educator flows*

* **Screen:** Discovery
  * "How did you hear about Typing.com?"
  * **Options:** [Colleague], [Conference/PD], [Social Media], [Search Engine], [District Recommendation]

### 2d. Rostering Branch Logic
*Used in: Teacher, School Admin, District Admin flows*

When user selects **Clever Secure Sync**, **ClassLink**, or **Rapid Identity**:
* → Branch to **SSO Handoff** (Section 7) — ends flow

When user selects **Clever Library**, **Google/Microsoft**, **CSV Upload**, or **Class Code/Username**:
* → Continue standard flow

---

## 3. Teacher Flow

*Top Motivations: Curriculum Utility & Classroom Control*

* **[Shared] Social Proof** (see 2a)
* **[Shared] Confirm Location** (see 2b)
* **Screen:** Select Grade Level
  * "What grade levels do you teach?"
  * **Affirmation:** Standards Alignment
    * "Excellent. We have curriculum aligned specifically to [State] standards for those grades."
* **Screen:** Student Count
  * "How many students do you teach?"
  * **Affirmation:** Student Count
    * "Tools to manage student counts of any size… live tracking, etc."
* **Screen:** Content Needs *(Primary Driver: Curriculum)*
  * "Beyond typing, what other skills are you looking to teach?"
  * **Options:** [Coding/Computer Basics], [Digital Citizenship], [Career Prep], [Just Typing]
  * **Affirmation:** Value Add
    * "Perfect choice. Our PLUS license unlocks a full Tech Literacy curriculum, not just keyboarding."
* **Screen:** Rostering *(Required)*
  * "How do you want your students to log in?"
  * **Options:** [Google/Microsoft Classroom], [Class Code/Username], [Clever Secure Sync], [Clever Library], [ClassLink]
  * **Branch:** If Clever Secure Sync or ClassLink → SSO Handoff (Section 7)
  * **Affirmation:** Ease of Use
    * "We sync seamlessly with [Rostering Method] so you don't have to manually manage passwords."
* **Screen:** Learning Environment *(Secondary Driver: Focus/Ads)*
  * "How important is removing ads to your classroom management?"
  * **Options:** [Very Important], [Somewhat Important], [Not a Priority]
  * **Affirmation:** Distraction Removal
    * "Understood. PLUS removes all ads to keep students in a focused 'flow state'."
* **Screen:** Accessibility *(Loss Aversion: Control)*
  * "Do you have students who require accessibility accommodations (IEP/504)?"
  * **Options:** [Yes], [No]
  * **Affirmation:** Inclusivity
    * "We provide WCAG 2.2 AA-compliant themes, audio dictation, and one-handed settings to ensure every student succeeds."
* **Screen:** Device
  * "What device(s) will your students use to access Typing.com?"
  * **Options:** [Chromebooks], [iPads/Tablets], [Windows/Mac], [Mixed]
  * **Affirmation:** Confirm Device
    * "Awesome! Typing.com is designed to work on [Device] without issue!"
* **[Shared] Discovery** (see 2c)

**Plan Analysis (Interstitial)**

* **Visual:** A progress bar or spinning circle.
* **Dynamic Text Cycling:**
  * "Confirming [State] standards alignment..."
  * "Loading curriculum for grades [Grade Levels]..."
  * "Preparing roster for [Student Count] students..."
  * "Adding [Content Needs] modules..."
  * "Configuring [Rostering Method] sync..."
  * "Optimizing for [Ad Importance] ad-free priority..."
  * "Enabling [Accessibility] accommodations..." *(if Yes selected)*
  * "Verifying [Device] compatibility..."
  * "Building your classroom plan..."

**Your Classroom Plan (Account Creation)**

* **Screen:** "Your Classroom is Ready."
* **Copy:** "Create your free account to save your classroom settings and view your Ad-Free quote."
* **Action:** Email/Password input or Google/SSO Signup.

**Paywall: PLUS Offer**

* **Headline:** "Unlock the Full Classroom Experience"
* **Value Proposition:**
  * Full Coding, Digital Citizenship, and Typing curriculum
  * Ad-free environment for focused learning
  * Student progress tracking and reports
* **Action:** "Continue with Free" or "Upgrade to PLUS"

---

## 4. School Administrator Flow

*Top Motivations: Risk Management (Ads) & Data Retention*

* **[Shared] Social Proof** (see 2a)
* **[Shared] Confirm Location** (see 2b)
  * "Great choice. You are joining thousands of schools and 50 million users who trust Typing.com."
* **Screen:** School Size
  * "Approximately how many students will be using the program?"
  * **Affirmation:** Scalability
    * "Our platform is optimized to handle high-volume traffic for schools your size."
* **Screen:** Rostering *(Required)*
  * "How does your school manage student data?"
  * **Options:** [Clever Secure Sync], [Clever Library], [ClassLink], [Google/Microsoft], [CSV Upload], [I don't know yet]
  * **Branch:** If Clever Secure Sync or ClassLink → SSO Handoff (Section 7)
  * **Affirmation:** Infrastructure
    * "Great. We support Single Sign-On (SSO) to make school-wide deployment instant."
* **Screen:** Environment *(Primary Driver: Risk/Safety)*
  * "What is your primary concern regarding free software in schools?"
  * **Options:** [Inappropriate Ads], [External Links/Distractions], [Data Privacy], [None]
  * **Affirmation:** The Walled Garden
    * "We hear you. That's why PLUS creates a 100% Ad-Free, Walled Garden environment to minimize risk."
* **Screen:** Reporting *(Secondary Driver: Data Retention)*
  * "Do you need to track student growth year-over-year?"
  * **Options:** [Yes, I need history], [No, current year only]
  * **Affirmation:** Unlimited History
    * "Noted. We will enable Unlimited Data Retention for your account (removing the standard 70-day limit)."
* **Screen:** Analytics *(Driver: ROI)*
  * "Do you need to report on usage and ROI to leadership?"
  * **Options:** [Yes], [No]
  * **Affirmation:** Admin Console
    * "Our Admin Console provides school-wide analytics to prove utilization and ROI."
* **[Insert] Dual-Role Module** (see Section 6) — *if applicable*
* **[Shared] Discovery** (see 2c)

**Plan Analysis (Interstitial)**

* **Visual:** A progress bar or spinning circle.
* **Dynamic Text Cycling:**
  * "Scaling for [Student Count] students..."
  * "Configuring [Rostering Method] integration..."
  * "Securing [Environment Concern] protection..."
  * "Enabling [Data Retention] data history..."
  * "Calibrating [Analytics] reporting dashboard..."
  * "Configuring Role Switcher..." *(if dual-role)*
  * "Generating quote for [Student Count] licenses..."

**Your School Plan (Account Creation)**

* **Screen:** "Secure Your School's Learning Environment."
* **Copy:** "Create an account to save your school's data configuration and view your Ad-Free quote."
* **Action:** Email/Password input or Google/SSO Signup.

**Paywall: School PLUS Quote**

* **Headline:** "Your School's Ad-Free Quote"
* **Value Proposition:**
  * 100% Ad-Free, Walled Garden environment
  * Unlimited Data Retention
  * School-wide SSO deployment
* **Action:** "Request Quote" or "Continue with Free"

---

## 5. District Administrator Flow
*Top Motivations: Risk Management (Ads), Compliance (SOPPA/DPA) & Oversight*

* **[Shared] Social Proof** (see 2a)
* **[Shared] Confirm Location** (see 2b)
  * "Great choice. You are joining hundreds of districts and 50 million users who trust Typing.com."
* **Screen:** District Scope
  * "How many schools in your district require a solution?"
  * **Affirmation:** Multi-Tenant Architecture
    * "We provide a District Master Dashboard to manage all schools from a single login."
* **Screen:** Rostering *(Required - High Priority)*
  * "What is your district's primary rostering integration?"
  * **Options:** [Clever Secure Sync], [Clever Library], [ClassLink], [Rapid Identity], [Google/Microsoft]
  * **Branch:** If Clever Secure Sync, ClassLink, or Rapid Identity → SSO Handoff (Section 7)
  * **Affirmation:** Nightly Sync
    * "We are a certified partner with [Rostering Integration]. We support automated nightly rostering updates."
* **Screen:** Environment *(Driver: Risk/Safety)*
  * "What is your primary concern regarding free software in schools?"
  * **Options:** [Inappropriate Ads], [External Links/Distractions], [Data Privacy], [None]
  * **Affirmation:** The Walled Garden
    * "We hear you. That's why PLUS creates a 100% Ad-Free, Walled Garden environment to minimize risk."
* **Screen:** Compliance *(Primary Driver: Legal/Privacy)*
  * "Does your district require a signed Data Privacy Agreement (DPA/SOPPA)?"
  * **Options:** [Yes, Mandatory], [No]
  * **Affirmation:** Legal Safety
    * "We are fully compliant. Your PLUS plan includes a signed DPA to satisfy your legal and security teams."
* **Screen:** Analytics *(Secondary Driver: Macro Reporting)*
  * "Do you need oversight on usage and ROI across the district?"
  * **Options:** [Yes, High-level views], [No, School-level only]
  * **Affirmation:** Executive Dashboard
    * "Our Admin Console provides district-wide analytics to prove utilization and ROI."
* **Screen:** Data Retention *(Driver: Data History)*
  * "Do you need to track student growth year-over-year across the district?"
  * **Options:** [Yes, I need history], [No, current year only]
  * **Affirmation:** Unlimited History
    * "Noted. We will enable Unlimited Data Retention for your district (removing the standard 70-day limit)."
* **[Insert] Dual-Role Module** (see Section 6) — *if applicable*
* **[Shared] Discovery** (see 2c)

**Plan Analysis (Interstitial)**

* **Visual:** A progress bar or spinning circle.
* **Dynamic Text Cycling:**
  * "Mapping [School Count] schools to Master Dashboard..."
  * "Verifying [Rostering Integration] protocols..."
  * "Securing [Environment Concern] protection..."
  * "Preparing [DPA Status] compliance documentation..." *(if required)*
  * "Calibrating [Analytics Level] reporting dashboard..."
  * "Enabling [Data Retention] data history..."
  * "Configuring Role Switcher..." *(if dual-role)*
  * "Building your district implementation roadmap..."

**Your District Plan (Account Creation)**

* **Screen:** "Your Compliant District Plan."
* **Copy:** "Solve your privacy requirements and rostering infrastructure today. Create an account to generate your implementation roadmap."
* **Action:** Email/Password input or Google/SSO Signup.

**Paywall: District PLUS Quote**

* **Headline:** "Your District Implementation Roadmap"
* **Value Proposition:**
  * 100% Ad-Free, Walled Garden environment
  * Signed DPA/SOPPA compliance
  * District Master Dashboard
  * Automated nightly rostering
  * ROI analytics
* **Action:** "Request Quote" or "Schedule Demo"

---

## 6. Insert Module: Dual-Role (Teacher-Admin)

*Insert into School Admin or District Admin flow after Environment/Compliance questions*

This module validates classroom needs without derailing the admin setup, using Role Switcher as the solution.

* **Screen:** Dual Role Verification
  * "In addition to your administrative duties, do you teach any classes of your own?"
  * **Options:**
    * **Yes** → Triggers Sub-Path below
    * **No** → Continue to Discovery

**[Start Sub-Path: The Teacher-Admin]**

* **Affirmation:** The Solution
  * "Perfect. You won't need two accounts. Our Role Switcher lets you toggle instantly between 'District Oversight' and 'Classroom Instruction' with one click."
* **Screen:** Teacher Content Needs *(Driver: Curriculum)*
  * "For your own students, are you looking to teach skills beyond basic typing?"
  * **Options:** [Coding Basics], [Digital Citizenship], [Just Typing]
  * **Affirmation:** Dual Access
    * "Your account includes full access to the PLUS Curriculum ([Content Needs]) for your students, while maintaining admin privileges for the school."
* **Screen:** Teacher Accessibility *(Driver: Control)*
  * "Do the students in your specific classes need accessibility accommodations?"
  * **Options:** [Yes, I have specific needs], [No, standard is fine]
  * **Affirmation:** Granular Control
    * "We've got you covered. You can apply specific accessibility settings to your own roster without altering the global settings for the rest of the school/district."

**[End Sub-Path: Return to Main Flow → Discovery]**

---

## 7. Branch Flow: SSO Handoff (Clever Secure Sync / ClassLink / Rapid Identity)

*Triggered when user selects Clever Secure Sync, ClassLink, or Rapid Identity in any Rostering screen*

*Note: Clever Library users can continue through standard signup flow.*

* **Screen:** SSO Handoff
  * "Great! Since your school uses [Integration], your account setup is managed there—not here."
  * **Copy:** "Ask your IT administrator to add Typing.com in your [Integration] dashboard. Once added, you and your students can log in instantly using your existing school credentials."
  * **Action:** [Got it] → End flow

**[End of Flow]**

---

## Appendix: Component Reuse Matrix

| Component | Teacher | School Admin | District Admin |
|-----------|---------|--------------|----------------|
| Confirm Location | ✓ | ✓ | ✓ |
| Social Proof | ✓ (variant) | ✓ (variant) | ✓ (variant) |
| Discovery | ✓ | ✓ | ✓ |
| Rostering | ✓ | ✓ | ✓ |
| SSO Handoff (exits flow) | ✓ | ✓ | ✓ |
| Dual-Role Module | — | ✓ | ✓ |
| Accessibility | ✓ | via Dual-Role | via Dual-Role |
| Content Needs | ✓ | via Dual-Role | via Dual-Role |
| Environment/Ads | ✓ | ✓ | ✓ |
| Compliance/DPA | — | — | ✓ |
| Data Retention | — | ✓ | ✓ |
| Analytics/ROI | — | ✓ | ✓ |
