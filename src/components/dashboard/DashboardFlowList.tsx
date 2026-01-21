"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Loader2, FileClock, ArrowRight } from "lucide-react";
import { flowService, FlowSummary } from "@/services/flowService";

export function DashboardFlowList() {
    const [flows, setFlows] = useState<FlowSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadFlows();
    }, []);

    const loadFlows = async () => {
        try {
            const data = await flowService.fetchFlows();
            setFlows(data);
        } catch (err) {
            console.error("Failed to load flows", err);
            // Don't show error to user immediately if it's just auth (might be anon)
            // But if we want them to see their flows, we should probably show something.
            // For now, let's just leave empty.
            setError("Could not load saved flows. Please sign in.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
                <Loader2 className="animate-spin" size={20} />
                <span>Loading your saved flows...</span>
            </div>
        );
    }

    if (error) {
        // Quietly fail or show if desired. Since we have dev auth, showing is good.
        return (
            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200 mb-6">
                {error}
            </div>
        );
    }

    if (flows.length === 0) {
        return (
            <div className="text-muted-foreground italic py-4 mb-8 text-sm">
                No saved flows found. Start by creating a new flow or editing a template below.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {flows.map((flow) => (
                <Link
                    key={flow.id}
                    href={`/editor/${flow.id}`}
                    className="group block p-5 border rounded-lg bg-white hover:border-primary/50 hover:shadow-sm transition-all"
                >
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg group-hover:text-primary transition-colors truncate pr-2">
                            {flow.name}
                        </h3>
                        <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1" />
                    </div>

                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 h-10">
                        {flow.description || "No description provided."}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <FileClock size={12} />
                        <span>
                            Updated {formatDistanceToNow(new Date(flow.updatedAt), { addSuffix: true })}
                        </span>
                    </div>
                </Link>
            ))}
        </div>
    );
}
