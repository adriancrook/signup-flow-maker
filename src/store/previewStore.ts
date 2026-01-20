import { create } from "zustand";
import type { Screen } from "@/types/flow";

export type DeviceMode = "mobile" | "tablet" | "desktop";

interface PreviewState {
  // Session state
  isActive: boolean;
  currentScreenId: string | null;
  screenHistory: string[];

  // Collected variables during preview
  variables: Record<string, string | number | boolean | string[]>;

  // Display settings
  deviceMode: DeviceMode;
  showVariableInspector: boolean;

  // Actions
  startPreview: (entryScreenId: string) => void;
  endPreview: () => void;
  goToScreen: (screenId: string) => void;
  goBack: () => void;
  setVariable: (name: string, value: string | number | boolean | string[]) => void;
  setDeviceMode: (mode: DeviceMode) => void;
  toggleVariableInspector: () => void;
  resetPreview: () => void;
}

export const usePreviewStore = create<PreviewState>((set, get) => ({
  // Initial state
  isActive: false,
  currentScreenId: null,
  screenHistory: [],
  variables: {},
  deviceMode: "desktop",
  showVariableInspector: true,

  // Start preview from entry point
  startPreview: (entryScreenId) => {
    set({
      isActive: true,
      currentScreenId: entryScreenId,
      screenHistory: [entryScreenId],
      variables: {},
    });
  },

  // End preview
  endPreview: () => {
    set({
      isActive: false,
      currentScreenId: null,
      screenHistory: [],
      variables: {},
    });
  },

  // Navigate to a screen
  goToScreen: (screenId) => {
    const { screenHistory } = get();
    set({
      currentScreenId: screenId,
      screenHistory: [...screenHistory, screenId],
    });
  },

  // Go back to previous screen
  goBack: () => {
    const { screenHistory } = get();
    if (screenHistory.length <= 1) return;

    const newHistory = screenHistory.slice(0, -1);
    set({
      currentScreenId: newHistory[newHistory.length - 1],
      screenHistory: newHistory,
    });
  },

  // Set a variable value
  setVariable: (name, value) => {
    set((state) => ({
      variables: {
        ...state.variables,
        [name]: value,
      },
    }));
  },

  // Change device mode
  setDeviceMode: (mode) => {
    set({ deviceMode: mode });
  },

  // Toggle variable inspector
  toggleVariableInspector: () => {
    set((state) => ({
      showVariableInspector: !state.showVariableInspector,
    }));
  },

  // Reset preview to start
  resetPreview: () => {
    const { screenHistory } = get();
    const entryScreenId = screenHistory[0];
    if (entryScreenId) {
      set({
        currentScreenId: entryScreenId,
        screenHistory: [entryScreenId],
        variables: {},
      });
    }
  },
}));

// Selectors
export const selectCanGoBack = (state: PreviewState) => state.screenHistory.length > 1;
