"use client";

import { useState, useMemo } from "react";
import {
  Users,
  HelpCircle,
  CheckSquare,
  Type,
  Award,
  GitBranch,
  ExternalLink,
  Loader2,
  UserPlus,
  CreditCard,
  Keyboard,
  Search,
  MapPin,
  GraduationCap,
  BookOpen,
  LogIn,
  Monitor,
  Accessibility,
  Laptop,
  Target,
  Gauge,
  ShieldOff,
  Zap,
  Clock,
  User,
} from "lucide-react";
import { useEditorStore } from "@/store/editorStore";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  componentTemplates,
  getTemplatesByCategory,
  categoryInfo,
} from "@/data/componentRegistry";
import type { FlowCategory, ComponentTemplate } from "@/types/flow";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, React.ElementType> = {
  users: Users,
  "help-circle": HelpCircle,
  "check-square": CheckSquare,
  type: Type,
  award: Award,
  "git-branch": GitBranch,
  "external-link": ExternalLink,
  loader: Loader2,
  "user-plus": UserPlus,
  "credit-card": CreditCard,
  keyboard: Keyboard,
  search: Search,
  "map-pin": MapPin,
  "graduation-cap": GraduationCap,
  "book-open": BookOpen,
  "log-in": LogIn,
  monitor: Monitor,
  accessibility: Accessibility,
  laptop: Laptop,
  target: Target,
  gauge: Gauge,
  "shield-off": ShieldOff,
  zap: Zap,
  clock: Clock,
  user: User,
};

interface ComponentLibraryProps {
  flowCategory?: FlowCategory;
}

export function ComponentLibrary({ flowCategory }: ComponentLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMode, setFilterMode] = useState<"all" | "individual" | "educator">("all");
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  // Constants for filters
  const ROLE_FILTERS = {
    individual: [
      { id: "student", label: "Student" },
      { id: "parent", label: "Parent" },
      { id: "adult", label: "Adult" },
    ],
    educator: [
      { id: "teacher", label: "Teacher" },
      { id: "school-admin", label: "School Admin" },
      { id: "district-admin", label: "District Admin" },
    ],
  };

  const CATEGORY_FILTERS = Object.entries(categoryInfo)
    .sort(([, a], [, b]) => a.order - b.order)
    .map(([key, info]) => ({ id: key, label: info.label }));

  const filteredTemplates = useMemo(() => {
    let templates = componentTemplates;

    // 1. Filter by Mode (Broad Scope)
    if (filterMode === "individual") {
      templates = templates.filter(
        (t) => t.isShared || (t.validFlows && t.validFlows.includes("individual"))
      );
    } else if (filterMode === "educator") {
      templates = templates.filter(
        (t) => t.isShared || (t.validFlows && t.validFlows.includes("educator"))
      );
    }

    // 2. Filter by Role (Specific Persona)
    if (roleFilter) {
      const knownRoles = [
        "student",
        "parent",
        "adult",
        "teacher",
        "school-admin",
        "district-admin",
        "admin", // helper
      ];

      templates = templates.filter((t) => {
        // Direct match: Component is explicitly tagged for this role
        if (t.tags.includes(roleFilter)) return true;

        // Admin expansion: school-admin/district-admin should match generic "admin" tag
        if (roleFilter.includes("admin") && t.tags.includes("admin")) return true;

        // Generic fallback: If component has NO known role tags, it's generic (e.g. Daily Goal) -> Include it
        const hasRoleTags = t.tags.some(tag => knownRoles.includes(tag));
        if (!hasRoleTags) return true;

        return false;
      });
    }

    // 3. Filter by Category (Type)
    if (categoryFilter) {
      templates = templates.filter((t) => t.category === categoryFilter);
    }

    // 4. Filter by Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      templates = templates.filter(
        (t) =>
          t.name.toLowerCase().includes(query) ||
          t.description.toLowerCase().includes(query) ||
          t.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    return templates;
  }, [filterMode, roleFilter, categoryFilter, searchQuery]);

  // ... (groupedTemplates logic remains same)

  const groupedTemplates = useMemo(() => {
    const groups: Record<string, ComponentTemplate[]> = {};

    filteredTemplates.forEach((template) => {
      if (!groups[template.category]) {
        groups[template.category] = [];
      }
      groups[template.category].push(template);
    });

    // Sort categories by order
    const sortedCategories = Object.keys(groups).sort(
      (a, b) => (categoryInfo[a]?.order || 99) - (categoryInfo[b]?.order || 99)
    );

    return { groups, sortedCategories };
  }, [filteredTemplates]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    template: ComponentTemplate
  ) => {
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify(template.defaultScreen)
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Reset sub-filters when mode changes
  const handleModeChange = (mode: "all" | "individual" | "educator") => {
    setFilterMode(mode);
    setRoleFilter(null);
    // We intentionally keep category filter as it applies across modes
  };

  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-4 border-b space-y-4">

        <div className="space-y-3">
          <h2 className="font-semibold text-sm">Library</h2>

          {/* 1. Mode Toggles */}
          <div className="flex p-1 bg-gray-100 rounded-lg">
            {(["all", "individual", "educator"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => handleModeChange(mode)}
                className={`flex-1 text-[11px] font-medium py-1.5 rounded-md transition-all ${filterMode === mode
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {mode === "individual" ? "Individual" : mode === "educator" ? "Faculty" : "All"}
              </button>
            ))}
          </div>

          {/* 2. Role Filters (Contextual) */}
          {filterMode !== "all" && (
            <div className="flex gap-1.5 flex-wrap">
              {ROLE_FILTERS[filterMode].map((role) => (
                <Badge
                  key={role.id}
                  variant={roleFilter === role.id ? "default" : "outline"}
                  className="cursor-pointer text-[10px] px-2 py-0.5"
                  onClick={() => setRoleFilter(roleFilter === role.id ? null : role.id)}
                >
                  {role.label}
                </Badge>
              ))}
            </div>
          )}

          {/* 3. Category Filters */}
          {/* 3. Category Filters */}
          <div className="flex gap-1.5 flex-wrap pb-1">
            {CATEGORY_FILTERS.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(categoryFilter === cat.id ? null : cat.id)}
                className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${categoryFilter === cat.id
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <Input
          type="search"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-sm"
        />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {groupedTemplates.sortedCategories.map((category) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                {categoryInfo[category]?.label || category}
              </h3>

              <div className="space-y-2">
                {groupedTemplates.groups[category].map((template) => (
                  <ComponentCard
                    key={template.id}
                    template={template}
                    onDragStart={handleDragStart}
                  />
                ))}
              </div>

              <Separator className="mt-4" />
            </div>
          ))}

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="text-sm">No components found</p>
              {searchQuery && (
                <p className="text-xs mt-1">Try a different search term</p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

interface ComponentCardProps {
  template: ComponentTemplate;
  onDragStart: (
    event: React.DragEvent<HTMLDivElement>,
    template: ComponentTemplate
  ) => void;
}

function ComponentCard({ template, onDragStart }: ComponentCardProps) {
  const Icon = iconMap[template.icon] || HelpCircle;
  const selectLibraryItem = useEditorStore((state) => state.selectLibraryItem);
  const selectedLibraryItemId = useEditorStore((state) => state.selectedLibraryItemId);
  const isSelected = selectedLibraryItemId === template.id;
  const isStickyNote = template.id === 'sticky-note';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      onClick={() => selectLibraryItem(template.id)}
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border cursor-grab active:cursor-grabbing transition-colors",
        isSelected
          ? "bg-blue-50 border-blue-200 ring-1 ring-blue-300"
          : isStickyNote
            ? "bg-yellow-50 border-yellow-200 hover:border-yellow-300 hover:bg-yellow-100"
            : "bg-gray-50 border-transparent hover:border-gray-200 hover:bg-gray-100"
      )}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded bg-white border flex items-center justify-center">
        <Icon size={16} className="text-gray-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{template.name}</p>
          {template.isShared && template.id !== "sticky-note" && (
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              Shared
            </Badge>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
          {template.description}
        </p>
      </div>
    </div>
  );
}
