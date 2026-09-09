export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/** Application-facing database contract mirrored from the reviewed Phase 8 migration. */
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      saved_content: {
        Row: {
          user_id: string;
          content_kind: "article" | "glossary-term" | "residence-status";
          content_id: string;
          state: "saved" | "removed";
          updated_at: string;
        };
        Insert: {
          user_id: string;
          content_kind: "article" | "glossary-term" | "residence-status";
          content_id: string;
          state: "saved" | "removed";
          updated_at: string;
        };
        Update: {
          state?: "saved" | "removed";
          updated_at?: string;
        };
        Relationships: [];
      };
      glossary_study_progress: {
        Row: {
          user_id: string;
          term_id: string;
          state: "new" | "learning" | "reviewed";
          review_count: number;
          last_reviewed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          term_id: string;
          state: "new" | "learning" | "reviewed";
          review_count: number;
          last_reviewed_at?: string | null;
          updated_at: string;
        };
        Update: {
          state?: "new" | "learning" | "reviewed";
          review_count?: number;
          last_reviewed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      checklist_progress: {
        Row: {
          user_id: string;
          checklist_id: string;
          state: "not-started" | "in-progress" | "complete";
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          checklist_id: string;
          state: "not-started" | "in-progress" | "complete";
          completed_at?: string | null;
          updated_at: string;
        };
        Update: {
          state?: "not-started" | "in-progress" | "complete";
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_preferences: {
        Row: {
          user_id: string;
          email_enabled: boolean;
          deadline_reminders_enabled: boolean;
          critical_updates_enabled: boolean;
          time_zone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          email_enabled?: boolean;
          deadline_reminders_enabled?: boolean;
          critical_updates_enabled?: boolean;
          time_zone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          email_enabled?: boolean;
          deadline_reminders_enabled?: boolean;
          critical_updates_enabled?: boolean;
          time_zone?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      reminders: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          target_kind: "article" | "checklist" | "custom";
          target_id: string | null;
          scheduled_for: string;
          time_zone: string;
          state: "scheduled" | "cancelled" | "fulfilled";
          cancelled_at: string | null;
          fulfilled_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          target_kind: "article" | "checklist" | "custom";
          target_id?: string | null;
          scheduled_for: string;
          time_zone: string;
          state?: "scheduled" | "cancelled" | "fulfilled";
          cancelled_at?: string | null;
          fulfilled_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          target_kind?: "article" | "checklist" | "custom";
          target_id?: string | null;
          scheduled_for?: string;
          time_zone?: string;
          state?: "scheduled" | "cancelled" | "fulfilled";
          cancelled_at?: string | null;
          fulfilled_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      notification_events: {
        Row: {
          id: string;
          user_id: string;
          event_type: "reminder-due" | "article-critical-update" | "residence-status-guidance-updated";
          deduplication_key: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          event_type: "reminder-due" | "article-critical-update" | "residence-status-guidance-updated";
          deduplication_key: string;
          payload: Json;
          created_at?: string;
        };
        Update: {
          payload?: Json;
        };
        Relationships: [];
      };
      user_preferences: {
        Row: {
          user_id: string;
          journey_stage: "planning" | "preparing" | "recently-arrived" | "living-in-japan" | null;
          journey_id: string | null;
          route_id: string | null;
          focused_article_id: string | null;
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          journey_stage?: "planning" | "preparing" | "recently-arrived" | "living-in-japan" | null;
          journey_id?: string | null;
          route_id?: string | null;
          focused_article_id?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          journey_stage?: "planning" | "preparing" | "recently-arrived" | "living-in-japan" | null;
          journey_id?: string | null;
          route_id?: string | null;
          focused_article_id?: string | null;
          onboarding_completed?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      sync_account_content: {
        Args: {
          p_saved_content?: Json;
          p_glossary_progress?: Json;
          p_checklist_progress?: Json;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
