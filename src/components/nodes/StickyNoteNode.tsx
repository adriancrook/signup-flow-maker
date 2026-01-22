import { memo, useCallback, useEffect, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { StickyNote, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEditorStore } from "@/store/editorStore";

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

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        updateNode(id, { notes: newValue });
    }, [id, updateNode]);

    return (
        <div
            className={cn(
                "relative w-48 h-48 bg-yellow-200 border-2 rounded-lg shadow-sm p-3 flex flex-col transition-all hover:shadow-md aspect-square",
                selected ? "border-blue-500 ring-2 ring-blue-500/20" : "border-yellow-300"
            )}
        >
            <div className="flex items-center justify-between mb-2 shrink-0">
                <div className="flex items-center gap-2 text-yellow-800 opacity-50">
                    <StickyNote className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Note</span>
                </div>
                {author && (
                    <div className="flex items-center gap-1.5" title={`Created by ${author.name}`}>
                        <Avatar className="w-4 h-4 border border-yellow-400/50">
                            <AvatarImage src={author.avatar_url} />
                            <AvatarFallback className="text-[8px] bg-yellow-300 text-yellow-800">
                                {author.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-[10px] text-yellow-800/60 font-medium truncate max-w-[60px]">
                            {author.name.split(' ')[0]}
                        </span>
                    </div>
                )}
            </div>

            <textarea
                className="flex-1 w-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none text-sm text-yellow-900 leading-relaxed placeholder:text-yellow-800/40 font-handwriting"
                placeholder="Add your note here..."
                value={content}
                onChange={handleContentChange}
                onMouseDown={(e) => e.stopPropagation()} // Allow text selection without dragging node
            />
        </div>
    );
};

export default memo(StickyNoteNode);
