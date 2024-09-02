export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
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
      answers: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          profile_id: string | null
          question_id: number | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          question_id?: number | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          question_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'answers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'answers_question_id_fkey'
            columns: ['question_id']
            isOneToOne: false
            referencedRelation: 'questions'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          id: number
          name: string | null
          pack_id: number | null
          slug: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          slug?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          pack_id?: number | null
          slug?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'categories_pack_id_fkey'
            columns: ['pack_id']
            isOneToOne: false
            referencedRelation: 'packs'
            referencedColumns: ['id']
          },
        ]
      }
      category_items: {
        Row: {
          category_id: number | null
          created_at: string | null
          id: number
          item_id: number | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          id?: number
          item_id?: number | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'category_items_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'category_items_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'items'
            referencedColumns: ['id']
          },
        ]
      }
      comments: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: number
          pack_id: number
          profile_id: string
          text: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          pack_id: number
          profile_id: string
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          pack_id?: number
          profile_id?: string
          text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'comments_pack_id_fkey'
            columns: ['pack_id']
            isOneToOne: false
            referencedRelation: 'packs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'comments_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      customers: {
        Row: {
          deleted_at: string | null
          id: string
          profile_id: string
          stripe_customer_id: string | null
        }
        Insert: {
          deleted_at?: string | null
          id?: string
          profile_id: string
          stripe_customer_id?: string | null
        }
        Update: {
          deleted_at?: string | null
          id?: string
          profile_id?: string
          stripe_customer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'customers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      friend_invitations: {
        Row: {
          created_at: string | null
          id: number
          recipient_id: string | null
          request_responded_at: string | null
          request_sent_at: string | null
          sender_id: string | null
          status: Database['public']['Enums']['friend_request_status']
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          recipient_id?: string | null
          request_responded_at?: string | null
          request_sent_at?: string | null
          sender_id?: string | null
          status?: Database['public']['Enums']['friend_request_status']
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          recipient_id?: string | null
          request_responded_at?: string | null
          request_sent_at?: string | null
          sender_id?: string | null
          status?: Database['public']['Enums']['friend_request_status']
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'friend_invitations_recipient_id_fkey'
            columns: ['recipient_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'friend_invitations_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      friends: {
        Row: {
          created_at: string | null
          friend_id: string | null
          id: number
          profile_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          friend_id?: string | null
          id?: number
          profile_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'friends_friend_id_fkey'
            columns: ['friend_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'friends_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      items: {
        Row: {
          consumable: boolean | null
          created_at: string | null
          generic_type: string | null
          id: number
          name: string | null
          price: number | null
          profile_id: string | null
          quantity: number | null
          slug: string
          unit: string | null
          updated_at: string | null
          url: string | null
          weight: string | null
          worn: boolean | null
        }
        Insert: {
          consumable?: boolean | null
          created_at?: string | null
          generic_type?: string | null
          id?: number
          name?: string | null
          price?: number | null
          profile_id?: string | null
          quantity?: number | null
          slug: string
          unit?: string | null
          updated_at?: string | null
          url?: string | null
          weight?: string | null
          worn?: boolean | null
        }
        Update: {
          consumable?: boolean | null
          created_at?: string | null
          generic_type?: string | null
          id?: number
          name?: string | null
          price?: number | null
          profile_id?: string | null
          quantity?: number | null
          slug?: string
          unit?: string | null
          updated_at?: string | null
          url?: string | null
          weight?: string | null
          worn?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: 'items_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          profile_id: string | null
          read_on_date: string | null
          sender_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          read_on_date?: string | null
          sender_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          profile_id?: string | null
          read_on_date?: string | null
          sender_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'notifications_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'notifications_sender_id_fkey'
            columns: ['sender_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      onboarding_steps: {
        Row: {
          completion_date: string | null
          created_at: string
          page: string
          profile_id: string
          updated_at: string
        }
        Insert: {
          completion_date?: string | null
          created_at?: string
          page: string
          profile_id: string
          updated_at?: string
        }
        Update: {
          completion_date?: string | null
          created_at?: string
          page?: string
          profile_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'onboarding_steps_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      packs: {
        Row: {
          allow_comments: boolean
          created_at: string | null
          id: number
          name: string | null
          private: boolean
          profile_id: string
          slug: string | null
          theme: Database['public']['Enums']['theme'] | null
          updated_at: string | null
        }
        Insert: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          name?: string | null
          private?: boolean
          profile_id: string
          slug?: string | null
          theme?: Database['public']['Enums']['theme'] | null
          updated_at?: string | null
        }
        Update: {
          allow_comments?: boolean
          created_at?: string | null
          id?: number
          name?: string | null
          private?: boolean
          profile_id?: string
          slug?: string | null
          theme?: Database['public']['Enums']['theme'] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'packs_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      polls: {
        Row: {
          created_at: string | null
          id: number
          profile_id: string | null
          trip_id: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'polls_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'polls_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      prices: {
        Row: {
          active: boolean | null
          currency: string | null
          description: string | null
          environment: string | null
          id: string
          identifier: Database['public']['Enums']['subscription_level'] | null
          interval: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count: number | null
          metadata: Json | null
          product_id: string | null
          trial_period_days: number | null
          type: Database['public']['Enums']['pricing_type'] | null
          unit_amount: number | null
        }
        Insert: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          environment?: string | null
          id: string
          identifier?: Database['public']['Enums']['subscription_level'] | null
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Update: {
          active?: boolean | null
          currency?: string | null
          description?: string | null
          environment?: string | null
          id?: string
          identifier?: Database['public']['Enums']['subscription_level'] | null
          interval?: Database['public']['Enums']['pricing_plan_interval'] | null
          interval_count?: number | null
          metadata?: Json | null
          product_id?: string | null
          trial_period_days?: number | null
          type?: Database['public']['Enums']['pricing_type'] | null
          unit_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'prices_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          active: boolean
          description: string | null
          environment: string | null
          id: string
          image: string | null
          metadata: Json | null
          name: Database['public']['Enums']['subscription_level'] | null
        }
        Insert: {
          active?: boolean
          description?: string | null
          environment?: string | null
          id: string
          image?: string | null
          metadata?: Json | null
          name?: Database['public']['Enums']['subscription_level'] | null
        }
        Update: {
          active?: boolean
          description?: string | null
          environment?: string | null
          id?: string
          image?: string | null
          metadata?: Json | null
          name?: Database['public']['Enums']['subscription_level'] | null
        }
        Relationships: []
      }
      profile_answers: {
        Row: {
          answer_id: number | null
          created_at: string | null
          id: number
          poll_id: number | null
          profile_id: string | null
          updated_at: string
        }
        Insert: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          updated_at?: string
        }
        Update: {
          answer_id?: number | null
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profile_answers_answer_id_fkey'
            columns: ['answer_id']
            isOneToOne: false
            referencedRelation: 'answers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_answers_poll_id_fkey'
            columns: ['poll_id']
            isOneToOne: false
            referencedRelation: 'polls'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'profile_answers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          address_1: string | null
          address_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          fts: unknown | null
          id: string
          image: string | null
          last_name: string | null
          location: Json | null
          measuring_system:
            | Database['public']['Enums']['measuring_system']
            | null
          onboard_date: string | null
          role: Database['public']['Enums']['user_role'] | null
          slug: string
          state: string | null
          trail_name: string | null
          updated_at: string | null
        }
        Insert: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          fts?: unknown | null
          id: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database['public']['Enums']['measuring_system']
            | null
          onboard_date?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          slug: string
          state?: string | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Update: {
          address_1?: string | null
          address_2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          fts?: unknown | null
          id?: string
          image?: string | null
          last_name?: string | null
          location?: Json | null
          measuring_system?:
            | Database['public']['Enums']['measuring_system']
            | null
          onboard_date?: string | null
          role?: Database['public']['Enums']['user_role'] | null
          slug?: string
          state?: string | null
          trail_name?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey'
            columns: ['id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      questions: {
        Row: {
          created_at: string | null
          id: number
          poll_id: number | null
          profile_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          id?: number
          poll_id?: number | null
          profile_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'questions_poll_id_fkey'
            columns: ['poll_id']
            isOneToOne: false
            referencedRelation: 'polls'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'questions_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      replies: {
        Row: {
          comment_id: number
          created_at: string | null
          deleted_at: string | null
          id: number
          profile_id: string
          text: string | null
          updated_at: string | null
        }
        Insert: {
          comment_id: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          profile_id: string
          text?: string | null
          updated_at?: string | null
        }
        Update: {
          comment_id?: number
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          profile_id?: string
          text?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'replies_comment_id_fkey'
            columns: ['comment_id']
            isOneToOne: false
            referencedRelation: 'comments'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'replies_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      shopping_list_items: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          profile_id: string | null
          quantity: number | null
          resource_type: Database['public']['Enums']['resource_type']
          title: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          quantity?: number | null
          resource_type?: Database['public']['Enums']['resource_type']
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          quantity?: number | null
          resource_type?: Database['public']['Enums']['resource_type']
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'shopping_list_items_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'shopping_list_items_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      subscriptions: {
        Row: {
          cancel_at: string | null
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          created_at: string
          current_period_end: string
          current_period_start: string
          ended_at: string | null
          id: string
          metadata: Json | null
          price_id: string | null
          profile_id: string
          quantity: number | null
          status: Database['public']['Enums']['subscription_status'] | null
          stripe_subscription_id: string | null
          trial_end: string | null
          trial_start: string | null
        }
        Insert: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          profile_id: string
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Update: {
          cancel_at?: string | null
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          created_at?: string
          current_period_end?: string
          current_period_start?: string
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          price_id?: string | null
          profile_id?: string
          quantity?: number | null
          status?: Database['public']['Enums']['subscription_status'] | null
          stripe_subscription_id?: string | null
          trial_end?: string | null
          trial_start?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'subscriptions_price_id_fkey'
            columns: ['price_id']
            isOneToOne: false
            referencedRelation: 'prices'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'subscriptions_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      todos: {
        Row: {
          completed: boolean
          created_at: string | null
          id: number
          profile_id: string | null
          resource_type: Database['public']['Enums']['resource_type']
          title: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          resource_type?: Database['public']['Enums']['resource_type']
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          completed?: boolean
          created_at?: string | null
          id?: number
          profile_id?: string | null
          resource_type?: Database['public']['Enums']['resource_type']
          title?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'todos_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'todos_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      trip_details: {
        Row: {
          created_at: string | null
          id: number
          title: string | null
          trip_id: number | null
          type: Database['public']['Enums']['trip_details_type']
          updated_at: string
          url: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: Database['public']['Enums']['trip_details_type']
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          title?: string | null
          trip_id?: number | null
          type?: Database['public']['Enums']['trip_details_type']
          updated_at?: string
          url?: string | null
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'trip_details_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      trip_friends: {
        Row: {
          accepted_invite_on: string | null
          created_at: string | null
          id: number
          invite_token: string | null
          invited_by_id: string | null
          profile_id: string | null
          status: Database['public']['Enums']['trip_friend_status']
          trip_id: number | null
          updated_at: string
        }
        Insert: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          invite_token?: string | null
          invited_by_id?: string | null
          profile_id?: string | null
          status?: Database['public']['Enums']['trip_friend_status']
          trip_id?: number | null
          updated_at?: string
        }
        Update: {
          accepted_invite_on?: string | null
          created_at?: string | null
          id?: number
          invite_token?: string | null
          invited_by_id?: string | null
          profile_id?: string | null
          status?: Database['public']['Enums']['trip_friend_status']
          trip_id?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trip_friends_invited_by_id_fkey'
            columns: ['invited_by_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_friends_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_friends_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      trip_packs: {
        Row: {
          created_at: string | null
          id: number
          pack_id: number | null
          profile_id: string | null
          trip_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          pack_id?: number | null
          profile_id?: string | null
          trip_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'trip_packs_pack_id_fkey'
            columns: ['pack_id']
            isOneToOne: false
            referencedRelation: 'packs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_packs_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'trip_packs_trip_id_fkey'
            columns: ['trip_id']
            isOneToOne: false
            referencedRelation: 'trips'
            referencedColumns: ['id']
          },
        ]
      }
      trips: {
        Row: {
          created_at: string | null
          description: string | null
          ending_date: string | null
          ending_point: string | null
          id: number
          name: string | null
          profile_id: string | null
          slug: string | null
          starting_date: string | null
          starting_point: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          slug?: string | null
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          ending_date?: string | null
          ending_point?: string | null
          id?: number
          name?: string | null
          profile_id?: string | null
          slug?: string | null
          starting_date?: string | null
          starting_point?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'trips_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_category_and_item: {
        Args: {
          p_name: string
          p_pack_id: number
          p_items: Json
        }
        Returns: Json
      }
      create_poll: {
        Args: {
          trip_id: number
          question: string
          answers: string[]
        }
        Returns: Json
      }
      get_closet_page_data: {
        Args: {
          p_pack_id: number
        }
        Returns: Json
      }
      get_dashboard_data: {
        Args: {
          p_user_id: string
        }
        Returns: Json
      }
      get_planning_page_data: {
        Args: {
          p_trip_id: number
        }
        Returns: Json
      }
      import_csv_data: {
        Args: {
          csv_data: Json
          p_pack_id: number
        }
        Returns: Json
      }
      search_profiles: {
        Args: {
          search_query: string
        }
        Returns: {
          address_1: string | null
          address_2: string | null
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          first_name: string | null
          fts: unknown | null
          id: string
          image: string | null
          last_name: string | null
          location: Json | null
          measuring_system:
            | Database['public']['Enums']['measuring_system']
            | null
          onboard_date: string | null
          role: Database['public']['Enums']['user_role'] | null
          slug: string
          state: string | null
          trail_name: string | null
          updated_at: string | null
        }[]
      }
      update_poll: {
        Args: {
          poll_id: number
          question: string
          answers: string[]
        }
        Returns: Json
      }
      update_positions: {
        Args: {
          records: Database['public']['CompositeTypes']['category_item_position'][]
        }
        Returns: Json[]
      }
    }
    Enums: {
      friend_request_status: 'PENDING' | 'ACCEPTED' | 'DECLINED'
      measuring_system: 'IMPERIAL' | 'METRIC'
      pricing_plan_interval: 'day' | 'week' | 'month' | 'year'
      pricing_type: 'one_time' | 'recurring'
      resource_type: 'USER' | 'GROUP'
      subscription_level: 'FREE' | 'MONTHLY' | 'ANNUAL' | 'LIFE'
      subscription_status:
        | 'trialing'
        | 'active'
        | 'canceled'
        | 'incomplete'
        | 'incomplete_expired'
        | 'past_due'
        | 'unpaid'
      theme:
        | 'BLUE6'
        | 'BLUEGREEN6'
        | 'BREEZE6'
        | 'CELESTIAL6'
        | 'CIRCUIT6'
        | 'DAMASK6'
        | 'DEPTH6'
        | 'FLOW6'
        | 'FORTE6'
        | 'GENESIS6'
        | 'GRAYSCALE6'
        | 'IONBOARDROOM6'
        | 'KILTER6'
        | 'TABLEAU10'
        | 'COLORBLIND10'
        | 'JEWELBRIGHT9'
        | 'HUECIRCLE19'
      trip_details_type: 'HIKE' | 'TRIP'
      trip_friend_status: 'ACCEPTED' | 'DECLINED' | 'PENDING'
      trip_invitation_status: 'ACCEPTED' | 'DECLINED' | 'PENDING'
      user_role: 'ADMIN' | 'USER'
    }
    CompositeTypes: {
      answer_type: {
        answer_id: number | null
        answer: string | null
      }
      category_item_position: {
        category_item_id: number | null
        category_id: number | null
        item_id: number | null
        new_position: number | null
      }
      question_type: {
        question_id: number | null
        question: string | null
      }
    }
  }
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
    Row: infer R
  }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Insert: infer I
  }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
    Update: infer U
  }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;


export enum FriendRequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum MeasuringSystem {
  IMPERIAL = 'IMPERIAL',
  METRIC = 'METRIC',
}

export enum PricingPlanInterval {
  day = 'day',
  week = 'week',
  month = 'month',
  year = 'year',
}

export enum PricingType {
  one_time = 'one_time',
  recurring = 'recurring',
}

export enum ResourceType {
  USER = 'USER',
  GROUP = 'GROUP',
}

export enum SubscriptionLevel {
  FREE = 'FREE',
  MONTHLY = 'MONTHLY',
  ANNUAL = 'ANNUAL',
  LIFE = 'LIFE',
}

export enum SubscriptionStatus {
  trialing = 'trialing',
  active = 'active',
  canceled = 'canceled',
  incomplete = 'incomplete',
  incomplete_expired = 'incomplete_expired',
  past_due = 'past_due',
  unpaid = 'unpaid',
}

export enum Theme {
  BLUE6 = 'BLUE6',
  BLUEGREEN6 = 'BLUEGREEN6',
  BREEZE6 = 'BREEZE6',
  CELESTIAL6 = 'CELESTIAL6',
  CIRCUIT6 = 'CIRCUIT6',
  DAMASK6 = 'DAMASK6',
  DEPTH6 = 'DEPTH6',
  FLOW6 = 'FLOW6',
  FORTE6 = 'FORTE6',
  GENESIS6 = 'GENESIS6',
  GRAYSCALE6 = 'GRAYSCALE6',
  IONBOARDROOM6 = 'IONBOARDROOM6',
  KILTER6 = 'KILTER6',
  TABLEAU10 = 'TABLEAU10',
  COLORBLIND10 = 'COLORBLIND10',
  JEWELBRIGHT9 = 'JEWELBRIGHT9',
  HUECIRCLE19 = 'HUECIRCLE19',
}

export enum TripDetailsType {
  HIKE = 'HIKE',
  TRIP = 'TRIP',
}

export enum TripFriendStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
}

export enum TripInvitationStatus {
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}