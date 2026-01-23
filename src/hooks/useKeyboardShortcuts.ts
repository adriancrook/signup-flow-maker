import { useEffect } from "react";
import { useEditorStore } from "@/store/editorStore";

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if target is input/textarea to avoid hijacking
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) || target.isContentEditable) {
        return;
      }

      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      const isShift = e.shiftKey;

      // Undo: Cmd+Z
      if (isCmdOrCtrl && !isShift && e.key.toLowerCase() === "z") {
        e.preventDefault();
        useEditorStore.temporal.getState().undo();
      }

      // Redo: Cmd+Shift+Z or Cmd+Y
      if ((isCmdOrCtrl && isShift && e.key.toLowerCase() === "z") || (isCmdOrCtrl && e.key.toLowerCase() === "y")) {
        e.preventDefault();
        useEditorStore.temporal.getState().redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
