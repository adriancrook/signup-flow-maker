import { memo, useCallback, useEffect, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { StickyNote, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEditorStore } from "@/store/editorStore";
import { useFlowSave } from "@/hooks/useFlowSave";
import { useComments } from "@/hooks/useComments";

const StickyNoteNode = ({ id, selected, data }: NodeProps) => {
    const updateNode = useEditorStore((state) => state.updateNode);
    const [author, setAuthor] = useState<{ name: string; avatar_url?: string } | null>(null);

    // Access nested screen data
    const screenData = (data.screen as any) || {};
    const metadata = screenData.metadata || {};
    const authorId = metadata.authorId;
    const content = screenData.notes || "";

    useEffect(() => {
        if (!authorId) return;

        const fetchAuthor = async () => {
            const { data } = await supabase
                .from("profiles")
                .select("full_name, avatar_url")
                .eq("id", authorId)
                .single();

            if (data) {
                setAuthor({
                    name: data.full_name || "Unknown",
                    avatar_url: data.avatar_url || undefined,
                });
            }
        };

        fetchAuthor();
    }, [authorId]);

    const { editComment } = useComments(useEditorStore(state => state.currentFlow?.id || ""));
    const { saveFlow } = useFlowSave();

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        updateNode(id, { notes: newValue });
    }, [id, updateNode]);

    const handleBlur = useCallback(() => {
        // Persist content to DB
        editComment(id, content);

        // We don't necessarily need to saveFlow() since sticky notes are independent now,
        // but it cleans up the "Unsaved" badge if we want to sync state. 
        // However, since getFlowJson excludes them, saveFlow technically saves "nothing" regarding this note.
        // Let's keep it to avoid user confusion about "Unsaved" state for now.
        saveFlow();
    }, [editComment, id, content, saveFlow]);

    return (
        <div
            className={cn(
                "relative w-48 h-48 bg-yellow-200 border-2 rounded-lg shadow-sm p-3 flex flex-col transition-all hover:shadow-md aspect-square",
                selected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-yellow-300"
            )}
        >
            <div className="flex items-center justify-between mb-2 shrink-0 gap-2">
                <div className="flex items-center gap-2 text-yellow-800 opacity-50 shrink-0">
                    <StickyNote className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Note</span>
                </div>
            </div>

            <textarea
                className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-sm text-yellow-900 leading-relaxed placeholder:text-yellow-800/40 font-handwriting mb-6"
                placeholder="Add your note here..."
                value={content}
                onChange={handleContentChange}
                onBlur={handleBlur}
                onMouseDown={(e) => e.stopPropagation()} // Allow text selection without dragging node
            />

            {author && (
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 max-w-[80%] justify-end" title={`Created by ${author.name}`}>
                    <span className="text-[10px] text-yellow-800/60 font-medium truncate">
                        {author.name.split(' ')[0]}
                    </span>
                    <Avatar className="w-4 h-4 border border-yellow-400/50 shrink-0">
                        <AvatarImage src={author.avatar_url} />
                        <AvatarFallback className="text-[8px] bg-yellow-300 text-yellow-800">
                            {author.name[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
            )}
        </div>
    );
};

export default memo(StickyNoteNode);
