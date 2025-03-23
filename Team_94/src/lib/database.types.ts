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
      shops: {
        Row: {
          id: string
          name: string
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          shop_id: string
          category: string
          name: string
          stock: number
          cost: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          category: string
          name: string
          stock: number
          cost: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          category?: string
          name?: string
          stock?: number
          cost?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      queue_tokens: {
        Row: {
          id: string
          user_id: string
          token_number: number
          slot_time: string
          status: string
          created_at: string
          expires_at: string
        }
        Insert: {
          id?: string
          user_id: string
          token_number: number
          slot_time: string
          status?: string
          created_at?: string
          expires_at: string
        }
        Update: {
          id?: string
          user_id?: string
          token_number?: number
          slot_time?: string
          status?: string
          created_at?: string
          expires_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string
          queue_token_id: string | null
          total_amount: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          queue_token_id?: string | null
          total_amount: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          queue_token_id?: string | null
          total_amount?: number
          status?: string
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          item_id: string
          quantity: number
          unit_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          item_id: string
          quantity: number
          unit_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          item_id?: string
          quantity?: number
          unit_price?: number
          created_at?: string
        }
      }
    }
  }
}