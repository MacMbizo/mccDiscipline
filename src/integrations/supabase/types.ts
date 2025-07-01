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
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          user_id?: string | null
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
      behavior_records: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          description: string
          id: string
          location: string | null
          merit_tier: string | null
          misdemeanor_id: string | null
          offense_number: number | null
          points: number | null
          reported_by: string
          resolved_at: string | null
          sanction: string | null
          status: string | null
          student_id: string
          timestamp: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          description: string
          id?: string
          location?: string | null
          merit_tier?: string | null
          misdemeanor_id?: string | null
          offense_number?: number | null
          points?: number | null
          reported_by: string
          resolved_at?: string | null
          sanction?: string | null
          status?: string | null
          student_id: string
          timestamp?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          description?: string
          id?: string
          location?: string | null
          merit_tier?: string | null
          misdemeanor_id?: string | null
          offense_number?: number | null
          points?: number | null
          reported_by?: string
          resolved_at?: string | null
          sanction?: string | null
          status?: string | null
          student_id?: string
          timestamp?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "behavior_records_misdemeanor_id_fkey"
            columns: ["misdemeanor_id"]
            isOneToOne: false
            referencedRelation: "misdemeanors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "behavior_records_reported_by_fkey"
            columns: ["reported_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "behavior_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "shadow_parent_dashboard"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "behavior_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      counseling_alerts: {
        Row: {
          alert_type: string
          created_at: string | null
          description: string | null
          id: string
          is_resolved: boolean | null
          resolved_at: string | null
          resolved_by: string | null
          severity_level: string | null
          student_id: string
          triggered_by_record_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string | null
          student_id: string
          triggered_by_record_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_resolved?: boolean | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity_level?: string | null
          student_id?: string
          triggered_by_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "counseling_alerts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counseling_alerts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "shadow_parent_dashboard"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "counseling_alerts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "counseling_alerts_triggered_by_record_id_fkey"
            columns: ["triggered_by_record_id"]
            isOneToOne: false
            referencedRelation: "behavior_records"
            referencedColumns: ["id"]
          },
        ]
      }
      misdemeanors: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          location: string
          name: string
          sanctions: Json
          severity_level: number | null
          status: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          location: string
          name: string
          sanctions: Json
          severity_level?: number | null
          status?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          sanctions?: Json
          severity_level?: number | null
          status?: string | null
        }
        Relationships: []
      }
      notification_delivery_log: {
        Row: {
          created_at: string | null
          delivered_at: string | null
          delivery_attempt: number | null
          delivery_method: string
          delivery_status: string
          error_message: string | null
          id: string
          notification_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempt?: number | null
          delivery_method: string
          delivery_status?: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivered_at?: string | null
          delivery_attempt?: number | null
          delivery_method?: string
          delivery_status?: string
          error_message?: string | null
          id?: string
          notification_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_delivery_log_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          reference_id: string | null
          reference_type: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          reference_id?: string | null
          reference_type?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          reference_id?: string | null
          reference_type?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          gender: string | null
          id: string
          is_active: boolean | null
          last_login: string | null
          name: string
          notification_preferences: Json | null
          profile_image: string | null
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          gender?: string | null
          id: string
          is_active?: boolean | null
          last_login?: string | null
          name: string
          notification_preferences?: Json | null
          profile_image?: string | null
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          gender?: string | null
          id?: string
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          notification_preferences?: Json | null
          profile_image?: string | null
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      shadow_parent_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          assignment_notes: string | null
          id: string
          is_active: boolean | null
          priority_score: number | null
          shadow_parent_id: string
          student_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_notes?: string | null
          id?: string
          is_active?: boolean | null
          priority_score?: number | null
          shadow_parent_id: string
          student_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          assignment_notes?: string | null
          id?: string
          is_active?: boolean | null
          priority_score?: number | null
          shadow_parent_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shadow_parent_assignments_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shadow_parent_assignments_shadow_parent_id_fkey"
            columns: ["shadow_parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shadow_parent_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "shadow_parent_dashboard"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "shadow_parent_assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          behavior_score: number | null
          boarding_status: string | null
          counseling_flagged_at: string | null
          counseling_reason: string | null
          created_at: string | null
          gender: string | null
          grade: string
          id: string
          name: string
          needs_counseling: boolean | null
          parent_contacts: Json | null
          profile_image: string | null
          shadow_parent_id: string | null
          student_id: string
          updated_at: string | null
        }
        Insert: {
          behavior_score?: number | null
          boarding_status?: string | null
          counseling_flagged_at?: string | null
          counseling_reason?: string | null
          created_at?: string | null
          gender?: string | null
          grade: string
          id?: string
          name: string
          needs_counseling?: boolean | null
          parent_contacts?: Json | null
          profile_image?: string | null
          shadow_parent_id?: string | null
          student_id: string
          updated_at?: string | null
        }
        Update: {
          behavior_score?: number | null
          boarding_status?: string | null
          counseling_flagged_at?: string | null
          counseling_reason?: string | null
          created_at?: string | null
          gender?: string | null
          grade?: string
          id?: string
          name?: string
          needs_counseling?: boolean | null
          parent_contacts?: Json | null
          profile_image?: string | null
          shadow_parent_id?: string | null
          student_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_shadow_parent_id_fkey"
            columns: ["shadow_parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      shadow_parent_dashboard: {
        Row: {
          behavior_score: number | null
          boarding_status: string | null
          gender: string | null
          grade: string | null
          needs_counseling: boolean | null
          recent_incidents: number | null
          recent_merits: number | null
          shadow_parent_id: string | null
          student_id: string | null
          student_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shadow_parent_assignments_shadow_parent_id_fkey"
            columns: ["shadow_parent_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      calculate_heat_score: {
        Args: { student_uuid: string }
        Returns: number
      }
      get_shadow_assignment_recommendations: {
        Args: Record<PropertyKey, never>
        Returns: {
          student_id: string
          student_name: string
          grade: string
          behavior_score: number
          recent_incidents: number
          recent_merits: number
          priority_score: number
          needs_counseling: boolean
        }[]
      }
      get_teacher_shadow_capacity: {
        Args: { teacher_id: string }
        Returns: {
          assigned_count: number
          remaining_capacity: number
          can_assign_more: boolean
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
