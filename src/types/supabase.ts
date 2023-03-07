import { ModerationStates } from "./general";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: {
          created_at: string | null;
          featured: boolean;
          id: number;
          moderation: ModerationStates;
          url: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          featured?: boolean;
          id?: number;
          moderation?: ModerationStates;
          url?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          featured?: boolean;
          id?: number;
          moderation?: ModerationStates;
          url?: string;
          user_id?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
