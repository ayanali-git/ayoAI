import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://qowrvmjvejmpdqcblipb.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvd3J2bWp2ZWptcGRxY2JsaXBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjM2ODAsImV4cCI6MjA2NzEzOTY4MH0.xH58LbgjbwSttZRh5v-mElhccgANY_QKGL3ySLHfngY';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);