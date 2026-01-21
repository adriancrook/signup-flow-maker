"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                // If no session, redirect to login (unless already there)
                if (pathname !== "/login") {
                    // Encode the return URL if needed, for now just simple redirect
                    router.replace("/login");
                }
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for auth state changes (e.g. sign out from another tab)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_OUT') {
                setAuthenticated(false);
                router.replace("/login");
            } else if (session) {
                setAuthenticated(true);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router, pathname]);

    // Allow unrestricted access to login page
    if (pathname === "/login") {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!authenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
