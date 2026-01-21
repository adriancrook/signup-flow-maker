# Design Specification: Advanced Commenting System

**Status**: DRAFT
**Target**: Q1 2026 (Phase 1.5)
**Goal**: Enable asynchronous collaboration and feedback directly on the Flow Canvas.

---

## 1. Overview

The Commenting System allows users to leave feedback on specific parts of a flow (Nodes) or general areas (Canvas Sticky Notes). It supports threaded conversations, status tracking (Open/Resolved), and real-time updates.

## 2. User Experience

### 2.1 Interaction Modes
1### 2.1 Interaction Modes
1.  **Node Comments** (Single Stream per Node):
    *   Nodes act as a single context for discussion.
    *   A badge appears on the node showing the **Total Comment Count**.
    *   Clicking the node (or badge) opens the **Node Discussion Panel**.
    *   This panel shows *all* root comments and their threaded replies for that node.
2.  **Canvas Sticky Notes**:
    *   User selects "Sticky Note" tool from the toolbar.
    *   Clicking anywhere on the canvas places a visual "Note" element (Node Type: `sticky-note`).
    *   **Interaction**: These behave exactly like standard nodes. Clicking a Sticky Note opens the shared **Node Discussion Panel**, allowing users to leave threaded comments on the note itself.

### 2.2 Comment Structure
*   **Root Comments**: Top-level messages in a Node's discussion stream.
*   **Replies**: Threaded responses to specific Root Comments.
*   **Status**: Individual Root Comments can be marked `RESOLVED`.
    *   *Example*: "Change this text" (Root) -> "Done" (Reply) -> Mark Root as Resolved.
*   **Resolved Items**:
    *   **Persistence**: Resolved comments are **never deleted**. They are simply hidden from the active view.
    *   **UI**: The Discussion Panel has a "Show Resolved" filter to view the full history.

## 3. Database Schema (PostgreSQL)

We will introduce a new table: `comments`.

### 3.1 Table Definition: `comments`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `organization_id` | `uuid` | Refs `organizations.id`. |
| `flow_id` | `uuid` | Refs `flows.id`. The context of the comment. |
| `user_id` | `uuid` | Refs `profiles.id` (Author). |
| `content` | `text` | The markdown text of the comment. |
| `parent_id` | `uuid` (Nullable) | Refs `comments.id`. If NULL, this is a **Root Thread**. |
| `node_id` | `text` | The persistent ID of the Node (or Sticky Note) being discussed. |
| `status` | `text` | Enum: `'OPEN'`, `'RESOLVED'`, `'WONTFIX'`. Defaults to `'OPEN'`. |
| `resolved_at` | `timestamptz` | When it was resolved. |
| `resolved_by` | `uuid` | Refs `profiles.id`. |
| `created_at` | `timestamptz` | Default `now()`. |
| `last_viewed_at_snapshot` | `timestamptz` | *Derived*. Used for "Since you last looked" queries. |

### 3.2 Tracking Unreads: `flow_visits`
To support "New Comments" badges, we need to know when a user last looked at a flow.
| Column | Type | Description |
| :--- | :--- | :--- |
| `user_id` | `uuid` | PK. |
| `flow_id` | `uuid` | PK. |
| `last_viewed_at` | `timestamptz` | Updated on flow open/close. |

### 3.3 Indexes
*   Index on `(flow_id, node_id)` for fetching all comments for a specific node.
*   Index on `(flow_id, status)` for global stats.

## 4. API & Realtime Strategy

### 4.1 Fetching Comments
*   **Initial Load**: When opening a Flow, we fetch all *active* (status != 'RESOLVED') threads for this `flow_id`.
*   *Query*: `SELECT * FROM comments WHERE flow_id = ? AND (status = 'OPEN' OR resolved_at > now() - interval '24 hours')`.

### 4.2 Realtime Updates
*   We will subscribe to Supabase Realtime changes for `table: comments`.
*   **Unread Logic**:
    *   On Load: Fetch `flow_visits.last_viewed_at` for current User.
    *   Compare: Any comment with `created_at > last_viewed_at` is flagged as **UNREAD**.
    *   Update: `last_viewed_at` is updated to `now()` when the user *closes* the flow or manually "Marks as Read".

## 5. UI Components

### 5.0 Discovery (Dashboard)
*   **Main Menu**: Flow Cards display a "New Activity" badge if `count(unread_comments) > 0`.
*   **Sort**: Default sort order bumps flows with new comments to the top.

### 5.1 `CommentOverlayLayer` (Canvas)
A transparent layer sitting *above* the React Flow canvas.
*   **Unread Indicator**: The Node Badge gets a distinct color (e.g., Red Dot) if it contains unread threads.
*   **Responsibility**: Renders `StickyNoteNode` and `CommentBadge` components at absolute positions relative to the viewport or nodes.
*   **Interactions**: Handles clicks to open the Thread Panel.

### 5.2 `DiscussionPanel` (Floating Popover)
To ensure users can view Node Properties (Right Panel) and Comments simultaneously, this will be a **Draggable Floating Window**.
*   **Behavior**: Anchored near the selected node by default, but movable by the user.
*   **Z-Index**: Top-most layer, independent of the main UI panels.
*   **Header**: Node Name / Type + Close Button.
*   **Filter/Action Bar**: Toggle for "Show Resolved" (default: Off).
*   **List**: Renders list of Root Comments (latest at bottom).
*   **Composer**: Input field at bottom to add new Root Comment.

### 5.3 `CommentThreadItem`
Renders a Root Comment and its nested replies.
*   **Status Toggle**: Checkbox/Button to mark this specific conversation chain as Resolved.

## 6. Implementation Plan

1.  **Database**:
    *   Create migration SQL for `comments` table.
    *   Add RLS policies (Viewers can SELECT, Editors/Admins can INSERT/UPDATE).
2.  **Types**:
    *   Generate TypeScript types from Supabase schema.
3.  **State Management**:
    *   Add `useComments(flowId)` hook utilizing `SWR` or React Query + Realtime subscription.
4.  **UI Construction**:
    *   Build `StickyNoteNode` custom node type.
    *   Build `CommentThread` and `CommentItem` components.
    *   Integrate into `FlowEditor` layout.
