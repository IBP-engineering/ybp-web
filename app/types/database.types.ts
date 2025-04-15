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
      book_genres: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: number
          label: string | null
          multiple: number | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          label?: string | null
          multiple?: number | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: number
          label?: string | null
          multiple?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'book_genres_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      reading_habits: {
        Row: {
          created_at: string
          created_by: string | null
          genre: number | null
          id: string
          page_count: number
          summary: string
          title: string
          update_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          genre?: number | null
          id?: string
          page_count: number
          summary: string
          title: string
          update_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          genre?: number | null
          id?: string
          page_count?: number
          summary?: string
          title?: string
          update_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'reading_habits_genre_fkey'
            columns: ['genre']
            isOneToOne: false
            referencedRelation: 'book_genres'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reading_habits_user_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
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
          is_active: boolean
          slug: string
          status: Database['public']['Enums']['Story status']
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          cover_path?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          slug: string
          status?: Database['public']['Enums']['Story status']
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          cover_path?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          slug?: string
          status?: Database['public']['Enums']['Story status']
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'stories_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      story_reactions: {
        Row: {
          created_at: string
          id: number
          reacted_by: string | null
          story: string | null
          type: Database['public']['Enums']['Story reaction']
        }
        Insert: {
          created_at?: string
          id?: number
          reacted_by?: string | null
          story?: string | null
          type?: Database['public']['Enums']['Story reaction']
        }
        Update: {
          created_at?: string
          id?: number
          reacted_by?: string | null
          story?: string | null
          type?: Database['public']['Enums']['Story reaction']
        }
        Relationships: [
          {
            foreignKeyName: 'story_reactions_reacted_by_fkey'
            columns: ['reacted_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_reactions_story_fkey'
            columns: ['story']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
        ]
      }
      story_status_histories: {
        Row: {
          created_at: string
          id: number
          reason: string | null
          status: Database['public']['Enums']['Story status'] | null
          story_id: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          reason?: string | null
          status?: Database['public']['Enums']['Story status'] | null
          story_id: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          reason?: string | null
          status?: Database['public']['Enums']['Story status'] | null
          story_id?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'story_status_histories_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_status_histories_updated_by_fkey'
            columns: ['updated_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
            foreignKeyName: 'story_tags_story_id_fkey'
            columns: ['story_id']
            isOneToOne: false
            referencedRelation: 'stories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'story_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
        ]
      }
      tags: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tags_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      users: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          email: string
          id: string
          is_active: boolean
          location: string | null
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
          is_active?: boolean
          location?: string | null
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
          is_active?: boolean
          location?: string | null
          password?: string | null
          role_id?: number | null
          updated_at?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: 'users_role_id_fkey'
            columns: ['role_id']
            isOneToOne: false
            referencedRelation: 'roles'
            referencedColumns: ['id']
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
      'Story reaction': 'like'
      'Story status': 'approved' | 'rejected' | 'pending'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      'Story reaction': ['like'],
      'Story status': ['approved', 'rejected', 'pending'],
    },
  },
} as const

