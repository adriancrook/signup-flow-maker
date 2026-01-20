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

  const filteredTemplates = useMemo(() => {
    let templates = componentTemplates;

    // Filter by flow category if specified
    if (flowCategory) {
      templates = templates.filter(
        (t) => !t.validFlows || t.validFlows.includes(flowCategory)
      );
    }

    // Filter by search query
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
  }, [flowCategory, searchQuery]);

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

  return (
    <div className="h-full flex flex-col bg-white border-r">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-sm mb-3">Components</h2>
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

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, template)}
      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-transparent hover:border-gray-200 hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors"
    >
      <div className="flex-shrink-0 w-8 h-8 rounded bg-white border flex items-center justify-center">
        <Icon size={16} className="text-gray-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900">{template.name}</p>
          {template.isShared && (
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
