"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabase/client";

export function DevAuthDetails() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleDevLogin = async () => {
        // For now, simpler to just start OAuth or magic link flow
        // But since we want to test RLS, we probably need a real user.
        // Let's just prompt for email and magic link for now.
        const email = prompt("Enter email for dev login:");
        if (!email) return;

        setLoading(true);
        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                shouldCreateUser: true,
                emailRedirectTo: typeof window !== 'undefined' ? window.location.href : undefined,
            }
        });

        setLoading(false);

        if (error) {
            alert(error.message);
        } else {
            alert("Magic link sent! Check your email (or Inbucket if local).");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return <Loader2 size={16} className="animate-spin text-gray-400" />;
    }

    return (
        <div className="flex items-center gap-2 text-xs">
            {user ? (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                    <User size={12} />
                    <span className="truncate max-w-[100px]">{user.email}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 ml-1 hover:bg-green-100"
                        onClick={handleLogout}
                        title="Sign Out"
                    >
                        <LogOut size={10} />
                    </Button>
                </div>
            ) : (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-xs gap-1.5 border-dashed border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                onClick={handleDevLogin}
                            >
                                <Lock size={12} />
                                Dev Auth
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Sign in to test RLS-protected flows</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
}
