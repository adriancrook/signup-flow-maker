// @ts-nocheck
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
    __InternalSupabase: {
        PostgrestVersion: "14.1"
    }
    public: {
        Tables: {
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
                    organization_id: string | null
                    role: string | null
                    updated_at: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id: string
                    organization_id?: string | null
                    role?: string | null
                    updated_at?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    full_name?: string | null
                    id?: string
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
