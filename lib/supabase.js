const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to handle Supabase responses
function handleSupabaseResponse(data, error, context = '') {
  if (error) {
    console.error(`Supabase error (${context}):`, error);
    throw new Error(error.message);
  }
  return data;
}

module.exports = { supabase, handleSupabaseResponse };

