import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://pwjunnsldyqhfrjxxvub.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3anVubnNsZHlxaGZyanh4dnViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjMxNzcsImV4cCI6MjA2NzYzOTE3N30.H2moTjJM60FVffF-uK8c9MNaVpkymuXH8Up1JYKnTn4";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== "undefined" ? localStorage : null,
    persistSession: true,
    autoRefreshToken: true,
  },
});
