export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export type Database = {
    // Allows to automatically instantiate createClient with right options
    // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
    // __InternalSupabase: {
    //     PostgrestVersion: "14.1"
    // }
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
                        referencedRelation: "flow_dashboard_stats"
                        referencedColumns: ["flow_id"]
                    },
                    {
                        foreignKeyName: "comments_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "comments_node_id_fkey"
                        columns: ["node_id"]
                        isOneToOne: false
                        referencedRelation: "flow_items"
                        referencedColumns: ["id"]
                    },
                ]
            }
            component_overrides: {
                Row: {
                    component_code: string
                    created_at: string | null
                    id: string
                    organization_id: string
                    overrides: Json
                    updated_at: string | null
                    updated_by: string | null
                }
                Insert: {
                    component_code: string
                    created_at?: string | null
                    id?: string
                    organization_id: string
                    overrides?: Json
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Update: {
                    component_code?: string
                    created_at?: string | null
                    id?: string
                    organization_id?: string
                    overrides?: Json
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "component_overrides_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            flow_items: {
                Row: {
                    created_at: string | null
                    flow_id: string
                    id: string
                    type: string
                    updated_at: string | null
                    x: number
                    y: number
                }
                Insert: {
                    created_at?: string | null
                    flow_id: string
                    id?: string
                    type: string
                    updated_at?: string | null
                    x: number
                    y: number
                }
                Update: {
                    created_at?: string | null
                    flow_id?: string
                    id?: string
                    type?: string
                    updated_at?: string | null
                    x?: number
                    y?: number
                }
                Relationships: [
                    {
                        foreignKeyName: "flow_items_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flow_dashboard_stats"
                        referencedColumns: ["flow_id"]
                    },
                    {
                        foreignKeyName: "flow_items_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
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
                        foreignKeyName: "flow_versions_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flow_dashboard_stats"
                        referencedColumns: ["flow_id"]
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
                    }
                ]
            }
            flows: {
                Row: {
                    created_at: string | null
                    created_by: string | null
                    current_version_id: string | null
                    description: string | null
                    dev_version_id: string | null
                    id: string
                    is_shared: boolean | null
                    name: string
                    organization_id: string
                    updated_at: string | null
                    updated_by: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    current_version_id?: string | null
                    description?: string | null
                    dev_version_id?: string | null
                    id?: string
                    is_shared?: boolean | null
                    name: string
                    organization_id: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    current_version_id?: string | null
                    description?: string | null
                    dev_version_id?: string | null
                    id?: string
                    is_shared?: boolean | null
                    name?: string
                    organization_id?: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "flows_current_version_id_fkey"
                        columns: ["current_version_id"]
                        isOneToOne: false
                        referencedRelation: "flow_versions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flows_dev_version_id_fkey"
                        columns: ["dev_version_id"]
                        isOneToOne: false
                        referencedRelation: "flow_versions"
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
            library_items: {
                Row: {
                    component_code: string
                    created_at: string | null
                    default_props: Json | null
                    description: string | null
                    icon: string | null
                    id: string
                    label: string
                    organization_id: string
                    updated_at: string | null
                    updated_by: string | null
                }
                Insert: {
                    component_code: string
                    created_at?: string | null
                    default_props?: Json | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    label: string
                    organization_id: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Update: {
                    component_code?: string
                    created_at?: string | null
                    default_props?: Json | null
                    description?: string | null
                    icon?: string | null
                    id?: string
                    label?: string
                    organization_id?: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "library_items_organization_id_fkey"
                        columns: ["organization_id"]
                        isOneToOne: false
                        referencedRelation: "organizations"
                        referencedColumns: ["id"]
                    },
                ]
            }
            organization_members: {
                Row: {
                    created_at: string | null
                    id: string
                    organization_id: string
                    role: string
                    status: string
                    user_id: string
                }
                Insert: {
                    created_at?: string | null
                    id?: string
                    organization_id: string
                    role?: string
                    status?: string
                    user_id: string
                }
                Update: {
                    created_at?: string | null
                    id?: string
                    organization_id?: string
                    role?: string
                    status?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "organization_members_organization_id_fkey"
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
                    created_by: string | null
                    id: string
                    metadata: Json | null
                    name: string
                    slug: string
                    updated_at: string | null
                }
                Insert: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    metadata?: Json | null
                    name: string
                    slug: string
                    updated_at?: string | null
                }
                Update: {
                    created_at?: string | null
                    created_by?: string | null
                    id?: string
                    metadata?: Json | null
                    name?: string
                    slug?: string
                    updated_at?: string | null
                }
                Relationships: []
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    email: string
                    full_name: string | null
                    id: string
                    metadata: Json | null
                    organization_id: string | null
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email: string
                    full_name?: string | null
                    id: string
                    metadata?: Json | null
                    organization_id?: string | null
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    email?: string
                    full_name?: string | null
                    id?: string
                    metadata?: Json | null
                    organization_id?: string | null
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
            sticky_notes: {
                Row: {
                    color: string
                    content: string
                    created_at: string | null
                    flow_id: string
                    id: string
                    metadata: Json | null
                    node_id: string
                    organization_id: string
                    updated_at: string | null
                    updated_by: string | null
                }
                Insert: {
                    color?: string
                    content?: string
                    created_at?: string | null
                    flow_id: string
                    id?: string
                    metadata?: Json | null
                    node_id: string
                    organization_id: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Update: {
                    color?: string
                    content?: string
                    created_at?: string | null
                    flow_id?: string
                    id?: string
                    metadata?: Json | null
                    node_id?: string
                    organization_id?: string
                    updated_at?: string | null
                    updated_by?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "sticky_notes_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flow_dashboard_stats"
                        referencedColumns: ["flow_id"]
                    },
                    {
                        foreignKeyName: "sticky_notes_flow_id_fkey"
                        columns: ["flow_id"]
                        isOneToOne: false
                        referencedRelation: "flows"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "sticky_notes_node_id_fkey"
                        columns: ["node_id"]
                        isOneToOne: false
                        referencedRelation: "flow_items"
                        referencedColumns: ["id"]
                    },
                ]
            }
        }
        Views: {
            flow_dashboard_stats: {
                Row: {
                    active_editors: number | null
                    comment_count: number | null
                    created_at: string | null
                    created_by: string | null
                    current_version_id: string | null
                    description: string | null
                    dev_version_id: string | null
                    flow_id: string | null
                    flow_name: string | null
                    id: string | null
                    is_shared: boolean | null
                    last_edited: string | null
                    organization_id: string | null
                    organization_name: string | null
                    status: string | null
                    updated_at: string | null
                    version_count: number | null
                }
                Relationships: [
                    {
                        foreignKeyName: "flows_current_version_id_fkey"
                        columns: ["current_version_id"]
                        isOneToOne: false
                        referencedRelation: "flow_versions"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "flows_dev_version_id_fkey"
                        columns: ["dev_version_id"]
                        isOneToOne: false
                        referencedRelation: "flow_versions"
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
        }
        Functions: {
            get_flows_using_component: {
                Args: {
                    p_component_code: string
                }
                Returns: {
                    flowId: string
                    flowName: string
                }[]
            }
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
    PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
            Row: infer R
        }
    ? R
    : never
    : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
            Row: infer R
        }
    ? R
    : never
    : never

export type TablesInsert<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Insert: infer I
    }
    ? I
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
    }
    ? I
    : never
    : never

export type TablesUpdate<
    PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
    TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
    ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
        Update: infer U
    }
    ? U
    : never
    : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
    }
    ? U
    : never
    : never

export type Enums<
    PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
    EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
    ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
    : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
    PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
    CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
        schema: keyof Database
    }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
    ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
    : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
    public: {
        Enums: {
        },
    },
} as const
