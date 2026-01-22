export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    public: {
        Tables: {
            comments: {
                Row: {
                    content: string
                    created_at: string | null
                    flow_id: string
                    id: string
                    metadata: Json | null
                    node_id: string
                    organization_id: string
                    parent_id: string | null
                    resolved_at: string | null
                    resolved_by: string | null
                    status: string
                    user_id: string
                }
                Insert: {
                    content: string
                    created_at?: string | null
                    flow_id: string
                    id?: string
                    metadata?: Json | null
                    node_id: string
                    organization_id: string
                    parent_id?: string | null
                    resolved_at?: string | null
                    resolved_by?: string | null
                    status?: string
                    user_id: string
                }
                Update: {
                    content?: string
                    created_at?: string | null
                    flow_id?: string
                    id?: string
                    metadata?: Json | null
                    node_id?: string
                    organization_id?: string
                    parent_id?: string | null
                    resolved_at?: string | null
                    resolved_by?: string | null
                    status?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "comments_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_parent_id_fkey"
                        columns: ["parent_id"]
                        isOneToOne: false
                        referencedRelation: "comments"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_resolved_by_fkey"
                        columns: ["resolved_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            flow_visits: {
                Row: {
                    flow_id: string
                    last_viewed_at: string
                    user_id: string
                }
                Insert: {
                    flow_id: string
                    last_viewed_at?: string
                    user_id: string
                }
                Update: {
                    flow_id?: string
                    last_viewed_at?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "flow_visits_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flow_visits_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                ]
            }
            flow_versions: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    data: Json
                    flow_id: string
                    id: string
                    version_name: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    data: Json
                    flow_id: string
                    id?: string
                    version_name?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    data?: Json
                    flow_id?: string
                    id?: string
                    version_name?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "flow_versions_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flow_versions_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
                        referencedColumns: ["id"]
                    },
                ]
            }
            flows: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    current_version_id: string | null
                    description: string | null
                    id: string
                    is_locked: boolean | null
                    name: string
                    organization_id: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    current_version_id?: string | null
                    description?: string | null
                    id?: string
                    is_locked?: boolean | null
                    name: string
                    organization_id: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    current_version_id?: string | null
                    description?: string | null
                    id?: string
                    is_locked?: boolean | null
                    name?: string
                    organization_id?: string
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "flows_created_by_fkey"
                        columns: ["created_by"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flows_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organizations: {
                Row: {
                    created_at: string | null
                    domain: string | null
                    id: string
                    name: string
                    slug: string
                }
                Insert: {
                    created_at?: string | null
                    domain?: string | null
                    id?: string
                    name: string
                    slug: string
                }
                Update: {
                    created_at?: string | null
                    domain?: string | null
                    id?: string
                    name?: string
                    slug?: string
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    full_name: string | null
                    id: string
                    organization_id: string
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id: string
                    organization_id: string
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id?: string
                    organization_id?: string
                    role?: string | null
                    updated_at?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
