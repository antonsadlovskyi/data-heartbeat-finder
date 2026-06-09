export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      account_analyses: {
        Row: {
          account_analysis_id: string
          account_id: string | null
          audience_pain_points: string | null
          best_patterns_to_copy: string | null
          community_signals: string | null
          main_content_pillars: string | null
          main_ctas: string | null
          main_hooks: string | null
          opportunities: string | null
          period_end: string | null
          period_start: string | null
          positioning_summary: string | null
          product_angle: string | null
          score_overall: number | null
          strategic_summary: string | null
          strengths: string | null
          strongest_formats: string | null
          things_to_avoid: string | null
          threats: string | null
          tone_of_voice: string | null
          trust_signals: string | null
          visual_identity: string | null
          weakest_formats: string | null
          weaknesses: string | null
          workspace_id: string
        }
        Insert: {
          account_analysis_id: string
          account_id?: string | null
          audience_pain_points?: string | null
          best_patterns_to_copy?: string | null
          community_signals?: string | null
          main_content_pillars?: string | null
          main_ctas?: string | null
          main_hooks?: string | null
          opportunities?: string | null
          period_end?: string | null
          period_start?: string | null
          positioning_summary?: string | null
          product_angle?: string | null
          score_overall?: number | null
          strategic_summary?: string | null
          strengths?: string | null
          strongest_formats?: string | null
          things_to_avoid?: string | null
          threats?: string | null
          tone_of_voice?: string | null
          trust_signals?: string | null
          visual_identity?: string | null
          weakest_formats?: string | null
          weaknesses?: string | null
          workspace_id: string
        }
        Update: {
          account_analysis_id?: string
          account_id?: string | null
          audience_pain_points?: string | null
          best_patterns_to_copy?: string | null
          community_signals?: string | null
          main_content_pillars?: string | null
          main_ctas?: string | null
          main_hooks?: string | null
          opportunities?: string | null
          period_end?: string | null
          period_start?: string | null
          positioning_summary?: string | null
          product_angle?: string | null
          score_overall?: number | null
          strategic_summary?: string | null
          strengths?: string | null
          strongest_formats?: string | null
          things_to_avoid?: string | null
          threats?: string | null
          tone_of_voice?: string | null
          trust_signals?: string | null
          visual_identity?: string | null
          weakest_formats?: string | null
          weaknesses?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_analyses_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_analyses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      account_snapshots: {
        Row: {
          account_id: string | null
          avg_comments_last_10: number | null
          avg_likes_last_10: number | null
          avg_views_last_10: number | null
          carousels_last_7_days: number | null
          date: string | null
          engagement_rate: number | null
          followers_count: number | null
          following_count: number | null
          notes: string | null
          posts_count: number | null
          posts_last_7_days: number | null
          reels_last_7_days: number | null
          snapshot_id: string
          static_posts_last_7_days: number | null
          workspace_id: string
        }
        Insert: {
          account_id?: string | null
          avg_comments_last_10?: number | null
          avg_likes_last_10?: number | null
          avg_views_last_10?: number | null
          carousels_last_7_days?: number | null
          date?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          notes?: string | null
          posts_count?: number | null
          posts_last_7_days?: number | null
          reels_last_7_days?: number | null
          snapshot_id: string
          static_posts_last_7_days?: number | null
          workspace_id: string
        }
        Update: {
          account_id?: string | null
          avg_comments_last_10?: number | null
          avg_likes_last_10?: number | null
          avg_views_last_10?: number | null
          carousels_last_7_days?: number | null
          date?: string | null
          engagement_rate?: number | null
          followers_count?: number | null
          following_count?: number | null
          notes?: string | null
          posts_count?: number | null
          posts_last_7_days?: number | null
          reels_last_7_days?: number | null
          snapshot_id?: string
          static_posts_last_7_days?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "account_snapshots_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "account_snapshots_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      action_plan: {
        Row: {
          action_id: string
          action_type: string | null
          based_on_insight: string | null
          content_format: string | null
          deadline: string | null
          example_topic: string | null
          expected_effect: string | null
          notes: string | null
          priority: string | null
          responsible: string | null
          status: string | null
          what_to_do: string | null
          workspace_id: string
        }
        Insert: {
          action_id: string
          action_type?: string | null
          based_on_insight?: string | null
          content_format?: string | null
          deadline?: string | null
          example_topic?: string | null
          expected_effect?: string | null
          notes?: string | null
          priority?: string | null
          responsible?: string | null
          status?: string | null
          what_to_do?: string | null
          workspace_id: string
        }
        Update: {
          action_id?: string
          action_type?: string | null
          based_on_insight?: string | null
          content_format?: string | null
          deadline?: string | null
          example_topic?: string | null
          expected_effect?: string | null
          notes?: string | null
          priority?: string | null
          responsible?: string | null
          status?: string | null
          what_to_do?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "action_plan_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      best_outcomes: {
        Row: {
          account_id: string | null
          account_name: string | null
          comment_reaction: string | null
          content_pattern: string | null
          hook_text: string | null
          how_we_can_adapt: string | null
          metric_used: string | null
          metric_value: number | null
          outcome_id: string
          post_id: string | null
          post_type: string | null
          post_url: string | null
          priority: string | null
          risk_if_copying: string | null
          topic: string | null
          visual_pattern: string | null
          why_it_worked: string | null
          why_selected: string | null
          workspace_id: string
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          comment_reaction?: string | null
          content_pattern?: string | null
          hook_text?: string | null
          how_we_can_adapt?: string | null
          metric_used?: string | null
          metric_value?: number | null
          outcome_id: string
          post_id?: string | null
          post_type?: string | null
          post_url?: string | null
          priority?: string | null
          risk_if_copying?: string | null
          topic?: string | null
          visual_pattern?: string | null
          why_it_worked?: string | null
          why_selected?: string | null
          workspace_id: string
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          comment_reaction?: string | null
          content_pattern?: string | null
          hook_text?: string | null
          how_we_can_adapt?: string | null
          metric_used?: string | null
          metric_value?: number | null
          outcome_id?: string
          post_id?: string | null
          post_type?: string | null
          post_url?: string | null
          priority?: string | null
          risk_if_copying?: string | null
          topic?: string | null
          visual_pattern?: string | null
          why_it_worked?: string | null
          why_selected?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "best_outcomes_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "best_outcomes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "best_outcomes_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_summaries: {
        Row: {
          audience_pain_points: string | null
          buying_signals: string | null
          comment_summary: string | null
          comment_summary_id: string
          common_objections: string | null
          content_requests: string | null
          negative_count: number | null
          neutral_count: number | null
          positive_count: number | null
          positive_reactions: string | null
          post_id: string | null
          strategic_insight: string | null
          top_questions: string | null
          total_comments_analyzed: number | null
          workspace_id: string
        }
        Insert: {
          audience_pain_points?: string | null
          buying_signals?: string | null
          comment_summary?: string | null
          comment_summary_id: string
          common_objections?: string | null
          content_requests?: string | null
          negative_count?: number | null
          neutral_count?: number | null
          positive_count?: number | null
          positive_reactions?: string | null
          post_id?: string | null
          strategic_insight?: string | null
          top_questions?: string | null
          total_comments_analyzed?: number | null
          workspace_id: string
        }
        Update: {
          audience_pain_points?: string | null
          buying_signals?: string | null
          comment_summary?: string | null
          comment_summary_id?: string
          common_objections?: string | null
          content_requests?: string | null
          negative_count?: number | null
          neutral_count?: number | null
          positive_count?: number | null
          positive_reactions?: string | null
          post_id?: string | null
          strategic_insight?: string | null
          top_questions?: string | null
          total_comments_analyzed?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_summaries_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "comment_summaries_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_comparison: {
        Row: {
          area: string | null
          comparison_id: string
          competitor_account_id: string | null
          competitor_score: number | null
          gap: number | null
          own_account_id: string | null
          own_score: number | null
          period_end: string | null
          period_start: string | null
          priority: string | null
          recommended_action: string | null
          what_to_learn: string | null
          who_is_stronger: string | null
          why: string | null
          workspace_id: string
        }
        Insert: {
          area?: string | null
          comparison_id: string
          competitor_account_id?: string | null
          competitor_score?: number | null
          gap?: number | null
          own_account_id?: string | null
          own_score?: number | null
          period_end?: string | null
          period_start?: string | null
          priority?: string | null
          recommended_action?: string | null
          what_to_learn?: string | null
          who_is_stronger?: string | null
          why?: string | null
          workspace_id: string
        }
        Update: {
          area?: string | null
          comparison_id?: string
          competitor_account_id?: string | null
          competitor_score?: number | null
          gap?: number | null
          own_account_id?: string | null
          own_score?: number | null
          period_end?: string | null
          period_start?: string | null
          priority?: string | null
          recommended_action?: string | null
          what_to_learn?: string | null
          who_is_stronger?: string | null
          why?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_comparison_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      competitor_radar: {
        Row: {
          account_id: string | null
          account_name: string | null
          community_engagement: number | null
          content_consistency: number | null
          educational_value: number | null
          emotional_connection: number | null
          format_diversity: number | null
          hook_strength: number | null
          key_strength: string | null
          key_weakness: string | null
          main_reason: string | null
          overall_score: number | null
          positioning_strength: number | null
          product_differentiation: number | null
          radar_id: string
          sales_clarity: number | null
          trend_usage: number | null
          trust_signals: number | null
          visual_identity: number | null
          workspace_id: string
        }
        Insert: {
          account_id?: string | null
          account_name?: string | null
          community_engagement?: number | null
          content_consistency?: number | null
          educational_value?: number | null
          emotional_connection?: number | null
          format_diversity?: number | null
          hook_strength?: number | null
          key_strength?: string | null
          key_weakness?: string | null
          main_reason?: string | null
          overall_score?: number | null
          positioning_strength?: number | null
          product_differentiation?: number | null
          radar_id: string
          sales_clarity?: number | null
          trend_usage?: number | null
          trust_signals?: number | null
          visual_identity?: number | null
          workspace_id: string
        }
        Update: {
          account_id?: string | null
          account_name?: string | null
          community_engagement?: number | null
          content_consistency?: number | null
          educational_value?: number | null
          emotional_connection?: number | null
          format_diversity?: number | null
          hook_strength?: number | null
          key_strength?: string | null
          key_weakness?: string | null
          main_reason?: string | null
          overall_score?: number | null
          positioning_strength?: number | null
          product_differentiation?: number | null
          radar_id?: string
          sales_clarity?: number | null
          trend_usage?: number | null
          trust_signals?: number | null
          visual_identity?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "competitor_radar_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "competitor_radar_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_subscriptions: {
        Row: {
          active: boolean
          channel: string
          created_at: string
          destination: string
          frequency: string
          id: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          active?: boolean
          channel: string
          created_at?: string
          destination: string
          frequency?: string
          id?: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          active?: boolean
          channel?: string
          created_at?: string
          destination?: string
          frequency?: string
          id?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      page_objects: {
        Row: {
          generated_at: string
          page_key: string
          payload: Json
          role_key: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          generated_at?: string
          page_key: string
          payload?: Json
          role_key: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          generated_at?: string
          page_key?: string
          payload?: Json
          role_key?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      post_analyses: {
        Row: {
          analysis_date: string | null
          analysis_id: string
          content_structure: string | null
          content_type: string | null
          cta_strength: number | null
          cta_type: string | null
          emotional_trigger: string | null
          format: string | null
          hook_strength: number | null
          hook_type: string | null
          main_promise: string | null
          pain_points: string | null
          post_id: string | null
          reusable_pattern: string | null
          sales_angle: string | null
          score_overall: number | null
          strategic_note: string | null
          target_audience: string | null
          topic: string | null
          trust_signal: string | null
          visual_style: string | null
          why_it_failed: string | null
          why_it_worked: string | null
          workspace_id: string
        }
        Insert: {
          analysis_date?: string | null
          analysis_id: string
          content_structure?: string | null
          content_type?: string | null
          cta_strength?: number | null
          cta_type?: string | null
          emotional_trigger?: string | null
          format?: string | null
          hook_strength?: number | null
          hook_type?: string | null
          main_promise?: string | null
          pain_points?: string | null
          post_id?: string | null
          reusable_pattern?: string | null
          sales_angle?: string | null
          score_overall?: number | null
          strategic_note?: string | null
          target_audience?: string | null
          topic?: string | null
          trust_signal?: string | null
          visual_style?: string | null
          why_it_failed?: string | null
          why_it_worked?: string | null
          workspace_id: string
        }
        Update: {
          analysis_date?: string | null
          analysis_id?: string
          content_structure?: string | null
          content_type?: string | null
          cta_strength?: number | null
          cta_type?: string | null
          emotional_trigger?: string | null
          format?: string | null
          hook_strength?: number | null
          hook_type?: string | null
          main_promise?: string | null
          pain_points?: string | null
          post_id?: string | null
          reusable_pattern?: string | null
          sales_angle?: string | null
          score_overall?: number | null
          strategic_note?: string | null
          target_audience?: string | null
          topic?: string | null
          trust_signal?: string | null
          visual_style?: string | null
          why_it_failed?: string | null
          why_it_worked?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_analyses_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_analyses_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      post_assets: {
        Row: {
          asset_id: string
          asset_order: number | null
          asset_type: string | null
          asset_url: string | null
          emotion: string | null
          notes: string | null
          pacing: string | null
          post_id: string | null
          quality_score: number | null
          role_in_post: string | null
          text_on_screen: string | null
          visual_description: string | null
          visual_style: string | null
          workspace_id: string
        }
        Insert: {
          asset_id: string
          asset_order?: number | null
          asset_type?: string | null
          asset_url?: string | null
          emotion?: string | null
          notes?: string | null
          pacing?: string | null
          post_id?: string | null
          quality_score?: number | null
          role_in_post?: string | null
          text_on_screen?: string | null
          visual_description?: string | null
          visual_style?: string | null
          workspace_id: string
        }
        Update: {
          asset_id?: string
          asset_order?: number | null
          asset_type?: string | null
          asset_url?: string | null
          emotion?: string | null
          notes?: string | null
          pacing?: string | null
          post_id?: string | null
          quality_score?: number | null
          role_in_post?: string | null
          text_on_screen?: string | null
          visual_description?: string | null
          visual_style?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_assets_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_assets_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      post_comments: {
        Row: {
          author_username: string | null
          buying_signal: string | null
          comment_id: string
          comment_text: string | null
          comment_type: string | null
          like_count: number | null
          notes: string | null
          objection: string | null
          pain_point: string | null
          post_id: string | null
          published_at: string | null
          question: string | null
          sentiment: string | null
          workspace_id: string
        }
        Insert: {
          author_username?: string | null
          buying_signal?: string | null
          comment_id: string
          comment_text?: string | null
          comment_type?: string | null
          like_count?: number | null
          notes?: string | null
          objection?: string | null
          pain_point?: string | null
          post_id?: string | null
          published_at?: string | null
          question?: string | null
          sentiment?: string | null
          workspace_id: string
        }
        Update: {
          author_username?: string | null
          buying_signal?: string | null
          comment_id?: string
          comment_text?: string | null
          comment_type?: string | null
          like_count?: number | null
          notes?: string | null
          objection?: string | null
          pain_point?: string | null
          post_id?: string | null
          published_at?: string | null
          question?: string | null
          sentiment?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["post_id"]
          },
          {
            foreignKeyName: "post_comments_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
        }
        Relationships: []
      }
      social_accounts: {
        Row: {
          account_id: string
          account_positioning: string | null
          account_type: string | null
          bio: string | null
          created_at: string
          external_url: string | null
          first_impression: string | null
          followers_count: number | null
          following_count: number | null
          last_scraped_at: string | null
          notes: string | null
          platform: string | null
          posts_count: number | null
          profile_name: string | null
          profile_url: string | null
          status: string | null
          username: string | null
          workspace_id: string
        }
        Insert: {
          account_id: string
          account_positioning?: string | null
          account_type?: string | null
          bio?: string | null
          created_at?: string
          external_url?: string | null
          first_impression?: string | null
          followers_count?: number | null
          following_count?: number | null
          last_scraped_at?: string | null
          notes?: string | null
          platform?: string | null
          posts_count?: number | null
          profile_name?: string | null
          profile_url?: string | null
          status?: string | null
          username?: string | null
          workspace_id: string
        }
        Update: {
          account_id?: string
          account_positioning?: string | null
          account_type?: string | null
          bio?: string | null
          created_at?: string
          external_url?: string | null
          first_impression?: string | null
          followers_count?: number | null
          following_count?: number | null
          last_scraped_at?: string | null
          notes?: string | null
          platform?: string | null
          posts_count?: number | null
          profile_name?: string | null
          profile_url?: string | null
          status?: string | null
          username?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          account_id: string | null
          caption: string | null
          comments_count: number | null
          content_pillar: string | null
          cta_text: string | null
          engagement_rate: number | null
          hashtags: string | null
          hook_text: string | null
          likes_count: number | null
          mentions: string | null
          performance_level: string | null
          platform_post_id: string | null
          post_id: string
          post_type: string | null
          post_url: string | null
          product_type: string | null
          published_at: string | null
          raw_notes: string | null
          saves_count: number | null
          shares_count: number | null
          short_code: string | null
          subtopic: string | null
          topic: string | null
          views_count: number | null
          workspace_id: string
        }
        Insert: {
          account_id?: string | null
          caption?: string | null
          comments_count?: number | null
          content_pillar?: string | null
          cta_text?: string | null
          engagement_rate?: number | null
          hashtags?: string | null
          hook_text?: string | null
          likes_count?: number | null
          mentions?: string | null
          performance_level?: string | null
          platform_post_id?: string | null
          post_id: string
          post_type?: string | null
          post_url?: string | null
          product_type?: string | null
          published_at?: string | null
          raw_notes?: string | null
          saves_count?: number | null
          shares_count?: number | null
          short_code?: string | null
          subtopic?: string | null
          topic?: string | null
          views_count?: number | null
          workspace_id: string
        }
        Update: {
          account_id?: string | null
          caption?: string | null
          comments_count?: number | null
          content_pillar?: string | null
          cta_text?: string | null
          engagement_rate?: number | null
          hashtags?: string | null
          hook_text?: string | null
          likes_count?: number | null
          mentions?: string | null
          performance_level?: string | null
          platform_post_id?: string | null
          post_id?: string
          post_type?: string | null
          post_url?: string | null
          product_type?: string | null
          published_at?: string | null
          raw_notes?: string | null
          saves_count?: number | null
          shares_count?: number | null
          short_code?: string | null
          subtopic?: string | null
          topic?: string | null
          views_count?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "social_accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "social_posts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspace_report: {
        Row: {
          best_opportunities: string | null
          competitor_strengths: string | null
          competitor_weaknesses: string | null
          executive_summary: string | null
          final_note: string | null
          key_content_ideas: string | null
          main_success_factors: string | null
          main_threats: string | null
          market_patterns: string | null
          next_30_days_actions: string | null
          next_7_days_actions: string | null
          own_profile_strengths: string | null
          own_profile_weaknesses: string | null
          period_end: string | null
          period_start: string | null
          recommended_strategy: string | null
          report_date: string | null
          report_id: string
          workspace_id: string
        }
        Insert: {
          best_opportunities?: string | null
          competitor_strengths?: string | null
          competitor_weaknesses?: string | null
          executive_summary?: string | null
          final_note?: string | null
          key_content_ideas?: string | null
          main_success_factors?: string | null
          main_threats?: string | null
          market_patterns?: string | null
          next_30_days_actions?: string | null
          next_7_days_actions?: string | null
          own_profile_strengths?: string | null
          own_profile_weaknesses?: string | null
          period_end?: string | null
          period_start?: string | null
          recommended_strategy?: string | null
          report_date?: string | null
          report_id: string
          workspace_id: string
        }
        Update: {
          best_opportunities?: string | null
          competitor_strengths?: string | null
          competitor_weaknesses?: string | null
          executive_summary?: string | null
          final_note?: string | null
          key_content_ideas?: string | null
          main_success_factors?: string | null
          main_threats?: string | null
          market_patterns?: string | null
          next_30_days_actions?: string | null
          next_7_days_actions?: string | null
          own_profile_strengths?: string | null
          own_profile_weaknesses?: string | null
          period_end?: string | null
          period_start?: string | null
          recommended_strategy?: string | null
          report_date?: string | null
          report_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_report_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["id"]
          },
        ]
      }
      workspaces: {
        Row: {
          country: string | null
          created_at: string
          id: string
          language: string | null
          main_goal: string | null
          niche: string | null
          notes: string | null
          owner_id: string
          product_description: string | null
          project_name: string
          target_audience: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          language?: string | null
          main_goal?: string | null
          niche?: string | null
          notes?: string | null
          owner_id: string
          product_description?: string | null
          project_name: string
          target_audience?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          language?: string | null
          main_goal?: string | null
          niche?: string | null
          notes?: string | null
          owner_id?: string
          product_description?: string | null
          project_name?: string
          target_audience?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_workspace: { Args: { _ws: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  app: {
    Tables: {
      page_objects: {
        Row: {
          page_object_id: string
          workspace_id: string
          page_key: string
          role_key: string
          data_status: string
          payload: Json
          generated_at: string
          updated_at: string
          period_start: string | null
          period_end: string | null
          status: string
          version: string
          expires_at: string | null
          page_title: string | null
          page_version: string
          metadata: Json
          section_key: string
          object_json: Json
          language: string
          role_view: string
          platform: string
          analysis_job_id: string | null
          priority: number
          object_version: string
          run_label: string | null
        }
        Insert: {
          page_object_id?: string
          workspace_id: string
          page_key: string
          role_key: string
          data_status: string
          payload?: Json
          generated_at?: string
          updated_at?: string
          period_start?: string | null
          period_end?: string | null
          status?: string
          version?: string
          expires_at?: string | null
          page_title?: string | null
          page_version?: string
          metadata?: Json
          section_key?: string
          object_json?: Json
          language?: string
          role_view?: string
          platform?: string
          analysis_job_id?: string | null
          priority?: number
          object_version?: string
          run_label?: string | null
        }
        Update: {
          page_object_id?: string
          workspace_id?: string
          page_key?: string
          role_key?: string
          data_status?: string
          payload?: Json
          generated_at?: string
          updated_at?: string
          status?: string
          version?: string
          expires_at?: string | null
          page_title?: string | null
          page_version?: string
          metadata?: Json
          section_key?: string
          object_json?: Json
          language?: string
          role_view?: string
          platform?: string
          analysis_job_id?: string | null
          priority?: number
          object_version?: string
          run_label?: string | null
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
  core: {
    Tables: {
      workspaces: {
        Row: {
          workspace_id: string
          app_user_id: string
          project_name: string
          niche: string | null
          country: string | null
          language: string | null
          target_audience: string | null
          product_description: string | null
          main_goal: string | null
          status: string
          created_at: string
          updated_at: string
          interface_language: string | null
          report_language: string | null
          content_language: string | null
          timezone: string | null
          organization_id: string | null
          plan_id: string | null
          subscription_status: string
          onboarding_status: string
          preferred_refresh_window: string | null
          metadata: Json
          business_stage: string | null
          website_url: string | null
          additional_context: string | null
        }
        Insert: {
          workspace_id?: string
          app_user_id: string
          project_name: string
          niche?: string | null
          country?: string | null
          language?: string | null
          status?: string
          created_at?: string
          updated_at?: string
          subscription_status?: string
          onboarding_status?: string
          metadata?: Json
        }
        Update: {
          workspace_id?: string
          project_name?: string
          niche?: string | null
          status?: string
          updated_at?: string
          metadata?: Json
        }
        Relationships: []
      }
      workspace_members: {
        Row: {
          workspace_member_id: string
          workspace_id: string
          app_user_id: string | null
          auth_user_id: string | null
          role: string
          created_at: string
          updated_at: string
          workspace_role: string
          default_view_mode: string
          allowed_view_modes: string[]
          allowed_platforms: string[]
          permissions_json: Json
          data_scope_json: Json
          status: string
          invited_by_app_user_id: string | null
          metadata: Json
        }
        Insert: {
          workspace_member_id?: string
          workspace_id: string
          app_user_id?: string | null
          auth_user_id?: string | null
          role: string
          created_at?: string
          updated_at?: string
          workspace_role: string
          default_view_mode: string
          allowed_view_modes: string[]
          allowed_platforms: string[]
          permissions_json?: Json
          data_scope_json?: Json
          status: string
          invited_by_app_user_id?: string | null
          metadata?: Json
        }
        Update: {
          workspace_member_id?: string
          workspace_id?: string
          app_user_id?: string | null
          auth_user_id?: string | null
          role?: string
          created_at?: string
          updated_at?: string
          workspace_role?: string
          default_view_mode?: string
          allowed_view_modes?: string[]
          allowed_platforms?: string[]
          permissions_json?: Json
          data_scope_json?: Json
          status?: string
          invited_by_app_user_id?: string | null
          metadata?: Json
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
