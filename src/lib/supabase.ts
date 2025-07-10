import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          full_name: string;
          avatar_url: string | null;
          bio: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          full_name: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          full_name?: string;
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          image_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      stories: {
        Row: {
          id: string;
          user_id: string;
          content: string;
          image_url: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          content: string;
          image_url?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          content?: string;
          image_url?: string | null;
          expires_at?: string;
          created_at?: string;
        };
      };
      friendships: {
        Row: {
          id: string;
          user_id: string;
          friend_id: string;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          friend_id: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          friend_id?: string;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          read: boolean;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
          read?: boolean;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string;
          read?: boolean;
        };
      };
      likes: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          created_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          user_id: string;
          post_id: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          post_id: string;
          content: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          post_id?: string;
          content?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};