import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hqlgdiawafasfckumxhp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbGdkaWF3YWZhc2Zja3VteGhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3MzU1NzgsImV4cCI6MjA3NzMxMTU3OH0.8jqq9gBvS4P7RmPusCnOUfQa6SHlEEoReSIfzY_wPL4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
