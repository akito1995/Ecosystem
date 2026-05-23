import { createClient } from "@supabase/supabase-js";

// Provide a valid dummy URL format so that the Supabase client initialization doesn't throw a fatal 500 error on module load if you haven't configured it yet.
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.startsWith("http") ? rawUrl : "https://placeholder-url.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
