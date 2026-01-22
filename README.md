# Visual CMS for Non-Linear User Flows

<div align="center">

![Project Status](https://img.shields.io/badge/Status-Active_Development-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)

</div>

> **The "Source of Truth" for product onboarding state machines.**

## TL;DR

**The Problem**: Product and Design teams map out complex signup flows in free-form tools like Miro or FigJam, which lack technical feasibility checks. This leads to expensive back-and-forth with Engineering when "logic gaps" are discovered during implementation.

**The Solution**: A **Node-Based Visual DSL (Domain Specific Language) Editor** that allows you to draft flows using real, validated components. It functions as a "Flow Builder" or "Logic Graph" that outputs a structured JSON payload, effectively decoupling flow logic from hard-coded application engineering.

### Why Use This?
| Feature | What It Does |
|---------|--------------|
| **Hybrid Logic & Content** | Manages variant metadata (e.g., Student vs. Teacher copy) directly on the node. |
| **Strict State Enforcement** | Validates connections against a strict component registry to ensure technical feasibility. |
| **Live Simulation** | "Plays" the graph in a Preview Mode to verify the UX before coding. |

---

## Comparison: Figma meets Retool

This system bridges the gap between design freedom and engineering constraints.

| Feature | Signup Flow Maker | Figma / Miro | Retool |
|---------|-------------------|--------------|--------|
| **Logic Validation** | ✅ Enforced by Schema | ❌ None (Lines don't mean logic) | ⚠️ Custom Scripting |
| **Content Variants** | ✅ Native Support | ❌ Manual Duplication | ⚠️ Data Binding Complexity |
| **Output** | ✅ Production JSON | ❌ Static Images | ✅ Internal Tools Only |
| **User Experience** | ✅ Designers & PMs | ✅ Designers | ❌ Engineers |

---

## Key Capabilities

### 1. Hybrid Logic & Content Layer
While most flow tools strictly handle logic (if `x` then `y`), this system functions simultaneously as a **Content CMS**. Each node (e.g., "Purpose Assessment") carries variant metadata, allowing you to define different UI copy—such as Headlines and Subheads—for different User Personas within the same logical block.

### 2. Strict State Enforcement
In contrast to free-form whiteboards, the system utilizes a strict component registry (`componentRegistry.ts`) that acts as a schema validator. Users are restricted to dragging in **valid, pre-coded components** (Questions, Inputs, Messages). This constraint ensures that the output is always technically feasible for the engineering team to implement.

### 3. Collaborative Annotation Layer
A "Metadata Overlay" sits on top of the graph, separating the "conversation about the work" from the "work itself," facilitating asynchronous collaboration similar to Figma.
- **Sticky Notes**: Free-floating feedback.
- **Threaded Comments**: Context-aware discussions anchored to specific nodes.

### 4. Simulation & Preview
The platform includes a live **Hydration Engine**. This engine consumes the abstract graph JSON and renders a preview of the actual user experience, verifying that the logic holds up before any production code is written.

---

## Enabling Tech Stack

- **Canvas Engine**: [`@xyflow/react`](https://reactflow.dev/) (formerly React Flow) handles node-edge topology, virtualization, and interactions.
- **App Framework**: `Next.js 15` (App Router) provides the application shell and routing architecture.
- **State Management**: `Zustand` + `Immer` facilitate complex, nested updates to the large JSON graph object without performance penalties.
- **Persistence**: `Supabase` (PostgreSQL) replaces local storage to enable cloud saves, distinct environments (Staging/Prod), and Role-Based Access Control (RBAC).
- **Auto-Layout**: `Dagre` integration ensures deterministic graph organization and readability.

---

## Quick Start

### Prerequisites
- Node.js 20+
- Supabase credentials in `.env.local`

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the editor.

### Core Workflow
1. **Drag** components from the Library to the Canvas.
2. **Connect** logical handles to define the user journey.
3. **Configure** content variants in the Properties Panel.
4. **Annotate** with Sticky Notes for team feedback.
5. **Save** to the cloud (Supabase) to persist your version.

---

## Roadmap

See [docs/ROADMAP.md](./docs/ROADMAP.md) for the full operational plan.

- [x] **Database Integration**: Migrated from local storage to Supabase.
- [x] **Collaboration**: Sticky Notes and Threaded Comments.
- [ ] **Versioning**: Rollback to previous flow states.
- [ ] **Figma Injection**: Hydrate Figma designs from Flow JSON.
