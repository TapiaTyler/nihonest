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
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
