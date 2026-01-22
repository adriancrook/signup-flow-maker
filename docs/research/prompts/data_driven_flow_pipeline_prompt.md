# Research Prompt: Data-Driven Flow Pipeline (Post-Figma)

## Context: The "Flow Maker" Project
We are building **Flow Maker**, an internal tool for **Typing.com** designed to author complex, branching user signup flows (Student, Teacher, Admin, Parent). 
- **Current Stack**: Next.js, React Flow, Zustand, Supabase.
- **Current Functionality**: Logic design, node linking, variable binding, and basic visual preview. 
- **The Problem**: Currently, we have a disconnect between the **High-Fidelity Design** (Figma, 100+ static screens) and the **Runtime Logic** (Hardcoded routes or the new Flow Maker config). We want to unify this into a data-driven pipeline.

## The Objective
We need to design a **Data-Driven Flow Pipeline** that automates the delivery of the signup experience. The goal is to move from "Design -> Code" to "Design + Logic Config -> Runtime hydration".

### The Proposed Workflow
1.  **Visual Source of Truth (Figma):**
    -   Designers create atomic component templates (e.g., "Multiple Choice Wrapper", "Hero Graphic", "Form Input").
    -   *Research Question:* How do we extract these definitions? (Figma Plugin? REST API hydration? HTML export?)
2.  **Logic Source of Truth (Flow Maker):**
    -   We define the *graph*: user paths, branching logic, variable bindings, and copy variations (e.g., "Student" vs "Teacher" text).
    -   We export a Configuration File (JSON/YAML) that represents the entire flow state machine.
3.  **Runtime Engine (The "Third Layer"):**
    -   A lightweight engine running on Typing.com (likely PHP/Laravel backend + Vue/React frontend, or a microservice) that:
        -   Reads the Flow Maker Configuration.
        -   Hydrates the Figma Templates with the dynamic content and logic.
        -   Manages the state machine (transitions, history, data collection).

## Constraints & Requirements
1.  **Scale**: Typing.com handles massive traffic volumes. Solutions **CANNOT** use traffic-based pricing models (e.g., No Funnelfox, No segment-based pricing).
2.  **Cost**: Preference for **Open Source** or **"Build it Ourselves"** approaches.
3.  **Performance**: The runtime hydration must be nearly instant.
4.  **Tech Agnostic (Runtime)**: the Flow Maker is Next.js, but the consuming app (Typing.com) may be a different stack. The output format must be universal (e.g., standardized JSON).

## Research Questions to Answer
Please analyze the following and propose 2-3 architectural options:

### 1. The Output Schema
-   What should the "Flow Definition" JSON look like?
-   Should we use an existing standard (e.g., SCXML, Amazon States Language) or invent a custom schema optimized for UI flows?
-   *Evaluation criteria:* Readability, compactness, ease of parsing by a frontend client.

### 2. Figma Integration Strategy
-   **Option A (Hydration):** A Figma plugin reads the Flow JSON and generates 100+ screens in Figma for design QA.
-   **Option B (Atomic Export):** Figma exports "dumb" React/HTML templates that the Runtime Engine fills with content.
-   *Which is more viable for maintaining 6+ distinct user flows (Student, Teacher, Parent, etc.) that share 90% of components?*

### 3. The "Third Layer" Engine
-   Are there existing **Open Source** flow engines (headless) that can handle the state machine part?
    -   *Examples to investigate:* XState (can it be serialized effectively?), other FSM libraries.
-   Or should we build a custom `FlowInterpreter` class?
    -   *Pros/Cons* of building custom vs. using a library.

### 4. Comparison of Solutions
For each proposed option, provide:
-   **Complexity Score** (1-5)
-   **Maintenance Overhead** (High/Medium/Low)
-   **Fit for Typing.com** (Scale/Cost)

## Deliverable
A summary comparison table and a recommendation for the "Best Path Forward" for Phase 3 of the Flow Maker Roadmap.
