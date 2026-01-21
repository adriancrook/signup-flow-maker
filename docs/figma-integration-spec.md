# Design Spec: Figma Content Injection (Plugin-Based)

## Overview
This specification details "Option 3" for integrating the Signup Flow Maker with Figma: a **Data Injection** approach. Instead of trying to generate UI via the read-only Figma API, we will utilize a custom Figma Plugin to "hydrate" existing design templates with real content defined in the Flow Maker.

## The Problem
*   **Figma REST API Limitations**: The standard REST API is primarily read-only for file content. It cannot modify text layers in existing files.
*   **Stitch Limitations**: Stitch is optimized for generating *new* layouts from scratch, not injecting precise content into highly specific, brand-compliant production templates.
*   **Manual Toil**: Manually string copy-pasting from the Flow Maker into Figma is error-prone and slow.

## The Solution: "Flow Hydrator" Plugin
We will build a lightweight Figma Plugin and a corresponding data export feature in the Flow Maker.

### Workflow
1.  **In Signup Flow Maker**:
    *   User defines the flow content (Headlines, Body Copy, Button Labels, Selection Options).
    *   User selects a screen/node.
    *   User clicks **"Copy Content Payload"**.
    *   System generates a flattened JSON payload of the content.

2.  **In Figma**:
    *   Designer opens the production design file.
    *   Designer selects the target Frame (or multiple Frames).
    *   Designer runs the local **"Flow Hydrator"** plugin.
    *   Plugin reads the JSON payload (either via clipboard or a direct local server fetch).
    *   Plugin iterates through layers, matching **Layer Names** to **JSON Keys**.
    *   Plugin updates the text content of matched layers.

---

## Technical Architecture

### 1. JSON Payload Structure
To ensure reliability, we will use a dedicated "content key" syntax. The JSON structure should reflect the component's semantic data.

**Example Payload:**
```json
{
  "screen_id": "MC-GRADE-STUDENT",
  "content": {
    "headline": "What grade are you in?",
    "subheadline": "This helps us adjust the difficulty.",
    "options": [
      { "id": "grade_k", "label": "Kindergarten" },
      { "id": "grade_1", "label": "1st Grade" },
      { "id": "grade_2", "label": "2nd Grade" }
    ],
    "button_primary": "Continue",
    "button_secondary": "Back"
  }
}
```

### 2. Figma Layer Naming Convention
The Figma template must be prepared by naming layers with a specific prefix or exact match to facilitate binding.

*   **Pattern**: `#<key_name>`
*   **Examples**:
    *   The main title text layer should be named: `#headline`
    *   The subtitle text layer should be named: `#subheadline`
    *   Option buttons might be named `#option_1_label`, `#option_2_label` OR use the Plugin API to find repeated groups.

### 3. Plugin Logic (Pseudocode)
```typescript
// Figma Plugin Code

// 1. Get Selection
const selection = figma.currentPage.selection;

// 2. Parse Payload (e.g. from UI input or Clipboard)
const payload = JSON.parse(userInput);

// 3. Traverse Helper
function updateLayers(node, data) {
  // Check if node name matches a data key (e.g. "#headline")
  const cleanName = node.name.replace('#', '');
  
  if (data[cleanName] && node.type === "TEXT") {
     // Load font before changing characters
    await figma.loadFontAsync(node.fontName);
    node.characters = data[cleanName];
  }

  // Recurse for children (Frames, Groups)
  if (node.children) {
    node.children.forEach(child => updateLayers(child, data));
  }
}

// 4. Run
selection.forEach(frame => {
  updateLayers(frame, payload.content);
});
```

---

## Implementation Steps

### Phase A: Export Utility (Signup Flow Maker)
1.  **Schema Definition**: Create a strict `ContentSchema` for nodes, separating logic props from display props.
2.  **Export Method**: Add a generic `toContentJSON()` method to the Screen Node types.
3.  **UI Action**: Add a "Copy Figma Data" button to the Properties Panel.

### Phase B: Figma Plugin (Local Dev)
1.  **Scaffold**: Initialize a new Figma Plugin project (Typescript).
2.  **Walker Logic**: Implement the recursive layer walker that respects Group/Frame hierarchies.
3.  **UI**: Implement a simple UI/Modal in Figma to paste the JSON.
4.  **Testing**: Test with a sample "Master Component" in Figma.

### Phase C: Advanced Binding (Optional)
*   **Auto-Layout Listeners**: If the list of options changes (e.g. 3 items vs 5 items), the plugin can clone/remove instances in an Auto-Layout container to match the array length.
