import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";

export type UserRole = 'admin' | 'editor' | 'viewer';

export function useUserRole() {
    const [role, setRole] = useState<UserRole | null>(null);
    const [realRole, setRealRole] = useState<UserRole | null>(null); // The actual DB role
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPreviewMode, setIsPreviewMode] = useState(false);

    const fetchRole = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setRole(null);
                setRealRole(null);
                setUserId(null);
                return;
            }

            setUserId(user.id);

            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (data) {
                const dbRole = data.role as UserRole;
                setRealRole(dbRole);

                // Check for override
                const override = localStorage.getItem('antigravity_role_override') as UserRole | null;
                if (dbRole === 'admin' && override && ['viewer', 'editor'].includes(override)) {
                    setRole(override);
                    setIsPreviewMode(true);
                } else {
                    setRole(dbRole);
                    setIsPreviewMode(false);
                }
            }
        } catch (e) {
            console.error("Failed to fetch role", e);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRole();

        // Listen for storage events (if we change it in another tab/component)
        const handleStorageChange = () => {
            fetchRole();
        };

        // Custom event dispatching might be needed if we stay on same page
        window.addEventListener('role_override_change', handleStorageChange);

        return () => {
            window.removeEventListener('role_override_change', handleStorageChange);
        };
    }, [fetchRole]);

    const setPreviewRole = (targetRole: UserRole | null) => {
        if (realRole !== 'admin') return;

        if (!targetRole) {
            localStorage.removeItem('antigravity_role_override');
        } else {
            localStorage.setItem('antigravity_role_override', targetRole);
        }

        // Dispatch event to update other components immediately
        window.dispatchEvent(new Event('role_override_change'));

        // Optimistic update
        fetchRole();
    };

    return {
        role, // The effective role (override or real)
        realRole, // The actual role
        userId,
        isLoading,
        isPreviewMode, // Boolean: are we faking it?
        setPreviewRole,
        refresh: fetchRole
    };
}
