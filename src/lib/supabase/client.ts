import { createBrowserClient } from '@supabase/ssr'

// Define a function to create a Supabase client for browser environments
export function createClient() {
  // Ensure the environment variables are loaded
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key in environment variables.');
  }

  // Create and return the Supabase client
  // We use createBrowserClient for client-side usage.
  // For server-side usage (API routes, Server Components), we'd use createServerClient.
  return createBrowserClient(
    supabaseUrl,
    supabaseAnonKey
  );
} 