"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, CalendarClock } from "lucide-react";
import { flowService, FlowSummary } from "@/services/flowService";
import { useEditorStore } from "@/store/editorStore";

interface LoadFlowModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function LoadFlowModal({ open, onOpenChange }: LoadFlowModalProps) {
    const [flows, setFlows] = useState<FlowSummary[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setFlow, markClean } = useEditorStore();

    useEffect(() => {
        if (open) {
            loadFlows();
        }
    }, [open]);

    const loadFlows = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await flowService.fetchFlows();
            setFlows(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load flows. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSelectFlow = async (flowId: string) => {
        setLoading(true);
        try {
            const flow = await flowService.fetchFlow(flowId);
            if (flow) {
                setFlow(flow);
                markClean();
                onOpenChange(false);
            } else {
                setError("Flow data not found.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch flow details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Load Flow</DialogTitle>
                    <DialogDescription>
                        Select a flow from the database to load into the editor.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
                        {error}
                    </div>
                )}

                <ScrollArea className="h-[400px] pr-4">
                    {loading && flows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-500">
                            <Loader2 className="animate-spin" size={24} />
                            <span className="text-sm">Loading flows...</span>
                        </div>
                    ) : flows.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-500">
                            <FileText size={40} className="opacity-20" />
                            <span className="text-sm">No flows found.</span>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {flows.map((flow) => (
                                <Button
                                    key={flow.id}
                                    variant="outline"
                                    className="h-auto p-4 flex flex-col items-start gap-1 hover:bg-slate-50 hover:border-slate-300 transition-all group"
                                    onClick={() => handleSelectFlow(flow.id)}
                                    disabled={loading}
                                >
                                    <div className="flex w-full items-center justify-between">
                                        <span className="font-semibold text-base group-hover:text-blue-600 transition-colors">
                                            {flow.name}
                                        </span>
                                        {loading && <Loader2 className="animate-spin opacity-0 group-hover:opacity-100" size={16} />}
                                    </div>

                                    {flow.description && (
                                        <span className="text-sm text-gray-500 line-clamp-2 text-left">
                                            {flow.description}
                                        </span>
                                    )}

                                    <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
                                        <CalendarClock size={12} />
                                        <span>Updated {new Date(flow.updatedAt).toLocaleDateString()}</span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
