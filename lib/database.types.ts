
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
      audiobooks: {
        Row: {
          id: number
          title: string
          author: string
          cover_art_url: string
          audio_url: string
          duration_minutes: number
        }
        Insert: {
          id?: number
          title: string
          author: string
          cover_art_url: string
          audio_url: string
          duration_minutes: number
        }
        Update: {
          id?: number
          title?: string
          author?: string
          cover_art_url?: string
          audio_url?: string
          duration_minutes?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          username: string
          is_subscribed: boolean
          is_admin: boolean
          avatar_url: string | null
        }
        Insert: {
          id: string
          username: string
          is_subscribed?: boolean
          is_admin?: boolean
          avatar_url?: string | null
        }
        Update: {
          id?: string
          username?: string
          is_subscribed?: boolean
          is_admin?: boolean
          avatar_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_profiles: {
        Args: Record<string, never>
        Returns: {
          id: string
          username: string
          is_admin: boolean
          is_subscribed: boolean
          avatar_url: string
        }[]
      }
      grant_admin_role: {
        Args: {
          user_email: string
        }
        Returns: undefined
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
