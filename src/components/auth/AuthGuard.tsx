"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            setLoading(true);
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                // Check if we are handling an OAuth callback
                // When coming back from Google, the URL usually has ?code=...
                const hasCode = searchParams.has("code");
                const hasError = searchParams.has("error_description");

                if (hasCode || hasError) {
                    // Let the Supabase client handle the code exchange
                    // It will eventually trigger onAuthStateChange
                    console.log("AuthGuard: Detected OAuth code, waiting for session...");
                } else if (pathname !== "/login") {
                    // If no session and NOT a callback, redirect to login
                    router.replace("/login");
                }
                setAuthenticated(false);
            } else {
                setAuthenticated(true);
            }
            setLoading(false);
        };

        checkAuth();

        // Listen for auth state changes (e.g. sign out from another tab, or OAuth completion)
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
    }, [router, pathname, searchParams]);

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

    // While waiting for auth, if we have a code, we might show nothing or the loading spinner.
    // Ideally we want to prevent the flash of "null" -> redirect.
    // If NOT authenticated and NOT loading, we redirected.
    // If we are waiting for code exchange, `authenticated` is false, `loading` is false (from checkAuth end),
    // but checkAuth didn't redirect. We should probably show a spinner or allow through if we trust the code logic.
    // However, if we return null here, the user sees blank.
    // Let's keep showing spinner if we have a code but no session yet?
    // Or just render null. Render null is fine as we expect a quick state change.

    // Better UX: If we have a code and are not authenticated, show loading.
    const hasCode = searchParams.has("code");
    if (!authenticated && hasCode) {
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
