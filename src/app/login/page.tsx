"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [checkingSession, setCheckingSession] = useState(true);

    useEffect(() => {
        const checkSession = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (session) {
                router.replace("/");
            } else {
                setCheckingSession(false);
            }
        };
        checkSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session) {
                    router.replace("/");
                }
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [router]);

    if (checkingSession) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{" "}
                    <a
                        href="#"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        contact support for access
                    </a>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <Auth
                        supabaseClient={supabase}
                        appearance={{ theme: ThemeSupa }}
                        theme="light"
                        providers={["google"]}
                        redirectTo={`${typeof window !== "undefined" ? window.location.origin : ""}/`}
                        magicLink={true}
                        showLinks={false}
                    />
                </div>
            </div>
        </div>
    );
}
