'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button"; // Assuming these exist
import { ArrowLeft, Check, Copy, Shield, ShieldAlert, User } from "lucide-react";
import Link from "next/link";

interface Profile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string | null;
    organization_id: string | null;
    email?: string;
}

export default function TeamPage() {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentUser, setCurrentUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        fetchTeam();
    }, []);

    const fetchTeam = async () => {
        setLoading(true);
        try {
            // Get current user first
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const { data: currentProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;
            setCurrentUser(currentProfile);

            if (!currentProfile.organization_id) {
                setProfiles([currentProfile]);
                return;
            }

            // Fetch all profiles in same org
            // Note: RLS allows this now
            const { data: teamMembers, error: teamError } = await supabase
                .from('profiles')
                .select('*')
                .eq('organization_id', currentProfile.organization_id)
                .order('full_name');

            if (teamError) throw teamError;
            setProfiles(teamMembers || []);

        } catch (err) {
            console.error("Error fetching team:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: 'admin' | 'editor' | 'viewer') => {
        if (!currentUser || currentUser.role !== 'admin') return;
        setUpdating(userId);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId);

            if (error) throw error;

            // Optimistic update
            setProfiles(prev => prev.map(p => p.id === userId ? { ...p, role: newRole } : p));

        } catch (err) {
            console.error("Failed to update role:", err);
            alert("Failed to update role. Ensure you are an admin.");
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    const isAdmin = currentUser?.role === 'admin';

    return (
        <div className="min-h-screen bg-gray-50/50 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        <Shield className="w-8 h-8 text-indigo-600" />
                        Team Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage members and permissions for your organization.
                    </p>
                </div>

                {!isAdmin && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-yellow-900">View Only Access</h3>
                            <p className="text-sm text-yellow-800 mt-1">
                                Only Organization Admins can change member roles. You can view the team roster below.
                            </p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-medium text-sm text-gray-500">Member</th>
                                <th className="px-6 py-4 font-medium text-sm text-gray-500">Role</th>
                                <th className="px-6 py-4 font-medium text-sm text-gray-500">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {profiles.map((profile) => (
                                <tr key={profile.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {profile.avatar_url ? (
                                                <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full bg-gray-200" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                                                    {profile.full_name?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                                                </div>
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{profile.full_name || 'Unnamed User'}</div>
                                                <div className="text-xs text-gray-500">ID: {profile.id.slice(0, 8)}...</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                            ${profile.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                profile.role === 'editor' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                            {profile.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {isAdmin && profile.id !== currentUser?.id ? (
                                            <select
                                                value={profile.role || 'viewer'}
                                                disabled={updating === profile.id}
                                                onChange={(e) => handleRoleChange(profile.id, e.target.value as any)}
                                                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                                            >
                                                <option value="viewer">Viewer</option>
                                                <option value="editor">Editor</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">
                                                {profile.id === currentUser?.id ? 'Current User' : 'Read Only'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
