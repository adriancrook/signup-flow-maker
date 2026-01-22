# Sticky Note Bugs

## Issue 1: Sticky Note Persistence Failure
**Title:** Bug: Sticky Note content resets after page reload

**Description:**
When adding text to a Sticky Note, the content appears to be saved temporarily but is lost upon reloading the page.

**Steps to Reproduce:**
1. Open the Flow Editor.
2. Drag a "Sticky Note" from the sidebar (Annotations category) onto the canvas.
3. Type text into the note (e.g., "Test Note").
4. Refresh the page.
5. Observe that the sticky note text is gone/reset.

**Technical Context:**
- The `StickyNoteNode` component uses `updateNode` from `editorStore` to save changes to `data.screen.notes`.
- Verify if `useAutoSave` is correctly triggering for these changes or if `nodesToScreens` mapping is preserving the `notes` field during serialization.

---

## Issue 2: Sticky Note Author Attribution Missing
**Title:** Bug: Sticky Note does not display creator's avatar

**Description:**
Sticky Notes are supposed to display the avatar and name of the user who created them in the top-right corner. Currently, no attribution is shown.

**Steps to Reproduce:**
1. Login as a user with a profile (name/avatar set).
2. Drag a "Sticky Note" onto the canvas.
3. Observe the header of the note.

**Expected Behavior:**
The top-right corner of the note should show the user's mini-avatar and name.

**Actual Behavior:**
Only the "Note" label and icon are visible.

**Technical Context:**
- `FlowCanvas` handleDrop attempts to inject `metadata` with `authorId` into the screen object.
- `StickyNoteNode` attempts to read `data.screen.metadata.authorId` and fetch the profile.
- Possible break points:
    - `currentUserId` might be empty at the moment of drop in `FlowCanvas`.
    - `metadata` object might be stripped by `types` or `editorStore` sanitization before saving.
