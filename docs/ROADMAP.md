# Product Roadmap: Signup Flow Maker

## Vision
To build the definitive "Source of Truth" for complex user signup flows, enabling safe authoring, logic verification, and seamless handover to design and engineering.

---

## 📅 Phase 1: Persistence & Collaboration (Q1 2026)
*Goal: Move from single-player local-storage prototype to a multi-user, safe cloud application.*

*   **[ ] Database Integration (Supabase + PostgreSQL)**
    *   [x] Migrate generic JSON persistence to relational tables (Flows, Nodes, Versions).
    *   Implement "Save Points" logic (e.g., autosave vs. explicit named versions).
    *   **Versioning & Rollback**: Complete history of flow states with one-click restore.
*   **[ ] Authentication System**
    *   [x] Google OAuth / Email Login via Supabase Auth.
    *   [x] Concept of "Organizations" or "Teams" (Shared Workspaces).
    *   [x] Role-Based Access (Viewer vs. Editor vs. Admin).
*   **[x] Environment Hygiene**
    *   [x] Separate **Staging** and **Production** databases.

## 🚀 Phase 2: Advanced Authoring (Q1-Q2 2026)
*Goal: Model the complex business logic realities of the existing application.*

*   **[ ] Component Availability Scoping**
    *   **Feature**: Ability to assign components to specific "Flow Scopes" (e.g., *Student* vs. *Teacher*).
    *   **UI**: "Available In" multi-select dropdown in Component Library.
*   **[ ] Variant Management UI**
    *   First-class UI for defining component variants (e.g., "Error State", "Loading State") without duplicating nodes.

## 🎨 Phase 3: Design Integration (Q2 2026)
*Goal: Bridge the gap between the Logic Graph and the Visual Design.*

*   **[ ] Figma Content Injection** (See [Spec](./figma-integration-spec.md))
    *   **Export**: JSON payload generator for Flow/Screen content.
    *   **Plugin**: "Flow Hydrator" Figma Plugin to inject text into named layers.
*   **[ ] Auto-Generated Previews**
    *   Headless browser service to capture PNG snapshots of flows for documentation.
*   **[ ] Asset Handover**
    *   Links to Figma/Storybook directly from the Flow Node properties.
*   **[ ] Custom Preview Styling**
    *   **Backgrounds**: Upload custom images to use as the backdrop for the preview canvas.
    *   **Theming**: CSS-based styling overrides to match production aesthetics in the preview.

*   **[ ] Research: Data-Driven Flow Pipeline (Post-Figma)**
    *   **Objective**: Replace manual 100+ screen design with a template-based hydration system.
    *   **Workflow Exploration**:
        1. Tool hydrates Figma OR Figma exports atomic component templates.
        2. Export configuration data files from Flow Maker.
        3. **The "Third Layer"**: A lightweight engine (custom or OSS) to assemble the flow at runtime on Typing.com.
    *   **Constraints**:
        *   Must avoid traffic-based pricing models (e.g., NO Funnelfox).
        *   Must handle high-volume traffic (Typing.com scale) without per-user costs.
        *   Preference: Open-source solutions or "Build it ourselves" approach.


## 🛡️ Phase 4: Operational Maturity (Q3 2026)
*Goal: Treat the Flow Maker as mission-critical infrastructure.*

*   **[ ] CI/CD Pipeline**
    *   Automated build and deploy on GitHub merge.
    *   Linting and Type Checking in CI.
*   **[ ] "Export to Code" SDK**
    *   Typescript SDK to consume the Flow JSON directly in the actual Signup App (making this tool the backend CMS).
*   **[ ] Analytics Integration**
    *   Overlay real-world funnel drop-off stats onto the Flow Graph nodes.

---
## 💡 "Immediately Useful" Backlog
*   **Cmd+Z / Redo** support for canvas actions.
*   **Search**: Global search for nodes by text content or ID.
*   **[x] Advanced Commenting System**
    *   [x] **Node-Level Attribution**: Comments anchored to specific flow nodes.
    *   [x] **Sticky Notes**: Free-floating comments for general feedback on the canvas.
    *   [x] **Visual Attribution**: Display user names/avatars beside each comment or sticky note.
    *   [x] **Threaded Discussions**: Reply chains for in-context conversation.
    *   [x] **Status Tracking**: "Open", "Resolved", and "Wontfix" states for feedback management.
