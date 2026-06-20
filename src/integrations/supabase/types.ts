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
  app: {
    Tables: {
      hypotheses: {
        Row: {
          affected_area: string | null
          app_user_id: string | null
          baseline_value: number | null
          completed_at: string | null
          content_format: string | null
          created_at: string
          evidence_json: Json
          expected_effect: string | null
          hypothesis_id: string
          hypothesis_text: string
          metadata: Json
          metric_to_track: string
          minimum_delta_percent: number | null
          platform: string | null
          recommended_action: string | null
          result_status: string | null
          result_summary: string | null
          source_insight_id: string | null
          source_semantic_key: string | null
          source_todo_id: string | null
          source_type: string
          started_at: string | null
          status: string
          success_criteria_json: Json
          target_direction: string
          target_value: number | null
          title: string
          tracking_period_days: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          affected_area?: string | null
          app_user_id?: string | null
          baseline_value?: number | null
          completed_at?: string | null
          content_format?: string | null
          created_at?: string
          evidence_json?: Json
          expected_effect?: string | null
          hypothesis_id?: string
          hypothesis_text: string
          metadata?: Json
          metric_to_track?: string
          minimum_delta_percent?: number | null
          platform?: string | null
          recommended_action?: string | null
          result_status?: string | null
          result_summary?: string | null
          source_insight_id?: string | null
          source_semantic_key?: string | null
          source_todo_id?: string | null
          source_type?: string
          started_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_direction?: string
          target_value?: number | null
          title: string
          tracking_period_days?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          affected_area?: string | null
          app_user_id?: string | null
          baseline_value?: number | null
          completed_at?: string | null
          content_format?: string | null
          created_at?: string
          evidence_json?: Json
          expected_effect?: string | null
          hypothesis_id?: string
          hypothesis_text?: string
          metadata?: Json
          metric_to_track?: string
          minimum_delta_percent?: number | null
          platform?: string | null
          recommended_action?: string | null
          result_status?: string | null
          result_summary?: string | null
          source_insight_id?: string | null
          source_semantic_key?: string | null
          source_todo_id?: string | null
          source_type?: string
          started_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_direction?: string
          target_value?: number | null
          title?: string
          tracking_period_days?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      idea_suggestions: {
        Row: {
          affected_area: string | null
          competitor_examples_json: Json
          confidence_score: number | null
          created_at: string
          difficulty_score: number | null
          expected_effect: string | null
          idea_id: string
          idea_type: string | null
          impact_score: number | null
          implementation_steps: Json
          marketing_idea: string | null
          platform: string | null
          priority: string | null
          semantic_key: string | null
          short_description: string | null
          source_pattern: string | null
          status: string
          suggested_ctas: Json
          suggested_formats: Json
          suggested_hooks: Json
          title: string
          updated_at: string
          why_it_fits_us: string | null
          workspace_id: string
        }
        Insert: {
          affected_area?: string | null
          competitor_examples_json?: Json
          confidence_score?: number | null
          created_at?: string
          difficulty_score?: number | null
          expected_effect?: string | null
          idea_id?: string
          idea_type?: string | null
          impact_score?: number | null
          implementation_steps?: Json
          marketing_idea?: string | null
          platform?: string | null
          priority?: string | null
          semantic_key?: string | null
          short_description?: string | null
          source_pattern?: string | null
          status?: string
          suggested_ctas?: Json
          suggested_formats?: Json
          suggested_hooks?: Json
          title: string
          updated_at?: string
          why_it_fits_us?: string | null
          workspace_id: string
        }
        Update: {
          affected_area?: string | null
          competitor_examples_json?: Json
          confidence_score?: number | null
          created_at?: string
          difficulty_score?: number | null
          expected_effect?: string | null
          idea_id?: string
          idea_type?: string | null
          impact_score?: number | null
          implementation_steps?: Json
          marketing_idea?: string | null
          platform?: string | null
          priority?: string | null
          semantic_key?: string | null
          short_description?: string | null
          source_pattern?: string | null
          status?: string
          suggested_ctas?: Json
          suggested_formats?: Json
          suggested_hooks?: Json
          title?: string
          updated_at?: string
          why_it_fits_us?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      insights_feed: {
        Row: {
          affected_area: string | null
          apply_status: string
          confidence_score: number | null
          created_at: string
          detailed_explanation: string | null
          effort_score: number | null
          evidence_json: Json
          expected_effect: string | null
          impact_score: number | null
          insight_id: string
          insight_type: string | null
          platform: string | null
          platform_specific_json: Json
          priority: string | null
          recommended_action: string | null
          recommended_tracking_metric: string | null
          recommended_tracking_period_days: number | null
          semantic_key: string | null
          short_summary: string | null
          source_entity_id: string | null
          source_type: string | null
          success_criteria_json: Json
          title: string
          updated_at: string
          workspace_id: string
        }
        Insert: {
          affected_area?: string | null
          apply_status?: string
          confidence_score?: number | null
          created_at?: string
          detailed_explanation?: string | null
          effort_score?: number | null
          evidence_json?: Json
          expected_effect?: string | null
          impact_score?: number | null
          insight_id?: string
          insight_type?: string | null
          platform?: string | null
          platform_specific_json?: Json
          priority?: string | null
          recommended_action?: string | null
          recommended_tracking_metric?: string | null
          recommended_tracking_period_days?: number | null
          semantic_key?: string | null
          short_summary?: string | null
          source_entity_id?: string | null
          source_type?: string | null
          success_criteria_json?: Json
          title: string
          updated_at?: string
          workspace_id: string
        }
        Update: {
          affected_area?: string | null
          apply_status?: string
          confidence_score?: number | null
          created_at?: string
          detailed_explanation?: string | null
          effort_score?: number | null
          evidence_json?: Json
          expected_effect?: string | null
          impact_score?: number | null
          insight_id?: string
          insight_type?: string | null
          platform?: string | null
          platform_specific_json?: Json
          priority?: string | null
          recommended_action?: string | null
          recommended_tracking_metric?: string | null
          recommended_tracking_period_days?: number | null
          semantic_key?: string | null
          short_summary?: string | null
          source_entity_id?: string | null
          source_type?: string | null
          success_criteria_json?: Json
          title?: string
          updated_at?: string
          workspace_id?: string
        }
        Relationships: []
      }
      onboarding_submissions: {
        Row: {
          app_user_id: string | null
          contract_version: string
          created_at: string
          display_name: string | null
          email: string
          error_message: string | null
          onboarding_submission_id: string
          payload: Json
          processed_at: string | null
          project_name: string
          run_label: string | null
          status: string
          updated_at: string
          wf01_execution_id: string | null
          wf08_execution_id: string | null
          workspace_id: string | null
        }
        Insert: {
          app_user_id?: string | null
          contract_version?: string
          created_at?: string
          display_name?: string | null
          email: string
          error_message?: string | null
          onboarding_submission_id?: string
          payload?: Json
          processed_at?: string | null
          project_name: string
          run_label?: string | null
          status?: string
          updated_at?: string
          wf01_execution_id?: string | null
          wf08_execution_id?: string | null
          workspace_id?: string | null
        }
        Update: {
          app_user_id?: string | null
          contract_version?: string
          created_at?: string
          display_name?: string | null
          email?: string
          error_message?: string | null
          onboarding_submission_id?: string
          payload?: Json
          processed_at?: string | null
          project_name?: string
          run_label?: string | null
          status?: string
          updated_at?: string
          wf01_execution_id?: string | null
          wf08_execution_id?: string | null
          workspace_id?: string | null
        }
        Relationships: []
      }
      page_objects: {
        Row: {
          analysis_job_id: string | null
          data_status: string
          expires_at: string | null
          generated_at: string
          language: string
          metadata: Json
          object_json: Json
          object_version: string
          page_key: string
          page_object_id: string
          page_title: string | null
          page_version: string
          payload: Json
          period_end: string | null
          period_start: string | null
          platform: string
          priority: number
          role_key: string
          role_view: string
          run_label: string | null
          section_key: string
          status: string
          updated_at: string
          version: string
          workspace_id: string
        }
        Insert: {
          analysis_job_id?: string | null
          data_status?: string
          expires_at?: string | null
          generated_at?: string
          language?: string
          metadata?: Json
          object_json?: Json
          object_version?: string
          page_key: string
          page_object_id?: string
          page_title?: string | null
          page_version?: string
          payload?: Json
          period_end?: string | null
          period_start?: string | null
          platform?: string
          priority?: number
          role_key?: string
          role_view?: string
          run_label?: string | null
          section_key?: string
          status?: string
          updated_at?: string
          version?: string
          workspace_id: string
        }
        Update: {
          analysis_job_id?: string | null
          data_status?: string
          expires_at?: string | null
          generated_at?: string
          language?: string
          metadata?: Json
          object_json?: Json
          object_version?: string
          page_key?: string
          page_object_id?: string
          page_title?: string | null
          page_version?: string
          payload?: Json
          period_end?: string | null
          period_start?: string | null
          platform?: string
          priority?: number
          role_key?: string
          role_view?: string
          run_label?: string | null
          section_key?: string
          status?: string
          updated_at?: string
          version?: string
          workspace_id?: string
        }
        Relationships: []
      }
      page_objects_backup_frontend_unblock_v2: {
        Row: {
          backed_up_at: string
          backup_id: string
          backup_reason: string
          language: string | null
          page_key: string | null
          page_object_id: string | null
          platform: string | null
          role_key: string | null
          role_view: string | null
          row_json: Json
          run_label: string | null
          workspace_id: string
        }
        Insert: {
          backed_up_at?: string
          backup_id?: string
          backup_reason?: string
          language?: string | null
          page_key?: string | null
          page_object_id?: string | null
          platform?: string | null
          role_key?: string | null
          role_view?: string | null
          row_json: Json
          run_label?: string | null
          workspace_id: string
        }
        Update: {
          backed_up_at?: string
          backup_id?: string
          backup_reason?: string
          language?: string | null
          page_key?: string | null
          page_object_id?: string | null
          platform?: string | null
          role_key?: string | null
          role_view?: string | null
          row_json?: Json
          run_label?: string | null
          workspace_id?: string
        }
        Relationships: []
      }
      tested_hypotheses: {
        Row: {
          action_taken: string | null
          affected_area: string | null
          baseline_value: number | null
          confidence_score: number | null
          content_format: string | null
          created_at: string
          delta_percent: number | null
          delta_value: number | null
          evaluated_at: string | null
          evidence_json: Json
          final_value: number | null
          hypothesis_description: string | null
          hypothesis_id: string
          hypothesis_title: string
          platform: string | null
          recommendation_for_future: string | null
          result_status: string
          reusable_learning: string | null
          source_insight_id: string | null
          success_criteria_json: Json
          todo_id: string | null
          tracking_metric: string
          tracking_period_days: number | null
          workspace_id: string
        }
        Insert: {
          action_taken?: string | null
          affected_area?: string | null
          baseline_value?: number | null
          confidence_score?: number | null
          content_format?: string | null
          created_at?: string
          delta_percent?: number | null
          delta_value?: number | null
          evaluated_at?: string | null
          evidence_json?: Json
          final_value?: number | null
          hypothesis_description?: string | null
          hypothesis_id?: string
          hypothesis_title: string
          platform?: string | null
          recommendation_for_future?: string | null
          result_status: string
          reusable_learning?: string | null
          source_insight_id?: string | null
          success_criteria_json?: Json
          todo_id?: string | null
          tracking_metric: string
          tracking_period_days?: number | null
          workspace_id: string
        }
        Update: {
          action_taken?: string | null
          affected_area?: string | null
          baseline_value?: number | null
          confidence_score?: number | null
          content_format?: string | null
          created_at?: string
          delta_percent?: number | null
          delta_value?: number | null
          evaluated_at?: string | null
          evidence_json?: Json
          final_value?: number | null
          hypothesis_description?: string | null
          hypothesis_id?: string
          hypothesis_title?: string
          platform?: string | null
          recommendation_for_future?: string | null
          result_status?: string
          reusable_learning?: string | null
          source_insight_id?: string | null
          success_criteria_json?: Json
          todo_id?: string | null
          tracking_metric?: string
          tracking_period_days?: number | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tested_hypotheses_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["todo_id"]
          },
        ]
      }
      todo_events: {
        Row: {
          created_at: string
          event_type: string
          from_status: string | null
          metadata: Json
          note: string | null
          to_status: string | null
          todo_event_id: string
          todo_id: string
          workspace_id: string
        }
        Insert: {
          created_at?: string
          event_type: string
          from_status?: string | null
          metadata?: Json
          note?: string | null
          to_status?: string | null
          todo_event_id?: string
          todo_id: string
          workspace_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          from_status?: string | null
          metadata?: Json
          note?: string | null
          to_status?: string | null
          todo_event_id?: string
          todo_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_events_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["todo_id"]
          },
        ]
      }
      todo_metric_tracking: {
        Row: {
          baseline_period_end: string | null
          baseline_period_start: string | null
          baseline_value: number | null
          change_absolute: number | null
          change_percent: number | null
          current_value: number | null
          interpretation: string | null
          last_updated_at: string
          metric_name: string
          result_status: string | null
          target_value: number | null
          todo_id: string
          tracking_id: string
          tracking_period_end: string | null
          tracking_period_start: string | null
          workspace_id: string
        }
        Insert: {
          baseline_period_end?: string | null
          baseline_period_start?: string | null
          baseline_value?: number | null
          change_absolute?: number | null
          change_percent?: number | null
          current_value?: number | null
          interpretation?: string | null
          last_updated_at?: string
          metric_name: string
          result_status?: string | null
          target_value?: number | null
          todo_id: string
          tracking_id?: string
          tracking_period_end?: string | null
          tracking_period_start?: string | null
          workspace_id: string
        }
        Update: {
          baseline_period_end?: string | null
          baseline_period_start?: string | null
          baseline_value?: number | null
          change_absolute?: number | null
          change_percent?: number | null
          current_value?: number | null
          interpretation?: string | null
          last_updated_at?: string
          metric_name?: string
          result_status?: string | null
          target_value?: number | null
          todo_id?: string
          tracking_id?: string
          tracking_period_end?: string | null
          tracking_period_start?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_metric_tracking_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["todo_id"]
          },
        ]
      }
      todo_tracking_configs: {
        Row: {
          baseline_value: number | null
          created_at: string
          current_value: number | null
          delta_percent: number | null
          delta_value: number | null
          end_at: string | null
          evaluated_at: string | null
          final_value: number | null
          metadata: Json
          metric_key: string
          minimum_delta_percent: number | null
          result_status: string | null
          start_at: string | null
          status: string
          success_criteria_json: Json
          target_direction: string | null
          todo_id: string
          tracking_config_id: string
          tracking_period_days: number
          updated_at: string
          workspace_id: string
        }
        Insert: {
          baseline_value?: number | null
          created_at?: string
          current_value?: number | null
          delta_percent?: number | null
          delta_value?: number | null
          end_at?: string | null
          evaluated_at?: string | null
          final_value?: number | null
          metadata?: Json
          metric_key: string
          minimum_delta_percent?: number | null
          result_status?: string | null
          start_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_direction?: string | null
          todo_id: string
          tracking_config_id?: string
          tracking_period_days?: number
          updated_at?: string
          workspace_id: string
        }
        Update: {
          baseline_value?: number | null
          created_at?: string
          current_value?: number | null
          delta_percent?: number | null
          delta_value?: number | null
          end_at?: string | null
          evaluated_at?: string | null
          final_value?: number | null
          metadata?: Json
          metric_key?: string
          minimum_delta_percent?: number | null
          result_status?: string | null
          start_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_direction?: string | null
          todo_id?: string
          tracking_config_id?: string
          tracking_period_days?: number
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_tracking_configs_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: true
            referencedRelation: "todos"
            referencedColumns: ["todo_id"]
          },
        ]
      }
      todo_tracking_results: {
        Row: {
          affected_area: string | null
          baseline_value: number | null
          created_at: string
          delta_percent: number | null
          delta_value: number | null
          measurement_at: string
          measurement_type: string
          metric_key: string
          metric_value: number | null
          minimum_delta_percent: number | null
          platform: string | null
          source_json: Json
          source_semantic_key: string | null
          success_criteria_json: Json
          target_direction: string | null
          todo_id: string
          tracking_config_id: string | null
          tracking_result_id: string
          workspace_id: string
        }
        Insert: {
          affected_area?: string | null
          baseline_value?: number | null
          created_at?: string
          delta_percent?: number | null
          delta_value?: number | null
          measurement_at?: string
          measurement_type?: string
          metric_key: string
          metric_value?: number | null
          minimum_delta_percent?: number | null
          platform?: string | null
          source_json?: Json
          source_semantic_key?: string | null
          success_criteria_json?: Json
          target_direction?: string | null
          todo_id: string
          tracking_config_id?: string | null
          tracking_result_id?: string
          workspace_id: string
        }
        Update: {
          affected_area?: string | null
          baseline_value?: number | null
          created_at?: string
          delta_percent?: number | null
          delta_value?: number | null
          measurement_at?: string
          measurement_type?: string
          metric_key?: string
          metric_value?: number | null
          minimum_delta_percent?: number | null
          platform?: string | null
          source_json?: Json
          source_semantic_key?: string | null
          success_criteria_json?: Json
          target_direction?: string | null
          todo_id?: string
          tracking_config_id?: string | null
          tracking_result_id?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todo_tracking_results_todo_id_fkey"
            columns: ["todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["todo_id"]
          },
          {
            foreignKeyName: "todo_tracking_results_tracking_config_id_fkey"
            columns: ["tracking_config_id"]
            isOneToOne: false
            referencedRelation: "todo_tracking_configs"
            referencedColumns: ["tracking_config_id"]
          },
        ]
      }
      todos: {
        Row: {
          action_type: string | null
          affected_area: string | null
          app_user_id: string | null
          baseline_value: number | null
          completed_at: string | null
          created_at: string
          description: string | null
          due_at: string | null
          due_date: string | null
          expected_effect: string | null
          metadata: Json
          platform: string | null
          postponed_until: string | null
          priority: string | null
          recommended_action: string | null
          source_hypothesis_id: string | null
          source_id: string | null
          source_insight_id: string | null
          source_semantic_key: string | null
          source_type: string | null
          start_tracking_at: string | null
          status: string
          success_criteria_json: Json
          target_metric: string | null
          target_value: number | null
          title: string
          todo_id: string
          tracking_end_date: string | null
          tracking_metric: string | null
          tracking_period_days: number | null
          tracking_start_date: string | null
          tracking_status: string | null
          updated_at: string
          workspace_id: string
        }
        Insert: {
          action_type?: string | null
          affected_area?: string | null
          app_user_id?: string | null
          baseline_value?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          due_date?: string | null
          expected_effect?: string | null
          metadata?: Json
          platform?: string | null
          postponed_until?: string | null
          priority?: string | null
          recommended_action?: string | null
          source_hypothesis_id?: string | null
          source_id?: string | null
          source_insight_id?: string | null
          source_semantic_key?: string | null
          source_type?: string | null
          start_tracking_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_metric?: string | null
          target_value?: number | null
          title: string
          todo_id?: string
          tracking_end_date?: string | null
          tracking_metric?: string | null
          tracking_period_days?: number | null
          tracking_start_date?: string | null
          tracking_status?: string | null
          updated_at?: string
          workspace_id: string
        }
        Update: {
          action_type?: string | null
          affected_area?: string | null
          app_user_id?: string | null
          baseline_value?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          due_at?: string | null
          due_date?: string | null
          expected_effect?: string | null
          metadata?: Json
          platform?: string | null
          postponed_until?: string | null
          priority?: string | null
          recommended_action?: string | null
          source_hypothesis_id?: string | null
          source_id?: string | null
          source_insight_id?: string | null
          source_semantic_key?: string | null
          source_type?: string | null
          start_tracking_at?: string | null
          status?: string
          success_criteria_json?: Json
          target_metric?: string | null
          target_value?: number | null
          title?: string
          todo_id?: string
          tracking_end_date?: string | null
          tracking_metric?: string | null
          tracking_period_days?: number | null
          tracking_start_date?: string | null
          tracking_status?: string | null
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_source_insight_id_fkey"
            columns: ["source_insight_id"]
            isOneToOne: false
            referencedRelation: "insights_feed"
            referencedColumns: ["insight_id"]
          },
        ]
      }
      tracking_metric_rules: {
        Row: {
          affected_area: string | null
          created_at: string
          default_tracking_period_days: number
          insight_type: string
          metadata: Json
          minimum_delta_percent: number
          primary_metric: string
          rule_id: string
          secondary_metrics: Json
          target_direction: string
        }
        Insert: {
          affected_area?: string | null
          created_at?: string
          default_tracking_period_days?: number
          insight_type: string
          metadata?: Json
          minimum_delta_percent?: number
          primary_metric: string
          rule_id?: string
          secondary_metrics?: Json
          target_direction?: string
        }
        Update: {
          affected_area?: string | null
          created_at?: string
          default_tracking_period_days?: number
          insight_type?: string
          metadata?: Json
          minimum_delta_percent?: number
          primary_metric?: string
          rule_id?: string
          secondary_metrics?: Json
          target_direction?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_page_object: {
        Args: {
          p_language?: string
          p_page_key: string
          p_platform: string
          p_role_key: string
          p_workspace_id: string
        }
        Returns: Json
      }
      get_workspace_ui_context: {
        Args: { p_app_user_id: string; p_workspace_id: string }
        Returns: Json
      }
      upsert_page_object_v2: {
        Args: {
          p_analysis_job_id?: string
          p_language: string
          p_metadata?: Json
          p_object_json: Json
          p_object_version?: string
          p_page_key: string
          p_period_end?: string
          p_period_start?: string
          p_platform: string
          p_priority?: number
          p_role_view: string
          p_section_key: string
          p_workspace_id: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  core: {
    Tables: {
      app_users: {
        Row: {
          app_user_id: string
          created_at: string
          default_organization_id: string | null
          display_name: string | null
          email: string
          updated_at: string
        }
        Insert: {
          app_user_id?: string
          created_at?: string
          default_organization_id?: string | null
          display_name?: string | null
          email: string
          updated_at?: string
        }
        Update: {
          app_user_id?: string
          created_at?: string
          default_organization_id?: string | null
          display_name?: string | null
          email?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_users_default_organization_fk"
            columns: ["default_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organization_members: {
        Row: {
          app_user_id: string
          created_at: string
          metadata: Json
          org_role: string
          organization_id: string
          organization_member_id: string
          status: string
          updated_at: string
        }
        Insert: {
          app_user_id: string
          created_at?: string
          metadata?: Json
          org_role?: string
          organization_id: string
          organization_member_id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          app_user_id?: string
          created_at?: string
          metadata?: Json
          org_role?: string
          organization_id?: string
          organization_member_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_members_app_user_id_fkey"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "organization_members_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          metadata: Json
          name: string
          organization_id: string
          owner_app_user_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          metadata?: Json
          name: string
          organization_id?: string
          owner_app_user_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          metadata?: Json
          name?: string
          organization_id?: string
          owner_app_user_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_owner_app_user_id_fkey"
            columns: ["owner_app_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["app_user_id"]
          },
        ]
      }
      social_accounts: {
        Row: {
          account_id: string
          account_type: string
          bio: string | null
          created_at: string
          display_name: string | null
          external_profile_id: string | null
          external_url: string | null
          last_scraped_at: string | null
          last_successful_scrape_at: string | null
          platform: string
          platform_metadata: Json
          platform_profile_url: string | null
          profile_url: string
          scrape_enabled: boolean | null
          scrape_error: string | null
          status: string
          updated_at: string
          username: string | null
          workspace_id: string
        }
        Insert: {
          account_id?: string
          account_type: string
          bio?: string | null
          created_at?: string
          display_name?: string | null
          external_profile_id?: string | null
          external_url?: string | null
          last_scraped_at?: string | null
          last_successful_scrape_at?: string | null
          platform: string
          platform_metadata?: Json
          platform_profile_url?: string | null
          profile_url: string
          scrape_enabled?: boolean | null
          scrape_error?: string | null
          status?: string
          updated_at?: string
          username?: string | null
          workspace_id: string
        }
        Update: {
          account_id?: string
          account_type?: string
          bio?: string | null
          created_at?: string
          display_name?: string | null
          external_profile_id?: string | null
          external_url?: string | null
          last_scraped_at?: string | null
          last_successful_scrape_at?: string | null
          platform?: string
          platform_metadata?: Json
          platform_profile_url?: string | null
          profile_url?: string
          scrape_enabled?: boolean | null
          scrape_error?: string | null
          status?: string
          updated_at?: string
          username?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_accounts_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["workspace_id"]
          },
        ]
      }
      workspace_members: {
        Row: {
          allowed_platforms: string[]
          allowed_view_modes: string[]
          app_user_id: string | null
          auth_user_id: string | null
          created_at: string
          data_scope_json: Json
          default_view_mode: string
          invited_by_app_user_id: string | null
          metadata: Json
          permissions_json: Json
          role: string
          status: string
          updated_at: string
          workspace_id: string
          workspace_member_id: string
          workspace_role: string
        }
        Insert: {
          allowed_platforms?: string[]
          allowed_view_modes?: string[]
          app_user_id?: string | null
          auth_user_id?: string | null
          created_at?: string
          data_scope_json?: Json
          default_view_mode?: string
          invited_by_app_user_id?: string | null
          metadata?: Json
          permissions_json?: Json
          role?: string
          status?: string
          updated_at?: string
          workspace_id: string
          workspace_member_id?: string
          workspace_role?: string
        }
        Update: {
          allowed_platforms?: string[]
          allowed_view_modes?: string[]
          app_user_id?: string | null
          auth_user_id?: string | null
          created_at?: string
          data_scope_json?: Json
          default_view_mode?: string
          invited_by_app_user_id?: string | null
          metadata?: Json
          permissions_json?: Json
          role?: string
          status?: string
          updated_at?: string
          workspace_id?: string
          workspace_member_id?: string
          workspace_role?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_members_app_user_id_fkey"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "workspace_members_invited_by_app_user_id_fkey"
            columns: ["invited_by_app_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "workspace_members_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: false
            referencedRelation: "workspaces"
            referencedColumns: ["workspace_id"]
          },
        ]
      }
      workspace_settings: {
        Row: {
          analysis_frequency: string
          comments_enabled: boolean
          created_at: string
          max_competitors: number
          media_description_enabled: boolean
          notification_email_enabled: boolean
          notification_telegram_enabled: boolean
          scraping_frequency: string
          timezone: string
          transcription_enabled: boolean
          updated_at: string
          workspace_id: string
        }
        Insert: {
          analysis_frequency?: string
          comments_enabled?: boolean
          created_at?: string
          max_competitors?: number
          media_description_enabled?: boolean
          notification_email_enabled?: boolean
          notification_telegram_enabled?: boolean
          scraping_frequency?: string
          timezone?: string
          transcription_enabled?: boolean
          updated_at?: string
          workspace_id: string
        }
        Update: {
          analysis_frequency?: string
          comments_enabled?: boolean
          created_at?: string
          max_competitors?: number
          media_description_enabled?: boolean
          notification_email_enabled?: boolean
          notification_telegram_enabled?: boolean
          scraping_frequency?: string
          timezone?: string
          transcription_enabled?: boolean
          updated_at?: string
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspace_settings_workspace_id_fkey"
            columns: ["workspace_id"]
            isOneToOne: true
            referencedRelation: "workspaces"
            referencedColumns: ["workspace_id"]
          },
        ]
      }
      workspaces: {
        Row: {
          additional_context: string | null
          app_user_id: string
          business_stage: string | null
          content_language: string | null
          country: string | null
          created_at: string
          interface_language: string | null
          language: string | null
          main_goal: string | null
          metadata: Json
          niche: string | null
          onboarding_status: string
          organization_id: string | null
          plan_id: string | null
          preferred_refresh_window: string | null
          product_description: string | null
          project_name: string
          report_language: string | null
          status: string
          subscription_status: string
          target_audience: string | null
          timezone: string | null
          updated_at: string
          website_url: string | null
          workspace_id: string
        }
        Insert: {
          additional_context?: string | null
          app_user_id: string
          business_stage?: string | null
          content_language?: string | null
          country?: string | null
          created_at?: string
          interface_language?: string | null
          language?: string | null
          main_goal?: string | null
          metadata?: Json
          niche?: string | null
          onboarding_status?: string
          organization_id?: string | null
          plan_id?: string | null
          preferred_refresh_window?: string | null
          product_description?: string | null
          project_name: string
          report_language?: string | null
          status?: string
          subscription_status?: string
          target_audience?: string | null
          timezone?: string | null
          updated_at?: string
          website_url?: string | null
          workspace_id?: string
        }
        Update: {
          additional_context?: string | null
          app_user_id?: string
          business_stage?: string | null
          content_language?: string | null
          country?: string | null
          created_at?: string
          interface_language?: string | null
          language?: string | null
          main_goal?: string | null
          metadata?: Json
          niche?: string | null
          onboarding_status?: string
          organization_id?: string | null
          plan_id?: string | null
          preferred_refresh_window?: string | null
          product_description?: string | null
          project_name?: string
          report_language?: string | null
          status?: string
          subscription_status?: string
          target_audience?: string | null
          timezone?: string | null
          updated_at?: string
          website_url?: string | null
          workspace_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workspaces_app_user_id_fkey"
            columns: ["app_user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["app_user_id"]
          },
          {
            foreignKeyName: "workspaces_organization_fk"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["organization_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      default_allowed_view_modes: {
        Args: { p_workspace_role: string }
        Returns: string[]
      }
      default_workspace_permissions: {
        Args: { p_workspace_role: string }
        Returns: Json
      }
      is_workspace_member: { Args: { _workspace_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      [_ in never]: never
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
  app: {
    Enums: {},
  },
  core: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
