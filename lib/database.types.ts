export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clicks: {
        Row: {
          id: string
          slug: string
          source_page: string | null
          session_id: string | null
          user_agent: string | null
          country: string | null
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          source_page?: string | null
          session_id?: string | null
          user_agent?: string | null
          country?: string | null
          ip_hash?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          source_page?: string | null
          session_id?: string | null
          user_agent?: string | null
          country?: string | null
          ip_hash?: string | null
          created_at?: string
        }
      }
      leads: {
        Row: {
          id: string
          name: string | null
          email: string | null
          phone: string | null
          message: string | null
          tour_slug: string | null
          source: string | null
          affiliate_ref: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          tour_slug?: string | null
          source?: string | null
          affiliate_ref?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          phone?: string | null
          message?: string | null
          tour_slug?: string | null
          source?: string | null
          affiliate_ref?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          created_at?: string
        }
      }
      affiliate_mappings: {
        Row: {
          slug: string
          url: string
          program: string | null
          commission_rate: number | null
          updated_at: string
        }
        Insert: {
          slug: string
          url: string
          program?: string | null
          commission_rate?: number | null
          updated_at?: string
        }
        Update: {
          slug?: string
          url?: string
          program?: string | null
          commission_rate?: number | null
          updated_at?: string
        }
      }
    }
  }
}

export type Click = Database['public']['Tables']['clicks']['Row']
export type Lead = Database['public']['Tables']['leads']['Row']
export type AffiliateMapping = Database['public']['Tables']['affiliate_mappings']['Row']
