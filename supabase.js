import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://reyikvrxcocgpshxfuwf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJleWlrdnJ4Y29jZ3BzaHhmdXdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTM0NjQsImV4cCI6MjA2OTM4OTQ2NH0.bF9LpRLO4ZHNsndHAU3YbgGuHztMnonqIFxZq7M3aGk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
