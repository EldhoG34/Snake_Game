import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bqzxlcmzcmrtooqvhfqt.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJxenhsY216Y21ydG9vcXZoZnF0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NTUxMDksImV4cCI6MjA2MDEzMTEwOX0.yoOo6ERS41v-h0e8IeQYREBED_ZO78TNWjukSqBiTRM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 