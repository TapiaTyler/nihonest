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
      notification_deliveries: {
        Row: {
          id: string;
          event_id: string;
          user_id: string;
          channel: "email";
          state: "pending" | "processing" | "sent" | "failed" | "suppressed";
          attempt_count: number;
          available_at: string;
          last_attempted_at: string | null;
          claim_token: string | null;
          claim_expires_at: string | null;
          sent_at: string | null;
          provider_message_id: string | null;
          last_error: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          user_id: string;
          channel?: "email";
          state: "pending" | "processing" | "sent" | "failed" | "suppressed";
          attempt_count?: number;
          available_at: string;
          last_attempted_at?: string | null;
          claim_token?: string | null;
          claim_expires_at?: string | null;
          sent_at?: string | null;
          provider_message_id?: string | null;
          last_error?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          state?: "pending" | "processing" | "sent" | "failed" | "suppressed";
          attempt_count?: number;
          available_at?: string;
          last_attempted_at?: string | null;
          claim_token?: string | null;
          claim_expires_at?: string | null;
          sent_at?: string | null;
          provider_message_id?: string | null;
          last_error?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      critical_update_releases: {
        Row: {
          id: string;
          target_kind: "article" | "residence-status";
          target_id: string;
          title: string;
          summary: string;
          revision: string;
          verification_note: string | null;
          editorial_state: "draft" | "approved" | "published";
          approved_at: string | null;
          published_at: string | null;
          events_generated_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          target_kind: "article" | "residence-status";
          target_id: string;
          title: string;
          summary: string;
          revision: string;
          verification_note?: string | null;
          editorial_state?: "draft" | "approved" | "published";
          approved_at?: string | null;
          published_at?: string | null;
          events_generated_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          summary?: string;
          revision?: string;
          verification_note?: string | null;
          editorial_state?: "draft" | "approved" | "published";
          approved_at?: string | null;
          published_at?: string | null;
          events_generated_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      critical_update_journey_targets: {
        Row: {
          release_id: string;
          journey_id: string;
          route_id: string | null;
        };
        Insert: {
          release_id: string;
          journey_id: string;
          route_id?: string | null;
        };
        Update: {
          journey_id?: string;
          route_id?: string | null;
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
      generate_due_reminder_events: {
        Args: { p_now?: string; p_limit?: number };
        Returns: number;
      };
      generate_targeted_critical_update_events: {
        Args: { p_now?: string; p_limit?: number };
        Returns: number;
      };
      claim_email_notification_deliveries: {
        Args: { p_now?: string; p_limit?: number; p_max_attempts?: number; p_lease_seconds?: number };
        Returns: Database["public"]["Tables"]["notification_deliveries"]["Row"][];
      };
      finalize_email_notification_delivery: {
        Args: {
          p_delivery_id: string;
          p_claim_token: string;
          p_state: "sent" | "failed" | "suppressed";
          p_now: string;
          p_provider_message_id?: string | null;
          p_error?: string | null;
          p_retry_at?: string | null;
        };
        Returns: Database["public"]["Tables"]["notification_deliveries"]["Row"];
      };
      prepare_email_notification_deliveries: {
        Args: { p_now?: string; p_limit?: number };
        Returns: number;
      };
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
