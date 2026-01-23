"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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

                if (hasCode) {
                    // Let the Supabase client handle the code exchange
                    console.log("AuthGuard: Detected OAuth code, waiting for session...");
                } else if (hasError) {
                    console.error("AuthGuard: Auth error detected", searchParams.get("error_description"));
                    setAuthenticated(false);
                    // Do NOT redirect immediately if there's an error, so we can show it
                } else if (pathname !== "/login") {
                    // If no session and NOT a callback, redirect to login
                    router.replace("/login");
                }

                // If checking auth failed (or we have no session), we are not authenticated.
                // But if there is an error, we want to stop loading to show it.
                if (!session) {
                    setAuthenticated(false);
                } else {
                    setAuthenticated(true);
                }
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

    const error = searchParams.get("error");
    const errorDescription = searchParams.get("error_description");

    if (error || errorDescription) {
        return (
            <div className="flex flex-col h-screen w-screen items-center justify-center bg-gray-50 p-4">
                <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full border border-red-100">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Authentication Error</h2>
                    <p className="text-gray-700 mb-4">
                        {errorDescription || "An unexpected error occurred during login."}
                    </p>
                    <div className="text-xs text-gray-500 mb-6 font-mono bg-gray-100 p-2 rounded">
                        Error Code: {error || "unknown"}
                    </div>
                    <Button
                        onClick={() => router.replace("/login")}
                        className="w-full"
                    >
                        Back to Login
                    </Button>
                </div>
            </div>
        );
    }

    if (!authenticated) {
        return null; // Will redirect in useEffect
    }

    return <>{children}</>;
}
