export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          plan: "free" | "plus" | "pro"
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          plan?: "free" | "plus" | "pro"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          plan?: "free" | "plus" | "pro"
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vaults: {
        Row: {
          id: string
          user_id: string
          name: string
          created_at: string
          updated_at: string
          last_accessed: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          created_at?: string
          updated_at?: string
          last_accessed?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          created_at?: string
          updated_at?: string
          last_accessed?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaults_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      operations: {
        Row: {
          id: string
          vault_id: string
          name: string
          objective: string
          status: "active" | "pending" | "completed" | "critical"
          mission_title: string
          strategic_objective: string
          deadline: string
          priority_level: "low" | "medium" | "high" | "critical"
          category: string
          operational_tags: string[]
          linked_resources: string[]
          linked_personas: string[]
          linked_pipelines: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vault_id: string
          name: string
          objective: string
          status?: "active" | "pending" | "completed" | "critical"
          mission_title: string
          strategic_objective: string
          deadline: string
          priority_level?: "low" | "medium" | "high" | "critical"
          category: string
          operational_tags?: string[]
          linked_resources?: string[]
          linked_personas?: string[]
          linked_pipelines?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vault_id?: string
          name?: string
          objective?: string
          status?: "active" | "pending" | "completed" | "critical"
          mission_title?: string
          strategic_objective?: string
          deadline?: string
          priority_level?: "low" | "medium" | "high" | "critical"
          category?: string
          operational_tags?: string[]
          linked_resources?: string[]
          linked_personas?: string[]
          linked_pipelines?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "operations_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      personas: {
        Row: {
          id: string
          vault_id: string
          name: string
          context: string
          status: "active" | "pending" | "completed" | "critical"
          linked_operations: string[]
          linked_pipelines: string[]
          linked_resources: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vault_id: string
          name: string
          context: string
          status?: "active" | "pending" | "completed" | "critical"
          linked_operations?: string[]
          linked_pipelines?: string[]
          linked_resources?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vault_id?: string
          name?: string
          context?: string
          status?: "active" | "pending" | "completed" | "critical"
          linked_operations?: string[]
          linked_pipelines?: string[]
          linked_resources?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "personas_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      pipelines: {
        Row: {
          id: string
          vault_id: string
          name: string
          steps: number
          is_active: boolean
          attached_personas: string[]
          attached_operations: string[]
          attached_resources: string[]
          step_data: Json
          status: "active" | "pending" | "completed" | "critical"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vault_id: string
          name: string
          steps?: number
          is_active?: boolean
          attached_personas?: string[]
          attached_operations?: string[]
          attached_resources?: string[]
          step_data?: Json
          status?: "active" | "pending" | "completed" | "critical"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vault_id?: string
          name?: string
          steps?: number
          is_active?: boolean
          attached_personas?: string[]
          attached_operations?: string[]
          attached_resources?: string[]
          step_data?: Json
          status?: "active" | "pending" | "completed" | "critical"
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pipelines_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          id: string
          vault_id: string
          name: string
          type: string
          content: string
          status: "active" | "pending" | "completed" | "critical"
          linked_operations: string[]
          linked_pipelines: string[]
          linked_personas: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          vault_id: string
          name: string
          type: string
          content: string
          status?: "active" | "pending" | "completed" | "critical"
          linked_operations?: string[]
          linked_pipelines?: string[]
          linked_personas?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          vault_id?: string
          name?: string
          type?: string
          content?: string
          status?: "active" | "pending" | "completed" | "critical"
          linked_operations?: string[]
          linked_pipelines?: string[]
          linked_personas?: string[]
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "resources_vault_id_fkey"
            columns: ["vault_id"]
            isOneToOne: false
            referencedRelation: "vaults"
            referencedColumns: ["id"]
          },
        ]
      }
      user_sessions: {
        Row: {
          id: string
          user_id: string
          session_token: string
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_token: string
          expires_at: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_token?: string
          expires_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          id: string
          user_id: string | null
          action: string
          details: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          action: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          action?: string
          details?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      log_auth_event: {
        Args: {
          p_user_id: string
          p_action: string
          p_details: Json
          p_ip_address: string | null
          p_user_agent: string | null
        }
        Returns: void
      }
      cleanup_expired_sessions: {
        Args: {}
        Returns: number
      }
      create_vault: {
        Args: {
          p_name: string
        }
        Returns: string
      }
      update_vault_access: {
        Args: {
          p_vault_id: string
        }
        Returns: void
      }
      delete_vault: {
        Args: {
          p_vault_id: string
        }
        Returns: boolean
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    ? (Database["public"]["Tables"] & Database["public"]["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof Database["public"]["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends keyof Database["public"]["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never
