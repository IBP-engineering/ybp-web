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
      roles: {
        Row: {
          created_at: string
          has_full_access: boolean
          id: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          has_full_access?: boolean
          id?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          has_full_access?: boolean
          id?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      stories: {
        Row: {
          content: string | null
          cover_path: string | null
          created_at: string
          id: string
          reaction: Json | null
          slug: string
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          cover_path?: string | null
          created_at?: string
          id?: string
          reaction?: Json | null
          slug: string
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          cover_path?: string | null
          created_at?: string
          id?: string
          reaction?: Json | null
          slug?: string
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      story_status_histories: {
        Row: {
          created_at: string
          id: number
          is_pending: boolean | null
          is_published: boolean | null
          is_rejected: boolean | null
          reason: string | null
          story_status_id: number
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_pending?: boolean | null
          is_published?: boolean | null
          is_rejected?: boolean | null
          reason?: string | null
          story_status_id: number
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_pending?: boolean | null
          is_published?: boolean | null
          is_rejected?: boolean | null
          reason?: string | null
          story_status_id?: number
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_status_histories_story_status_id_fkey"
            columns: ["story_status_id"]
            isOneToOne: false
            referencedRelation: "story_statuses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_status_histories_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      story_statuses: {
        Row: {
          created_at: string
          id: number
          is_pending: boolean
          is_published: boolean
          is_rejected: boolean
          story_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_pending?: boolean
          is_published?: boolean
          is_rejected?: boolean
          story_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_pending?: boolean
          is_published?: boolean
          is_rejected?: boolean
          story_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "story_statuses_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
        ]
      }
      story_tags: {
        Row: {
          created_at: string
          id: string
          story_id: string | null
          tag_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          story_id?: string | null
          tag_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          story_id?: string | null
          tag_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "story_tags_story_id_fkey"
            columns: ["story_id"]
            isOneToOne: false
            referencedRelation: "stories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "story_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          is_active: string | null
          password: string | null
          role_id: number | null
          updated_at: string
          username: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          email: string
          id?: string
          is_active?: string | null
          password?: string | null
          role_id?: number | null
          updated_at?: string
          username: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          email?: string
          id?: string
          is_active?: string | null
          password?: string | null
          role_id?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
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
