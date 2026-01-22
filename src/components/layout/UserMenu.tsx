"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOut, User, Eye, EyeOff } from "lucide-react";
import { useUserRole } from "@/hooks/useUserRole";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function UserMenu() {
    const [email, setEmail] = useState<string | null>(null);
    const router = useRouter();
    const { realRole, role, isPreviewMode, setPreviewRole } = useUserRole();

    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (user?.email) {
                setEmail(user.email);
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login"); // Force redirect to login
    };

    if (!email) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full border border-gray-200">
                    <span className="sr-only">Open user menu</span>
                    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs font-medium text-gray-600 rounded-full">
                        {email.substring(0, 2).toUpperCase()}
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">Account</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuItem onClick={() => router.push('/team')} className="cursor-pointer">
                    <div className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Team Settings</span>
                    </div>
                </DropdownMenuItem>

                {realRole === 'admin' && (
                    <>
                        {isPreviewMode ? (
                            <DropdownMenuItem onClick={() => setPreviewRole(null)} className="cursor-pointer bg-amber-50 text-amber-900 border-l-4 border-amber-500">
                                <div className="flex items-center w-full font-medium">
                                    <EyeOff className="mr-2 h-4 w-4 text-amber-600" />
                                    <span>Exit Preview ({role})</span>
                                </div>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Eye className="mr-2 h-4 w-4" />
                                    <span>Preview As...</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem onClick={() => setPreviewRole('editor')}>
                                            <span className="ml-2">Editor</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => setPreviewRole('viewer')}>
                                            <span className="ml-2">Viewer</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        )}
                    </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
