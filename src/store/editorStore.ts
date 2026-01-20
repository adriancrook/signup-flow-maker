import { create } from "zustand";
import { temporal } from "zundo";
import { immer } from "zustand/middleware/immer";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
  Connection,
  addEdge,
} from "@xyflow/react";
import { nanoid } from "nanoid";
import type {
  Flow,
  Screen,
  FlowNodeData,
  FlowEdgeData,
  FlowVariable,
  FlowSettings,
} from "@/types/flow";

export type FlowNode = Node<FlowNodeData>;
export type FlowEdge = Edge<FlowEdgeData>;

interface ValidationError {
  nodeId: string;
  message: string;
}

interface EditorState {
  // Flow data
  currentFlow: Flow | null;
  nodes: FlowNode[];
  edges: FlowEdge[];

  // Selection
  selectedNodeId: string | null;
  selectedEdgeId: string | null;

  // Editor state
  isDirty: boolean;
  isValidating: boolean;
  validationErrors: ValidationError[];

  // UI State
  leftPanelOpen: boolean;
  rightPanelOpen: boolean;
  previewMode: boolean;

  // Actions
  setFlow: (flow: Flow) => void;
  createNewFlow: (name: string, category: "individual" | "educator") => void;
  updateFlowMeta: (updates: Partial<Pick<Flow, "name" | "description" | "settings">>) => void;

  // Node actions
  addNode: (screen: Partial<Screen>, position: { x: number; y: number }) => string;
  updateNode: (nodeId: string, screenUpdates: Partial<Screen>) => void;
  removeNode: (nodeId: string) => void;
  duplicateNode: (nodeId: string) => string | null;

  // Edge actions
  addEdge: (edge: FlowEdge) => void;
  removeEdge: (edgeId: string) => void;
  updateEdge: (edgeId: string, updates: Partial<FlowEdgeData>) => void;

  // React Flow callbacks
  onNodesChange: OnNodesChange<FlowNode>;
  onEdgesChange: OnEdgesChange<FlowEdge>;
  onConnect: OnConnect;

  // Selection
  selectNode: (nodeId: string | null) => void;
  selectEdge: (edgeId: string | null) => void;
  clearSelection: () => void;

  // Variable management
  addVariable: (variable: Omit<FlowVariable, "id">) => string;
  updateVariable: (variableId: string, updates: Partial<FlowVariable>) => void;
  removeVariable: (variableId: string) => void;

  // UI toggles
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  togglePreviewMode: () => void;

  // Persistence
  getFlowJson: () => string;
  loadFlowJson: (json: string) => boolean;
  markClean: () => void;
}

// Convert screens to React Flow nodes
function screensToNodes(screens: Screen[]): FlowNode[] {
  return screens.map((screen) => ({
    id: screen.id,
    type: screen.type,
    position: screen.position,
    data: {
      screen,
      isValid: true,
      isSelected: false,
      isHighlighted: false,
    },
  }));
}

// Convert screens to React Flow edges
function screensToEdges(screens: Screen[]): FlowEdge[] {
  const edges: FlowEdge[] = [];

  screens.forEach((screen) => {
    // Default next screen edge
    if (screen.nextScreenId) {
      edges.push({
        id: `${screen.id}->${screen.nextScreenId}`,
        source: screen.id,
        target: screen.nextScreenId,
        data: { isDefault: true },
      });
    }

    // Branch edges
    if (screen.branches) {
      screen.branches.forEach((branch) => {
        edges.push({
          id: `${screen.id}->${branch.targetScreenId}-branch-${branch.id}`,
          source: screen.id,
          target: branch.targetScreenId,
          data: {
            isDefault: false,
            branch,
            label: branch.label,
          },
          label: branch.label,
          animated: true,
        });
      });
    }

    // For screens with options that have nextScreenId
    if ("options" in screen && Array.isArray(screen.options)) {
      screen.options.forEach((option) => {
        if (option.nextScreenId && option.nextScreenId !== screen.nextScreenId) {
          edges.push({
            id: `${screen.id}->${option.nextScreenId}-option-${option.id}`,
            source: screen.id,
            target: option.nextScreenId,
            sourceHandle: option.id,
            data: {
              isDefault: false,
              label: option.label,
            },
            label: option.label,
            style: { strokeDasharray: "5,5" },
          });
        }
      });
    }
  });

  return edges;
}

// Convert nodes back to screens
function nodesToScreens(nodes: FlowNode[]): Screen[] {
  return nodes.map((node) => ({
    ...node.data.screen,
    position: node.position,
  }));
}

const defaultFlowSettings: FlowSettings = {
  showProgressBar: true,
  progressBarStyle: "steps",
  allowBackNavigation: true,
  autoSaveResponses: true,
  theme: "default",
};

export const useEditorStore = create<EditorState>()(
  temporal(
    immer((set, get) => ({
      // Initial state
      currentFlow: null,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      selectedEdgeId: null,
      isDirty: false,
      isValidating: false,
      validationErrors: [],
      leftPanelOpen: true,
      rightPanelOpen: true,
      previewMode: false,

      // Set entire flow
      setFlow: (flow) => {
        set((state) => {
          state.currentFlow = flow;
          state.nodes = screensToNodes(flow.screens);
          state.edges = screensToEdges(flow.screens);
          state.isDirty = false;
          state.selectedNodeId = null;
          state.selectedEdgeId = null;
        });
      },

      // Create new flow
      createNewFlow: (name, category) => {
        const flow: Flow = {
          id: nanoid(),
          name,
          description: "",
          category,
          targetPortal: category === "educator" ? "teacher" : "student",
          version: "1.0.0",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          entryScreenId: "",
          screens: [],
          variables: [],
          settings: defaultFlowSettings,
        };
        set((state) => {
          state.currentFlow = flow;
          state.nodes = [];
          state.edges = [];
          state.isDirty = true;
        });
      },

      // Update flow metadata
      updateFlowMeta: (updates) => {
        set((state) => {
          if (state.currentFlow) {
            Object.assign(state.currentFlow, updates);
            state.currentFlow.updatedAt = new Date().toISOString();
            state.isDirty = true;
          }
        });
      },

      // Add node
      addNode: (screenPartial, position) => {
        const id = nanoid();
        const screen: Screen = {
          id,
          type: screenPartial.type || "question",
          title: screenPartial.title || "New Screen",
          position,
          ...screenPartial,
        } as Screen;

        const node: FlowNode = {
          id,
          type: screen.type,
          position,
          data: {
            screen,
            isValid: true,
            isSelected: false,
            isHighlighted: false,
          },
        };

        set((state) => {
          state.nodes.push(node);
          if (state.currentFlow) {
            state.currentFlow.screens.push(screen);
            // Set as entry if first node
            if (state.nodes.length === 1) {
              state.currentFlow.entryScreenId = id;
            }
          }
          state.isDirty = true;
        });

        return id;
      },

      // Update node
      updateNode: (nodeId, screenUpdates) => {
        set((state) => {
          const nodeIndex = state.nodes.findIndex((n) => n.id === nodeId);
          if (nodeIndex !== -1) {
            const node = state.nodes[nodeIndex];
            node.data.screen = { ...node.data.screen, ...screenUpdates } as Screen;
          }
          if (state.currentFlow) {
            const screenIndex = state.currentFlow.screens.findIndex((s) => s.id === nodeId);
            if (screenIndex !== -1) {
              state.currentFlow.screens[screenIndex] = {
                ...state.currentFlow.screens[screenIndex],
                ...screenUpdates,
              } as Screen;
            }
            state.currentFlow.updatedAt = new Date().toISOString();
          }
          state.isDirty = true;
        });
      },

      // Remove node
      removeNode: (nodeId) => {
        set((state) => {
          state.nodes = state.nodes.filter((n) => n.id !== nodeId);
          state.edges = state.edges.filter(
            (e) => e.source !== nodeId && e.target !== nodeId
          );
          if (state.currentFlow) {
            state.currentFlow.screens = state.currentFlow.screens.filter(
              (s) => s.id !== nodeId
            );
            if (state.currentFlow.entryScreenId === nodeId) {
              state.currentFlow.entryScreenId = state.nodes[0]?.id || "";
            }
          }
          if (state.selectedNodeId === nodeId) {
            state.selectedNodeId = null;
          }
          state.isDirty = true;
        });
      },

      // Duplicate node
      duplicateNode: (nodeId) => {
        const state = get();
        const node = state.nodes.find((n) => n.id === nodeId);
        if (!node) return null;

        const newId = nanoid();
        const newScreen = {
          ...node.data.screen,
          id: newId,
          title: `${node.data.screen.title} (Copy)`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          nextScreenId: undefined,
          branches: undefined,
        };

        set((draft) => {
          const newNode: FlowNode = {
            id: newId,
            type: newScreen.type,
            position: newScreen.position,
            data: {
              screen: newScreen as Screen,
              isValid: true,
              isSelected: false,
              isHighlighted: false,
            },
          };
          draft.nodes.push(newNode);
          if (draft.currentFlow) {
            draft.currentFlow.screens.push(newScreen as Screen);
          }
          draft.isDirty = true;
        });

        return newId;
      },

      // Add edge
      addEdge: (edge) => {
        set((state) => {
          state.edges.push(edge);
          // Update source screen's nextScreenId
          if (edge.data?.isDefault) {
            const sourceScreen = state.currentFlow?.screens.find(
              (s) => s.id === edge.source
            );
            if (sourceScreen) {
              sourceScreen.nextScreenId = edge.target;
            }
          }
          state.isDirty = true;
        });
      },

      // Remove edge
      removeEdge: (edgeId) => {
        set((state) => {
          const edge = state.edges.find((e) => e.id === edgeId);
          if (edge && edge.data?.isDefault && state.currentFlow) {
            const screen = state.currentFlow.screens.find(
              (s) => s.id === edge.source
            );
            if (screen) {
              screen.nextScreenId = undefined;
            }
          }
          state.edges = state.edges.filter((e) => e.id !== edgeId);
          if (state.selectedEdgeId === edgeId) {
            state.selectedEdgeId = null;
          }
          state.isDirty = true;
        });
      },

      // Update edge
      updateEdge: (edgeId, updates) => {
        set((state) => {
          const edgeIndex = state.edges.findIndex((e) => e.id === edgeId);
          if (edgeIndex !== -1) {
            state.edges[edgeIndex].data = {
              ...state.edges[edgeIndex].data,
              ...updates,
            } as FlowEdgeData;
          }
          state.isDirty = true;
        });
      },

      // React Flow callbacks
      onNodesChange: (changes) => {
        set((state) => {
          state.nodes = applyNodeChanges(changes, state.nodes) as FlowNode[];
          // Sync position changes to screens
          changes.forEach((change) => {
            if (change.type === "position" && change.position && state.currentFlow) {
              const screen = state.currentFlow.screens.find(
                (s) => s.id === change.id
              );
              if (screen) {
                screen.position = change.position;
              }
            }
          });
          state.isDirty = true;
        });
      },

      onEdgesChange: (changes) => {
        set((state) => {
          state.edges = applyEdgeChanges(changes, state.edges) as FlowEdge[];
          state.isDirty = true;
        });
      },

      onConnect: (connection: Connection) => {
        if (!connection.source || !connection.target) return;

        const edgeId = `${connection.source}->${connection.target}`;
        const newEdge: FlowEdge = {
          id: edgeId,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle ?? undefined,
          targetHandle: connection.targetHandle ?? undefined,
          data: { isDefault: true },
        };

        set((state) => {
          state.edges = addEdge(newEdge, state.edges) as FlowEdge[];
          // Update source screen
          if (state.currentFlow) {
            const screen = state.currentFlow.screens.find(
              (s) => s.id === connection.source
            );
            if (screen) {
              screen.nextScreenId = connection.target!;
            }
          }
          state.isDirty = true;
        });
      },

      // Selection
      selectNode: (nodeId) => {
        set((state) => {
          state.selectedNodeId = nodeId;
          state.selectedEdgeId = null;
          // Update node selection state
          state.nodes.forEach((node) => {
            node.data.isSelected = node.id === nodeId;
          });
        });
      },

      selectEdge: (edgeId) => {
        set((state) => {
          state.selectedEdgeId = edgeId;
          state.selectedNodeId = null;
          state.nodes.forEach((node) => {
            node.data.isSelected = false;
          });
        });
      },

      clearSelection: () => {
        set((state) => {
          state.selectedNodeId = null;
          state.selectedEdgeId = null;
          state.nodes.forEach((node) => {
            node.data.isSelected = false;
          });
        });
      },

      // Variable management
      addVariable: (variable) => {
        const id = nanoid();
        set((state) => {
          if (state.currentFlow) {
            state.currentFlow.variables.push({ ...variable, id });
          }
          state.isDirty = true;
        });
        return id;
      },

      updateVariable: (variableId, updates) => {
        set((state) => {
          if (state.currentFlow) {
            const varIndex = state.currentFlow.variables.findIndex(
              (v) => v.id === variableId
            );
            if (varIndex !== -1) {
              state.currentFlow.variables[varIndex] = {
                ...state.currentFlow.variables[varIndex],
                ...updates,
              };
            }
          }
          state.isDirty = true;
        });
      },

      removeVariable: (variableId) => {
        set((state) => {
          if (state.currentFlow) {
            state.currentFlow.variables = state.currentFlow.variables.filter(
              (v) => v.id !== variableId
            );
          }
          state.isDirty = true;
        });
      },

      // UI toggles
      toggleLeftPanel: () => {
        set((state) => {
          state.leftPanelOpen = !state.leftPanelOpen;
        });
      },

      toggleRightPanel: () => {
        set((state) => {
          state.rightPanelOpen = !state.rightPanelOpen;
        });
      },

      togglePreviewMode: () => {
        set((state) => {
          state.previewMode = !state.previewMode;
        });
      },

      // Persistence
      getFlowJson: () => {
        const state = get();
        if (!state.currentFlow) return "";

        // Sync node positions to screens
        const screens = nodesToScreens(state.nodes);
        const flow: Flow = {
          ...state.currentFlow,
          screens,
          updatedAt: new Date().toISOString(),
        };

        return JSON.stringify(flow, null, 2);
      },

      loadFlowJson: (json) => {
        try {
          const flow = JSON.parse(json) as Flow;
          get().setFlow(flow);
          return true;
        } catch {
          return false;
        }
      },

      markClean: () => {
        set((state) => {
          state.isDirty = false;
        });
      },
    })),
    {
      limit: 50,
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        currentFlow: state.currentFlow,
      }),
    }
  )
);

// Selectors
export const selectSelectedNode = (state: EditorState) =>
  state.nodes.find((n) => n.id === state.selectedNodeId);

export const selectSelectedScreen = (state: EditorState) =>
  selectSelectedNode(state)?.data.screen;

export const selectVariables = (state: EditorState) =>
  state.currentFlow?.variables || [];
